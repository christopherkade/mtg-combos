interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-300 text-lg mb-4 font-serif">Error: {error}</p>
        <button
          onClick={onRetry}
          className="bg-stone-700 hover:bg-stone-600 text-yellow-200 font-bold py-2 px-4 rounded border border-yellow-600 font-serif"
        >
          Try Again
        </button>
      </div>
    </div>
  );
} 