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
      className="fixed top-1/3 md:top-1/2 transform -translate-y-1/2 z-30 bg-stone-800 border-r-2 border-t-2 border-b-2 border-yellow-400 py-2 shadow-lg transition-all duration-200 hover:bg-stone-700 group w-fit"
      aria-label="Open combo history"
    >
      <div className="writing-mode-vertical text-center">
        <span className="text-yellow-200 font-serif font-bold text-sm whitespace-nowrap">
          History ({comboCount})
        </span>
      </div>
    </button>
  );
}
