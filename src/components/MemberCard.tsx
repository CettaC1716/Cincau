import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChildProfile, MascotTheme } from '../types';
import { ProfileAvatar } from './ProfileAvatar';
import { INTEREST_STICKERS } from '../data/stickers';
import { playPopSound } from '../utils/audioEffects';

interface MemberCardProps {
  childProfile: ChildProfile | null;
  mascotTheme?: MascotTheme;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  childProfile,
  isFlipped: controlledIsFlipped,
  onFlip,
}) => {
  const [internalIsFlipped, setInternalIsFlipped] = useState<boolean>(false);
  const isCardFlipped = controlledIsFlipped !== undefined ? controlledIsFlipped : internalIsFlipped;

  const handleFlip = () => {
    const nextFlipped = !isCardFlipped;
    if (onFlip) {
      onFlip(nextFlipped);
    } else {
      setInternalIsFlipped(nextFlipped);
    }
  };

  const childName = childProfile?.name || 'Petualang Cilik';
  const fase = childProfile?.fase || 'A';
  const gender = childProfile?.gender || 'boy';
  const playDurationMinutes = childProfile?.playDuration || '30 Menit';
  const selectedStickers = childProfile?.stickers || [];
  const memberId = childProfile?.memberId || 'CINCAU-2026-VIP';

  return (
    <div className="perspective-1000 w-full max-w-xs mx-auto">
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.15}
        whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
        onClick={() => {
          playPopSound();
          handleFlip();
        }}
        animate={{ 
          rotateY: isCardFlipped ? 180 : 0,
          rotateZ: isCardFlipped ? [-1, 1, -1] : [1, -1, 1],
        }}
        transition={{ 
          rotateY: { duration: 0.6, type: 'spring', damping: 20 },
          rotateZ: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        }}
        className="w-full h-56 rounded-3xl shadow-xl cursor-pointer relative preserve-3d"
      >
        {/* CARD FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFE8CC] border-3 border-amber-300 p-4 flex flex-col justify-between backface-hidden shadow-md overflow-hidden">
          {/* Shimmer overlay */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/40 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🌿</span>
              <span className="text-[10px] font-black uppercase text-amber-950 tracking-wider">
                CINCAU ADVENTURE CLUB
              </span>
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 bg-amber-500 text-white rounded-full">
              VIP MEMBER
            </span>
          </div>

          {/* Middle info */}
          <div className="flex items-center gap-3 py-1">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
              <ProfileAvatar gender={gender} className="w-14 h-14" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-black text-neutral-900 leading-tight">
                {childName}
              </h3>
              <span className="text-[10px] font-bold text-amber-800 block mt-0.5">
                Fase {fase} • {gender === 'boy' ? 'Jagoan Cilik' : 'Putri Cilik'}
              </span>
              <span className="text-[9px] font-medium text-neutral-500 block">
                Target: {playDurationMinutes} {childProfile?.birthDate ? `• 🎂 ${String(childProfile.birthDate.day).padStart(2, '0')}/${String(childProfile.birthDate.month).padStart(2, '0')}` : ''}
              </span>
            </div>
          </div>

          {/* Bottom stickers & barcode */}
          <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {selectedStickers.slice(0, 3).map((id) => (
                <span key={id} className="text-sm">
                  {INTEREST_STICKERS.find((s) => s.id === id)?.icon}
                </span>
              ))}
            </div>

            <div className="text-right">
              <div className="flex items-center gap-0.5 h-3">
                <div className="w-1 h-full bg-neutral-900" />
                <div className="w-2 h-full bg-neutral-900" />
                <div className="w-0.5 h-full bg-neutral-900" />
                <div className="w-1.5 h-full bg-neutral-900" />
                <div className="w-1 h-full bg-neutral-900" />
                <div className="w-2.5 h-full bg-neutral-900" />
              </div>
              <span className="text-[8px] font-mono text-neutral-400 block mt-0.5">
                ID: {memberId}
              </span>
            </div>
          </div>
        </div>

        {/* CARD BACK SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#FFF5EA] via-[#FFE4CC] to-[#FED7AA] border-3 border-amber-400 p-4 flex flex-col justify-between backface-hidden rotate-y-180 shadow-md">
          <div className="text-center pt-2">
            <span className="text-2xl block mb-1">🏅</span>
            <h4 className="text-xs font-black text-amber-950 uppercase">
              Janji Petualang Cincau
            </h4>
            <p className="text-[10px] font-medium text-amber-900/80 mt-1 max-w-[210px] mx-auto leading-snug">
              "Aku berjanji akan selalu penasaran belajar hal baru, berbuat baik, dan bermain dengan gembira!"
            </p>
          </div>

          <div className="py-2 flex items-center justify-center gap-4 border-t border-amber-300/80">
            <div className="w-10 h-10 bg-white rounded-lg p-1 border border-amber-300 shadow-2xs flex items-center justify-center text-xs">
              📱 QR
            </div>
            <div className="text-left text-[9px] font-bold text-amber-950">
              <span>Resmi Diverifikasi oleh</span>
              <span className="block text-orange-700 font-black">Cincau Edu Indonesia</span>
            </div>
          </div>

          <span className="text-[9px] text-amber-800/60 font-semibold block text-center">
            Ketuk untuk membalik kembali
          </span>
        </div>
      </motion.div>
    </div>
  );
};
