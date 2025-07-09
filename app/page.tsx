'use client';

import { useState, useEffect } from 'react';
import combosData from '../data/combos.json';
import { Card, Combo } from './types';
import { fetchCardByName } from './utils/cardUtils';
import CardGrid from './components/CardGrid';
import GameControls from './components/GameControls';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import CardAnimation from './components/CardAnimation';

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCombo, setCurrentCombo] = useState<Combo | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCardAnimation, setShowCardAnimation] = useState(false);

  const fetchRandomCards = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCards(new Set());
      setGameResult(null);
      setShowResult(false);
      setShowCardAnimation(false);
      
      // Select a random combo
      const combos = combosData.combos as Combo[];
      const randomCombo = combos[Math.floor(Math.random() * combos.length)];
      setCurrentCombo(randomCombo);
      
      // Fetch combo cards
      const comboCardPromises = randomCombo.cards.map(cardName => fetchCardByName(cardName));
      const comboCards = await Promise.all(comboCardPromises);
      
      // Fetch additional random cards to fill the grid (7 total - combo cards)
      const remainingSlots = 7 - comboCards.length;
      const randomCardPromises = Array.from({ length: remainingSlots }, () =>
        fetch('https://api.scryfall.com/cards/random')
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
      );
      
      const randomCards = await Promise.all(randomCardPromises);
      
      // Combine combo cards and random cards
      const allCards = [...comboCards, ...randomCards];
      
      // Shuffle the cards to randomize positions
      const shuffledCards = allCards.sort(() => Math.random() - 0.5);
      
      setCards(shuffledCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomCards();
  }, []);

  useEffect(() => {
    if (showResult && gameResult === 'lose') {
      const timer = setTimeout(() => {
        setShowResult(false);
        setGameResult(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showResult, gameResult]);

  const handleCardClick = (cardId: string) => {
    const newSelectedCards = new Set(selectedCards);
    if (newSelectedCards.has(cardId)) {
      newSelectedCards.delete(cardId);
    } else {
      newSelectedCards.add(cardId);
    }
    setSelectedCards(newSelectedCards);
  };

  const validateSelection = () => {
    if (!currentCombo) return;

    const selectedCardNames = Array.from(selectedCards).map(cardId => {
      const card = cards.find(c => c.id === cardId);
      return card ? card.name : '';
    });

    const comboCardNames = currentCombo.cards;
    const isCorrect = comboCardNames.every(name => selectedCardNames.includes(name)) &&
                     selectedCardNames.every(name => comboCardNames.includes(name)) &&
                     selectedCardNames.length === comboCardNames.length;

    setGameResult(isCorrect ? 'win' : 'lose');
    setShowResult(true);

    if (isCorrect) {
      setShowCardAnimation(true);
    }
  };

  const resetGame = () => {
    setSelectedCards(new Set());
    setGameResult(null);
    setShowResult(false);
  };

  const handleAnimationComplete = () => {
    fetchRandomCards();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchRandomCards} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 flex flex-col">
      {showCardAnimation && (
        <CardAnimation 
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="h-full w-full mx-auto">
          <CardGrid
            cards={cards}
            selectedCards={selectedCards}
            onCardClick={handleCardClick}
          />
        </div>
      </main>

      <footer className="flex-shrink-0 p-4 md:p-6">
        <GameControls
          currentCombo={currentCombo}
          selectedCards={selectedCards}
          gameResult={gameResult}
          showResult={showResult}
          onNewGame={fetchRandomCards}
          onCheckAnswer={validateSelection}
          onPlayAgain={resetGame}
        />
      </footer>
    </div>
  );
}
