import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Edit3, LogOut, Sparkles, RotateCcw } from 'lucide-react';
import { ChildProfile, MascotTheme } from '../types';
import { playPopSound } from '../utils/audioEffects';

import { MemberCard } from './MemberCard';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  childProfile: ChildProfile | null;
  onLogout: () => void;
  onEditProfile: () => void;
  mascotTheme?: MascotTheme;
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  childProfile,
  onLogout,
  onEditProfile,
  mascotTheme = 'cyan-jelly',
}) => {
  const [isCardFlipped, setIsCardFlipped] = React.useState(false);
  const [infoNotice, setInfoNotice] = React.useState<string | null>(null);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 tablet:p-5 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 290 }}
          className="w-full max-w-sm tablet:max-w-md max-h-[92vh] overflow-visible bg-[#FFFDF5] rounded-[24px] tablet:rounded-[32px] border-4 border-[#5C4033] shadow-[0_32px_80px_rgba(92,64,51,0.3)] p-5 tablet:p-7 relative flex flex-col items-center text-center pointer-events-auto"
        >
          {/* Yellow Sticky Tape at Top Center */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-amber-300 shadow-sm rotate-[-0.5deg] rounded-xs border border-amber-400/60 z-30" />

          {/* Close Button */}
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-[#5C4033] hover:text-stone-800 flex items-center justify-center transition-all cursor-pointer border-2 border-[#5C4033]/20 shadow-xs z-30"
            title="Tutup"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>

          {/* Header Title */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border-2 border-[#5C4033]/20 text-[#5C4033] text-[11px] tablet:text-xs font-black uppercase tracking-wider mb-2 mt-3 shadow-2xs font-handwriting">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>KARTU PETUALANG RESMI CINCAU</span>
          </div>

          <h3 className="text-xl tablet:text-2xl font-black text-[#5C4033] tracking-tight mb-4 font-handwriting">
            Profil Petualang {childProfile?.name} 🐾
          </h3>

          {/* THE MEMBER CARD */}
          <div className="w-full mb-2">
            <MemberCard
              childProfile={childProfile}
              mascotTheme={mascotTheme}
              isFlipped={isCardFlipped}
              onFlip={setIsCardFlipped}
            />
          </div>

          <button
            onClick={() => {
              playPopSound();
              setIsCardFlipped((prev) => !prev);
            }}
            className="mt-1 py-1.5 text-xs font-black text-[#5C4033] hover:text-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider mx-auto bg-amber-100 px-3 rounded-full border-2 border-[#5C4033]/20 font-handwriting"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Putar Balik Kartu</span>
          </button>

          {/* Action Buttons */}
          <div className="w-full space-y-3 mt-5 tablet:mt-6 font-handwriting">
            {/* Parent Report Button (New) */}
            <button
              onClick={() => {
                playPopSound();
                setInfoNotice('Fitur Laporan Orang Tua akan segera hadir di pembaruan selanjutnya! ✨');
                setTimeout(() => setInfoNotice(null), 3500);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-2 border-[#5C4033] font-black text-xs tablet:text-sm shadow-[0_4px_0_0_#5C4033] flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 tablet:w-5 tablet:h-5 text-amber-950" />
              <span>Laporan Belajar (Khusus Orang Tua)</span>
            </button>

            {infoNotice && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full py-2 px-3 rounded-xl bg-amber-100 border-2 border-amber-300 text-amber-950 text-xs font-black shadow-xs"
              >
                {infoNotice}
              </motion.div>
            )}

            {/* Edit Profile Button */}
            <button
              onClick={() => {
                playPopSound();
                onClose();
                onEditProfile();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-amber-50 text-[#5C4033] border-2 border-[#5C4033]/40 font-black text-xs tablet:text-sm shadow-[0_4px_0_0_#5C4033]/20 flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 tablet:w-5 tablet:h-5 text-amber-600" />
              <span>Ubah Data / Atur Ulang Profil</span>
            </button>

            {/* Log Out Button */}
            <button
              onClick={() => {
                playPopSound();
                onClose();
                onLogout();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-[10px] tablet:text-xs border border-rose-100 flex items-center justify-center gap-2 hover:bg-rose-100 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Keluar Akun (Log Out)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
