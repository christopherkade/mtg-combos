"use client";

import { useState, useRef, useEffect } from "react";
import { Combo } from "../types";
import SettingsDropdown from "./SettingsDropdown";

interface GameControlsProps {
  currentCombo: Combo | null;
  selectedCards: Set<string>;
  gameResult: "win" | "lose" | null;
  showResult: boolean;
  onNewGame: () => void;
  onResetProgress: () => void;
  onBackToHome: () => void;
  onCheckAnswer: () => void;
  onUseHint: () => void;
  hintUsed: boolean;
  loading: boolean;
  streak: number;
}

export default function GameControls({
  currentCombo,
  selectedCards,
  gameResult,
  showResult,
  onNewGame,
  onResetProgress,
  onBackToHome,
  onCheckAnswer,
  onUseHint,
  hintUsed,
  loading,
  streak,
}: GameControlsProps) {
  const [buttonLabel, setButtonLabel] = useState<"check" | "wrong">("check");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showResult && gameResult === "lose") {
      setButtonLabel("wrong");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setButtonLabel("check");
      }, 1000);
    }
  }, [showResult, gameResult]);

  return (
    <div className="w-full text-center">
      {currentCombo && (
        <div className="p-2 md:p-4 bg-stone-900 border-y-6 border-slate-950 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Buttons on the left */}
          <div className="flex flex-row gap-2 md:gap-4 items-center justify-center md:justify-start mb-4 md:mb-0">
            <button
              onClick={onCheckAnswer}
              className={`${
                selectedCards.size < 1 ? "cursor-not-allowed" : "cursor-pointer"
              } font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base border w-full md:w-fit ${
                buttonLabel === "wrong"
                  ? "bg-red-700 text-stone-50 animate-shake"
                  : "bg-green-700 hover:bg-green-600 text-stone-50 hover:shadow-xl"
              }${selectedCards.size < 1 ? " opacity-50" : ""}`}
              disabled={selectedCards.size < 1}
            >
              {buttonLabel === "wrong" ? "Wrong Answer" : "Check Answer"}
            </button>
            <button
              onClick={onUseHint}
              disabled={hintUsed || loading}
              className={`font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base border ${
                hintUsed || loading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-blue-700 hover:bg-blue-600 text-stone-50 hover:shadow-xl cursor-pointer"
              }`}
            >
              {loading ? "Loading..." : "Hint"}
            </button>
          </div>
          {/* Effect text in the center */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-yellow-200 font-semibold text-xs md:text-sm">
              Find the cards that create this effect:
            </p>
            <p className="text-stone-50 text-md md:text-xl">
              {currentCombo.description}
            </p>
          </div>

          {/* Streak and settings on the right */}
          <div className="flex items-center justify-center md:justify-end gap-2">
            <span className="bg-yellow-900/80 rounded-xl px-6 py-2 shadow text-stone-50 font-bold text-xs md:text-base whitespace-nowrap">
              Winning Streak: {streak}
            </span>
            <SettingsDropdown
              onBackToHome={onBackToHome}
              onNewGame={onNewGame}
              onResetProgress={onResetProgress}
            />
          </div>
        </div>
      )}
    </div>
  );
}
