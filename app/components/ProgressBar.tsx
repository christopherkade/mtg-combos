"use client";

interface ProgressBarProps {
  found: number;
  total: number;
}

export default function ProgressBar({ found, total }: ProgressBarProps) {
  const percentage = total > 0 ? (found / total) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 w-full z-30 bg-stone-900 px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-yellow-200 font-serif">
          Combos Found: {found} / {total}
        </span>
        <span className="text-yellow-200 font-serif">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-stone-700 rounded-full h-2 mt-1">
        <div
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
