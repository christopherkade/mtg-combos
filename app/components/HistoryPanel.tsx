"use client";

import Image from "next/image";
import { Card, Combo } from "../types";
import { getCardImage, getCardName } from "../utils/cardUtils";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  comboHistory: Array<{
    combo: Combo;
    cards: Card[];
    timestamp: Date;
  }>;
}

export default function HistoryPanel({
  isOpen,
  onClose,
  comboHistory,
}: HistoryPanelProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-stone-800 border-r-4 border-yellow-400 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-yellow-400 bg-stone-700">
          <div className="flex items-center justify-between">
            <h2 className="text-yellow-200 font-bold text-xl font-serif">
              Combo History
            </h2>
            <button
              onClick={onClose}
              className="text-yellow-200 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-stone-300 text-sm mt-1">
            {comboHistory.length} combo{comboHistory.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto p-4 pb-25">
          {comboHistory.length === 0 ? (
            <div className="text-center text-stone-400 mt-8">
              <p className="text-lg font-serif">No combos found yet!</p>
              <p className="text-sm mt-2">
                Start playing to build your history.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comboHistory.map((entry, index) => (
                <div
                  key={index}
                  className="bg-stone-700 rounded-lg p-4 border border-yellow-400/30"
                >
                  {/* Combo name and description */}
                  <h3 className="text-yellow-200 font-bold text-lg font-serif mb-2">
                    {entry.combo.name}
                  </h3>
                  <p className="text-stone-300 text-sm mb-3 font-serif">
                    {entry.combo.description}
                  </p>

                  {/* Cards */}
                  <div className="flex gap-2 justify-center">
                    {entry.cards.map((card) => {
                      const imageUrl = getCardImage(card);
                      const cardName = getCardName(card);

                      return (
                        <div
                          key={card.id}
                          className="flex flex-col items-center"
                        >
                          <div className="w-16 h-22 rounded-lg overflow-hidden shadow-lg">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={cardName}
                                width={64}
                                height={88}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-stone-600 flex items-center justify-center">
                                <span className="text-xs text-stone-400">
                                  ?
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-stone-300 mt-1 text-center font-serif leading-tight">
                            {cardName}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-stone-500 mt-3 text-center">
                    {entry.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
