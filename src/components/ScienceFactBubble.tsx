import React from 'react';
import { motion } from 'motion/react';
import { playPopSound } from '../utils/audioEffects';

export interface ScienceFact {
  title: string;
  fact: string;
  explanation: string;
}

interface ScienceFactBubbleProps {
  isVisible: boolean;
  scienceFactIndex: number;
  isExplaining: boolean;
  displayedText: string;
  isTyping: boolean;
  isInteractingModalsOpen: boolean;
  totalFacts: number;
  onExplainingChange: (explaining: boolean) => void;
  onFactIndexChange: (index: number | ((prev: number) => number)) => void;
  isLandscape?: boolean;
}

export const ScienceFactBubble: React.FC<ScienceFactBubbleProps> = ({
  isVisible,
  scienceFactIndex,
  isExplaining,
  displayedText,
  isTyping,
  isInteractingModalsOpen,
  totalFacts,
  onExplainingChange,
  onFactIndexChange,
  isLandscape = false,
}) => {
  const showBubble = isVisible && !isInteractingModalsOpen;

  return (
    <div className="relative z-20 w-full max-w-full mx-auto px-1 my-1 min-h-[110px] tablet:min-h-[130px] flex flex-col items-center justify-center overflow-visible pointer-events-auto">
      <motion.div
        initial={false}
        animate={{
          opacity: showBubble ? 1 : 0,
          scale: showBubble ? 1 : 0.95,
          y: isInteractingModalsOpen ? -140 : (showBubble ? 0 : 8),
          pointerEvents: showBubble ? 'auto' : 'none',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full flex flex-col items-center"
      >
        <motion.div
          key={`${scienceFactIndex}-${isExplaining}`}
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: showBubble ? 1 : 0, scale: showBubble ? 1 : 0.92, y: showBubble ? 0 : 10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full bg-[#FFFDF5] backdrop-blur-md rounded-2xl tablet:rounded-3xl p-3.5 tablet:p-4 border-2 tablet:border-3 border-amber-300/90 shadow-md text-center relative group max-h-[38vh] tablet:max-h-[42vh] overflow-y-auto no-scrollbar flex flex-col mt-0"
        >
          {/* 3D Tactile Speech Bubble Tail */}
          {isLandscape ? (
            /* Right Side Pointer Tail pointing directly to the Mascot on the Right */
            <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-4 h-4 bg-[#FFFDF5] border-r-2 border-t-2 border-amber-300/90 rotate-45 rounded-tr-xs shadow-[2px_-2px_4px_rgba(245,158,11,0.12)] z-10" />
          ) : (
            /* Bottom Pointer Tail pointing toward Cincau Mascot below */
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFFDF5] border-r-2 border-b-2 border-amber-300/90 rotate-45 rounded-br-xs shadow-[2px_2px_4px_rgba(245,158,11,0.12)] z-10" />
          )}

          <div className="flex flex-col items-center flex-1">
            {/* Cheerful Pill Badge Header: 💡 Fakta Seru Ayah Cincau */}
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 shadow-2xs mb-2">
              <span className="text-[11px] tablet:text-xs font-extrabold text-amber-950 tracking-normal">
                💡 Fakta Seru Ayah Cincau
              </span>
            </div>

            {/* Upright, Highly Legible Typography for SD Grade 1-6 */}
            <div className="w-full flex-1 flex flex-col justify-center">
              <p className="text-xs sm:text-sm tablet:text-base font-bold text-neutral-800 leading-snug text-center px-1">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-1.5 h-3.5 bg-amber-500 ml-1 rounded-full animate-pulse" />
                )}
              </p>
            </div>
          </div>

          {/* 3D Tactile Action CTA Button */}
          {!isTyping && (
            <div className="mt-2.5 tablet:mt-3 shrink-0 z-20">
              {!isExplaining ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playPopSound();
                    onExplainingChange(true);
                  }}
                  className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs tablet:text-sm shadow-[0_3px_0_0_#d97706] hover:shadow-[0_4px_0_0_#d97706] border border-amber-300/80 cursor-pointer transition-all flex items-center justify-center gap-1.5 active:translate-y-0.5 active:shadow-none"
                >
                  <span>✨ Ceritakan Lagi!</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playPopSound();
                    onExplainingChange(false);
                    onFactIndexChange((prev) => (prev + 1) % totalFacts);
                  }}
                  className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs tablet:text-sm shadow-[0_3px_0_0_#b45309] hover:shadow-[0_4px_0_0_#b45309] border border-amber-300/70 cursor-pointer transition-all flex items-center justify-center gap-1.5 active:translate-y-0.5 active:shadow-none"
                >
                  <span>Lanjut Fakta Lainnya ➔</span>
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
