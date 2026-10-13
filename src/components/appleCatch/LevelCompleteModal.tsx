import React from 'react';
import { motion } from 'motion/react';
import { Star, RotateCcw, Home, Sparkles } from 'lucide-react';
import { CingcauGameMascot } from './CingcauGameMascot';

interface LevelCompleteModalProps {
  score: number;
  highScore: number;
  starsEarned: number; // 1, 2, or 3 stars
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  score,
  highScore,
  starsEarned,
  onPlayAgain,
  onReturnToMenu,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="w-full max-w-xs tablet:max-w-sm rounded-[34px] bg-gradient-to-b from-white via-amber-50/50 to-emerald-50/40 p-5 tablet:p-6 border-4 border-amber-300 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Confetti Sparkle Ring */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Celebrating Cingcau */}
        <div className="w-24 h-24 my-1 flex items-center justify-center">
          <CingcauGameMascot emotion="celebrating" size={96} />
        </div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hebat Sekali! 🎉</span>
        </motion.div>

        <h2 className="text-2xl font-black text-[#28334A] tracking-tight">
          Panen Apel Berhasil!
        </h2>
        <p className="text-xs font-bold text-neutral-500 mt-0.5">
          Cingcau kenyang dan sangat senang!
        </p>

        {/* 3-Star Rating Presentation */}
        <div className="flex items-center justify-center gap-2 my-3">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= starsEarned;
            return (
              <motion.div
                key={starIdx}
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: isEarned ? [1, 1.25, 1] : 1, rotate: 0 }}
                transition={{ delay: starIdx * 0.2, type: 'spring' }}
                className={`p-2 rounded-2xl border-2 ${
                  isEarned
                    ? 'bg-amber-100 border-amber-400 text-amber-500 shadow-sm'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-300'
                }`}
              >
                <Star className={`w-6 h-6 ${isEarned ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}`} />
              </motion.div>
            );
          })}
        </div>

        {/* Score Summary Box */}
        <div className="w-full bg-white rounded-2xl border-2 border-amber-200 p-3.5 mb-3.5 shadow-2xs flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-600">
            <span>Skor Panen:</span>
            <span className="text-xl font-black text-emerald-600">+{score} Poin</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-neutral-500">
            <span>Rekor Terbaik:</span>
            <span className="text-sm font-black text-amber-600">{highScore} Poin</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onPlayAgain}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-black text-sm tablet:text-base shadow-lg shadow-emerald-500/30 border-2 border-emerald-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Lagi! 🌟</span>
          </motion.button>

          <button
            onClick={onReturnToMenu}
            className="w-full py-2.5 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Selesai & Kembali</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
