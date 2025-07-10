// Simple centered spinner for initial load
export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-stone-900/80">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
    </div>
  );
}
