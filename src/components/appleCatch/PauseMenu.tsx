import React from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { CingcauGameMascot } from './CingcauGameMascot';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onReturnToMenu: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  currentScore: number;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onReturnToMenu,
  isMuted,
  onToggleSound,
  currentScore,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="w-full max-w-xs tablet:max-w-sm rounded-[32px] bg-gradient-to-b from-white via-sky-50 to-white p-5 tablet:p-6 border-4 border-white shadow-2xl flex flex-col items-center text-center"
      >
        {/* Cute Paused Mascot */}
        <div className="w-20 h-20 my-1 flex items-center justify-center">
          <CingcauGameMascot emotion="surprised" size={80} />
        </div>

        <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight mt-1">
          Permainan Dijeda ⏸️
        </h2>
        <p className="text-xs font-bold text-neutral-500 mt-0.5">
          Skor Sementara: <span className="text-red-600 font-black">{currentScore} Poin</span>
        </p>

        {/* Buttons Stack */}
        <div className="w-full space-y-2 mt-4">
          {/* Resume */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm tablet:text-base shadow-md border-2 border-emerald-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Lanjutkan Bermain ▶</span>
          </motion.button>

          {/* Restart */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs tablet:text-sm border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-amber-700" />
            <span>Ulangi dari Awal</span>
          </motion.button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs border border-neutral-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span>{isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}</span>
          </button>

          {/* Return to Menu */}
          <button
            onClick={onReturnToMenu}
            className="w-full py-2 px-4 rounded-2xl text-neutral-500 hover:text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Menu Utama</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
