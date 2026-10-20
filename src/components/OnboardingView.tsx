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
import { HabitatWorlds } from './HabitatWorlds';
import { useDraggableCarousel } from '../hooks/useDraggableCarousel';
import { useTamagotchi } from '../hooks/useTamagotchi';
import { useDailyChecklist } from '../hooks/useDailyChecklist';
import { DailyChecklistWidget } from './DailyChecklistWidget';
import { LearningMissionModal } from './LearningMissionModal';
import { PLAY_CARDS, LEARN_CARDS } from '../data/cards';
import { PlayCard } from './cards/PlayCard';
import { LearnCard } from './cards/LearnCard';
import { ToycadLearningRoom } from './ToycadLearningRoom';
import { ToycadPlayRoom } from './ToycadPlayRoom';
import { BentoActionCards } from './BentoActionCards';
import { DrawingStudioModal } from './DrawingStudioModal';
import { CincauSalonOverlay } from './CincauSalonOverlay';
import { ScienceFactBubble } from './ScienceFactBubble';
import { CincauNavBar } from './CincauNavBar';

interface ScienceFact {
  title: string;
  fact: string;
  explanation: string;
}

const SCIENCE_FACTS: ScienceFact[] = [
  {
    title: "Cahaya Matahari",
    fact: "Tahukah kamu? Cahaya matahari membutuhkan waktu sekitar 8 menit untuk sampai ke Bumi! ☀️",
    explanation: "Ya benar sekali, petualang cilik! Meskipun cahaya bergerak sangat super cepat yaitu sekitar 300.000 kilometer per detik, jarak antara Matahari dan planet Bumi kita sangatlah luar biasa jauh, mencapai sekitar 150 juta kilometer! Jadi kalau matahari tiba-tiba padam, kita baru akan mengetahuinya 8 menit kemudian!"
  },
  {
    title: "Listrik di Otak",
    fact: "Tahukah kamu? Otak manusia menghasilkan listrik yang cukup untuk menyalakan sebuah lampu kecil! ⚡",
    explanation: "Ya benar! Di dalam kepala kita terdapat miliaran sel saraf yang disebut neuron. Ketika kamu sedang berpikir, belajar hal baru, atau bermain game, sel-sel saraf ini saling mengirimkan pesan menggunakan sinyal listrik mini. Hebatnya lagi, jika seluruh listrik dari semua sel saraf dikumpulkan, dayanya cukup untuk menyalakan bola lampu kecil!"
  },
  {
    title: "Lautan di Bumi",
    fact: "Tahukah kamu? Air menutupi sekitar 70% permukaan planet Bumi kita lho! 🌊",
    explanation: "Ya benar! Itulah sebabnya mengapa jika astronot melihat planet Bumi dari angkasa luar, bumi tampak seperti kelereng biru yang sangat indah dan berkilau. Sebagian besar air di bumi berada di samudra yang luas, dan masih banyak misteri serta hewan laut unik yang belum kita temukan di dasar laut dalam!"
  },
  {
    title: "Pohon Bernapas",
    fact: "Tahukah kamu? Pohon bernapas dengan menyerap karbon dioksida dan memproduksi oksigen segar! 🌳",
    explanation: "Ya benar! Daun pada pohon bertindak seperti pabrik ajaib pencuci udara. Mereka menghirup udara kotor (karbon dioksida) yang kita keluarkan, lalu menggunakan bantuan cahaya matahari untuk mengubahnya menjadi makanan serta oksigen segar yang kita hirup setiap hari. Makanya menanam pohon sangat penting untuk bumi!"
  },
  {
    title: "Loncatan Kucing",
    fact: "Tahukah kamu? Kucing dapat melompat hingga 6 kali lipat tinggi tubuh mereka sendiri! 🐱",
    explanation: "Ya benar! Kucing adalah atlet lompat yang luar biasa tangguh di dunia hewan. Otot kaki belakang mereka sangat kuat, lentur, dan bekerja seperti pegas mekanik super. Selain itu, kucing selalu mendarat dengan anggun menggunakan cakar empuk mereka untuk meredam benturan!"
  },
  {
    title: "Tarian Lebah",
    fact: "Tahukah kamu? Lebah menari untuk memberitahu teman-temannya di mana letak bunga yang manis! 🐝",
    explanation: "Ya benar! Lebah madu memiliki bahasa tubuh yang unik bernama 'tarian goyang' (waggle dance). Saat seekor lebah menemukan kebun bunga penuh nektar, ia kembali ke sarang lalu menari membentuk pola angka delapan sambil menggoyangkan perutnya untuk memberi tahu teman-teman satu sarang arah dan jarak bunga tersebut!"
  },
  {
    title: "Jantung Paus Biru",
    fact: "Tahukah kamu? Jantung paus biru sangat besar sampai-sampai manusia bisa berenang di dalam pembuluh utamanya! 🐋",
    explanation: "Ya benar! Paus biru adalah hewan terbesar yang pernah hidup di bumi sepanjang sejarah. Ukuran tubuhnya bisa sepanjang bus kota besar, dan jantungnya saja seukuran mobil kecil! Pembuluh darah utamanya bahkan begitu besar sampai anak manusia bisa merangkak atau berenang di dalamnya!"
  }
];

interface OnboardingViewProps {
  mascotTheme: MascotTheme;
  onToggleTheme: () => void;
  childProfile?: ChildProfile | null;
  onOpenRegistration?: () => void;
  onLogout?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  mascotTheme,
  onToggleTheme,
  childProfile,
  onOpenRegistration,
  onLogout,
}) => {
  // Global View Index (0: Onboarding, 1: Rumah Cincau, 2: Luar Ruangan)
  const [viewIndex, setViewIndex] = useState<number>(0);
  const [bounceKey, setBounceKey] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<'learn' | 'play' | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isToycadLearningRoomOpen, setIsToycadLearningRoomOpen] = useState(false);
  const [isToycadPlayRoomOpen, setIsToycadPlayRoomOpen] = useState(false);
  const [isDrawingStudioOpen, setIsDrawingStudioOpen] = useState(false);
  const [isSalonModalOpen, setIsSalonModalOpen] = useState(false);
  const [isDailyChecklistOpen, setIsDailyChecklistOpen] = useState(false);
  
  // Mascot States
  const [isInteracting, setIsInteracting] = useState(false);
  const [mouseLookTarget, setMouseLookTarget] = useState<LookTarget>({ x: 0, y: 0.3 });
  const [mascotEmotionOverride, setMascotEmotionOverride] = useState<CharviEmotion | null>(null);
  const [dragLookTarget, setDragLookTarget] = useState<LookTarget | null>(null);
  const [isBubbleMenuOpen, setIsBubbleMenuOpen] = useState(false);
  const [isFeedingOpen, setIsFeedingOpen] = useState(false);
  const [scienceFactIndex, setScienceFactIndex] = useState(0);
  const [isExplaining, setIsExplaining] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const fullText = useMemo(() => {
    const current = SCIENCE_FACTS[scienceFactIndex];
    return !isExplaining ? `${current.fact} Mau tau lebih lanjut?` : current.explanation;
  }, [scienceFactIndex, isExplaining]);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const speed = 16;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [fullText]);

  const [showScienceBubble, setShowScienceBubble] = useState(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isInteractingModalsOpen = isFeedingOpen || isSalonModalOpen || isDailyChecklistOpen || isProfileModalOpen;

  // Auto close logic
  useEffect(() => {
    if (showScienceBubble && !isExplaining && !isInteractingModalsOpen) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        setShowScienceBubble(false);
        setMascotEmotionOverride(null);
      }, 15000);
    } else if (isExplaining && !isInteractingModalsOpen) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        setIsExplaining(false);
        setShowScienceBubble(false);
        setMascotEmotionOverride(null);
      }, 20000);
    } else if (isInteractingModalsOpen) {
      // Hide science bubble immediately if any interaction modal opens
      setShowScienceBubble(false);
      setIsExplaining(false);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [showScienceBubble, scienceFactIndex, isExplaining, isInteractingModalsOpen]);

  // Random interval pop-up when hidden
  useEffect(() => {
    let randomTimer: NodeJS.Timeout | null = null;
    if (!showScienceBubble && !isInteractingModalsOpen) {
      const randomDelay = Math.floor(Math.random() * 15000) + 25000; // 25 to 40 seconds
      randomTimer = setTimeout(() => {
        setScienceFactIndex(Math.floor(Math.random() * SCIENCE_FACTS.length));
        setShowScienceBubble(true);
        setIsExplaining(false);
        setMascotEmotionOverride('thinking');
        setTimeout(() => setMascotEmotionOverride('proud'), 1500);
        setTimeout(() => setMascotEmotionOverride(null), 4000);
      }, randomDelay);
    }
    return () => {
      if (randomTimer) clearTimeout(randomTimer);
    };
  }, [showScienceBubble, isInteractingModalsOpen]);

  // Persistence & State Hook
  const { 
    energy, 
    foodStock, 
    feed, 
    addMisiRewards, 
    getEmotion 
  } = useTamagotchi();

  // Birthday Detection & Celebration Trigger
  const isBirthdayToday = useMemo(() => {
    if (!childProfile?.birthDate) return false;
    const today = new Date();
    return (
      today.getDate() === childProfile.birthDate.day &&
      today.getMonth() + 1 === childProfile.birthDate.month
    );
  }, [childProfile]);

  useEffect(() => {
    if (isBirthdayToday) {
      try {
        playCheerSound();
      } catch {
        // ignore
      }
      setMascotEmotionOverride('celebrating');
    }
  }, [isBirthdayToday]);

  // Pawchi Daily Checklist & Habit Streak Hook
  const {
    completedCount: dailyCompletedCount,
    totalTasks: dailyTotalTasks,
    isAllCompleted: isDailyAllCompleted,
    streak: dailyStreak,
    tasks: dailyTasks,
    claimedBonusToday: dailyClaimedBonusToday,
    trackFeed: trackDailyFeed,
    trackQuiz: trackDailyQuiz,
    trackPet: trackDailyPet,
    claimBonus: claimDailyBonus,
  } = useDailyChecklist();

  // Carousel Hooks
  const playCarousel = useDraggableCarousel();
  const learnCarousel = useDraggableCarousel();

  // Refs
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emotionTimerRef = useRef<NodeJS.Timeout | null>(null);
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
    const rawX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const rawY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const clampedX = Math.max(-0.55, Math.min(0.55, rawX * 0.6));
    const clampedY = Math.max(-0.55, Math.min(0.55, rawY * 0.6));
    setMouseLookTarget({ x: clampedX, y: clampedY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    registerInteraction();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const rawY = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
    const clampedX = Math.max(-0.55, Math.min(0.55, rawX * 0.6));
    const clampedY = Math.max(-0.55, Math.min(0.55, rawY * 0.6));
    setMouseLookTarget({ x: clampedX, y: clampedY });
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
    trackDailyPet();
  };

  // UI Compute
  const { lookTarget, mascotEmotion } = useMemo<{
    lookTarget: LookTarget;
    mascotEmotion: CharviEmotion;
  }>(() => {
    const baseEmotion = getEmotion();
    if (isFeedingOpen) return { lookTarget: { x: 0, y: -0.9 }, mascotEmotion: 'happy' };
    if (isBubbleMenuOpen) return { lookTarget: { x: 0, y: -0.95 }, mascotEmotion: 'excited' };
    if (isInteracting) return { lookTarget: mouseLookTarget, mascotEmotion: baseEmotion };
    return { lookTarget: { x: 0.28, y: -0.75 }, mascotEmotion: baseEmotion };
  }, [dragLookTarget, mascotEmotionOverride, isFeedingOpen, isBubbleMenuOpen, isInteracting, mouseLookTarget, getEmotion]);

  return (
    <div
      ref={viewContainerRef}
      onClick={handleOutsideClick}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={registerInteraction}
      className="relative w-full h-full bg-white text-neutral-900 flex flex-col justify-start overflow-hidden select-none cursor-default"
    >
      <HabitatWorlds />

      {/* Birthday Celebration Banner */}
      {isBirthdayToday && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs tablet:text-sm py-2 px-4 shadow-md flex items-center justify-center gap-2 border-b-2 border-amber-300 z-30 tracking-wide"
        >
          <span>🥳 SELAMAT ULANG TAHUN, {childProfile?.name?.toUpperCase() || 'SI KECIL'}! 🎉🎂</span>
        </motion.div>
      )}


      {/* Floating Navigation (Hidden on Homescreen viewIndex === 0 as requested) */}
      {viewIndex !== 0 && (
        <div className="px-4 tablet:px-6 pt-1.5 tablet:pt-2 pb-0 z-20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => travelToView(0)}
              className="min-h-[40px] tablet:min-h-[44px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-xs text-xs tablet:text-sm font-black text-amber-900 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
              title="Kembali ke Beranda Cincau"
            >
              <span className="text-sm tablet:text-base">🏡</span>
              <span>Beranda</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pr-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                playPopSound();
                travelToView(0);
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="min-h-[44px] min-w-[44px] tablet:min-h-[48px] tablet:min-w-[48px] relative p-2.5 tablet:p-3 rounded-2xl border-2 bg-white/80 border-neutral-200 text-neutral-400 hover:border-neutral-300 transition-all cursor-pointer shadow-xs flex items-center justify-center"
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
      )}

      {/* Horizontal Sliding UI Track */}
      <div className={`w-full overflow-hidden relative z-20 ${
        viewIndex === 0
          ? 'h-full flex-1 flex flex-col justify-center pt-0.5 tablet:pt-1 pb-1 tablet:pb-2'
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
          className="flex pointer-events-auto h-full"
        >
          {/* SLIDE 0: MAIN MENU */}
          <div className="w-1/3 min-w-[33.333333%] max-w-[33.333333%] h-full flex-shrink-0 px-3 sm:px-4 tablet:px-6 flex flex-col items-center justify-center relative pt-2 sm:pt-3 tablet:pt-2 box-border">
            <div className={`flex flex-col items-center justify-center my-auto w-full mx-auto ${
              isLandscape 
                ? 'max-w-full tablet:max-w-[96%] pl-0' 
                : 'max-w-md tablet:max-w-2xl tablet-md:max-w-4xl desktop:max-w-5xl'
            }`}>
              {/* Bento Action Cards: Belajar, Main Game, & Menggambar (Kurikulum Merdeka 3D Style) */}
              <motion.div
                animate={{
                  y: isFeedingOpen || isSalonModalOpen ? -140 : 0,
                  opacity: isFeedingOpen || isSalonModalOpen ? 0 : 1,
                  scale: isFeedingOpen || isSalonModalOpen ? 0.95 : 1,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full mb-2 sm:mb-3 tablet:mb-4 overflow-visible pointer-events-auto"
              >
                <BentoActionCards
                  selectedMode={selectedMode}
                  onSelectMode={(mode) => {
                    registerInteraction();
                    setSelectedMode(mode);
                    if (mode === 'learn') {
                      setIsToycadLearningRoomOpen(true);
                    } else if (mode === 'play') {
                      setIsToycadPlayRoomOpen(true);
                    }
                  }}
                  onOpenLearningRoom={() => {
                    registerInteraction();
                    setIsToycadLearningRoomOpen(true);
                  }}
                  onOpenPlayRoom={() => {
                    registerInteraction();
                    setIsToycadPlayRoomOpen(true);
                  }}
                  onOpenDrawingStudio={() => {
                    registerInteraction();
                    setIsDrawingStudioOpen(true);
                  }}
                  isCompact={isLandscape}
                />
              </motion.div>

              {/* Removed DailyChecklistWidget from here as it will be moved to a fixed position at bottom right */}

              <motion.div
                animate={{
                  y: isFeedingOpen || isSalonModalOpen ? -140 : 0,
                  opacity: isFeedingOpen || isSalonModalOpen ? 0 : 1,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="mt-1 tablet:mt-2 w-full"
              >
                <AnimatePresence mode="wait">
                  {selectedMode !== null && (
                    <motion.div key="action" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="font-handwriting mb-2">
                      <span className="text-xl tablet:text-2xl tablet-lg:text-3xl font-extrabold text-neutral-900 tracking-tight block leading-snug">
                        {selectedMode === 'learn' ? 'ayo kita belajar' : 'kamu yakin ingin bermain?'}
                      </span>
                      <motion.button
                        onClick={() => {
                          if (selectedMode === 'learn') {
                            setIsToycadLearningRoomOpen(true);
                          } else {
                            setIsToycadPlayRoomOpen(true);
                          }
                        }}
                        className={`mt-2 px-3 tablet:px-4 py-1.5 tablet:py-2 bg-gradient-to-r ${selectedMode === 'learn' ? 'from-amber-500 to-orange-500 border-amber-300' : 'from-emerald-500 to-teal-500 border-emerald-300'} text-white rounded-2xl font-black text-xs tablet:text-sm shadow-md flex items-center gap-1.5 border-2 cursor-pointer active:scale-95 transition-all`}
                      >
                        <Sparkles className="w-3.5 h-3.5 tablet:w-4 tablet:h-4" />
                        <span>{selectedMode === 'learn' ? 'Masuk ke Ruang Belajar 3D!' : 'Buka Peta Petualangan Bermain! 🗺️'} ▶</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* TABLET VIEW (>= tablet): 12-col layout aligned with Bento Grid */}
                <div className="hidden tablet:grid tablet-md:grid tablet:grid-cols-12 tablet-md:grid-cols-12 tablet:gap-4 tablet-md:gap-5 w-full items-end mt-1">
                  {/* LEFT SIDE (tablet:col-span-7) under Membaca */}
                  <div className="tablet:col-span-7 tablet-md:col-span-7 flex flex-col items-start gap-2 w-full">
                    {/* Small Cincau (Anak Cincau) with Misi Harian Bubble shifted to the left */}
                    <div className="w-full flex items-center justify-start">
                      <DailyChecklistWidget
                        isInline={true}
                        completedCount={dailyCompletedCount}
                        totalTasks={dailyTotalTasks}
                        isAllCompleted={isDailyAllCompleted}
                        streak={dailyStreak}
                        tasks={dailyTasks}
                        claimedBonusToday={dailyClaimedBonusToday}
                        onClaimBonus={() => {
                          claimDailyBonus();
                          addMisiRewards(1, 10);
                        }}
                        onOpenFeedMenu={() => {
                          if (viewIndex !== 0) travelToView(0);
                          setIsBubbleMenuOpen(true);
                        }}
                        onOpenQuizMenu={() => {
                          setSelectedCategory(undefined);
                          setIsQuizModalOpen(true);
                        }}
                        onPetMascotAction={() => {
                          trackDailyPet();
                          setBounceKey((k) => k + 1);
                          setMascotEmotionOverride('excited');
                          setTimeout(() => setMascotEmotionOverride(null), 2000);
                        }}
                        onOpenChange={(open) => setIsDailyChecklistOpen(open)}
                      />
                    </div>

                    {/* Compact Fakta Seru Ayah Cincau Bubble filling the left area */}
                    <ScienceFactBubble
                      isVisible={viewIndex === 0 && showScienceBubble}
                      scienceFactIndex={scienceFactIndex}
                      isExplaining={isExplaining}
                      displayedText={displayedText}
                      isTyping={isTyping}
                      isInteractingModalsOpen={isInteractingModalsOpen}
                      totalFacts={SCIENCE_FACTS.length}
                      onExplainingChange={setIsExplaining}
                      onFactIndexChange={setScienceFactIndex}
                    />
                  </div>

                  {/* RIGHT SIDE (tablet:col-span-5) under Menggambar, flush right */}
                  <div className="tablet:col-span-5 tablet-md:col-span-5 flex flex-row items-end justify-end gap-3 w-full pr-0.5">
                    {/* Large Cincau Mascot (Ayah Cincau) placed beside Navigation Bar */}
                    <motion.div
                      ref={mascotContainerRef}
                      onClick={handleCincauTap}
                      className="pointer-events-auto cursor-pointer flex flex-col justify-end items-center"
                    >
                      <motion.div
                        key={`mascot-bounce-${bounceKey}`}
                        animate={{ y: [0, -26, 0] }}
                        transition={{ duration: 0.48, ease: [0.175, 0.885, 0.32, 1.275] }}
                        className="w-full flex justify-center"
                      >
                        <CharviMascot
                          variant="large-bottom"
                          theme={mascotTheme}
                          emotion={mascotEmotion}
                          onEmotionChange={(emo) => {
                            setMascotEmotionOverride(emo === 'idle' ? null : emo);
                          }}
                          isInteracting={isInteracting || selectedMode !== null || isFeedingOpen || isBubbleMenuOpen}
                          lookTarget={lookTarget}
                          className="w-full h-auto max-w-[145px] tablet:max-w-[170px] tablet-md:max-w-[185px] max-h-[28vh] tablet:max-h-[32vh] drop-shadow-2xl"
                        />
                      </motion.div>
                    </motion.div>

                    {/* Navigation Bar flush to the right edge */}
                    <div className="flex flex-col items-end shrink-0">
                      <CincauNavBar
                        hp={energy}
                        totalFoodCount={foodStock}
                        childProfile={childProfile}
                        onOpenProfile={() => setIsProfileModalOpen(true)}
                        onOpenSalon={() => setIsSalonModalOpen(true)}
                        onOpenFeeding={() => {
                          setIsBubbleMenuOpen(false);
                          setIsFeedingOpen(true);
                        }}
                        onPetAction={() => {
                          if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
                          trackDailyPet();
                          feed();
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* MOBILE VIEW (< tablet) */}
                <div className="tablet:hidden tablet-md:hidden flex flex-col items-center w-full gap-2 mt-1">
                  <DailyChecklistWidget
                    isInline={true}
                    completedCount={dailyCompletedCount}
                    totalTasks={dailyTotalTasks}
                    isAllCompleted={isDailyAllCompleted}
                    streak={dailyStreak}
                    tasks={dailyTasks}
                    claimedBonusToday={dailyClaimedBonusToday}
                    onClaimBonus={() => {
                      claimDailyBonus();
                      addMisiRewards(1, 10);
                    }}
                    onOpenFeedMenu={() => {
                      if (viewIndex !== 0) travelToView(0);
                      setIsBubbleMenuOpen(true);
                    }}
                    onOpenQuizMenu={() => {
                      setSelectedCategory(undefined);
                      setIsQuizModalOpen(true);
                    }}
                    onPetMascotAction={() => {
                      trackDailyPet();
                      setBounceKey((k) => k + 1);
                      setMascotEmotionOverride('excited');
                      setTimeout(() => setMascotEmotionOverride(null), 2000);
                    }}
                    onOpenChange={(open) => setIsDailyChecklistOpen(open)}
                  />

                  <ScienceFactBubble
                    isVisible={viewIndex === 0 && showScienceBubble}
                    scienceFactIndex={scienceFactIndex}
                    isExplaining={isExplaining}
                    displayedText={displayedText}
                    isTyping={isTyping}
                    isInteractingModalsOpen={isInteractingModalsOpen}
                    totalFacts={SCIENCE_FACTS.length}
                    onExplainingChange={setIsExplaining}
                    onFactIndexChange={setScienceFactIndex}
                  />
                </div>
              </motion.div>
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

            {/* Toycad / MerdekaKids 3D Learning Room Banner */}
            <div className="w-full mb-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playPopSound();
                  setIsToycadLearningRoomOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs tablet:text-sm shadow-md flex items-center justify-between border-2 border-amber-300 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🚀</span>
                  <div className="text-left">
                    <span>Ruang Belajar 3D Tactile Play (MerdekaKids) ✨</span>
                    <p className="text-[10px] text-amber-100 font-medium">Modul 3D interaktif, Pena Pintar stylus & katalog kurikulum lengkap!</p>
                  </div>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-xl text-xs">Buka Ruang ➔</span>
              </motion.button>
            </div>

            <div className="w-full mb-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playPopSound();
                  setIsToycadLearningRoomOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-black text-xs tablet:text-sm shadow-md flex items-center justify-between border-2 border-emerald-400 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌿</span>
                  <div className="text-left">
                    <span>Eksplorasi Dunia Pelajaran (World Wonders Style) ✨</span>
                    <p className="text-[10px] text-emerald-200 font-medium">Klik untuk menjelajah mata pelajaran dengan karakter 3D & video!</p>
                  </div>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-xl text-xs">Buka ➔</span>
              </motion.button>
            </div>

            <div className="w-full relative z-20 my-auto">
              <div
                ref={learnCarousel.carouselRef}
                onMouseDown={learnCarousel.handleMouseDown}
                onMouseMove={learnCarousel.handleMouseMove}
                onMouseUp={learnCarousel.handleMouseUp}
                onMouseLeave={learnCarousel.handleMouseUp}
                className="w-full flex gap-3.5 mobile-lg:gap-4 tablet:gap-5 overflow-x-auto pb-5 pt-3 px-2 -mt-1.5 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none no-scrollbar"
              >
                {LEARN_CARDS.map((card) => (
                  <LearnCard 
                    key={card.id} 
                    card={card} 
                    onClick={() => {
                      playPopSound();
                      setSelectedCategory(card.id);
                      setIsQuizModalOpen(true);
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

            {/* Toycad / MerdekaKids 3D Play Room Banner */}
            <div className="w-full mb-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playPopSound();
                  setIsToycadPlayRoomOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white font-black text-xs tablet:text-sm shadow-md flex items-center justify-between border-2 border-emerald-300 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🗺️</span>
                  <div className="text-left">
                    <span>Peta Petualangan Ruang Bermain (Interactive Map) ✨</span>
                    <p className="text-[10px] text-emerald-100 font-medium">Jelajahi kepulauan nusantara, temukan pos bermain & taklukkan level!</p>
                  </div>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-xl text-xs">Buka Peta ➔</span>
              </motion.button>
            </div>

            <div className="w-full relative z-20 my-auto">
              <div
                ref={playCarousel.carouselRef}
                onMouseDown={playCarousel.handleMouseDown}
                onMouseMove={playCarousel.handleMouseMove}
                onMouseUp={playCarousel.handleMouseUp}
                onMouseLeave={playCarousel.handleMouseUp}
                className="w-full flex gap-3.5 mobile-lg:gap-4 tablet:gap-5 overflow-x-auto pb-5 pt-3 px-2 -mt-1.5 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none no-scrollbar"
              >
                {PLAY_CARDS.map((card) => (
                  <PlayCard 
                    key={card.id} 
                    card={card} 
                    onClick={() => {
                      playPopSound();
                      if (card.id === 'coloring-book') {
                        setIsDrawingStudioOpen(true);
                      } else {
                        setIsToycadPlayRoomOpen(true);
                      }
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mascot Feeding Overlay (Hanya di Home Screen: viewIndex === 0) */}
      {viewIndex === 0 && (
        <CincauFeedingOverlay
          isFeedingOpen={isFeedingOpen}
          onOpenFeeding={() => {
            setIsBubbleMenuOpen(false);
            setIsFeedingOpen(true);
          }}
          onCloseFeeding={() => setIsFeedingOpen(false)}
          onFeedSuccess={() => {
            if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
            feed();
            trackDailyFeed();
          }}
          onPetMascot={() => {
            if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
            trackDailyPet();
          }}
          hp={energy}
          setHp={() => {}}
          onMascotEmotionChange={(emo) => {
            if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
            setMascotEmotionOverride(emo === 'idle' ? null : emo);
          }}
          onLookTargetChange={(target) => setDragLookTarget(target)}
          mascotContainerRef={mascotContainerRef}
          isLandscapeHomescreen={isLandscape}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSalon={() => setIsSalonModalOpen(true)}
          inventory={{ honey: foodStock, apple: foodStock, watermelon: foodStock }}
          childProfile={childProfile}
        />
      )}

      {/* Persistent Mascot (Hanya di Beranda: viewIndex === 0) */}
      {viewIndex === 0 && (
        <motion.div
          ref={mascotContainerRef}
          onClick={handleCincauTap}
          className={`tablet:hidden tablet-md:hidden pointer-events-auto cursor-pointer z-10 min-h-0 ${
            isLandscape
              ? 'absolute left-2 tablet:left-6 bottom-2 tablet:bottom-4 w-[34%] tablet:w-[28%] tablet-lg:w-[26%] max-w-[200px] tablet-lg:max-w-[260px] flex flex-col justify-end items-start translate-y-0'
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
              onEmotionChange={(emo) => {
                setMascotEmotionOverride(emo === 'idle' ? null : emo);
              }}
              isInteracting={isInteracting || selectedMode !== null || isFeedingOpen || isBubbleMenuOpen}
              lookTarget={
                isLandscape && !mouseLookTarget
                  ? { x: 0.6, y: -0.2 } // Di homescreen landscape, Cincau ramah menatap ke arah kanan (ke arah menu)
                  : lookTarget
              }
              className={`w-full h-auto drop-shadow-2xl ${
                isLandscape
                  ? 'max-w-[140px] tablet:max-w-[210px] tablet-lg:max-w-[250px] max-h-[45vh] tablet:max-h-[50vh] ml-0 mr-auto'
                  : 'max-w-[220px] mobile-lg:max-w-[260px] tablet:max-w-[320px] max-h-[35vh] tablet:max-h-[44vh] mx-auto'
              }`}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Anak Cincau & Daily Checklist (Fixed at Bottom Right above Profile) */}
      {viewIndex === 0 && (
        <DailyChecklistWidget
          isInline={false}
          className="z-40 tablet:hidden tablet-md:hidden"
          completedCount={dailyCompletedCount}
          totalTasks={dailyTotalTasks}
          isAllCompleted={isDailyAllCompleted}
          streak={dailyStreak}
          tasks={dailyTasks}
          claimedBonusToday={dailyClaimedBonusToday}
          onClaimBonus={() => {
            claimDailyBonus();
            addMisiRewards(1, 10);
          }}
          onOpenFeedMenu={() => {
            if (viewIndex !== 0) travelToView(0);
            setIsBubbleMenuOpen(true);
          }}
          onOpenQuizMenu={() => {
            setSelectedCategory(undefined);
            setIsQuizModalOpen(true);
          }}
          onPetMascotAction={() => {
            trackDailyPet();
            setBounceKey((k) => k + 1);
            setMascotEmotionOverride('excited');
            setTimeout(() => setMascotEmotionOverride(null), 2000);
          }}
          onOpenChange={(open) => setIsDailyChecklistOpen(open)}
        />
      )}

      {/* Cincau Salon & Style Customizer Overlay */}
      <CincauSalonOverlay
        isOpen={isSalonModalOpen}
        onClose={() => setIsSalonModalOpen(false)}
        mascotTheme={mascotTheme}
        onToggleTheme={onToggleTheme}
        selectedAccessory="none"
        onSelectAccessory={() => {}}
        isLandscapeHomescreen={isLandscape && viewIndex === 0}
      />

      {/* PAWCHI-STYLE DAILY CHECKLIST WIDGET (Kartu Aktivitas & Jadwal Harian) */}


      {/* Minigame Overlay */}
      <AnimatePresence>
      </AnimatePresence>

      {/* Interactive Learning Mission Quiz Modal */}
      <LearningMissionModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        fase={childProfile?.fase || 'A'}
        category={selectedCategory}
        onMissionSuccess={(earnedFood, earnedStars) => {
          addMisiRewards(earnedFood, earnedStars);
          trackDailyQuiz();
          setMascotEmotionOverride('excited');
          setTimeout(() => setMascotEmotionOverride(null), 2800);
        }}
      />

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

      {/* Dedicated Tactile Polygonal Play Learning Room (ToyCAD / MerdekaKids Aesthetic - No Bottom Nav Bar) */}
      <AnimatePresence>
        {isToycadLearningRoomOpen && (
          <ToycadLearningRoom
            onClose={() => setIsToycadLearningRoomOpen(false)}
            mascotTheme={mascotTheme}
            childProfile={childProfile}
          />
        )}
      </AnimatePresence>

      {/* Dedicated Tactile Polygonal Ruang Bermain 3D (ToyCAD / MerdekaKids Aesthetic) */}
      <AnimatePresence>
        {isToycadPlayRoomOpen && (
          <ToycadPlayRoom
            onClose={() => setIsToycadPlayRoomOpen(false)}
            mascotTheme={mascotTheme}
          />
        )}
      </AnimatePresence>

      {/* Pena Pintar Studio - Interactive Canvas Drawing Modal */}
      <DrawingStudioModal
        isOpen={isDrawingStudioOpen}
        onClose={() => setIsDrawingStudioOpen(false)}
      />
    </div>
  );
};
