import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { playPopSound, playCheerSound } from '../utils/audioEffects';
import { MascotTheme } from '../types';
import { SalonItemIcon } from './SalonItemIcon';

interface CincauSalonOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  mascotTheme: MascotTheme;
  onToggleTheme: () => void;
  selectedAccessory: string;
  onSelectAccessory: (accId: string) => void;
  isLandscapeHomescreen?: boolean;
}

const ACCESSORIES: { id: string; name: string; iconType: 'glasses' | 'crown' | 'bow' | 'star' | 'flower' | 'palette'; desc: string }[] = [
  { id: 'crown', name: 'Mahkota', iconType: 'crown', desc: 'Mahkota Emas' },
  { id: 'bow', name: 'Pita', iconType: 'bow', desc: 'Pita Merah' },
  { id: 'star', name: 'Bintang', iconType: 'star', desc: 'Topi Bintang' },
  { id: 'flower', name: 'Bunga', iconType: 'flower', desc: 'Hiasan Bunga' },
  { id: 'glasses', name: 'Kacamata', iconType: 'glasses', desc: 'Kacamata Keren' },
  { id: 'palette', name: 'Palet Seni', iconType: 'palette', desc: 'Gaya Pelukis' },
];

const THEMES: { id: MascotTheme; name: string; color: string; desc: string }[] = [
  { id: 'cyan-jelly', name: 'Biru Cincau', color: '#38bdf8', desc: 'Segar' },
  { id: 'emerald-mint', name: 'Hijau Mint', color: '#10b981', desc: 'Alami' },
  { id: 'berry-purple', name: 'Ungu Berry', color: '#c026d3', desc: 'Ceria' },
  { id: 'sunny-banana', name: 'Kuning Pisang', color: '#f59e0b', desc: 'Hangat' },
  { id: 'classic-orange', name: 'Oranye Manis', color: '#ea580c', desc: 'Tropis' },
];

export const CincauSalonOverlay: React.FC<CincauSalonOverlayProps> = ({
  isOpen,
  onClose,
  mascotTheme,
  onToggleTheme,
  selectedAccessory,
  onSelectAccessory,
  isLandscapeHomescreen = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="salon-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          e.stopPropagation();
          playPopSound();
          onClose();
        }}
        className={`absolute inset-0 z-35 flex flex-col pointer-events-auto select-none ${
          isLandscapeHomescreen
            ? 'w-[52%] tablet:w-[48%] items-center justify-center pl-2 tablet:pl-6 mr-auto'
            : 'items-center justify-start'
        }`}
      >
        {/* Subtle backdrop glow */}
        <div className="absolute inset-0 bg-radial from-purple-500/15 via-pink-500/10 to-transparent pointer-events-none" />

        {/* TOP BASKET / SALON ICON (Click to close) */}
        <motion.div
          initial={{ scale: 0.7, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.7, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 380 }}
          onClick={(e) => e.stopPropagation()}
          className={`flex flex-col items-center relative z-25 ${
            isLandscapeHomescreen ? 'mt-2 tablet:mt-3 scale-85 tablet:scale-90' : 'mt-14'
          }`}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              playPopSound();
              onClose();
            }}
            className="relative cursor-pointer filter drop-shadow-xl hover:scale-105 transition-transform p-3 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-lg border-2 border-white"
            title="Tutup Salon"
          >
            <span className="text-3xl tablet:text-4xl">💇‍♂️</span>
            <div className="absolute -top-1 -right-1 bg-pink-400 text-white font-black text-[9px] tablet:text-[10px] px-1.5 py-0.5 rounded-full shadow-md border border-white flex items-center gap-0.5">
              <span>Salon</span>
              <span>✨</span>
            </div>
          </div>

          <div className="mt-1 text-center flex flex-col items-center">
            <p className="text-xs font-extrabold text-neutral-800">
              Salon Cincau ✨
            </p>
            <p className="text-[10px] tablet:text-[11px] font-medium text-neutral-500">
              Pilih warna jeli &amp; aksesoris keren!
            </p>
          </div>
        </motion.div>

        {/* ITEMS SPREAD IN THE AREA */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-sm px-2 tablet:px-4 grid grid-cols-3 gap-2.5 z-30 ${
            isLandscapeHomescreen ? 'mt-3 tablet:mt-4 scale-85 tablet:scale-90' : 'mt-5 tablet:mt-7'
          }`}
        >
          {/* Theme switcher items (First row or combined) */}
          {THEMES.slice(0, 3).map((th) => (
            <div key={th.id} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: -5 }}
                animate={{ scale: 1, opacity: 1, y: [0, -3, 0] }}
                transition={{ scale: { type: 'spring', damping: 20, stiffness: 450 } }}
                onClick={() => {
                  playCheerSound();
                  if (mascotTheme !== th.id) {
                    onToggleTheme();
                  }
                }}
                className={`relative p-2.5 rounded-2xl cursor-pointer transition-transform touch-none flex flex-col items-center justify-center w-full aspect-square ${
                  mascotTheme === th.id
                    ? 'bg-purple-600 text-white ring-4 ring-purple-300 shadow-lg scale-105'
                    : 'bg-white/95 border-2 border-purple-200 shadow-md hover:scale-105'
                }`}
                title={`Pilih Warna ${th.name}`}
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-inner mb-1"
                  style={{ backgroundColor: th.color }}
                />
                <span className={`text-[10px] font-black truncate max-w-full ${mascotTheme === th.id ? 'text-white' : 'text-purple-900'}`}>
                  {th.name}
                </span>
              </motion.div>
            </div>
          ))}

          {/* Accessories items */}
          {ACCESSORIES.slice(0, 3).map((acc) => (
            <div key={acc.id} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: -5 }}
                animate={{ scale: 1, opacity: 1, y: [0, -3, 0] }}
                transition={{ scale: { type: 'spring', damping: 20, stiffness: 450 } }}
                onClick={() => {
                  playPopSound();
                  onSelectAccessory(acc.id);
                }}
                className={`relative p-2.5 rounded-2xl cursor-pointer transition-transform touch-none flex flex-col items-center justify-center w-full aspect-square ${
                  selectedAccessory === acc.id
                    ? 'bg-amber-500 text-white ring-4 ring-amber-200 shadow-lg scale-105'
                    : 'bg-white/95 border-2 border-amber-200 shadow-md hover:scale-105'
                }`}
                title={`Pakai ${acc.name}`}
              >
                <div className="w-10 h-10 flex items-center justify-center mb-1">
                  <SalonItemIcon type={acc.iconType} className="w-9 h-9 object-contain" />
                </div>
                <span className={`text-[10px] font-black truncate max-w-full ${selectedAccessory === acc.id ? 'text-white' : 'text-amber-900'}`}>
                  {acc.name}
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
