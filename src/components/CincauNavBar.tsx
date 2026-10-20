import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import { FruitBasketIcon } from './FruitBasketIcon';
import { playPopSound, playPurrSound } from '../utils/audioEffects';
import { ChildProfile } from '../types';

interface CincauNavBarProps {
  hp: number;
  totalFoodCount: number;
  childProfile?: ChildProfile | null;
  onOpenProfile?: () => void;
  onOpenSalon?: () => void;
  onOpenFeeding?: () => void;
  onPetAction?: () => void;
  className?: string;
}

export const CincauNavBar: React.FC<CincauNavBarProps> = ({
  hp,
  totalFoodCount,
  childProfile,
  onOpenProfile,
  onOpenSalon,
  onOpenFeeding,
  onPetAction,
  className = '',
}) => {
  const [floatingHpText, setFloatingHpText] = useState<{ id: number; text: string } | null>(null);

  const handlePetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPurrSound();
    setFloatingHpText({ id: Date.now(), text: '+6 HP 💕' });
    setTimeout(() => setFloatingHpText(null), 1200);
    if (onPetAction) onPetAction();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`z-40 flex flex-col items-end gap-1 px-1.5 py-2 bg-white/95 backdrop-blur-md rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] border-2 border-amber-200/80 pointer-events-auto ${className}`}
    >
      {/* Item 0: Mood / Profil Si Kecil */}
      <div className="flex items-center gap-2 group/item">
        <span className="text-[9px] tablet:text-[10px] font-black text-neutral-600 bg-neutral-100/80 px-1.5 py-0.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity">
          Mood
        </span>
        <motion.button
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            playPopSound();
            if (onOpenProfile) onOpenProfile();
          }}
          className="flex items-center justify-center w-8 h-8 tablet:w-9 tablet:h-9 rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-rose-500 border-2 border-white transition-all cursor-pointer shadow-sm overflow-hidden"
          title="Profil Si Kecil"
        >
          <ProfileAvatar gender={childProfile?.gender || 'boy'} className="w-6 h-6 invert brightness-[2.5]" />
        </motion.button>
      </div>

      {/* Divider */}
      <div className="h-px w-5 bg-neutral-100 mx-auto" />

      {/* Item 1: Kostum / Salon */}
      <div className="flex items-center gap-2 group/item">
        <span className="text-[9px] tablet:text-[10px] font-black text-neutral-600 bg-neutral-100/80 px-1.5 py-0.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity">
          Kostum
        </span>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            playPopSound();
            if (onOpenSalon) onOpenSalon();
          }}
          className="flex items-center justify-center w-8 h-8 tablet:w-9 tablet:h-9 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 border-2 border-white transition-all cursor-pointer shadow-sm"
          title="Salon & Kostum Cincau"
        >
          <span className="text-base drop-shadow-sm">💇‍♂️</span>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="h-px w-5 bg-neutral-100 mx-auto" />

      {/* Item 2: Makan / Keranjang Hadiah */}
      <div className="flex items-center gap-2 group/item">
        <span className="text-[9px] tablet:text-[10px] font-black text-neutral-600 bg-neutral-100/80 px-1.5 py-0.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity">
          Makan
        </span>
        <motion.button
          whileHover={{ scale: 1.1, rotate: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            e.stopPropagation();
            playPopSound();
            if (onOpenFeeding) onOpenFeeding();
          }}
          className="relative flex items-center justify-center w-8 h-8 tablet:w-9 tablet:h-9 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 border-2 border-white transition-all cursor-pointer shadow-sm group"
          title="Buka Keranjang Hadiah Makanan"
        >
          <div className="relative">
            <FruitBasketIcon className="w-5 h-5 drop-shadow-sm group-hover:scale-110 transition-transform brightness-0 invert" />
            {totalFoodCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-white text-orange-800 text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-orange-200 shadow-xs animate-bounce">
                {totalFoodCount}
              </span>
            )}
          </div>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="h-px w-5 bg-neutral-100 mx-auto" />

      {/* Item 3: Sayang / Icon Love & Radial Healthbar */}
      <div className="flex items-center gap-2 group/item">
        <span className="text-[9px] tablet:text-[10px] font-black text-neutral-600 bg-neutral-100/80 px-1.5 py-0.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity">
          Sayang
        </span>
        <div className="relative flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePetClick}
            className={`relative flex items-center justify-center w-8 h-8 tablet:w-9 tablet:h-9 rounded-full bg-pink-50 hover:bg-pink-100 transition-all cursor-pointer shadow-xs border border-pink-200/50 group ${
              hp <= 30 ? 'animate-pulse ring-2 ring-pink-400 ring-offset-1' : ''
            }`}
            title={`HP Cincau: ${Math.round(hp)}%`}
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="17" fill="transparent" stroke="#fce7f3" strokeWidth="2.5" />
              <circle
                cx="20"
                cy="20"
                r="17"
                fill="transparent"
                stroke="#db2777"
                strokeWidth="2.8"
                strokeDasharray={106.8}
                strokeDashoffset={106.8 * (1 - Math.max(0, Math.min(100, hp)) / 100)}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <Heart className="w-3.5 h-3.5 fill-[#db2777] text-[#db2777] drop-shadow-2xs group-hover:scale-115 transition-transform" />
            <span className="absolute -bottom-1 -right-1 bg-[#be185d] text-white text-[7px] font-black px-1 rounded-full border border-white shadow-2xs leading-tight">
              {Math.round(hp)}
            </span>
          </motion.button>

          <AnimatePresence>
            {floatingHpText && (
              <motion.div
                key={floatingHpText.id}
                initial={{ opacity: 1, y: 0, scale: 0.85 }}
                animate={{ opacity: 0, y: -26, scale: 1.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap px-1.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-[9px] shadow-md shadow-pink-500/30 flex items-center gap-0.5 z-50 border border-white"
              >
                <span>{floatingHpText.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
