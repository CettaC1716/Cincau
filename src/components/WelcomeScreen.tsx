import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, KeyRound } from 'lucide-react';
import { CharviMascot } from './CharviMascot';
import { CincauLogo } from './CincauLogo';
import { MascotTheme, CharviEmotion } from '../types';
import { playPopSound } from '../utils/audioEffects';

interface WelcomeScreenProps {
  mascotTheme: MascotTheme;
  onStartRegistration: () => void;
  onSignInExisting: () => void;
}

// 4 guaranteed distinct color themes for WelcomeScreen
const WELCOME_MASCOT_THEMES = {
  ayah: 'emerald-mint' as MascotTheme, // Hijau Daun Cincau Alami
  biru: 'cyan-jelly' as MascotTheme,    // Si Biru Air
  pink: 'berry-purple' as MascotTheme,  // Si Pink Permen
  kuning: 'sunny-banana' as MascotTheme,// Si Kuning Surya
};

// Curated rotation sets where all 4 mascots ALWAYS have strictly different expressions
const DIVERSE_EMOTIONS: [CharviEmotion, CharviEmotion, CharviEmotion, CharviEmotion][] = [
  ['proud', 'thinking', 'giggle', 'happy'],        // Ayah: Bangga, Biru: Berpikir, Pink: Terkikik, Kuning: Ceria
  ['happy', 'surprised', 'excited', 'proud'],       // Ayah: Ceria, Biru: Takjub, Pink: Riang, Kuning: Bangga
  ['celebrating', 'happy', 'giggle', 'thinking'],   // Ayah: Merayakan, Biru: Ceria, Pink: Terkikik, Kuning: Berpikir
  ['encouraging', 'excited', 'happy', 'surprised'], // Ayah: Semangat, Biru: Riang, Pink: Ceria, Kuning: Takjub
  ['proud', 'giggle', 'surprised', 'happy'],        // Ayah: Bangga, Biru: Terkikik, Pink: Takjub, Kuning: Ceria
  ['celebrating', 'thinking', 'excited', 'giggle'], // Ayah: Merayakan, Biru: Berpikir, Pink: Riang, Kuning: Terkikik
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  mascotTheme: _mascotTheme,
  onStartRegistration,
  onSignInExisting,
}) => {
  // Track sequence completion to show buttons
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false);
  const [isFamilyJumping, setIsFamilyJumping] = useState<boolean>(false);
  const [mascotDialog, setMascotDialog] = useState<string>('Nyam! Yuk main bareng Cincau! ✨');

  // Individual emotion state for every mascot - Guaranteed strictly different at all times
  const [ayahEmotion, setAyahEmotion] = useState<CharviEmotion>('proud');
  const [biruEmotion, setBiruEmotion] = useState<CharviEmotion>('thinking');
  const [pinkEmotion, setPinkEmotion] = useState<CharviEmotion>('giggle');
  const [kuningEmotion, setKuningEmotion] = useState<CharviEmotion>('happy');

  const emotionCycleIndexRef = useRef<number>(0);

  // Timer to reveal action buttons after the entrance sequence finishes (~2.4s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  // Autonomous living emotion shift every 4.8s ensuring no two mascots ever share an expression
  useEffect(() => {
    const interval = setInterval(() => {
      if (isFamilyJumping) return;
      emotionCycleIndexRef.current = (emotionCycleIndexRef.current + 1) % DIVERSE_EMOTIONS.length;
      const [nextAyah, nextBiru, nextPink, nextKuning] = DIVERSE_EMOTIONS[emotionCycleIndexRef.current];
      setAyahEmotion(nextAyah);
      setBiruEmotion(nextBiru);
      setPinkEmotion(nextPink);
      setKuningEmotion(nextKuning);
    }, 4800);

    return () => clearInterval(interval);
  }, [isFamilyJumping]);

  // Synchronized family jump trigger when tapping the stage: 4 strictly different festive expressions
  const triggerFamilyJump = () => {
    playPopSound();
    setIsFamilyJumping(true);
    setAnimationCompleted(true); // reveal buttons if tapped early

    // 4 completely different joyful expressions during jump
    setAyahEmotion('celebrating');
    setBiruEmotion('surprised');
    setPinkEmotion('excited');
    setKuningEmotion('giggle');
    setMascotDialog('Horeee! Keluarga Jeli Cincau siap bermain! 🎉✨');

    setTimeout(() => {
      setIsFamilyJumping(false);
      // Return to another diverse set
      setAyahEmotion('proud');
      setBiruEmotion('thinking');
      setPinkEmotion('happy');
      setKuningEmotion('giggle');
    }, 1100);
  };

  return (
    <div
      onClick={() => {
        if (!animationCompleted) setAnimationCompleted(true);
      }}
      className="relative w-full h-full bg-gradient-to-b from-sky-50 via-amber-50/35 to-emerald-50/50 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-6 w-80 h-80 bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-4 w-60 h-60 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Sparkle Elements */}
      <motion.div
        animate={{ y: [-8, 8, -8], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-8 text-amber-400 pointer-events-none"
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>
      <motion.div
        animate={{ y: [6, -10, 6], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-28 right-10 text-sky-400 pointer-events-none"
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      {/* Top Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full px-5 pt-4 tablet:pt-5 flex items-center justify-between z-30"
      >
      </motion.div>

      {/* Main Responsive Stage */}
      <div className="flex-1 w-full flex flex-col landscape:flex-row items-center justify-between px-5 tablet:px-8 py-2 z-10 overflow-y-auto no-scrollbar">
        {/* Left Column in Landscape / Top & Middle Content in Portrait */}
        <div className="w-full landscape:w-1/2 flex flex-col items-center landscape:items-start text-center landscape:text-left my-auto px-2 tablet:px-4 z-20">
          <AnimatePresence>
            {animationCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center landscape:items-start"
              >
                {/* Hero Logo Banner */}
                <div className="mb-2">
                  <CincauLogo variant="green" className="w-44 tablet:w-56 landscape:w-36 tablet:landscape:w-52 h-auto drop-shadow-md" />
                </div>

                <h1 className="text-xl tablet:text-3xl landscape:text-xl tablet:landscape:text-2xl tablet-lg:landscape:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
                  Halo, Petualang Cilik! 🌟
                </h1>
                <p className="text-xs tablet:text-base landscape:text-xs tablet:landscape:text-sm text-neutral-600 font-medium mt-1.5 max-w-sm leading-relaxed">
                  Belajar kurikulum seru dan bermain minigame asyik bersama Cincau dan keluarga jeli yang ceria!
                </p>

                {/* Action Buttons: Staggered reveal after family animation */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-full max-w-xs mt-4 tablet:mt-7 space-y-2.5"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playPopSound();
                      onStartRegistration();
                    }}
                    className="w-full py-3.5 tablet:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm tablet:text-base shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2.5 cursor-pointer border-2 border-amber-300 active:scale-95 transition-transform"
                  >
                    <span>Mulai Petualangan 🚀</span>
                    <ArrowRight className="w-4 h-4 tablet:w-5 tablet:h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playPopSound();
                      onSignInExisting();
                    }}
                    className="w-full min-h-[44px] tablet:min-h-[48px] py-3 tablet:py-3.5 px-5 rounded-2xl bg-white/95 hover:bg-white text-neutral-700 font-extrabold text-xs tablet:text-sm shadow-xs border-2 border-neutral-200/80 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-neutral-500" />
                    <span>Saya Sudah Punya Akun</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column in Landscape / Character Stage in Portrait */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            triggerFamilyJump();
          }}
          className="w-full landscape:w-1/2 flex-1 flex flex-col justify-end items-center relative min-h-[260px] tablet:min-h-[320px] cursor-pointer"
        >
          {/* Adorable Speech Bubble: Plays after Ayah and children gather or when any mascot is tapped */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 15 }}
            animate={{
              opacity: animationCompleted ? 1 : 0,
              scale: animationCompleted ? 1 : 0,
              y: animationCompleted ? [0, -4, 0] : 15,
            }}
            transition={{
              opacity: { duration: 0.4, delay: 0.1 },
              scale: { type: 'spring', bounce: 0.5, delay: 0.1 },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute top-1 tablet:top-3 z-30 px-3.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-xs shadow-md border-2 border-amber-300 text-center pointer-events-none max-w-[85%]"
          >
            <span className="text-xs font-black text-amber-900 flex items-center justify-center gap-1.5">
              <span>{mascotDialog}</span>
            </span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r-2 border-b-2 border-amber-300" />
          </motion.div>

          {/* Baby Jelly 1: Si Biru 💧 (Kiri) - Meluncur masuk dari sisi kiri luar layar */}
          <motion.div
            initial={{ x: -240, y: -20, opacity: 0, scale: 0.6, rotate: -40 }}
            animate={{
              x: 0,
              y: isFamilyJumping ? [-10, -40, 0] : [-6, 6, -6],
              opacity: 1,
              scale: isFamilyJumping ? 1.15 : 1,
              rotate: isFamilyJumping ? [-15, 12, -5] : [-6, 5, -6],
            }}
            transition={{
              // Entrance animation
              x: { delay: 1.2, duration: 0.9, type: 'spring', bounce: 0.4 },
              opacity: { delay: 1.2, duration: 0.5 },
              scale: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { delay: 1.2, duration: 0.9, ease: 'easeOut' },
              // Idle floating loop (active after entry)
              y: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 2.1 },
              rotate: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 2.1 },
            }}
            className="absolute left-2 mobile-lg:left-4 tablet:left-8 bottom-24 mobile-lg:bottom-28 tablet:bottom-36 tablet:landscape:bottom-28 z-20"
          >
            <div className="w-16 h-16 mobile-lg:w-18 mobile-lg:h-18 tablet:w-24 tablet:h-24 relative">
              <CharviMascot
                variant="compact-header"
                emotion={biruEmotion}
                theme={WELCOME_MASCOT_THEMES.biru}
                className="w-full h-full drop-shadow-md"
                onClick={() => {
                  playPopSound();
                  setBiruEmotion('surprised');
                  setAyahEmotion('proud');
                  setPinkEmotion('giggle');
                  setKuningEmotion('happy');
                  setMascotDialog('Ciprat! Aku Si Biru lincah & cerdik! 💧✨');
                }}
                onEmotionChange={(emo) => {
                  if (emo === 'angry') setMascotDialog('Pusing! Jangan dipencet terus dong! 😡💢');
                  else if (emo === 'excited') setMascotDialog('Yey! Si Biru diajak main! 💖');
                }}
              />
            </div>
          </motion.div>

          {/* Baby Jelly 2: Si Pink 🌸 (Kanan) - Meluncur masuk dari sisi kanan luar layar */}
          <motion.div
            initial={{ x: 240, y: -20, opacity: 0, scale: 0.6, rotate: 40 }}
            animate={{
              x: 0,
              y: isFamilyJumping ? [-10, -42, 0] : [6, -8, 6],
              opacity: 1,
              scale: isFamilyJumping ? 1.15 : 1,
              rotate: isFamilyJumping ? [15, -12, 4] : [5, -6, 5],
            }}
            transition={{
              // Entrance animation
              x: { delay: 1.4, duration: 0.9, type: 'spring', bounce: 0.4 },
              opacity: { delay: 1.4, duration: 0.5 },
              scale: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { delay: 1.4, duration: 0.9, ease: 'easeOut' },
              // Idle floating loop (active after entry)
              y: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { repeat: Infinity, duration: 3.6, ease: 'easeInOut', delay: 2.3 },
              rotate: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { repeat: Infinity, duration: 3.6, ease: 'easeInOut', delay: 2.3 },
            }}
            className="absolute right-2 mobile-lg:right-4 tablet:right-8 bottom-26 mobile-lg:bottom-30 tablet:bottom-38 tablet:landscape:bottom-30 z-20"
          >
            <div className="w-16 h-16 mobile-lg:w-18 mobile-lg:h-18 tablet:w-24 tablet:h-24 relative">
              <CharviMascot
                variant="compact-header"
                emotion={pinkEmotion}
                theme={WELCOME_MASCOT_THEMES.pink}
                className="w-full h-full drop-shadow-md"
                onClick={() => {
                  playPopSound();
                  setPinkEmotion('excited');
                  setAyahEmotion('proud');
                  setBiruEmotion('thinking');
                  setKuningEmotion('happy');
                  setMascotDialog('Yippie! Aku Si Pink manis suka main! 🌸💖');
                }}
                onEmotionChange={(emo) => {
                  if (emo === 'angry') setMascotDialog('Huwaa! Jangan ketuk cepat-cepat! 😡💢');
                  else if (emo === 'excited') setMascotDialog('Aww! Geli tapi senang! 🌸💕');
                }}
              />
            </div>
          </motion.div>

          {/* Baby Jelly 3: Si Kuning Ceria 🌟 (Atas Kanan) - Melayang turun dari atas kanan */}
          <motion.div
            initial={{ x: 80, y: -180, opacity: 0, scale: 0.5, rotate: 30 }}
            animate={{
              x: 0,
              y: isFamilyJumping ? [-15, -46, 0] : [-5, 6, -5],
              opacity: 1,
              scale: isFamilyJumping ? 1.2 : 1,
              rotate: isFamilyJumping ? [-8, 14, -3] : [-4, 6, -4],
            }}
            transition={{
              // Entrance animation
              x: { delay: 1.6, duration: 0.85, type: 'spring', bounce: 0.4 },
              y: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 2.5 },
              opacity: { delay: 1.6, duration: 0.5 },
              scale: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { delay: 1.6, duration: 0.85, ease: 'easeOut' },
              // Idle floating loop (active after entry)
              rotate: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : { repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 2.5 },
            }}
            className="absolute right-6 mobile-lg:right-12 tablet:right-24 bottom-38 mobile-lg:bottom-44 tablet:bottom-56 tablet:landscape:bottom-44 z-20"
          >
            <div className="w-13 h-13 mobile-lg:w-14 mobile-lg:h-14 tablet:w-18 tablet:h-18 relative">
              <CharviMascot
                variant="compact-header"
                emotion={kuningEmotion}
                theme={WELCOME_MASCOT_THEMES.kuning}
                className="w-full h-full drop-shadow-md"
                onClick={() => {
                  playPopSound();
                  setKuningEmotion('happy');
                  setAyahEmotion('proud');
                  setBiruEmotion('thinking');
                  setPinkEmotion('giggle');
                  setMascotDialog('Semangat! Aku Si Kuning ceria berbinar! 🌟⭐');
                }}
                onEmotionChange={(emo) => {
                  if (emo === 'angry') setMascotDialog('Aduhh! Jangan ketuk terus ya! 😡💢');
                  else if (emo === 'excited') setMascotDialog('Horeee! Si Kuning gembira! 🌟✨');
                }}
              />
            </div>
          </motion.div>

          {/* Ayah Cincau: Muncul dari bawah memenuhi ~setengah layar, posisi terangkat nyaman agar mulut terlihat jelas */}
          <motion.div
            initial={{ y: 320, scale: 1.4 }}
            animate={{
              // Stage 1: Meluncur naik besar (0.0s - 0.9s), Stage 2: Mengecil elastis (0.9s - 1.3s), Stage 3: Goyangan bermain ramah
              y: isFamilyJumping ? [0, -26, 0] : [0, -4, 0],
              scale: isFamilyJumping ? 1.08 : 1.0,
              rotate: isFamilyJumping ? [-3, 3, 0] : [-1.5, 1.5, -1.5],
            }}
            transition={{
              y: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : {
                    duration: 1.3,
                    times: [0, 0.75, 1],
                    ease: [0.16, 1, 0.3, 1],
                  },
              scale: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : {
                    duration: 1.4,
                    times: [0, 0.65, 0.88, 1],
                    ease: [0.34, 1.56, 0.64, 1],
                  },
              rotate: isFamilyJumping
                ? { duration: 0.55, ease: 'easeOut' }
                : {
                    repeat: Infinity,
                    duration: 4,
                    ease: 'easeInOut',
                    delay: 1.8,
                  },
            }}
            className="w-full max-w-[200px] mobile-lg:max-w-[220px] tablet:max-w-[360px] landscape:max-w-[170px] tablet:landscape:max-w-[320px] tablet-lg:landscape:max-w-[360px] relative z-10 flex justify-center pb-2 tablet:pb-4 mb-0"
          >
            <CharviMascot
              variant="large-bottom"
              emotion={ayahEmotion}
              theme={WELCOME_MASCOT_THEMES.ayah}
              className="w-full h-auto max-h-[46vh] tablet:max-h-[52vh] drop-shadow-xl"
              onClick={() => {
                playPopSound();
                setAyahEmotion('celebrating');
                setBiruEmotion('thinking');
                setPinkEmotion('giggle');
                setKuningEmotion('happy');
                setMascotDialog('Halo jagoan! Aku Ayah Cincau, senang bertemu kamu! 🌿✨');
              }}
              onEmotionChange={(emo) => {
                if (emo === 'angry') setMascotDialog('Aduh aduh, jangan dipencet terus dong, pusing! 😡💢');
                else if (emo === 'excited') setMascotDialog('Nyam! Ayah Cincau senang banget! 🌿✨');
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
