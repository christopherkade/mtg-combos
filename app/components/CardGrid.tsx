'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { Card } from '../types';
import { getCardImage, getCardName } from '../utils/cardUtils';

interface CardGridProps {
  cards: Card[];
  selectedCards: Set<string>;
  onCardClick: (cardId: string) => void;
}

export default function CardGrid({ cards, selectedCards, onCardClick }: CardGridProps) {
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    function updateWidth() {
      if (desktopContainerRef.current) {
        setContainerWidth(desktopContainerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="flex justify-center items-center h-full pb-8">
      {/* Mobile: Vertical stack with scroll */}
      <div className="md:hidden relative flex flex-col items-center h-full w-full px-4 overflow-y-auto py-4">
        {cards.map((card, index) => {
          const imageUrl = getCardImage(card);
          const cardName = getCardName(card);
          const isSelected = selectedCards.has(card.id);
          
          return (
            <div
              key={`${card.id}-${index}`}
              data-card-id={card.id}
              onClick={() => onCardClick(card.id)}
              className="mb-6 transition-all duration-300 cursor-pointer"
            >
              <div
                className={`w-32 rounded-lg border-2 shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-4 hover:-translate-x-2 ${
                  isSelected ? 'border-yellow-400' : 'border-stone-600'
                }`}
                style={{ aspectRatio: '2.5/3.5' }}
              >
                {imageUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt={cardName}
                      fill
                      className="object-contain"
                      sizes="128px"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                    <p className="text-stone-700 text-center p-2 text-xs font-serif">Image not available</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal layout */}
      <div ref={desktopContainerRef} className="hidden md:flex relative items-end justify-center w-full" style={{ height: '400px' }}>
        {cards.map((card, index) => {
          const imageUrl = getCardImage(card);
          const cardName = getCardName(card);
          const isSelected = selectedCards.has(card.id);
          
          // Dynamic spacing calculation
          const totalCards = cards.length;
          const cardWidth = 224; // Increased card width in pixels
          const totalSpacing = containerWidth > 0 ? containerWidth - (totalCards * cardWidth) : 0;
          const spacingBetweenCards = totalCards > 1 ? totalSpacing / (totalCards - 1) : 0;
          
          // Calculate position for even distribution
          const cardPosition = (index * cardWidth) + (index * spacingBetweenCards);

          return (
            <div
              key={`${card.id}-${index}`}
              data-card-id={card.id}
              onClick={() => onCardClick(card.id)}
              className="absolute transition-all duration-300 cursor-pointer"
              style={{
                left: `${cardPosition}px`,
                bottom: '20px',
                zIndex: 10 + index,
              }}
            >
              <div
                className={`w-40 md:w-48 lg:w-56 rounded-lg border-2 shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-8 hover:-translate-x-4 hover:rotate-0 ${
                  isSelected ? 'border-yellow-400' : 'border-stone-600'
                }`}
                style={{ aspectRatio: '2.5/3.5' }}
              >
                {imageUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt={cardName}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                    <p className="text-stone-700 text-center p-2 text-xs font-serif">Image not available</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 