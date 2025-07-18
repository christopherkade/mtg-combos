"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import mtgLogoPng from "../../public/mtgLogo.png";

export default function Welcome() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-transparent to-orange-900/20" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* MTG Logo */}
        <div className="mb-6 sm:mb-8 flex flex-col items-center">
          <div className="relative w-64 sm:w-80 md:w-96 h-auto mb-3 sm:mb-4">
            <Image
              src={mtgLogoPng}
              alt="Magic: The Gathering Logo"
              width={400}
              height={150}
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
          </div>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" />
        </div>

        {/* Subtitle */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-100 mb-3 sm:mb-4">
            Combo Master
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-yellow-200 leading-relaxed max-w-2xl mx-auto px-2">
            Test your knowledge of Magic: The Gathering by identifying the cards
            that create powerful combos. From infinite mana to game-winning
            synergies, can you spot the connections that make Magic legendary?
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={() => router.push("/combos")}
          className="hover:cursor-pointer group relative inline-flex items-center justify-center px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold text-stone-50 bg-gradient-to-r from-green-700 to-green-600 rounded-xl shadow-2xl hover:from-green-600 hover:to-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/25 border-2 border-green-500/50 hover:border-green-400 w-full sm:w-auto max-w-xs mx-auto"
        >
          <span className="relative z-10">Start Game</span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-300/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Decorative elements */}
        <div className="mt-12 sm:mt-16 flex justify-center space-x-3 sm:space-x-6 md:space-x-8 opacity-60">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-yellow-400/40 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400/20 rounded-full" />
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-blue-400/40 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400/20 rounded-full" />
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-stone-400/40 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-stone-400/20 rounded-full" />
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-red-400/40 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-400/20 rounded-full" />
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-green-400/40 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-400/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
