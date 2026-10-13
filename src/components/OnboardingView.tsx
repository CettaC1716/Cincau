/* =========================================================================
   [LOCKED DESIGN] ONBOARDING VIEW
   INSTRUKSI USER: "Mohon design onboard di kunci agar kamu tidak merubahnya tanpa persetujuan ku"
   DESAIN INI DIKUNCI DAN TIDAK BOLEH DIUBAH TANPA PERSETUJUAN EKSPLISIT USER
   ========================================================================= */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharviMascot } from './CharviMascot';
import { ChildProfileModal } from './ChildProfileModal';
import { Sparkles } from 'lucide-react';
import { FruitBasketIcon } from './FruitBasketIcon';
import { MascotTheme, CharviEmotion, LookTarget, ChildProfile } from '../types';
import { CincauFeedingOverlay } from './CincauFeedingOverlay';
import { playPopSound, playCheerSound } from '../utils/audioEffects';
import { getThemeStyle } from '../utils/themeColors';
import { HabitatWorlds } from './HabitatWorlds';
import { AppleCatchMinigame } from './AppleCatchMinigame';
import { useDraggableCarousel } from '../hooks/useDraggableCarousel';
import { useTamagotchi } from '../hooks/useTamagotchi';
import { PLAY_CARDS, LEARN_CARDS } from '../data/cards';
import { PlayCard } from './cards/PlayCard';
import { LearnCard } from './cards/LearnCard';

interface OnboardingViewProps {
  mascotTheme: MascotTheme;
  onToggleTheme: () => void;
  onStart?: () => void;
  childProfile?: ChildProfile | null;
  onOpenRegistration?: () => void;
  onLogout?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  mascotTheme,
  childProfile,
  onOpenRegistration,
  onLogout,
}) => {
  // Global View Index (0: Onboarding, 1: Rumah Cincau, 2: Luar Ruangan)
  const [viewIndex, setViewIndex] = useState<number>(0);
  const [bounceKey, setBounceKey] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<'learn' | 'play' | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Mascot States
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mouseLookTarget, setMouseLookTarget] = useState<LookTarget>({ x: 0, y: 0.3 });
  const [mascotEmotionOverride, setMascotEmotionOverride] = useState<CharviEmotion | null>(null);
  const [dragLookTarget, setDragLookTarget] = useState<LookTarget | null>(null);
  const [isBubbleMenuOpen, setIsBubbleMenuOpen] = useState(false);
  const [isFeedingOpen, setIsFeedingOpen] = useState(false);
  const [activeMinigame, setActiveMinigame] = useState<'apple-catch' | null>(null);

  // Persistence & State Hook
  const { 
    energy, 
    foodStock, 
    feed, 
    addMisiRewards, 
    getEmotion 
  } = useTamagotchi();

  // Carousel Hooks
  const playCarousel = useDraggableCarousel();
  const learnCarousel = useDraggableCarousel();

  // Refs
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emotionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const mascotContainerRef = useRef<HTMLDivElement | null>(null);
  const viewContainerRef = useRef<HTMLDivElement | null>(null);

  // Landscape / Horizontal Screen Detection (Mobile Phone Landscape vs Portrait)
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (viewContainerRef.current) {
        const rect = viewContainerRef.current.getBoundingClientRect();
        // True if container width is greater than height by at least 5%
        setIsLandscape(rect.width > rect.height * 1.05);
      } else if (typeof window !== 'undefined') {
        setIsLandscape(window.innerWidth > window.innerHeight);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && viewContainerRef.current) {
      ro = new ResizeObserver(checkOrientation);
      ro.observe(viewContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (ro) ro.disconnect();
    };
  }, []);

  // Interaction Handlers
  const registerInteraction = () => {
    setIsInteracting(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    registerInteraction();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMouseLookTarget({ x: x * 0.9, y: y * 0.9 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    registerInteraction();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
    setMouseLookTarget({ x: x * 0.9, y: y * 0.9 });
  };

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFeedingOpen) setIsFeedingOpen(false);
        else if (isBubbleMenuOpen) setIsBubbleMenuOpen(false);
        else if (selectedMode) setSelectedMode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFeedingOpen, isBubbleMenuOpen, selectedMode]);

  const handleOutsideClick = () => {
    if (isFeedingOpen) setIsFeedingOpen(false);
    if (isBubbleMenuOpen) setIsBubbleMenuOpen(false);
    if (selectedMode !== null) setSelectedMode(null);
  };

  const handleSelectMode = (e: React.MouseEvent, mode: 'learn' | 'play') => {
    e.stopPropagation();
    registerInteraction();
    playPopSound();
    if (selectedMode === mode) {
      travelToView(mode === 'learn' ? 1 : 2);
    } else {
      setSelectedMode(mode);
    }
  };

  const travelToView = (targetIndex: number) => {
    playPopSound();
    setIsBubbleMenuOpen(false);
    setIsFeedingOpen(false);
    setViewIndex(targetIndex);
    setBounceKey((k) => k + 1);
    setMascotEmotionOverride('excited');
    setTimeout(() => setMascotEmotionOverride(null), 2600);
  };

  const handleCincauTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    registerInteraction();
    playPopSound();
    setBounceKey((k) => k + 1);
  };

  // UI Compute
  const { lookTarget, mascotEmotion } = useMemo<{
    lookTarget: LookTarget;
    mascotEmotion: CharviEmotion;
  }>(() => {
    const baseEmotion = getEmotion();
    if (dragLookTarget) return { lookTarget: dragLookTarget, mascotEmotion: mascotEmotionOverride || baseEmotion };
    if (mascotEmotionOverride) return { lookTarget: { x: 0, y: -0.75 }, mascotEmotion: mascotEmotionOverride };
    if (isFeedingOpen) return { lookTarget: { x: 0, y: -0.9 }, mascotEmotion: 'happy' };
    if (isBubbleMenuOpen) return { lookTarget: { x: 0, y: -0.95 }, mascotEmotion: 'excited' };
    if (isInteracting || isHovered) return { lookTarget: mouseLookTarget, mascotEmotion: baseEmotion };
    return { lookTarget: { x: 0.28, y: -0.75 }, mascotEmotion: baseEmotion };
  }, [dragLookTarget, mascotEmotionOverride, isFeedingOpen, isBubbleMenuOpen, isHovered, isInteracting, mouseLookTarget, getEmotion]);

  return (
    <div
      ref={viewContainerRef}
      onClick={handleOutsideClick}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={registerInteraction}
      className="relative w-full h-full bg-white text-neutral-900 flex flex-col justify-between overflow-hidden select-none cursor-default"
    >
      <HabitatWorlds viewIndex={viewIndex} />


      {/* Floating Navigation */}
      <div className="px-4 tablet:px-6 pt-2 tablet:pt-3 z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {viewIndex === 0 ? (
            <button
              onClick={() => {
                playPopSound();
                setIsProfileModalOpen(true);
              }}
              className="min-h-[44px] tablet:min-h-[48px] flex items-center gap-2 px-3.5 tablet:px-4 py-2 rounded-2xl bg-white/95 border-2 border-sky-200/90 shadow-xs text-xs tablet:text-sm font-extrabold text-neutral-800 hover:border-sky-400 hover:text-sky-700 active:scale-95 transition-all cursor-pointer"
              title="Profil Si Kecil"
            >
              <span className="text-base tablet:text-lg">🧒</span>
              <span className="max-w-[90px] tablet:max-w-[140px] truncate">{childProfile?.name || 'Petualang Cilik'}</span>
            </button>
          ) : (
            <button
              onClick={() => travelToView(0)}
              className="min-h-[40px] tablet:min-h-[44px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-xs text-xs tablet:text-sm font-black text-amber-900 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
              title="Kembali ke Beranda Cincau"
            >
              <span className="text-sm tablet:text-base">🏡</span>
              <span>Beranda</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 pr-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              playPopSound();
              if (viewIndex !== 0) {
                travelToView(0);
              } else {
                if (isFeedingOpen) {
                  setIsFeedingOpen(false);
                  setIsBubbleMenuOpen(false);
                } else {
                  setIsBubbleMenuOpen((prev) => !prev);
                }
              }
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={{ 
              y: viewIndex === 0 && isBubbleMenuOpen ? -2 : 0,
              scale: isBubbleMenuOpen ? 1.15 : viewIndex === 0 ? 1.05 : 0.95,
            }}
            transition={{ 
              y: { type: 'spring', stiffness: 300, damping: 15 },
              scale: { type: 'spring', stiffness: 300, damping: 15 }
            }}
            className={`min-h-[44px] min-w-[44px] tablet:min-h-[48px] tablet:min-w-[48px] relative p-2.5 tablet:p-3 rounded-2xl border-2 transition-all cursor-pointer shadow-xs flex items-center justify-center ${
              isBubbleMenuOpen
                ? 'bg-amber-400 border-amber-500 text-white shadow-lg ring-4 ring-amber-200'
                : viewIndex === 0
                  ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-md hover:bg-amber-200'
                  : 'bg-white/80 border-neutral-200 text-neutral-400 hover:border-neutral-300'
            }`}
            title="Menu Beri Makan Cincau"
          >
            <FruitBasketIcon className="w-5 h-5 tablet:w-6 tablet:h-6 drop-shadow-xs" />
            {foodStock > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] tablet:text-xs font-black w-4.5 h-4.5 tablet:w-5 tablet:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {foodStock}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Horizontal Sliding UI Track */}
      <div className={`w-full overflow-hidden relative z-20 ${
        viewIndex === 0
          ? 'pt-2 tablet:pt-4 pb-1 tablet:pb-2'
          : 'flex-1 flex flex-col justify-center pt-1 tablet:pt-3 pb-6 mobile-lg:pb-8 tablet:pb-10'
      }`}>
        <motion.div
          animate={{
            x: `${-(viewIndex * 100) / 3}%`,
            y: isFeedingOpen ? -180 : 0,
            opacity: isFeedingOpen ? 0 : 1,
            scale: isFeedingOpen ? 0.9 : 1,
          }}
          transition={{ type: 'spring', damping: 26, stiffness: 120 }}
          style={{ width: '300%' }}
          className="flex pointer-events-auto"
        >
          {/* SLIDE 0: MAIN MENU */}
          <div className={`w-1/3 flex-shrink-0 px-4 tablet:px-6 flex flex-col items-start relative ${
            isLandscape ? 'w-1/3 max-w-none' : 'max-w-sm tablet:max-w-lg mx-auto'
          }`}>
            <div className={`flex flex-col items-start pt-1 tablet:pt-2.5 ${
              isLandscape ? 'w-full max-w-[50%] tablet:max-w-[52%] tablet-lg:max-w-[55%] pl-1 tablet:pl-3' : 'w-full'
            }`}>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                className="inline-block"
              >
                <motion.div
                  onClick={(e) => handleSelectMode(e, 'learn')}
                  whileHover={{ scale: 1.08, rotate: -2 }}
                  whileTap={{ scale: 0.92, rotate: -6 }}
                  animate={{
                    scale: selectedMode === 'learn' ? 1.08 : selectedMode === 'play' ? 0.94 : 1,
                    opacity: selectedMode === 'play' ? 0.7 : 1,
                    rotate: selectedMode === 'learn' ? -1.5 : -3.5,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className={`relative inline-block text-white px-3.5 tablet:px-5 py-1 tablet:py-1.5 rounded-2xl font-extrabold text-xl tablet:text-3xl tracking-tight transition-colors duration-200 cursor-pointer select-none bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 shadow-md hover:shadow-xl ${
                    selectedMode === 'learn' ? 'ring-4 ring-offset-2 ring-amber-400 shadow-xl' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Belajar</span>
                    <motion.span
                      animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                      className="inline-block text-lg tablet:text-2xl"
                    >
                      📚
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut', delay: 0.3 }}
                className="inline-block mt-1.5 tablet:mt-2 ml-3 tablet:ml-8"
              >
                <motion.div
                  onClick={(e) => handleSelectMode(e, 'play')}
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  whileTap={{ scale: 0.92, rotate: 6 }}
                  animate={{
                    scale: selectedMode === 'play' ? 1.08 : selectedMode === 'learn' ? 0.94 : 1,
                    opacity: selectedMode === 'learn' ? 0.7 : 1,
                    rotate: selectedMode === 'play' ? 2.5 : 2.5,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className={`relative inline-block text-white px-3.5 tablet:px-5 py-1 tablet:py-1.5 rounded-2xl font-extrabold text-xl tablet:text-3xl tracking-tight transition-colors duration-200 cursor-pointer select-none bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-md hover:shadow-xl ${
                    selectedMode === 'play' ? 'ring-4 ring-offset-2 ring-emerald-400 shadow-xl' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Bermain</span>
                    <motion.span
                      animate={{ rotate: [0, -15, 10, 0], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.4 }}
                      className="inline-block text-lg tablet:text-2xl"
                    >
                      🎮
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>

              <div className="mt-2 tablet:mt-4 min-h-[48px] tablet:min-h-[72px] flex flex-col justify-center w-full">
                <AnimatePresence mode="wait">
                  {selectedMode === null ? (
                    <motion.div key="default" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="font-handwriting">
                      <span className="text-base tablet:text-xl tablet-lg:text-2xl font-bold text-neutral-600 block leading-tight">apa yang kamu mau lakukan hari ini,</span>
                      <span className="text-xl tablet:text-2xl tablet-lg:text-3xl font-extrabold text-neutral-900 tracking-tight block mt-0.5 truncate max-w-full">{childProfile?.name || 'Petualang Cilik'}? 🌟</span>
                    </motion.div>
                  ) : (
                    <motion.div key="action" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="font-handwriting">
                      <span className="text-xl tablet:text-2xl tablet-lg:text-3xl font-extrabold text-neutral-900 tracking-tight block leading-snug">
                        {selectedMode === 'learn' ? 'ayo kita belajar' : 'kamu yakin ingin bermain?'}
                      </span>
                      <motion.button
                        onClick={() => travelToView(selectedMode === 'learn' ? 1 : 2)}
                        className={`mt-2 px-3 tablet:px-4 py-1.5 tablet:py-2 bg-gradient-to-r ${selectedMode === 'learn' ? 'from-amber-500 to-orange-500 border-amber-300' : 'from-emerald-500 to-teal-500 border-emerald-300'} text-white rounded-2xl font-black text-xs tablet:text-sm shadow-md flex items-center gap-1.5 border-2 cursor-pointer active:scale-95 transition-all`}
                      >
                        <Sparkles className="w-3.5 h-3.5 tablet:w-4 tablet:h-4" />
                        <span>{selectedMode === 'learn' ? 'Masuk ke Dunia Cincau!' : 'Masuk Arena Bermain!'} ▶</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* SLIDE 1: LEARNING HUB */}
          <div className="w-1/3 flex-shrink-0 px-3.5 mobile-lg:px-4 tablet:px-6 flex flex-col justify-center items-start relative pointer-events-auto">
            <div className="w-full mb-2 tablet:mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 mobile-lg:gap-2.5">
                <div className="w-9 h-9 mobile-lg:w-11 mobile-lg:h-11 rounded-2xl bg-amber-100/90 border border-amber-200 shadow-2xs p-1 shrink-0 flex items-center justify-center">
                  <CharviMascot
                    variant="compact-header"
                    emotion="excited"
                    theme={mascotTheme}
                    className="w-full h-full drop-shadow-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] mobile-lg:text-[11px] tablet:text-xs font-black text-amber-900/90 tracking-wider uppercase block">rumah cincau • materi belajar</span>
                  <h2 className="text-sm mobile-lg:text-base tablet:text-xl font-black text-neutral-900 tracking-tight block truncate max-w-[170px] mobile-lg:max-w-none">Mau Belajar Apa, {childProfile?.name || 'Petualang Cilik'}? 📖</h2>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] mobile-lg:text-xs font-extrabold bg-white/95 text-amber-900 px-2.5 mobile-lg:px-3 py-1 rounded-full border border-amber-200 shadow-2xs shrink-0 ml-1.5">
                <span>Geser</span><span className="animate-pulse">➔</span>
              </span>
            </div>

            <div className="w-full relative z-20 my-auto">
              <div
                ref={learnCarousel.carouselRef}
                onMouseDown={learnCarousel.handleMouseDown}
                onMouseMove={learnCarousel.handleMouseMove}
                onMouseUp={learnCarousel.handleMouseUp}
                onMouseLeave={learnCarousel.handleMouseUp}
                className="w-full flex gap-3.5 mobile-lg:gap-4 tablet:gap-5 overflow-x-auto pb-5 pt-1.5 px-1 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none no-scrollbar"
              >
                {LEARN_CARDS.map((card) => (
                  <LearnCard 
                    key={card.id} 
                    card={card} 
                    onClick={() => {
                      playPopSound();
                      setMascotEmotionOverride('excited');
                      setTimeout(() => setMascotEmotionOverride(null), 2600);
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* SLIDE 2: PLAY ARENA */}
          <div className="w-1/3 flex-shrink-0 px-3.5 mobile-lg:px-4 tablet:px-6 flex flex-col justify-center items-start relative pointer-events-auto">
            <div className="w-full mb-2 tablet:mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 mobile-lg:gap-2.5">
                <div className="w-9 h-9 mobile-lg:w-11 mobile-lg:h-11 rounded-2xl bg-emerald-100/90 border border-emerald-200 shadow-2xs p-1 shrink-0 flex items-center justify-center">
                  <CharviMascot
                    variant="compact-header"
                    emotion="excited"
                    theme={mascotTheme}
                    className="w-full h-full drop-shadow-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] mobile-lg:text-[11px] tablet:text-xs font-black text-emerald-900/90 tracking-wider uppercase block">petualangan luar ruangan</span>
                  <h2 className="text-sm mobile-lg:text-base tablet:text-xl font-black text-emerald-950 tracking-tight block truncate max-w-[170px] mobile-lg:max-w-none">Arena Bermain! 🌳</h2>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] mobile-lg:text-xs font-extrabold bg-white/95 text-emerald-900 px-2.5 mobile-lg:px-3 py-1 rounded-full border border-emerald-200 shadow-2xs shrink-0 ml-1.5">
                <span>Geser</span><span className="animate-pulse">➔</span>
              </span>
            </div>

            <div className="w-full relative z-20 my-auto">
              <div
                ref={playCarousel.carouselRef}
                onMouseDown={playCarousel.handleMouseDown}
                onMouseMove={playCarousel.handleMouseMove}
                onMouseUp={playCarousel.handleMouseUp}
                onMouseLeave={playCarousel.handleMouseUp}
                className="w-full flex gap-3.5 mobile-lg:gap-4 tablet:gap-5 overflow-x-auto pb-5 pt-1.5 px-1 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none no-scrollbar"
              >
                {PLAY_CARDS.map((card) => (
                  <PlayCard 
                    key={card.id} 
                    card={card} 
                    onClick={() => {
                      playPopSound();
                      if (card.id === 'fruit-catch') {
                        setActiveMinigame('apple-catch');
                        return;
                      }
                      setMascotEmotionOverride('excited');
                      setTimeout(() => setMascotEmotionOverride(null), 2600);
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mascot Feeding Overlay (Hanya di Home Screen: viewIndex === 0) */}
      <CincauFeedingOverlay
        isMenuOpen={isBubbleMenuOpen && viewIndex === 0}
        isFeedingOpen={isFeedingOpen && viewIndex === 0}
        onOpenMenu={() => {
          if (viewIndex === 0) setIsBubbleMenuOpen(true);
        }}
        onCloseMenu={() => setIsBubbleMenuOpen(false)}
        onOpenFeeding={() => {
          if (viewIndex === 0) {
            setIsBubbleMenuOpen(false);
            setIsFeedingOpen(true);
          }
        }}
        onCloseFeeding={() => setIsFeedingOpen(false)}
        onFeedSuccess={() => {
          if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
          feed();
        }}
        onPetMascot={() => {
          if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
        }}
        onHpChange={() => {}} // Hook handles internal HP/Energy
        hp={energy}
        setHp={() => {}}
        onMascotEmotionChange={(emo) => {
          if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
          setMascotEmotionOverride(emo === 'idle' ? null : emo);
        }}
        onLookTargetChange={(target) => setDragLookTarget(target)}
        mascotContainerRef={mascotContainerRef}
        isLandscapeHomescreen={isLandscape && viewIndex === 0}
      />

      {/* Persistent Mascot (Hanya di Beranda: viewIndex === 0) */}
      {viewIndex === 0 && (
        <motion.div
          ref={mascotContainerRef}
          onClick={handleCincauTap}
          className={`pointer-events-auto cursor-pointer z-10 min-h-0 ${
            isLandscape
              ? 'absolute right-2 tablet:right-6 bottom-2 tablet:bottom-4 w-[48%] tablet:w-[46%] tablet-lg:w-[44%] max-w-[380px] tablet-lg:max-w-[440px] flex flex-col justify-end items-end translate-y-0'
              : 'relative w-full flex-1 flex flex-col justify-end items-center pb-4 mobile-lg:pb-6 tablet:pb-8 translate-y-[-2%] mobile-lg:translate-y-[-1%] tablet:translate-y-0'
          }`}
        >
          <motion.div
            key={`mascot-bounce-${bounceKey}`}
            animate={{ y: [0, -32, 0] }}
            transition={{ duration: 0.48, ease: [0.175, 0.885, 0.32, 1.275] }}
            className={`w-full mb-0 overflow-visible ${
              isLandscape ? 'flex justify-end' : 'flex justify-center'
            }`}
          >
            <CharviMascot
              variant="large-bottom"
              theme={mascotTheme}
              emotion={mascotEmotion}
              isInteracting={isInteracting || isHovered || selectedMode !== null || isFeedingOpen || isBubbleMenuOpen}
              lookTarget={
                isLandscape && !mouseLookTarget
                  ? { x: -0.6, y: -0.2 } // Di homescreen landscape, Cincau ramah menatap ke arah menu belajar & bermain di sebelah kiri
                  : lookTarget
              }
              className={`w-full h-auto drop-shadow-2xl ${
                isLandscape
                  ? 'max-w-[260px] tablet:max-w-[360px] tablet-lg:max-w-[420px] max-h-[66vh] tablet:max-h-[76vh] ml-auto mr-0'
                  : 'max-w-[310px] mobile-lg:max-w-[360px] tablet:max-w-[460px] max-h-[46vh] tablet:max-h-[54vh] mx-auto'
              }`}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Minigame Overlay */}
      <AnimatePresence>
        {activeMinigame === 'apple-catch' && (
          <AppleCatchMinigame
            mascotTheme={mascotTheme}
            onClose={(earnedFood, earnedStars) => {
              setActiveMinigame(null);
              addMisiRewards(earnedFood, earnedStars);
              if (earnedFood > 0 || earnedStars > 0) {
                playCheerSound();
                setMascotEmotionOverride('excited');
                setTimeout(() => setMascotEmotionOverride(null), 3000);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Simple Child Profile Modal */}
      <ChildProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        childProfile={childProfile || null}
        onLogout={() => {
          if (onLogout) onLogout();
        }}
        onEditProfile={() => {
          if (onOpenRegistration) onOpenRegistration();
        }}
        mascotTheme={mascotTheme}
      />
    </div>
  );
};
