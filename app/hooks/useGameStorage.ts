import { useState, useEffect } from "react";
import { Combo, Card } from "../types";

interface GameStorageState {
  usedCombos: Set<string>;
  comboHistory: Array<{
    combo: Combo;
    cards: Card[];
    timestamp: Date;
  }>;
  streak: number;
}

const STORAGE_KEYS = {
  USED_COMBOS: "mtg-combos-used",
  COMBO_HISTORY: "mtg-combos-history",
  STREAK: "mtg-combos-streak",
} as const;

export const useGameStorage = () => {
  const [usedCombos, setUsedCombos] = useState<Set<string>>(new Set());
  const [comboHistory, setComboHistory] = useState<
    GameStorageState["comboHistory"]
  >([]);
  const [streak, setStreak] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load used combos
      const savedUsedCombos = localStorage.getItem(STORAGE_KEYS.USED_COMBOS);
      if (savedUsedCombos) {
        setUsedCombos(new Set(JSON.parse(savedUsedCombos)));
      }

      // Load combo history
      const savedHistory = localStorage.getItem(STORAGE_KEYS.COMBO_HISTORY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        const historyWithDates = parsedHistory.map(
          (entry: { combo: Combo; cards: Card[]; timestamp: string }) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })
        );
        setComboHistory(historyWithDates);
      }

      // Load streak
      const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (savedStreak) {
        setStreak(parseInt(savedStreak, 10));
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []);

  // Auto-save when data changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.USED_COMBOS,
        JSON.stringify(Array.from(usedCombos))
      );
    } catch (error) {
      console.error("Error saving used combos to localStorage:", error);
    }
  }, [usedCombos]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.COMBO_HISTORY,
        JSON.stringify(comboHistory)
      );
    } catch (error) {
      console.error("Error saving combo history to localStorage:", error);
    }
  }, [comboHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    } catch (error) {
      console.error("Error saving streak to localStorage:", error);
    }
  }, [streak]);

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USED_COMBOS);
      localStorage.removeItem(STORAGE_KEYS.COMBO_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.STREAK);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  const resetProgress = () => {
    clearStorage();
    setStreak(0);
    setUsedCombos(new Set());
    setComboHistory([]);
  };

  const resetGameSession = () => {
    setStreak(0);
    setUsedCombos(new Set());
    setComboHistory([]);
  };

  return {
    usedCombos,
    setUsedCombos,
    comboHistory,
    setComboHistory,
    streak,
    setStreak,
    resetProgress,
    resetGameSession,
  };
};
