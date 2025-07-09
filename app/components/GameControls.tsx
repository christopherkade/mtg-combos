'use client';

import { useState, useRef, useEffect } from 'react';
import { Combo } from '../types';

interface GameControlsProps {
  currentCombo: Combo | null;
  selectedCards: Set<string>;
  gameResult: 'win' | 'lose' | null;
  showResult: boolean;
  onNewGame: () => void;
  onCheckAnswer: () => void;
  onPlayAgain: () => void;
}

export default function GameControls({
  currentCombo,
  selectedCards,
  gameResult,
  showResult,
  onNewGame,
  onCheckAnswer,
  onPlayAgain
}: GameControlsProps) {
  const [buttonLabel, setButtonLabel] = useState<'check' | 'wrong'>('check');
  const [shake, setShake] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showResult && gameResult === 'lose') {
      setButtonLabel('wrong');
      setShake(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setButtonLabel('check');
        setShake(false);
      }, 2000);
    }
  }, [showResult, gameResult]);

  return (
    <div className="max-w-7xl mx-auto text-center">
      {currentCombo && (
        <div className="mb-4 p-4 bg-stone-800/70 rounded-lg border-2 border-yellow-600 shadow-lg">
          <p className="text-yellow-200 font-semibold text-sm md:text-base font-serif">
            Find the cards that create this effect:
          </p>
          <p className="text-yellow-100 text-sm font-serif">
            {currentCombo.description}
          </p>
        </div>
      )}
      <div className="flex gap-2 md:gap-4 justify-center">
        <button
          onClick={onNewGame}
          className="cursor-pointer bg-stone-700 hover:bg-stone-600 text-yellow-200 font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base border border-yellow-600 font-serif"
        >
          🔄 New Game
        </button>
        {selectedCards.size > 0 && (
          <button
            onClick={onCheckAnswer}
            className={`cursor-pointer bg-green-700 text-green-100 font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base border border-green-500 font-serif ${shake ? 'animate-shake' : ''}`}
            disabled={buttonLabel === 'wrong'}
          >
            {buttonLabel === 'wrong' ? '❌ Wrong Answer' : '✅ Check Answer'}
          </button>
        )}
      </div>
    </div>
  );
}

// Add shake animation to global styles if not present
// @layer utilities {
//   .animate-shake {
//     animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
//   }
//   @keyframes shake {
//     10%, 90% { transform: translateX(-2px); }
//     20%, 80% { transform: translateX(4px); }
//     30%, 50%, 70% { transform: translateX(-8px); }
//     40%, 60% { transform: translateX(8px); }
//   }
// } 