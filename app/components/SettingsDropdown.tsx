"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SettingsDropdownProps {
  onNewGame: () => void;
  onResetProgress: () => void;
}

export default function SettingsDropdown({
  onNewGame,
  onResetProgress,
}: SettingsDropdownProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const closeAndExecute = (action: () => void) => {
    setDropdownOpen(false);
    action();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Settings"
        className="p-1 rounded-full hover:bg-yellow-800/60 focus:outline-none flex items-center justify-center cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
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

      {dropdownOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-yellow-900 border-2 border-yellow-400 rounded-xl shadow-lg z-50 animate-fade-in">
          <button
            className="w-full text-left px-4 py-2 text-yellow-100 hover:bg-yellow-800/80 rounded-t-xl hover:cursor-pointer"
            onClick={() => closeAndExecute(() => router.push("/"))}
          >
            Back to home screen
          </button>
          <button
            className="w-full text-left px-4 py-2 text-yellow-100 hover:bg-yellow-800/80 hover:cursor-pointer"
            onClick={() => closeAndExecute(onNewGame)}
          >
            Restart game
          </button>
          <button
            className="w-full text-left px-4 py-2 text-yellow-100 hover:bg-yellow-800/80 hover:cursor-pointer"
            onClick={() => closeAndExecute(onResetProgress)}
          >
            Reset progress
          </button>
          <a
            href="https://github.com/christopherkade/mtg-combos/blob/main/data/combos.json"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-yellow-100 hover:bg-yellow-800/80 rounded-b-xl text-left"
            onClick={() => setDropdownOpen(false)}
          >
            Combo list
          </a>
        </div>
      )}
    </div>
  );
}
