import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playFaunaChime } from '../utils/audioEffects';

interface FaunaInteractiveCardProps {
  onExplore?: () => void;
  isDraggingRef?: React.RefObject<boolean>;
}

export const FaunaInteractiveCard: React.FC<FaunaInteractiveCardProps> = ({ 
  onExplore,
  isDraggingRef 
}) => {
  const [showToast, setShowToast] = useState(false);
  const [isBtnPressed, setIsBtnPressed] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTriggerExplore = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDraggingRef?.current) return;

    // Tactile button bounce feedback
    setIsBtnPressed(true);
    setTimeout(() => setIsBtnPressed(false), 180);

    // Play cheerful safari fauna chime
    playFaunaChime();

    // Show floating card notification toast
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2800);

    if (onExplore) {
      onExplore();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => handleTriggerExplore()}
      className="toycad-card-item relative rounded-[2.2rem] overflow-hidden group transition-all duration-500 hover:scale-[1.015] bg-[#001711] shrink-0 cursor-pointer select-none font-['Quicksand',sans-serif]"
      style={{
        boxShadow: 'rgba(0, 23, 17, 0.45) 0px 24px 60px -15px, rgba(245, 166, 35, 0.25) 0px 0px 0px 1px',
        backgroundColor: '#001711'
      }}
    >
      {/* Full-Bleed Artwork Image (3D Globe World Wonders Animals) */}
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDUE55d1PuvRXzvt69dc0fhVqCrlgML0ug32vFp0XZyi4IIzAmO36OSUuuajvARNl7Kiqg-0m_fsi6vRfRxxWJdTMXQvRs7OkPywSFZFh3Zmgeqb1k6wZWM4qKMe8E4w39qCXHLHtsQ1LQo63u8qfxLOrPcd_iZzf36t6mRILBPsVFTl4Dn8Z-bZyRpb--c060jqWdRKQsVlGunoB6-bERgNKfeFUvjSXRIcDezELNk6nQ6daW_A"
        alt="Buku Interaktif Satwa Rimba & Dunia 3D"
        className="w-full h-full object-cover object-[center_12%] select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />

      {/* Subtle Vignette & Glow Overlay for Visual Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#001711]/90 via-transparent to-black/30 pointer-events-none" />

      {/* Bottom Interactive Action Button (Matches Card 1) */}
      <div className="absolute bottom-5 left-5 right-5 z-20">
        <button
          onClick={(e) => handleTriggerExplore(e)}
          className={`w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#b3f51b] via-[#a2ea12] to-[#88e000] hover:brightness-110 active:scale-95 text-black font-black text-xs sm:text-sm flex items-center justify-between shadow-[0_8px_25px_rgba(179,245,27,0.4)] border-2 border-white/40 transition-all cursor-pointer group/btn ${
            isBtnPressed ? 'scale-95' : ''
          }`}
          title="Mulai Eksplorasi Rimba Dunia 3D"
        >
          <span className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center shadow-inner">
              <svg className="w-3.5 h-3.5 fill-[#b3f51b] text-[#b3f51b] ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="font-black tracking-tight text-black">Mulai Eksplorasi</span>
          </span>
          <svg className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {/* Notification Toast (Appears upon clicking Explore or card) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-[#053e2e] to-[#0a5c45] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-xl flex items-center gap-2 whitespace-nowrap border border-[#f5a623]/50"
          >
            <span>🦁 Membuka Petualangan Safari Satwa Dunia...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
