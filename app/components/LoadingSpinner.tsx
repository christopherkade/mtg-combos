// Magic: The Gathering mana symbols spinner
export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-stone-900/80">
      <div className="relative w-32 h-32">
        {/* White mana (top) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-8 h-8 bg-white rounded-full shadow-lg animate-mana-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
        </div>

        {/* Blue mana (top-right) */}
        <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2">
          <div
            className="w-8 h-8 bg-blue-500 rounded-full shadow-lg animate-mana-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Black mana (bottom-right) */}
        <div className="absolute bottom-1/4 right-0 transform translate-x-1/2 translate-y-1/2">
          <div
            className="w-8 h-8 bg-gray-800 rounded-full shadow-lg animate-mana-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Red mana (bottom-left) */}
        <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 translate-y-1/2">
          <div
            className="w-8 h-8 bg-red-500 rounded-full shadow-lg animate-mana-pulse"
            style={{ animationDelay: "0.6s" }}
          ></div>
        </div>

        {/* Green mana (top-left) */}
        <div className="absolute top-1/4 left-0 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-8 h-8 bg-green-500 rounded-full shadow-lg animate-mana-pulse"
            style={{ animationDelay: "0.8s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
