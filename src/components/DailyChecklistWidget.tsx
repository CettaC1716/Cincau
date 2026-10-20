import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ChevronRight, Flame } from 'lucide-react';
import { playPopSound, playCheerSound } from '../utils/audioEffects';
import { PlayfulConfetti } from './PlayfulConfetti';
import { CharviMascot } from './CharviMascot';

interface DailyChecklistWidgetProps {
  completedCount: number;
  totalTasks: number;
  isAllCompleted: boolean;
  streak: number;
  tasks: {
    feed: { current: number; target: number; completed: boolean };
    quiz: { current: number; target: number; completed: boolean };
    pet: { current: number; target: number; completed: boolean };
  };
  claimedBonusToday: boolean;
  onClaimBonus: () => void;
  onOpenFeedMenu?: () => void;
  onOpenQuizMenu?: () => void;
  onPetMascotAction?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  isInline?: boolean;
  className?: string;
}



export const DailyChecklistWidget: React.FC<DailyChecklistWidgetProps> = ({
  completedCount,
  totalTasks,
  isAllCompleted,
  streak,
  tasks,
  claimedBonusToday,
  onClaimBonus,
  onOpenFeedMenu,
  onOpenQuizMenu,
  onPetMascotAction,
  onOpenChange,
  isInline = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTriggeredRef = useRef(false);

  useEffect(() => {
    if (isOpen && isAllCompleted) {
      if (!confettiTriggeredRef.current) {
        setShowConfetti(true);
        confettiTriggeredRef.current = true;
      }
    } else if (!isOpen) {
      confettiTriggeredRef.current = false;
      setShowConfetti(false);
    }
  }, [isOpen, isAllCompleted]);

  const triggerManualConfetti = () => {
    setShowConfetti(false);
    setTimeout(() => {
      setShowConfetti(true);
    }, 50);
  };

  const handleToggle = () => {
    playPopSound();
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (onOpenChange) onOpenChange(nextState);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* SMALL MASCOT BUTTON WITH SPEECH BUBBLE CHAT */}
      {/* ========================================================= */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={isInline 
          ? `inline-flex items-center select-none ${className}` 
          : `absolute bottom-[40%] left-4 tablet:left-8 z-40 select-none ${className}`
        }
      >
        <motion.div
          onClick={handleToggle}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="relative group flex flex-row items-center gap-2.5 cursor-pointer"
        >
          {/* 1. Tombol Mascot Kecil (Small Mascot Circle Stage Button) */}
          <div className="relative w-12 h-12 tablet:w-13 tablet:h-13 rounded-full bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 border-2 border-amber-400 shadow-md flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all ring-2 ring-amber-200/70">
            <div className="w-full h-full p-1 flex items-center justify-center">
              <CharviMascot variant="compact-header" theme="cyan-jelly" className="w-full h-full scale-110 drop-shadow-2xs" />
            </div>
            {isAllCompleted ? (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 text-[10px] font-black border-2 border-white shadow-xs animate-bounce">
                ✓
              </span>
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                {completedCount}
              </span>
            )}
          </div>

          {/* 2. Floating Tactile Speech Bubble (Upright, Clean & Kid-Friendly) */}
          <div className="relative bg-[#FFFDF5] backdrop-blur-md border-2 border-amber-300 rounded-2xl shadow-[0_6px_20px_rgba(245,158,11,0.18)] px-4 py-2 flex items-center gap-2.5">
            {/* Left Speech Pointer Tail pointing directly to the Mascot Button */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-8 border-r-amber-300" />
            <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-5 border-y-transparent border-r-7 border-r-[#FFFDF5]" />

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs tablet:text-sm font-extrabold text-amber-950 tracking-tight">
                  Misi Harian 💬
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-100 border border-orange-300 text-orange-900 text-[10px] tablet:text-xs font-black">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-400" />
                  {streak} Hari
                </span>
              </div>

              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center gap-1.5 bg-[#FDF8ED] px-2.5 py-0.5 rounded-full border border-amber-200">
                  <span className={`w-2 h-2 rounded-full ${isAllCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-[10px] tablet:text-xs font-bold text-amber-900">
                    {completedCount}/{totalTasks} Tuntas
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className={`w-4 h-4 text-amber-600 transition-transform duration-200 ml-1 ${isOpen ? 'rotate-90' : ''}`} />
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================= */}
      {/* PAWCHI FLOATING CARD OVERLAY / MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 tablet:p-5 bg-amber-950/45 backdrop-blur-xs select-none">
            {/* Backdrop click */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0"
            />

            {/* Refined Cincau Mission Modal (Memo Board Style) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[420px] max-h-[90vh] tablet:max-h-[85vh] bg-[#FFFDF5] rounded-[36px] tablet:rounded-[40px] shadow-[0_32px_80px_rgba(92,64,51,0.3)] pointer-events-auto z-10 flex flex-col items-center border-4 border-[#5C4033] overflow-visible"
            >
              {/* Yellow Sticky Tape at Top Center */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-amber-300 shadow-sm rotate-[-0.5deg] rounded-xs border border-amber-400/60 z-30" />

              {/* Confetti Animation Trigger */}
              <PlayfulConfetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

              {/* Close Button */}
              <button
                onClick={() => {
                  playPopSound();
                  setIsOpen(false);
                  if (onOpenChange) onOpenChange(false);
                }}
                className="absolute top-4 right-4 tablet:top-5 tablet:right-5 w-9 h-9 tablet:w-10 tablet:h-10 rounded-full bg-white/90 text-[#5C4033] hover:text-stone-800 flex items-center justify-center transition-all cursor-pointer border-2 border-[#5C4033]/20 shadow-xs z-30"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>

              {/* Scrollable Container Body */}
              <div className="w-full flex-1 overflow-y-auto px-5 py-6 tablet:px-6 tablet:py-8 flex flex-col items-center scrollbar-none">
                {/* 1. Large Mascot Header with Floating Decorators */}
                <div className="relative mb-4 tablet:mb-5 pt-2">
                  {/* Floating Bell Icon (Top Left) */}
                  <motion.div
                    animate={{ y: [-4, 4, -4], rotate: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="absolute -top-1 -left-5 w-9 h-9 tablet:w-10 tablet:h-10 bg-white rounded-2xl shadow-sm border-2 border-amber-100 flex items-center justify-center text-base tablet:text-lg"
                  >
                    🔔
                  </motion.div>

                  {/* Floating Clock Icon (Top Right) */}
                  <motion.div
                    animate={{ y: [4, -4, 4], rotate: [4, -4, 4] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute -top-1 -right-5 w-9 h-9 tablet:w-10 tablet:h-10 bg-white rounded-2xl shadow-sm border-2 border-amber-100 flex items-center justify-center text-base tablet:text-lg"
                  >
                    ⏰
                  </motion.div>

                  {/* Floating Food Bowl Icon (Bottom Left) */}
                  <motion.div
                    animate={{ y: [-3, 3, -3], rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-0 -left-6 w-8 h-8 tablet:w-9 tablet:h-9 bg-white rounded-xl shadow-sm border-2 border-amber-100 flex items-center justify-center text-sm tablet:text-base"
                  >
                    🍯
                  </motion.div>

                  {/* Central Mascot (Borderless) */}
                  <div className="w-24 h-24 tablet:w-28 tablet:h-28 flex items-center justify-center">
                    <CharviMascot 
                      variant="compact-header" 
                      theme="cyan-jelly" 
                      className="w-full h-full scale-110 tablet:scale-120 drop-shadow-md"
                      emotion={isAllCompleted ? 'celebrating' : 'happy'}
                    />
                  </div>
                </div>

                {/* 2. Title & Subtitle Section */}
                <div className="text-center mb-5 tablet:mb-6 px-2">
                  <h3 className="text-xl tablet:text-2xl font-black text-amber-950 tracking-tight leading-tight mb-1">
                    Cincau Mengingatkan, Kamu Belajar!
                  </h3>
                  <p className="text-xs tablet:text-sm font-semibold text-stone-600 leading-relaxed max-w-[300px] mx-auto">
                    Cincau menunggumu menyelesaikan misi harian — ayo buat hari ini menjadi luar biasa! ✨
                  </p>
                </div>

                {/* 3. Nested Task Card Container */}
                <div className="w-full bg-white rounded-[28px] tablet:rounded-[32px] p-4 tablet:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-amber-100/60 mb-5 space-y-3 relative">
                  {/* Card Header with Mini Mascot Avatar */}
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 px-1">
                    <div>
                      <h4 className="text-xs tablet:text-sm font-black text-[#2D2D2D]">Mengurus Cincau Hari Ini</h4>
                      <p className="text-[10px] font-bold text-[#A0A0A0]">Progress: {completedCount}/{totalTasks} Tuntas</p>
                    </div>
                    <div className="w-8 h-8 tablet:w-9 tablet:h-9 bg-[#FFF9F0] rounded-full flex items-center justify-center border border-amber-200 overflow-hidden shadow-2xs">
                      <CharviMascot variant="compact-header" theme="cyan-jelly" className="w-full h-full scale-115" />
                    </div>
                  </div>

                  {/* Task Items */}
                  <div className="space-y-2">
                    {[
                      { id: 'feed', icon: '🍯', title: 'Sarapan Segar', desc: 'Beri makan Cincau', task: tasks.feed, action: onOpenFeedMenu },
                      { id: 'quiz', icon: '📚', title: 'Sesi Belajar', desc: 'Jawab tantangan', task: tasks.quiz, action: onOpenQuizMenu },
                      { id: 'pet', icon: '🫂', title: 'Main Bersama', desc: `Belai (${tasks.pet.current}/3)`, task: tasks.pet, action: onPetMascotAction }
                    ].map((item) => (
                      <motion.div 
                        key={item.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (!item.task.completed) {
                            playPopSound();
                            if (item.id !== 'pet') setIsOpen(false);
                            if (item.action) item.action();
                          }
                        }}
                        className={`group p-3 tablet:p-3.5 rounded-[20px] tablet:rounded-[24px] border transition-all flex items-center justify-between cursor-pointer ${
                          item.task.completed 
                          ? 'bg-[#F8FAF8] border-emerald-100/80 opacity-85' 
                          : 'bg-stone-50/60 border-stone-100 hover:border-amber-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 tablet:w-10 tablet:h-10 bg-white rounded-[14px] tablet:rounded-[16px] flex items-center justify-center text-lg tablet:text-xl shadow-2xs border border-amber-100/50">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className={`text-xs tablet:text-sm font-black tracking-tight leading-snug ${item.task.completed ? 'text-[#A0A0A0] line-through decoration-2 decoration-amber-400' : 'text-[#2D2D2D]'}`}>
                              {item.title}
                            </h5>
                            <p className="text-[10px] tablet:text-[11px] font-bold text-[#A0A0A0]">{item.desc}</p>
                          </div>
                        </div>
                        
                        {/* Prominent Orange Checkbox */}
                        <div className={`w-8 h-8 tablet:w-9 tablet:h-9 rounded-full border-[2.5px] flex items-center justify-center transition-all shadow-xs ${
                          item.task.completed 
                          ? 'bg-[#FF8A00] border-[#FF8A00] text-white' 
                          : 'bg-white border-stone-200 group-hover:border-[#FFB800]'
                        }`}>
                          {item.task.completed ? (
                            <Check className="w-4 h-4 stroke-[4]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-stone-200 group-hover:bg-[#FFB800] transition-colors" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 4. Bottom Action / Claim Button */}
                <div className="w-full pt-1">
                  <button
                    onClick={() => {
                      playPopSound();
                      if (isAllCompleted && !claimedBonusToday) {
                        playCheerSound();
                        triggerManualConfetti();
                        onClaimBonus();
                      } else {
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full py-3.5 tablet:py-4 rounded-[24px] tablet:rounded-[28px] font-black text-sm tablet:text-base active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
                      isAllCompleted && !claimedBonusToday
                      ? 'bg-[#FF8A00] text-white shadow-[0_5px_0_0_#CC6E00]'
                      : 'bg-[#FFB800] text-white shadow-[0_5px_0_0_#D97706]'
                    }`}
                  >
                    {isAllCompleted && !claimedBonusToday ? 'KLAIM HADIAH! ✨' : 'LANJUTKAN'}
                  </button>
                  
                  {/* Streak indicator below button */}
                  <div className="flex items-center justify-center gap-1.5 mt-3 text-[#8C7A6B]/80">
                    <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                    <span className="text-[10px] tablet:text-[11px] font-black uppercase tracking-wider">{streak} HARI REKOR STREAK</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
