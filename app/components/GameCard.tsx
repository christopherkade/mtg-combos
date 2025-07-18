"use client";

import Image from "next/image";
import { Card } from "../types";
import { getCardImage, getCardName } from "../utils/cardUtils";
import cardBackPng from "../../public/card_back.png";

interface GameCardProps {
  card: Card;
  index: number;
  isSelected: boolean;
  isEliminated: boolean;
  isFlipped: boolean;
  onCardClick: (cardId: string) => void;
  onImageLoad: (cardId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const CardBack = () => (
  <Image
    src={cardBackPng}
    alt="Magic card back"
    fill
    className="object-contain w-full h-full rounded-xl"
    draggable={false}
  />
);

export default function GameCard({
  card,
  index,
  isSelected,
  isEliminated,
  isFlipped,
  onCardClick,
  onImageLoad,
  className = "",
  style = {},
}: GameCardProps) {
  const imageUrl = getCardImage(card);
  const cardName = getCardName(card);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick(card.id);
      (e.target as HTMLElement).blur();
    }
  };

  const handleClick = () => {
    if (!isEliminated) {
      onCardClick(card.id);
    }
  };

  return (
    <div
      key={`${card.id}-${index}`}
      data-card-id={card.id}
      onClick={handleClick}
      className={`${
        isEliminated ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      style={style}
    >
      <div
        tabIndex={0}
        className={`rounded-lg shadow-lg transition-all duration-300 ${
          isEliminated
            ? "opacity-30 grayscale"
            : "hover:scale-105 hover:-translate-y-4 hover:-translate-x-2"
        } ${isSelected ? "outline-2 outline-yellow-400" : ""}`}
        style={{ aspectRatio: "2.5/3.5", position: "relative" }}
        onKeyDown={!isEliminated ? handleKeyDown : undefined}
        aria-label={`Card: ${cardName}`}
        role="button"
      >
        <div
          className={`card-flip${isFlipped ? " flipped" : ""}`}
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
                    onLoad={() => onImageLoad(card.id)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
