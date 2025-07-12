"use client";

import { useState, useEffect } from "react";
import combosData from "../data/combos.json";
import { Card, Combo } from "./types";
import { fetchCardByName } from "./utils/cardUtils";
import CardGrid from "./components/CardGrid";
import GameControls from "./components/GameControls";
import ErrorDisplay from "./components/ErrorDisplay";
import CardAnimation from "./components/CardAnimation";
import LoadingSpinner from "./components/LoadingSpinner";

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCombo, setCurrentCombo] = useState<Combo | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCardAnimation, setShowCardAnimation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [congrats, setCongrats] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminatedCards, setEliminatedCards] = useState<Set<string>>(
    new Set()
  );

  const congratsMessages = [
    "Great job!",
    "Combo Master!",
    "Well done, Planeswalker!",
    "You nailed it!",
    "Well played!",
    "Impressive!",
    "That's a win!",
    "You found the combo!",
    "Victory!",
    "Excellent!",
    "You got it!",
  ];

  const fetchRandomCards = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCards(new Set());
      setHintUsed(false);
      setEliminatedCards(new Set());
      setGameResult(null);
      setShowResult(false);
      setShowCardAnimation(false);

      // Select a random combo
      const combos = combosData.combos as Combo[];
      const randomCombo = combos[Math.floor(Math.random() * combos.length)];
      setCurrentCombo(randomCombo);

      // Fetch combo cards
      const comboCardPromises = randomCombo.cards.map((cardName) =>
        fetchCardByName(cardName)
      );
      const comboCards = await Promise.all(comboCardPromises);

      // Fetch additional random cards to fill the grid (7 total - combo cards)
      const remainingSlots = 7 - comboCards.length;
      const randomCardPromises = Array.from({ length: remainingSlots }, () =>
        fetch("https://api.scryfall.com/cards/random").then((res) => {
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
      setError(err instanceof Error ? err.message : "Failed to fetch cards");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomCards();
  }, []);

  useEffect(() => {
    if (showResult && gameResult === "lose") {
      const timer = setTimeout(() => {
        setShowResult(false);
        setGameResult(null);
      }, 1000);
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

    const selectedCardNames = Array.from(selectedCards).map((cardId) => {
      const card = cards.find((c) => c.id === cardId);
      return card ? card.name : "";
    });

    const comboCardNames = currentCombo.cards;
    const isCorrect =
      comboCardNames.every((name) => selectedCardNames.includes(name)) &&
      selectedCardNames.every((name) => comboCardNames.includes(name)) &&
      selectedCardNames.length === comboCardNames.length;

    setGameResult(isCorrect ? "win" : "lose");
    setShowResult(true);

    if (isCorrect) {
      setStreak((prev) => prev + 1);
      // Show congrats overlay
      const msg =
        congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
      setCongrats(msg);
      setTimeout(() => {
        setCongrats(null);
        setShowCardAnimation(true);
      }, 1000);
    } else {
      setStreak(0);
    }
  };

  const useHint = () => {
    if (!currentCombo || hintUsed) return;

    // Find wrong cards (cards that are not part of the combo)
    const comboCardNames = currentCombo.cards;
    const wrongCards = cards.filter(
      (card) => !comboCardNames.includes(card.name)
    );

    // Find wrong cards that haven't been eliminated yet
    const availableWrongCards = wrongCards.filter(
      (card) => !eliminatedCards.has(card.id)
    );

    if (availableWrongCards.length > 0) {
      // Randomly select one wrong card to eliminate
      const randomWrongCard =
        availableWrongCards[
          Math.floor(Math.random() * availableWrongCards.length)
        ];
      setEliminatedCards((prev) => new Set([...prev, randomWrongCard.id]));
      setHintUsed(true);
    }
  };

  const handleAnimationComplete = () => {
    fetchRandomCards();
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchRandomCards} />;
  }

  // 7 placeholder cards for loading state
  const placeholderCards = Array.from({ length: 7 }, (_, i) => ({
    id: `placeholder-${i}`,
    name: "",
    image_uris: { normal: "" },
  }));

  return (
    <div className="h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 flex flex-col border-8 border-slate-950 rounded-xl">
      {initialLoading && <LoadingSpinner />}
      {congrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-yellow-900/90 border-4 border-yellow-400 rounded-2xl px-12 py-8 shadow-2xl text-yellow-100 font-bold text-3xl font-serif text-center animate-fade-in">
            {congrats}
          </div>
        </div>
      )}
      {showCardAnimation && (
        <CardAnimation onAnimationComplete={handleAnimationComplete} />
      )}
      <>
        <main className="flex-1 p-4 md:p-6 overflow-hidden">
          <div className="w-full h-full mx-auto">
            <CardGrid
              cards={loading ? placeholderCards : cards}
              selectedCards={selectedCards}
              onCardClick={handleCardClick}
              eliminatedCards={eliminatedCards}
            />
          </div>
        </main>

        <div className="fixed bottom-0 left-0 w-full z-40">
          <GameControls
            currentCombo={currentCombo}
            selectedCards={selectedCards}
            gameResult={gameResult}
            showResult={showResult}
            onNewGame={() => {
              setStreak(0);
              fetchRandomCards();
            }}
            onCheckAnswer={validateSelection}
            onUseHint={useHint}
            hintUsed={hintUsed}
            streak={streak}
          />
        </div>
      </>
    </div>
  );
}
