import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Home, Trophy, Sparkles } from 'lucide-react';
import { CingcauGameMascot } from './CingcauGameMascot';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewRecord: boolean;
  onRetry: () => void;
  onReturnToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewRecord,
  onRetry,
  onReturnToMenu,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="w-full max-w-xs tablet:max-w-sm rounded-[32px] bg-gradient-to-b from-white via-red-50/40 to-white p-5 tablet:p-6 border-4 border-white shadow-2xl flex flex-col items-center text-center"
      >
        {/* Adorable Sad Cingcau */}
        <div className="w-24 h-24 my-1 flex items-center justify-center">
          <CingcauGameMascot emotion="disappointed" size={90} />
        </div>

        <h2 className="text-2xl font-black text-[#28334A] tracking-tight mt-1">
          Yah, Game Over! 😢
        </h2>
        <p className="text-xs font-semibold text-neutral-500 mt-0.5">
          Jangan berkecil hati, Cingcau tetap bangga padamu!
        </p>

        {/* Score & High Score Box */}
        <div className="w-full bg-white rounded-2xl border-2 border-neutral-200 p-3.5 my-3.5 shadow-xs flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-600">
            <span>Skor Akhir:</span>
            <span className="text-lg font-black text-red-600">{score} Poin</span>
          </div>

          <div className="h-px bg-neutral-100" />

          <div className="flex justify-between items-center text-xs font-bold text-neutral-600">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Rekor Terbaik:</span>
            </span>
            <span className="text-base font-black text-amber-600">{highScore} Poin</span>
          </div>

          {isNewRecord && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="mt-1 py-1 px-2.5 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] flex items-center justify-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3 fill-amber-950" />
              <span>REKOR BARU DICAPAI! 🎉</span>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRetry}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white font-black text-sm tablet:text-base shadow-lg shadow-red-500/30 border-2 border-red-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Lagi! 🍎</span>
          </motion.button>

          <button
            onClick={onReturnToMenu}
            className="w-full py-2.5 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kembali ke Menu</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
