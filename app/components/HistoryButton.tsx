"use client";

interface HistoryButtonProps {
  onClick: () => void;
  comboCount: number;
}

export default function HistoryButton({
  onClick,
  comboCount,
}: HistoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed left-0 top-1/2 transform -translate-y-1/2 z-30 bg-stone-800 border-r-2 border-t-2 border-b-2 border-yellow-400 px-2 py-2 shadow-lg transition-all duration-200 hover:bg-stone-700 group min-h-32"
      aria-label="Open combo history"
      style={{
        writingMode: "vertical-rl",
        textOrientation: "mixed",
      }}
    >
      <span className="text-yellow-200 font-bold text-sm whitespace-nowrap block transform rotate-180">
        History ({comboCount})
      </span>
    </button>
  );
}
