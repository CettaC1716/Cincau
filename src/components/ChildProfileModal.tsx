import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, Award, Clock, Edit3, LogOut, Sparkles } from 'lucide-react';
import { ChildProfile, MascotTheme } from '../types';
import { CharviMascot } from './CharviMascot';
import { playPopSound } from '../utils/audioEffects';

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
  if (!isOpen) return null;

  const childName = childProfile?.name || 'Petualang Cilik';
  const faseLabel = childProfile?.fase 
    ? childProfile.fase === 'A' 
      ? 'Fase A (Kelas 1 - 2 SD)' 
      : childProfile.fase === 'B' 
        ? 'Fase B (Kelas 3 - 4 SD)' 
        : 'Fase C (Kelas 5 - 6 SD)'
    : 'Fase A (Kelas 1 - 2 SD)';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          className="w-full max-w-sm tablet:max-w-md max-h-[92vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-sky-50 via-white to-sky-50/60 rounded-[28px] tablet:rounded-[38px] border-4 border-white shadow-2xl p-4.5 tablet:p-7 relative flex flex-col items-center text-center"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="absolute top-4 right-4 min-h-[44px] min-w-[44px] tablet:min-h-[48px] tablet:min-w-[48px] rounded-2xl bg-white/95 border border-neutral-200/80 flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shadow-xs"
            title="Tutup"
          >
            <X className="w-5 h-5 tablet:w-6 tablet:h-6" />
          </button>

          {/* Header Title */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-[11px] tablet:text-xs font-extrabold uppercase tracking-wider mb-2 mt-1">
            <Sparkles className="w-3.5 h-3.5 tablet:w-4 tablet:h-4 text-amber-500" />
            <span>Profil Si Kecil</span>
          </div>

          {/* Mascot & Name Header */}
          <div className="relative w-24 h-24 tablet:w-28 tablet:h-28 my-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-200/50 rounded-full filter blur-md animate-pulse" />
            <CharviMascot
              variant="compact-header"
              emotion="idle"
              theme="cyan-jelly"
              className="w-20 h-20 tablet:w-24 tablet:h-24 drop-shadow-md relative z-10"
            />
          </div>

          <h3 className="text-2xl tablet:text-3xl font-black text-neutral-900 tracking-tight">
            {childName}
          </h3>
          <p className="text-xs tablet:text-sm font-bold text-sky-700 mt-1 px-3.5 py-1 rounded-full bg-white border border-sky-200 shadow-2xs">
            {faseLabel}
          </p>

          {/* Info Cards Container */}
          <div className="w-full space-y-2.5 tablet:space-y-3 mt-4 tablet:mt-5 text-left">
            {/* Subject / Learning Goals */}
            <div className="p-3.5 tablet:p-4 bg-white/95 rounded-2xl border border-sky-100 shadow-2xs flex items-start gap-3.5">
              <div className="w-9 h-9 tablet:w-10 tablet:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] tablet:text-xs font-bold text-neutral-400 uppercase tracking-wider block">Fokus Belajar</span>
                <p className="text-xs tablet:text-sm font-extrabold text-neutral-800 truncate mt-0.5">
                  {childProfile?.favoriteSubject || childProfile?.learningGoals?.[0] || 'Berhitung & Logika Cepat'}
                </p>
              </div>
            </div>

            {/* Target Play Duration */}
            <div className="p-3.5 tablet:p-4 bg-white/95 rounded-2xl border border-sky-100 shadow-2xs flex items-start gap-3.5">
              <div className="w-9 h-9 tablet:w-10 tablet:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] tablet:text-xs font-bold text-neutral-400 uppercase tracking-wider block">Target Harian</span>
                <p className="text-xs tablet:text-sm font-extrabold text-neutral-800 truncate mt-0.5">
                  {childProfile?.playDuration || '15 - 30 Menit'}
                </p>
              </div>
            </div>

            {/* Email Parent Note */}
            {childProfile?.parentEmail && (
              <div className="p-3 tablet:p-3.5 bg-sky-50/90 rounded-2xl border border-sky-200/70 flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 tablet:w-5 tablet:h-5 text-sky-600 shrink-0" />
                <span className="text-xs tablet:text-sm font-semibold text-sky-900 truncate">
                  Terhubung: {childProfile.parentEmail}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5 mt-5 tablet:mt-6">
            {/* Edit Profile Button */}
            <button
              onClick={() => {
                playPopSound();
                onClose();
                onEditProfile();
              }}
              className="w-full min-h-[44px] tablet:min-h-[48px] py-3 tablet:py-3.5 px-4 rounded-2xl bg-white hover:bg-sky-50/80 text-sky-700 border-2 border-sky-200 font-extrabold text-xs tablet:text-sm shadow-2xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 tablet:w-5 tablet:h-5 text-sky-600" />
              <span>Ubah Data / Atur Ulang Profil</span>
            </button>

            {/* Log Out Button */}
            <button
              onClick={() => {
                playPopSound();
                onClose();
                onLogout();
              }}
              className="w-full min-h-[44px] tablet:min-h-[48px] py-3 tablet:py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs tablet:text-sm shadow-md shadow-rose-500/20 border border-rose-400 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 tablet:w-5 tablet:h-5 text-white" />
              <span>Keluar Akun (Log Out)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
