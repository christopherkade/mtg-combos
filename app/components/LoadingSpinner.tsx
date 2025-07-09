export default function LoadingSpinner() {
  return (
    <div className="h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-yellow-200 text-lg font-serif">Loading ancient spells...</p>
      </div>
    </div>
  );
} 