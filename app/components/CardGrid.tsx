"use client";

import { useRef, useEffect, useState } from "react";
import { Card } from "../types";
import GameCard from "./GameCard";

interface CardGridProps {
  cards: Card[];
  selectedCards: Set<string>;
  onCardClick: (cardId: string) => void;
  eliminatedCards: Set<string>;
}

export default function CardGrid({
  cards,
  selectedCards,
  onCardClick,
  eliminatedCards,
}: CardGridProps) {
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // Track loaded state for each card
  const [loaded, setLoaded] = useState<{ [id: string]: boolean }>({});
  const [readyToFlip, setReadyToFlip] = useState<{ [id: string]: boolean }>({});
  const [flipped, setFlipped] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    function updateWidth() {
      if (desktopContainerRef.current) {
        setContainerWidth(desktopContainerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    // Reset animation states when new cards are loaded
    setLoaded({});
    setReadyToFlip({});
    setFlipped({});

    // Start flip timers for new cards
    const timers = cards.map((card) =>
      setTimeout(() => {
        setReadyToFlip((r) => ({ ...r, [card.id]: true }));
      }, 1000)
    );

    // Cleanup timers if cards change before they complete
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  // Flip card when both loaded, readyToFlip are true
  useEffect(() => {
    cards.forEach((card) => {
      if (loaded[card.id] && readyToFlip[card.id] && !flipped[card.id]) {
        setFlipped((f) => ({ ...f, [card.id]: true }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, readyToFlip, cards]);

  return (
    <div className="flex justify-center items-center h-full pb-55 md:pb-8">
      {/* Mobile: Vertical stack with scroll */}
      <div className="md:hidden relative flex flex-col items-center h-full w-full px-4 overflow-y-auto py-4">
        {cards.map((card, index) => (
          <GameCard
            key={`${card.id}-${index}`}
            card={card}
            index={index}
            isSelected={selectedCards.has(card.id)}
            isEliminated={eliminatedCards.has(card.id)}
            isFlipped={flipped[card.id]}
            onCardClick={onCardClick}
            onImageLoad={(cardId) =>
              setLoaded((l) => ({ ...l, [cardId]: true }))
            }
            className="w-48 mb-6"
          />
        ))}
      </div>
      {/* Desktop: Horizontal layout */}
      <div
        ref={desktopContainerRef}
        className="hidden md:flex relative items-end justify-center w-full"
        style={{ height: "300px" }}
      >
        {cards.map((card, index) => {
          // Dynamic spacing calculation
          const totalCards = cards.length;
          const cardWidth = 224;
          const totalSpacing =
            containerWidth > 0 ? containerWidth - totalCards * cardWidth : 0;
          const spacingBetweenCards =
            totalCards > 1 ? totalSpacing / (totalCards - 1) : 0;
          const cardPosition = index * cardWidth + index * spacingBetweenCards;

          return (
            <GameCard
              key={`${card.id}-${index}`}
              card={card}
              index={index}
              isSelected={selectedCards.has(card.id)}
              isEliminated={eliminatedCards.has(card.id)}
              isFlipped={flipped[card.id]}
              onCardClick={onCardClick}
              onImageLoad={(cardId) =>
                setLoaded((l) => ({ ...l, [cardId]: true }))
              }
              className="w-40 md:w-48 lg:w-56 absolute hover:scale-110 hover:-translate-y-8 hover:-translate-x-4"
              style={{
                left: `${cardPosition}px`,
                bottom: "20px",
                zIndex: 10 + index,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
