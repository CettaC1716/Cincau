import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Navigation } from 'lucide-react';
import { RedAppleSVG, GoldenAppleSVG, RottenAppleSVG } from './AppleCatchSVGAssets';

interface HowToPlayModalProps {
  onBack: () => void;
  onStartGame: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onBack, onStartGame }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-[#BDEBFF] via-[#E9F8FF] to-[#D5F5BE] p-4 tablet:p-6 overflow-y-auto no-scrollbar select-none z-30">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between max-w-md pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/95 border-2 border-sky-200 text-sky-900 font-extrabold text-xs shadow-xs cursor-pointer hover:bg-white active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <h2 className="text-base tablet:text-lg font-black text-[#28334A] tracking-tight">
          Cara Bermain 🍎
        </h2>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* 3 Illustrated Instruction Cards */}
      <div className="w-full max-w-sm flex flex-col gap-3 my-auto py-2">
        {/* Step 1: Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3.5 rounded-2xl bg-white/95 border-2 border-sky-200 shadow-sm flex items-center gap-3.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0 border border-sky-300">
            <Navigation className="w-6 h-6 text-sky-600 rotate-90" />
          </div>
          <div>
            <h3 className="text-xs tablet:text-sm font-black text-neutral-900">
              1. Gerakkan Cingcau
            </h3>
            <p className="text-[11px] tablet:text-xs text-neutral-600 font-semibold mt-0.5">
              Geser jarimu di layar, gunakan tombol panah, atau tombol kiri & kanan untuk berpindah.
            </p>
          </div>
        </motion.div>

        {/* Step 2: Catch with Cingcau's Body */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3.5 rounded-2xl bg-white/95 border-2 border-emerald-200 shadow-sm flex items-center gap-3.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-300">
            <RedAppleSVG size={36} />
          </div>
          <div>
            <h3 className="text-xs tablet:text-sm font-black text-neutral-900">
              2. Tangkap dengan Tubuh Jeli
            </h3>
            <p className="text-[11px] tablet:text-xs text-neutral-600 font-semibold mt-0.5">
              Posisikan Cingcau tepat di bawah apel jatuh. Tangkap dengan bagian atas kepala jeli!
            </p>
          </div>
        </motion.div>

        {/* Step 3: Bonus vs Rotten Hazard */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3.5 rounded-2xl bg-white/95 border-2 border-amber-200 shadow-sm flex items-center gap-3.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300 relative">
            <div className="scale-75 -translate-x-2">
              <GoldenAppleSVG size={32} />
            </div>
            <div className="scale-75 absolute right-0 translate-y-1">
              <RottenAppleSVG size={28} />
            </div>
          </div>
          <div>
            <h3 className="text-xs tablet:text-sm font-black text-neutral-900">
              3. Ambil Bonus & Hindari Apel Busuk
            </h3>
            <p className="text-[11px] tablet:text-xs text-neutral-600 font-semibold mt-0.5">
              <strong className="text-amber-700">Apel Emas (+3)</strong> & <strong className="text-amber-700">Bintang (+5)</strong>. Awas! Jangan sentuh <strong className="text-purple-700">Apel Busuk (-1 Nyawa)</strong>!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Start Playing Button */}
      <div className="w-full max-w-xs pt-2">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartGame}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-black text-sm tablet:text-base shadow-lg shadow-emerald-600/30 border-2 border-emerald-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Saya Mengerti, Ayo Main! 🚀</span>
        </motion.button>
      </div>
    </div>
  );
};
