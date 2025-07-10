"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Card } from "../types";
import { getCardImage, getCardName } from "../utils/cardUtils";
import cardBackWebp from "../../public/mtg-back.webp";

interface CardGridProps {
  cards: Card[];
  selectedCards: Set<string>;
  onCardClick: (cardId: string) => void;
}

// CardBack component for Magic card back image
function CardBack() {
  return (
    <Image
      src={cardBackWebp}
      alt="Magic card back"
      fill
      className="object-contain w-full h-full rounded-xl"
      draggable={false}
    />
  );
}

export default function CardGrid({
  cards,
  selectedCards,
  onCardClick,
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

  // Start 3s timer for each card on mount
  useEffect(() => {
    cards.forEach((card) => {
      if (!readyToFlip[card.id]) {
        setTimeout(() => {
          setReadyToFlip((r) => ({ ...r, [card.id]: true }));
        }, 1000);
      }
    });
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
    <div className="flex justify-center items-center h-full pb-50 md:pb-8">
      {/* Mobile: Vertical stack with scroll */}
      <div className="md:hidden relative flex flex-col items-center h-full w-full px-4 overflow-y-auto py-4">
        {cards.map((card, index) => {
          const imageUrl = getCardImage(card);
          const cardName = getCardName(card);
          const isSelected = selectedCards.has(card.id);

          // Listen to "Enter" or "Space" press and select the focused card when used
          const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onCardClick(card.id);
              // Unfocus the element after selection
              (e.target as HTMLElement).blur();
            }
          };

          return (
            <div
              key={`${card.id}-${index}`}
              data-card-id={card.id}
              onClick={() => onCardClick(card.id)}
              className="mb-6 cursor-pointer"
            >
              <div
                tabIndex={0}
                className={`w-48 rounded-lg shadow-lg transition-all duration-300 md:hover:scale-105 md:hover:-translate-y-4 md:hover:-translate-x-2 focus:outline-yellow-100 focus:outline-2 ${
                  isSelected ? "outline-2 outline-yellow-400" : ""
                }`}
                style={{ aspectRatio: "2.5/3.5", position: "relative" }}
                onKeyDown={handleKeyDown}
              >
                <div
                  className={`card-flip${flipped[card.id] ? " flipped" : ""}`}
                  style={{ width: "100%", height: "100%" }}
                >
                  <div
                    className="card-flip-inner relative w-full h-full"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    {/* Card back */}
                    <div className="card-flip-front absolute top-0 left-0 w-full h-full">
                      <CardBack />
                    </div>
                    {/* Card front */}
                    <div
                      className="card-flip-back absolute top-0 left-0 w-full h-full"
                      style={{ width: "100%", height: "100%" }}
                    >
                      {imageUrl && (
                        <div className="relative w-full h-full overflow-hidden rounded-xl">
                          <Image
                            src={imageUrl}
                            alt={cardName}
                            fill
                            className="object-contain rounded-xl"
                            sizes="192px"
                            onLoad={() =>
                              setLoaded((l) => ({ ...l, [card.id]: true }))
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Desktop: Horizontal layout */}
      <div
        ref={desktopContainerRef}
        className="hidden md:flex relative items-end justify-center w-full"
        style={{ height: "400px" }}
      >
        {cards.map((card, index) => {
          const imageUrl = getCardImage(card);
          const cardName = getCardName(card);
          const isSelected = selectedCards.has(card.id);

          // Listen to "Enter" or "Space" press and select the focused card when used
          const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onCardClick(card.id);
              // Unfocus the element after selection
              (e.target as HTMLElement).blur();
            }
          };

          // Dynamic spacing calculation
          const totalCards = cards.length;
          const cardWidth = 224; // Increased card width in pixels
          const totalSpacing =
            containerWidth > 0 ? containerWidth - totalCards * cardWidth : 0;
          const spacingBetweenCards =
            totalCards > 1 ? totalSpacing / (totalCards - 1) : 0;
          // Calculate position for even distribution
          const cardPosition = index * cardWidth + index * spacingBetweenCards;

          return (
            <div
              key={`${card.id}-${index}`}
              data-card-id={card.id}
              onClick={() => onCardClick(card.id)}
              onKeyDown={handleKeyDown}
              className="absolute cursor-pointer"
              style={{
                left: `${cardPosition}px`,
                bottom: "20px",
                zIndex: 10 + index,
              }}
            >
              <div
                tabIndex={0}
                className={`w-40 md:w-48 lg:w-56 rounded-lg shadow-lg transition-all hover:scale-110 hover:-translate-y-8 hover:-translate-x-4 hover:rotate-0 focus:outline-yellow-100 focus:outline-2 ${
                  isSelected ? "outline-2 outline-yellow-400" : ""
                }`}
                style={{ aspectRatio: "2.5/3.5", position: "relative" }}
              >
                <div
                  className={`card-flip${loaded[card.id] ? " flipped" : ""}`}
                  style={{ width: "100%", height: "100%" }}
                >
                  <div
                    className="card-flip-inner relative w-full h-full"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    {/* Card back */}
                    <div className="card-flip-front absolute top-0 left-0 w-full h-full">
                      <CardBack />
                    </div>
                    {/* Card front */}
                    <div
                      className="card-flip-back absolute top-0 left-0 w-full h-full"
                      style={{ width: "100%", height: "100%" }}
                    >
                      <div className="relative w-full h-full overflow-hidden rounded-xl">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={cardName}
                            fill
                            className="object-contain rounded-xl"
                            sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                            onLoad={() =>
                              setLoaded((l) => ({ ...l, [card.id]: true }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
