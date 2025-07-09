'use client';

import { useEffect, useState } from 'react';

interface CardAnimationProps {
  onAnimationComplete: () => void;
}

export default function CardAnimation({ onAnimationComplete }: CardAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'pile' | 'move' | 'complete'>('pile');

  useEffect(() => {
    // Get all card elements
    const cardElements = document.querySelectorAll('[data-card-id]');
    const cards = Array.from(cardElements) as HTMLElement[];

    if (cards.length === 0) {
      onAnimationComplete();
      return;
    }

    // Phase 1: Move to pile in center
    const pileTimer = setTimeout(() => {
      const centerX = window.innerWidth / 2 - 112; // Adjusted for larger card size
      const centerY = window.innerHeight / 2 - 156; // Adjusted for larger card size
      
      cards.forEach((card, index) => {
        card.style.position = 'fixed';
        card.style.left = `${centerX + (index * 2)}px`;
        card.style.top = `${centerY + (index * 2)}px`;
        card.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        card.style.zIndex = (index + 100).toString();
        card.style.transition = 'all 1s ease-in-out';
        card.style.pointerEvents = 'none';
      });
      
      setAnimationPhase('move');
      
      // Phase 2: Move pile off screen
      const moveTimer = setTimeout(() => {
        cards.forEach((card, index) => {
          card.style.left = `${window.innerWidth + 200}px`;
          card.style.top = `${centerY + (index * 5)}px`;
          card.style.transform = 'rotate(45deg)';
        });
        
        // Phase 3: Complete animation
        const completeTimer = setTimeout(() => {
          setAnimationPhase('complete');
          onAnimationComplete();
        }, 1000);
        
        return () => clearTimeout(completeTimer);
      }, 800);
      
      return () => clearTimeout(moveTimer);
    }, 100);
    
    return () => clearTimeout(pileTimer);
  }, [onAnimationComplete]);

  return null; // This component doesn't render anything, it just manipulates existing elements
} 