"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import combosData from "../../data/combos.json";
import { Card, Combo } from "../types";
import { fetchCardByName } from "../utils/cardUtils";
import { useGameStorage } from "../hooks/useGameStorage";
import CardGrid from "../components/CardGrid";
import GameControls from "../components/GameControls";
import ErrorDisplay from "../components/ErrorDisplay";
import CardAnimation from "../components/CardAnimation";
import LoadingSpinner from "../components/LoadingSpinner";
import HistoryPanel from "../components/HistoryPanel";
import HistoryButton from "../components/HistoryButton";
import ProgressBar from "../components/ProgressBar";
import ConfirmationDialog from "../components/ConfirmationDialog";

export default function CombosPage() {
  const fetchingRef = useRef(false);
  const {
    usedCombos,
    setUsedCombos,
    comboHistory,
    setComboHistory,
    streak,
    setStreak,
    resetProgress: resetGameProgress,
    resetGameSession: resetSession,
  } = useGameStorage();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCombo, setCurrentCombo] = useState<Combo | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCardAnimation, setShowCardAnimation] = useState(false);
  const [congrats, setCongrats] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminatedCards, setEliminatedCards] = useState<Set<string>>(
    new Set()
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

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

  const fetchRandomCards = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);
      setSelectedCards(new Set());
      setHintUsed(false);
      setEliminatedCards(new Set());
      setGameResult(null);
      setShowResult(false);
      setShowCardAnimation(false);

      // Select a random combo that hasn't been used yet
      const combos = combosData.combos as Combo[];
      const availableCombos = combos.filter(
        (combo) => !usedCombos.has(combo.name)
      );

      let selectedCombo: Combo;

      // If all combos have been used, reset the used combos set
      if (availableCombos.length === 0) {
        setUsedCombos(new Set());
        selectedCombo = combos[Math.floor(Math.random() * combos.length)];
        setUsedCombos(new Set([selectedCombo.name]));
      } else {
        selectedCombo =
          availableCombos[Math.floor(Math.random() * availableCombos.length)];
        setUsedCombos((prev) => new Set([...prev, selectedCombo.name]));
      }

      setCurrentCombo(selectedCombo);

      // Fetch combo cards
      const comboCardPromises = selectedCombo.cards.map((cardName) =>
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
      fetchingRef.current = false;
    }
  }, [usedCombos]);

  useEffect(() => {
    fetchRandomCards();
  }, [fetchRandomCards]);

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
      // Add combo to history
      setComboHistory((prev) => [
        ...prev,
        {
          combo: currentCombo,
          cards: cards.filter((card) => currentCombo.cards.includes(card.name)),
          timestamp: new Date(),
        },
      ]);
      // Show congrats overlay
      const msg =
        congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
      setCongrats(msg);
      setTimeout(() => {
        setCongrats(null);
        // Clear card selection before starting animation
        setSelectedCards(new Set());
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

      // If the eliminated card was selected, deselect it
      if (selectedCards.has(randomWrongCard.id)) {
        setSelectedCards((prev) => {
          const newSelected = new Set(prev);
          newSelected.delete(randomWrongCard.id);
          return newSelected;
        });
      }

      setHintUsed(true);
    }
  };

  const handleAnimationComplete = useCallback(() => {
    fetchRandomCards();
  }, [fetchRandomCards]);

  const resetGameSession = useCallback(() => {
    resetSession();
    fetchRandomCards();
  }, [resetSession, fetchRandomCards]);

  const confirmResetProgress = useCallback(() => {
    setShowResetConfirmation(true);
  }, []);

  const resetProgress = useCallback(() => {
    resetGameProgress();
    setShowResetConfirmation(false);
    fetchRandomCards();
  }, [resetGameProgress, fetchRandomCards]);

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchRandomCards} />;
  }

  // 7 placeholder cards for loading state
  const placeholderCards = Array.from({ length: 7 }, (_, i) => ({
    id: `placeholder-${i}`,
    name: "",
    image_uris: { normal: "" },
  }));

  const totalCombos = (combosData.combos as Combo[]).length;
  const foundCombos = comboHistory.length;

  return (
    <div className="h-screen flex flex-col">
      {initialLoading && <LoadingSpinner />}
      {congrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
          <div className="bg-yellow-900/90 border-4 border-yellow-400 rounded-2xl px-6 sm:px-12 py-6 sm:py-8 shadow-2xl text-yellow-100 font-bold text-2xl sm:text-3xl text-center animate-fade-in max-w-sm sm:max-w-none">
            {congrats}
          </div>
        </div>
      )}
      {showCardAnimation && (
        <CardAnimation onAnimationComplete={handleAnimationComplete} />
      )}
      <HistoryButton
        onClick={() => setIsHistoryOpen(true)}
        comboCount={comboHistory.length}
      />
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        comboHistory={comboHistory}
      />
      <ConfirmationDialog
        isOpen={showResetConfirmation}
        title="Reset Progress"
        message="Are you sure you want to reset all your progress? This will clear your combo history, winning streak, and start fresh. This action cannot be undone."
        confirmText="Reset Progress"
        cancelText="Keep Progress"
        onConfirm={resetProgress}
        onCancel={() => setShowResetConfirmation(false)}
      />
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

      <ProgressBar found={foundCombos} total={totalCombos} />

      <div
        className="fixed bottom-0 left-0 w-full z-40"
        style={{ bottom: "45px" }}
      >
        <GameControls
          currentCombo={currentCombo}
          selectedCards={selectedCards}
          gameResult={gameResult}
          showResult={showResult}
          onNewGame={resetGameSession}
          onResetProgress={confirmResetProgress}
          onCheckAnswer={validateSelection}
          onUseHint={useHint}
          hintUsed={hintUsed}
          loading={loading}
          streak={streak}
        />
      </div>
    </div>
  );
}
