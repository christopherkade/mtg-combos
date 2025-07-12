"use client";

import { useState, useRef, useEffect } from "react";
import { Combo } from "../types";

interface GameControlsProps {
  currentCombo: Combo | null;
  selectedCards: Set<string>;
  gameResult: "win" | "lose" | null;
  showResult: boolean;
  onNewGame: () => void;
  onCheckAnswer: () => void;
  onUseHint: () => void;
  hintUsed: boolean;
  streak: number;
}

export default function GameControls({
  currentCombo,
  selectedCards,
  gameResult,
  showResult,
  onNewGame,
  onCheckAnswer,
  onUseHint,
  hintUsed,
  streak,
}: GameControlsProps) {
  const [buttonLabel, setButtonLabel] = useState<"check" | "wrong">("check");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResult && gameResult === "lose") {
      setButtonLabel("wrong");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setButtonLabel("check");
      }, 1000);
    }
  }, [showResult, gameResult]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <div className="w-full text-center px-2">
      {currentCombo && (
        <div className="p-4 pb-6 bg-stone-800/70 md:bg-transparent border-t-6 border-slate-950 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Buttons on the left */}
          <div className="flex flex-row gap-2 md:gap-4 items-center justify-center md:justify-start mb-4 md:mb-0">
            <button
              onClick={onCheckAnswer}
              className={`${
                selectedCards.size < 1 ? "cursor-not-allowed" : "cursor-pointer"
              } font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base font-serif border w-full md:w-fit ${
                buttonLabel === "wrong"
                  ? "bg-red-700 text-stone-50 animate-shake"
                  : "bg-green-700 hover:bg-green-600 text-green-100 text-stone-50 hover:shadow-xl"
              }${selectedCards.size < 1 ? " opacity-50" : ""}`}
              disabled={selectedCards.size < 1}
            >
              {buttonLabel === "wrong" ? "Wrong Answer" : "Check Answer"}
            </button>
            <button
              onClick={onUseHint}
              disabled={hintUsed}
              className={`font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base font-serif border ${
                hintUsed
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-blue-700 hover:bg-blue-600 text-blue-100 text-stone-50 hover:shadow-xl cursor-pointer"
              }`}
            >
              Hint
            </button>
          </div>
          {/* Effect text in the center */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-yellow-200 font-semibold text-sm font-serif">
              Find the cards that create this effect:
            </p>
            <p className="text-stone-50 text-xl font-serif">
              {currentCombo.description}
            </p>
          </div>

          {/* Streak and settings on the right */}
          <div
            className="flex items-center justify-center md:justify-end relative gap-2"
            ref={dropdownRef}
          >
            <span className="bg-yellow-900/80 rounded-xl px-6 py-2 shadow text-stone-50 font-bold text-base font-serif whitespace-nowrap">
              Winning Streak: {streak}
            </span>
            {/* Settings icon */}
            <button
              aria-label="Settings"
              className="p-1 rounded-full hover:bg-yellow-800/60 focus:outline-none flex items-center justify-center cursor-pointer"
              onClick={() => setDropdownOpen((open) => !open)}
              tabIndex={0}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.527-.878 3.276.87 2.398 2.398a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.878 1.527-.87 3.276-2.398 2.398a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.527.878-3.276-.87-2.398-2.398a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.878-1.527.87-3.276 2.398-2.398.996.574 2.25.096 2.573-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-yellow-900 border-2 border-yellow-400 rounded-xl shadow-lg z-50 animate-fade-in">
                <button
                  className="w-full text-left px-4 py-2 text-yellow-100 hover:bg-yellow-800/80 rounded-t-xl font-serif hover:cursor-pointer"
                  onClick={() => {
                    setDropdownOpen(false);
                    onNewGame();
                  }}
                >
                  Restart game
                </button>
                <a
                  href="https://github.com/christopherkade/mtg-combos/blob/main/data/combos.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-yellow-100 hover:bg-yellow-800/80 rounded-b-xl font-serif text-left"
                  onClick={() => setDropdownOpen(false)}
                >
                  Combo list
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
