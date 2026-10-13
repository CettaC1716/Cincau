import React from 'react';
import { motion } from 'motion/react';
import { Play, HelpCircle, Volume2, VolumeX, Trophy } from 'lucide-react';
import { CingcauGameMascot } from './CingcauGameMascot';
import { RedAppleSVG, GoldenAppleSVG, OrchardTreeSVG, CloudSVG } from './AppleCatchSVGAssets';

interface StartMenuProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  highScore: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onCloseGame?: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  onStartGame,
  onOpenHowToPlay,
  highScore,
  isMuted,
  onToggleSound,
  onCloseGame,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#BDEBFF] via-[#E1F7FF] to-[#C9F3AA] select-none p-4 tablet:p-6">
      {/* Background Decor: Fluffy Moving Clouds */}
      <motion.div
        animate={{ x: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-6 left-6 pointer-events-none opacity-80"
      >
        <CloudSVG width={130} />
      </motion.div>
      <motion.div
        animate={{ x: [20, -20, 20] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        className="absolute top-12 right-8 pointer-events-none opacity-75"
      >
        <CloudSVG width={110} />
      </motion.div>

      {/* Background Orchard Trees */}
      <div className="absolute -bottom-6 -left-8 pointer-events-none opacity-90 z-0">
        <OrchardTreeSVG size={140} />
      </div>
      <div className="absolute -bottom-6 -right-8 pointer-events-none opacity-90 z-0">
        <OrchardTreeSVG size={140} />
      </div>

      {/* Top Bar: Sound Toggle & Highscore Badge */}
      <div className="w-full flex justify-between items-center z-20 max-w-md">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleSound}
          className="p-2.5 rounded-2xl bg-white/90 border-2 border-sky-200 text-sky-800 shadow-sm flex items-center gap-1.5 font-bold text-xs cursor-pointer hover:bg-white active:scale-95 transition-transform"
          title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-neutral-400" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          <span className="hidden mobile-lg:inline text-neutral-700">{isMuted ? 'Mute' : 'Audio On'}</span>
        </motion.button>

        {highScore > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/90 border-2 border-amber-300 rounded-2xl shadow-sm text-xs font-black text-amber-900">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Rekor: {highScore} Poin</span>
          </div>
        )}

        {onCloseGame && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onCloseGame}
            className="px-3 py-1.5 rounded-2xl bg-white/90 border-2 border-neutral-200 text-neutral-600 font-extrabold text-xs cursor-pointer shadow-xs hover:bg-neutral-100"
          >
            Kembali
          </motion.button>
        )}
      </div>

      {/* Center Stage: Title, Floating Apples, & Cingcau Mascot */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full max-w-sm relative my-auto">
        {/* Floating Decorative Apples */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          className="absolute -top-4 -left-6 z-10 filter drop-shadow-md"
        >
          <RedAppleSVG size={52} />
        </motion.div>
        <motion.div
          animate={{ y: [8, -8, 8], rotate: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-2 -right-4 z-10 filter drop-shadow-md"
        >
          <GoldenAppleSVG size={48} />
        </motion.div>

        {/* Game Title Badge */}
        <div className="text-center mb-3">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 260 }}
            className="inline-block px-4 py-1 rounded-full bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-md border-2 border-white mb-1"
          >
            🍎 Mini Game Seru
          </motion.div>
          <h1 className="text-3xl tablet:text-4xl font-black text-[#28334A] tracking-tight leading-none drop-shadow-sm">
            CINGCAU
          </h1>
          <h2 className="text-2xl tablet:text-3xl font-black text-[#EF3844] tracking-tight">
            APPLE CATCH!
          </h2>
          <p className="text-xs tablet:text-sm font-bold text-neutral-600 mt-1">
            Tangkap apel sebanyak mungkin! 🍏✨
          </p>
        </div>

        {/* Hero Cingcau Mascot */}
        <div className="my-2">
          <CingcauGameMascot
            emotion="celebrating"
            size={135}
            className="drop-shadow-xl"
          />
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full max-w-xs flex flex-col gap-2.5 z-20 pb-2">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartGame}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-black text-base tablet:text-lg shadow-lg shadow-emerald-600/30 border-3 border-emerald-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Mulai Bermain! 🚀</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenHowToPlay}
          className="w-full py-2.5 px-4 rounded-2xl bg-white/95 text-sky-900 font-extrabold text-xs tablet:text-sm shadow-xs border-2 border-sky-200 flex items-center justify-center gap-2 cursor-pointer hover:bg-white active:scale-95 transition-all"
        >
          <HelpCircle className="w-4 h-4 text-sky-600" />
          <span>Cara Bermain</span>
        </motion.button>
      </div>
    </div>
  );
};
