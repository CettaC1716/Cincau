import React, { useEffect, useState, useMemo, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharviEmotion, LookTarget, MascotTheme } from '../types';

interface CharviMascotProps {
  variant?: 'large-bottom' | 'compact-header';
  emotion?: CharviEmotion;
  lookTarget?: LookTarget;
  isTalking?: boolean;
  isListening?: boolean;
  isInteracting?: boolean;
  theme?: MascotTheme;
  className?: string;
  onClick?: () => void;
  onAnnoyedChange?: (isAnnoyed: boolean) => void;
  onEmotionChange?: (emotion: CharviEmotion) => void;
}

const getEmotionGradient = (emo: CharviEmotion, theme: MascotTheme = 'cyan-jelly', mascotId: string = '') => {
  const sfx = mascotId ? `_${mascotId}` : '';
  switch (emo) {
    case 'happy':
      return `url(#charviYellowJelly${sfx})`; // Kuning ceria pasca-makan
    case 'angry':
    case 'pouty':
    case 'annoyed':
      return `url(#charviRedJelly${sfx})`; // Merah menyala saat ditekan >5x
    case 'excited':
      return `url(#charviPinkJelly${sfx})`; // Pink cerah saat interaksi & diberi makan
    case 'celebrating':
      return `url(#charviEmeraldJelly${sfx})`; // Hijau zamrud selebrasi
    case 'thinking':
      return `url(#charviCyanJelly${sfx})`; // Toska / cyan cerah berpikir
    case 'surprised':
      return `url(#charviOrangeJelly${sfx})`; // Oranye manis kagum
    case 'sleepy':
      return `url(#charviIndigoJelly${sfx})`; // Indigo malam mengantuk
    case 'proud':
      return `url(#charviGoldJelly${sfx})`; // Emas kemilau bangga
    case 'giggle':
      return `url(#charviPeachJelly${sfx})`; // Coral peach geli
    case 'bored':
      return `url(#charviPurpleJelly${sfx})`; // Ungu saat merasa bosan
    case 'sad':
      return `url(#charviBlueJelly${sfx})`;
    case 'idle':
    default:
      // Respect the distinct theme color when idle
      switch (theme) {
        case 'emerald-mint':
          return `url(#charviEmeraldJelly${sfx})`;
        case 'berry-purple':
          return `url(#charviBerryJelly${sfx})`;
        case 'sunny-banana':
          return `url(#charviBananaJelly${sfx})`;
        case 'classic-orange':
          return `url(#charviOrangeJelly${sfx})`;
        case 'cyan-jelly':
        default:
          return `url(#charviBlueJelly${sfx})`;
      }
  }
};

const isDopamineEmotion = (emo: CharviEmotion) => {
  return (
    emo === 'happy' ||
    emo === 'excited' ||
    emo === 'celebrating' ||
    emo === 'thinking' ||
    emo === 'angry' ||
    emo === 'pouty' ||
    emo === 'annoyed' ||
    emo === 'surprised' ||
    emo === 'proud' ||
    emo === 'giggle'
  );
};

const getEmotionGlow = (emo: CharviEmotion, theme: MascotTheme = 'cyan-jelly') => {
  switch (emo) {
    case 'happy':
      return '#f59e0b'; // Kuning
    case 'angry':
    case 'pouty':
    case 'annoyed':
      return '#e11d48'; // Merah
    case 'excited':
      return '#ec4899'; // Pink
    case 'celebrating':
      return '#10b981'; // Hijau
    case 'thinking':
      return '#06b6d4'; // Toska
    case 'surprised':
      return '#ea580c'; // Oranye
    case 'sleepy':
      return '#4f46e5'; // Indigo
    case 'proud':
      return '#d97706'; // Emas
    case 'giggle':
      return '#f97316'; // Peach
    case 'bored':
      return '#7c3aed'; // Ungu
    case 'sad':
      return '#0284c7';
    case 'idle':
    default:
      switch (theme) {
        case 'emerald-mint':
          return '#10b981';
        case 'berry-purple':
          return '#c026d3';
        case 'sunny-banana':
          return '#f59e0b';
        case 'classic-orange':
          return '#ea580c';
        case 'cyan-jelly':
        default:
          return '#0284c7'; // Biru langit
      }
  }
};

export const CharviMascot: React.FC<CharviMascotProps> = ({
  variant = 'large-bottom',
  emotion = 'idle',
  lookTarget = { x: 0.3, y: -0.7 },
  isTalking = false,
  isListening = false,
  isInteracting = false,
  theme = 'cyan-jelly',
  className = '',
  onClick,
  onAnnoyedChange,
  onEmotionChange,
}) => {
  const rawId = useId();
  const mascotId = useMemo(() => rawId.replace(/[^a-zA-Z0-9_-]/g, '_'), [rawId]);

  const [isBlinking, setIsBlinking] = useState(false);
  const [talkingFrame, setTalkingFrame] = useState(0);

  // Rapid tap & Angry state (>5x taps = Angry / Red)
  const [tapCount, setTapCount] = useState(0);
  const [isRapidTapAnnoyed, setIsRapidTapAnnoyed] = useState(false);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Interactive tap emotion: Pink ('excited') -> 2.5s -> Yellow ('happy') -> 3.2s -> Blue ('idle')
  const [tapEmotion, setTapEmotion] = useState<CharviEmotion | null>(null);
  const tapEmotionTimer1Ref = useRef<NodeJS.Timeout | null>(null);
  const tapEmotionTimer2Ref = useRef<NodeJS.Timeout | null>(null);

  // Inactivity Idle Boredom state (after 12s = Ungu) & Sleepy state (after 32s = Indigo)
  const [isLongIdleBored, setIsLongIdleBored] = useState(false);
  const [isLongIdleSleepy, setIsLongIdleSleepy] = useState(false);
  const boredTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sleepyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Living Idle spontaneous behaviors (thinking, curious glance, happy wiggle, giggle, proud)
  const [livingSubEmotion, setLivingSubEmotion] = useState<CharviEmotion | null>(null);
  const [spontaneousLook, setSpontaneousLook] = useState<{ x: number; y: number } | null>(null);
  const livingLoopRef = useRef<NodeJS.Timeout | null>(null);
  const subEmotionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle tap on mascot:
  // - 1 to 4 taps: Pink ('excited') -> Yellow ('happy') -> Blue ('idle')
  // - >5 taps: Angry ('angry' / Red) shake effect for 3.2s -> return to Blue ('idle')
  const handleMascotTap = () => {
    // Waking up immediately from boredom, sleepiness, or spontaneous micro-behavior
    setIsLongIdleBored(false);
    setIsLongIdleSleepy(false);
    setLivingSubEmotion(null);
    setSpontaneousLook(null);

    // Clear previous timers
    if (subEmotionTimerRef.current) clearTimeout(subEmotionTimerRef.current);
    if (tapEmotionTimer1Ref.current) clearTimeout(tapEmotionTimer1Ref.current);
    if (tapEmotionTimer2Ref.current) clearTimeout(tapEmotionTimer2Ref.current);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount >= 5) {
      // Trigger Angry Red (>5x taps)
      setIsRapidTapAnnoyed(true);
      setTapEmotion('angry');
      if (onAnnoyedChange) onAnnoyedChange(true);
      if (onEmotionChange) onEmotionChange('angry');

      cooldownTimerRef.current = setTimeout(() => {
        setIsRapidTapAnnoyed(false);
        setTapCount(0);
        setTapEmotion(null);
        if (onAnnoyedChange) onAnnoyedChange(false);
        if (onEmotionChange) onEmotionChange('idle');
      }, 4600);
    } else {
      // Normal interactive tap: Candy Pink ('excited') -> Golden Yellow ('happy') -> Sky Blue ('idle')
      // Retained for 5-7 seconds total so child can appreciate the warm feedback
      setIsRapidTapAnnoyed(false);
      setTapEmotion('excited');
      if (onEmotionChange) onEmotionChange('excited');

      // Transition to Yellow ('happy') after 3.0 seconds
      tapEmotionTimer1Ref.current = setTimeout(() => {
        setTapEmotion('happy');
        if (onEmotionChange) onEmotionChange('happy');

        // Transition back to Idle Blue after 3.6 seconds (Total duration: 6.6 seconds)
        tapEmotionTimer2Ref.current = setTimeout(() => {
          setTapEmotion(null);
          setTapCount(0);
          if (onEmotionChange) onEmotionChange('idle');
        }, 3600);
      }, 3000);
    }

    if (onClick) onClick();
  };

  // Inactivity detectors & Autonomous Living Idle Loop
  useEffect(() => {
    if (isInteracting || isRapidTapAnnoyed || tapEmotion || emotion !== 'idle') {
      setIsLongIdleBored(false);
      setIsLongIdleSleepy(false);
      setLivingSubEmotion(null);
      if (subEmotionTimerRef.current) clearTimeout(subEmotionTimerRef.current);
      if (boredTimerRef.current) clearTimeout(boredTimerRef.current);
      if (sleepyTimerRef.current) clearTimeout(sleepyTimerRef.current);
      if (livingLoopRef.current) clearInterval(livingLoopRef.current);
      return;
    }

    // 14-second idle timeout -> BORED (Ungu)
    boredTimerRef.current = setTimeout(() => {
      setIsLongIdleBored(true);
      if (onEmotionChange) onEmotionChange('bored');
    }, 14000);

    // 36-second idle timeout -> SLEEPY (Indigo)
    sleepyTimerRef.current = setTimeout(() => {
      setIsLongIdleSleepy(true);
      if (onEmotionChange) onEmotionChange('sleepy');
    }, 36000);

    // Autonomous living idle loop: calm, charming spontaneous micro-expressions every 8.2 seconds
    livingLoopRef.current = setInterval(() => {
      if (isInteracting || isRapidTapAnnoyed || tapEmotion || isLongIdleBored || isLongIdleSleepy) return;
      if (subEmotionTimerRef.current) clearTimeout(subEmotionTimerRef.current);
      const rand = Math.random();
      if (rand < 0.28) {
        // Spontaneous Thinking (Toska / Cyan)
        setLivingSubEmotion('thinking');
        setSpontaneousLook({ x: 0.65, y: -0.8 });
        subEmotionTimerRef.current = setTimeout(() => {
          setLivingSubEmotion(null);
          setSpontaneousLook(null);
        }, 3400);
      } else if (rand < 0.50) {
        // Spontaneous curious glance left or right
        setSpontaneousLook({ x: Math.random() > 0.5 ? 0.75 : -0.75, y: -0.2 });
        subEmotionTimerRef.current = setTimeout(() => setSpontaneousLook(null), 2800);
      } else if (rand < 0.68) {
        // Spontaneous happy bounce (Kuning)
        setLivingSubEmotion('happy');
        subEmotionTimerRef.current = setTimeout(() => setLivingSubEmotion(null), 3000);
      } else if (rand < 0.82) {
        // Spontaneous giggle (Coral Peach)
        setLivingSubEmotion('giggle');
        subEmotionTimerRef.current = setTimeout(() => setLivingSubEmotion(null), 3000);
      } else {
        // Spontaneous surprised curious look (Oranye)
        setLivingSubEmotion('surprised');
        subEmotionTimerRef.current = setTimeout(() => setLivingSubEmotion(null), 3000);
      }
    }, 8200);

    return () => {
      if (subEmotionTimerRef.current) clearTimeout(subEmotionTimerRef.current);
      if (boredTimerRef.current) clearTimeout(boredTimerRef.current);
      if (sleepyTimerRef.current) clearTimeout(sleepyTimerRef.current);
      if (livingLoopRef.current) clearInterval(livingLoopRef.current);
    };
  }, [isInteracting, isRapidTapAnnoyed, tapEmotion, emotion, onEmotionChange]);

  useEffect(() => {
    return () => {
      if (subEmotionTimerRef.current) clearTimeout(subEmotionTimerRef.current);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (tapEmotionTimer1Ref.current) clearTimeout(tapEmotionTimer1Ref.current);
      if (tapEmotionTimer2Ref.current) clearTimeout(tapEmotionTimer2Ref.current);
      if (boredTimerRef.current) clearTimeout(boredTimerRef.current);
      if (sleepyTimerRef.current) clearTimeout(sleepyTimerRef.current);
      if (livingLoopRef.current) clearInterval(livingLoopRef.current);
    };
  }, []);

  // Determine current active emotion
  const activeEmotion: CharviEmotion = useMemo(() => {
    if (isRapidTapAnnoyed) return 'angry';
    if (tapEmotion) return tapEmotion;
    if (livingSubEmotion && emotion === 'idle') return livingSubEmotion;
    if (isLongIdleSleepy && emotion === 'idle') return 'sleepy';
    if (isLongIdleBored && emotion === 'idle') return 'bored';
    return emotion;
  }, [isRapidTapAnnoyed, tapEmotion, livingSubEmotion, isLongIdleSleepy, isLongIdleBored, emotion]);

  const isBored = activeEmotion === 'bored';
  const isAngry = activeEmotion === 'angry' || activeEmotion === 'pouty' || activeEmotion === 'annoyed';
  const isHappy = activeEmotion === 'happy';
  const isExcited = activeEmotion === 'excited';
  const isSad = activeEmotion === 'sad';
  const isThinking = activeEmotion === 'thinking';
  const isCelebrating = activeEmotion === 'celebrating';
  const isSurprised = activeEmotion === 'surprised';
  const isSleepy = activeEmotion === 'sleepy';
  const isProud = activeEmotion === 'proud';
  const isGiggle = activeEmotion === 'giggle';

  // DUAL-LAYER JELLY SEAMLESS CROSS-FADE & WAVE SYSTEM
  // Under-layer retains previous emotion during transition (no black/blank flashes).
  // Top-layer performs a silky opacity cross-fade (0 -> 1) over 650ms.
  // Liquid wave sweeps across with soft opacity envelope [0.6, 1, 1, 0].
  const [underEmotion, setUnderEmotion] = useState<CharviEmotion>(activeEmotion);
  const [topEmotion, setTopEmotion] = useState<CharviEmotion>(activeEmotion);
  const [fadeKey, setFadeKey] = useState<number>(0);
  const [incomingEmotion, setIncomingEmotion] = useState<CharviEmotion | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down'>('up');
  const [transitionKey, setTransitionKey] = useState(0);
  const prevEmotionRef = useRef<CharviEmotion>(activeEmotion);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const waveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeEmotion === prevEmotionRef.current) return;
    const prev = prevEmotionRef.current;
    const isDopamine = isDopamineEmotion(activeEmotion);
    const direction = isDopamine ? 'up' : 'down';

    // 1. Anchor under-layer to previous emotion for seamless backdrop
    setUnderEmotion(prev);
    // 2. Set top-layer to new incoming emotion
    setTopEmotion(activeEmotion);
    // 3. Increment cross-fade key
    setFadeKey((k) => k + 1);

    // 4. Trigger accompanying organic liquid wave
    setTransitionDirection(direction);
    setIncomingEmotion(activeEmotion);
    setTransitionKey((prev) => prev + 1);

    // Clear previous transition timers
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);

    // Once cross-fade finishes (650ms), stabilize under-layer to activeEmotion
    fadeTimerRef.current = setTimeout(() => {
      setUnderEmotion(activeEmotion);
    }, 680);

    // Once wave animation reaches full crest and dissolves (800ms), unmount wave cleanly
    waveTimerRef.current = setTimeout(() => {
      setIncomingEmotion(null);
    }, 800);

    prevEmotionRef.current = activeEmotion;
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    };
  }, [activeEmotion]);

  // 8-Second Breathing-Aligned Blinking Loop (active when not interacting and not bored/angry)
  useEffect(() => {
    if (isInteracting || isBored || isAngry) {
      setIsBlinking(false);
      return;
    }

    let blinkTimeout: NodeJS.Timeout;
    let cycleInterval: NodeJS.Timeout;

    const runBlinkCycle = () => {
      setIsBlinking(true);
      blinkTimeout = setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    };

    const initialDelay = setTimeout(() => {
      runBlinkCycle();
      cycleInterval = setInterval(runBlinkCycle, 8000);
    }, 4000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(blinkTimeout);
      clearInterval(cycleInterval);
      setIsBlinking(false);
    };
  }, [isInteracting, isBored, isAngry]);

  // Talking mouth animation loop
  useEffect(() => {
    if (!isTalking) return;
    const interval = setInterval(() => {
      setTalkingFrame((prev) => (prev + 1) % 4);
    }, 130);
    return () => clearInterval(interval);
  }, [isTalking]);

  // Dynamic eye pupil offsets based on lookTarget or spontaneousLook (-1 to 1)
  const effectiveLook = spontaneousLook || lookTarget;
  const pupilOffsetX = useMemo(() => {
    if (isBored) return 4;
    if (isThinking) return 10; // Gazing thoughtfully up-right
    if (isProud) return 6;
    const raw = (effectiveLook?.x ?? 0) * 12;
    return Math.max(-14, Math.min(14, raw));
  }, [effectiveLook?.x, isBored, isThinking, isProud]);

  const pupilOffsetY = useMemo(() => {
    if (isBored) return 10; // gazing slightly down when bored/sleepy
    if (isThinking) return -12; // Gazing up when contemplating
    if (isProud) return -4;
    const raw = (effectiveLook?.y ?? 0) * 14;
    return Math.max(-16, Math.min(16, raw));
  }, [effectiveLook?.y, isBored, isThinking, isProud]);

  const isLarge = variant === 'large-bottom';

  // Physical body lean towards cursor/finger
  const bodyTiltX = useMemo(() => {
    if (!isInteracting || isBored || isAngry) return 0;
    return (lookTarget?.x ?? 0) * 6; // Max 6 degrees tilt
  }, [lookTarget?.x, isInteracting, isBored, isAngry]);

  const bodyLeanY = useMemo(() => {
    if (!isInteracting || isBored || isAngry) return 0;
    return (lookTarget?.y ?? 0) * 5; // Max 5px vertical lean
  }, [lookTarget?.y, isInteracting, isBored, isAngry]);

  return (
    <motion.div
      onClick={handleMascotTap}
      whileTap={{
        scaleY: 0.84,
        scaleX: 1.16,
        y: 4,
        transition: { type: 'spring', damping: 10, stiffness: 420 },
      }}
      className={`relative select-none transition-transform cursor-pointer ${className}`}
    >
      <motion.svg
        viewBox={isLarge ? '0 15 360 300' : '0 0 360 280'}
        className="w-full h-full overflow-visible drop-shadow-md"
        animate={
          isListening
            ? {
                y: [0, -6, 0],
                scaleY: [1, 1.05, 0.96, 1],
                scaleX: [1, 0.96, 1.04, 1],
                rotate: [0, 1, -1, 0],
              }
            : isAngry
            ? {
                // Annoyed indignant jelly squish, jiggle and vibration
                x: [-6, 6, -5, 5, -3, 3, 0],
                y: [0, -4, 2, -3, 0],
                rotate: [0, -3.5, 3.5, -2, 2, 0],
                scaleY: [1, 0.90, 1.10, 0.93, 1.05, 1],
                scaleX: [1, 1.10, 0.90, 1.07, 0.95, 1],
              }
            : isExcited || isCelebrating
            ? {
                // Energetic joyful squishy bounce & stretch
                y: [0, -18, 4, -10, 0],
                scaleY: [1, 1.18, 0.84, 1.12, 0.93, 1],
                scaleX: [1, 0.84, 1.18, 0.90, 1.06, 1],
                rotate: [0, 3, -3, 1.5, 0],
              }
            : activeEmotion === 'surprised'
            ? {
                // Surprised tall stretch upwards and bouncy squish recoil
                y: [0, -16, 4, -4, 0],
                scaleY: [1, 1.20, 0.86, 1.07, 1],
                scaleX: [1, 0.83, 1.15, 0.94, 1],
                rotate: [0, -2, 2, 0],
              }
            : isThinking
            ? {
                // Thinking inquisitive squishy lean and head tilt
                y: [0, -6, 2, -3, 0],
                rotate: [0, -3.5, 3.5, -1.8, 0],
                scaleY: [1, 1.06, 0.95, 1.03, 1],
                scaleX: [1, 0.95, 1.05, 0.97, 1],
              }
            : isHappy
            ? {
                // Cheerful bouncy jelly bob & squish
                y: [0, -12, 3, -6, 0],
                scaleY: [1, 1.12, 0.89, 1.06, 0.97, 1],
                scaleX: [1, 0.89, 1.12, 0.95, 1.02, 1],
                rotate: [0, 1.8, -1.8, 1, 0],
              }
            : isSad
            ? {
                // Sad subtle droop & melt
                y: [0, 5, 0],
                scaleY: [1, 0.94, 1],
                scaleX: [1, 1.06, 1],
                rotate: [0, -0.6, 0.6, 0],
              }
            : {
                // Organic Jelly Squash & Stretch Floating Rhythm (8-second cycle)
                y: [0, -8, -2, 4, 0],
                scaleY: [1, 1.07, 1.02, 0.94, 1],
                scaleX: [1, 0.94, 0.98, 1.06, 1],
                rotate: [0, 1, -0.8, 0.4, 0],
              }
        }
        transition={{
          repeat: Infinity,
          duration: isListening
            ? 1.6
            : isAngry
            ? 0.6
            : isExcited || isCelebrating
            ? 1.5
            : activeEmotion === 'surprised'
            ? 1.8
            : isHappy
            ? 2.2
            : isThinking
            ? 3.2
            : isBored
            ? 9.5
            : isSad
            ? 5.0
            : 8.0,
          ease: 'easeInOut',
        }}
        style={{
          transformOrigin: '50% 100%',
        }}
      >
        <defs>
          {/* 1. CYAN JELLY TRANSLUCENT GRADIENT (IDLE / CALM) */}
          <linearGradient id="charviCyanJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="25%" stopColor="#00e5ff" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* 2. HAPPY JELLY TRANSLUCENT GRADIENT (GOLDEN YELLOW / AMBER) */}
          <linearGradient id="charviYellowJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* 3. ANGRY JELLY TRANSLUCENT GRADIENT (FIERY CRIMSON RED) */}
          <linearGradient id="charviRedJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="25%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          {/* 4. EXCITED JELLY TRANSLUCENT GRADIENT (MAGENTA / FUCHSIA-PINK) */}
          <linearGradient id="charviPinkJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="25%" stopColor="#e879f9" />
            <stop offset="70%" stopColor="#c026d3" />
            <stop offset="100%" stopColor="#86198f" />
          </linearGradient>

          {/* 5. SAD JELLY TRANSLUCENT GRADIENT (OCEAN BLUE) */}
          <linearGradient id="charviBlueJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="25%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>

          {/* 6. BORED JELLY TRANSLUCENT GRADIENT (LAVENDER / SOFT VIOLET) */}
          <linearGradient id="charviPurpleJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="25%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>

          {/* 7. EMERALD MINT THEME GRADIENT */}
          <linearGradient id="charviEmeraldJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="25%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* 8. BERRY PURPLE THEME GRADIENT */}
          <linearGradient id="charviBerryJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="25%" stopColor="#8b5cf6" />
            <stop offset="70%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>

          {/* 9. SUNNY BANANA THEME GRADIENT */}
          <linearGradient id="charviBananaJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* 10. CLASSIC ORANGE THEME GRADIENT (SURPRISED) */}
          <linearGradient id="charviOrangeJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="25%" stopColor="#fb923c" />
            <stop offset="70%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* 11. INDIGO JELLY (SLEEPY) */}
          <linearGradient id="charviIndigoJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="25%" stopColor="#818cf8" />
            <stop offset="70%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>

          {/* 12. GOLDEN JELLY (PROUD) */}
          <linearGradient id="charviGoldJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#fde047" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>

          {/* 13. CORAL PEACH JELLY (GIGGLE) */}
          <linearGradient id="charviPeachJelly" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="440">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="25%" stopColor="#fb923c" />
            <stop offset="70%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Liquid Wave Highlight crest */}
          <linearGradient id="liquidWaveRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>

          {/* Soft translucent bubble gradient */}
          <radialGradient id="bubbleGloss" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="45%" stopColor="#bae6fd" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
          </radialGradient>

          {/* Under-layer jelly aura glow */}
          <filter id={`jellyGlow_under_${mascotId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor={getEmotionGlow(underEmotion, theme)} floodOpacity="0.48" />
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.22" />
          </filter>

          {/* Top-layer jelly aura glow */}
          <filter id={`jellyGlow_top_${mascotId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor={getEmotionGlow(topEmotion, theme)} floodOpacity="0.48" />
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.22" />
          </filter>

          {/* Subsurface jelly core luminance (under) */}
          <radialGradient id={`jellyCoreGlow_under_${mascotId}`} cx="50%" cy="45%" r="58%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="35%" stopColor={getEmotionGlow(underEmotion, theme)} stopOpacity="0.28" />
            <stop offset="70%" stopColor={getEmotionGlow(underEmotion, theme)} stopOpacity="0.08" />
            <stop offset="100%" stopColor={getEmotionGlow(underEmotion, theme)} stopOpacity="0" />
          </radialGradient>

          {/* Subsurface jelly core luminance (top) */}
          <radialGradient id={`jellyCoreGlow_top_${mascotId}`} cx="50%" cy="45%" r="58%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="35%" stopColor={getEmotionGlow(topEmotion, theme)} stopOpacity="0.28" />
            <stop offset="70%" stopColor={getEmotionGlow(topEmotion, theme)} stopOpacity="0.08" />
            <stop offset="100%" stopColor={getEmotionGlow(topEmotion, theme)} stopOpacity="0" />
          </radialGradient>

          <filter id="jellyCoreBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* Clip path for pupils so they stay inside the white eyeballs */}
          <clipPath id={`leftEyeClip_${mascotId}`}>
            <ellipse cx="126" cy="155" rx="30" ry="46" />
          </clipPath>
          <clipPath id={`rightEyeClip_${mascotId}`}>
            <ellipse cx="234" cy="155" rx="30" ry="46" />
          </clipPath>

          {/* Clip path for Large Body Liquid Filling - extends seamlessly to bottom (elongated) */}
          <clipPath id={`largeBodyClip_${mascotId}`}>
            <path
              d="
                M 0, 95
                q 20,-34 40,0
                q 20,-34 40,0
                q 20,-34 40,0
                q 20,-34 40,0
                q 20,-34 40,0
                q 20,-34 40,0
                q 20,-34 40,0
                q 20,-34 40,0
                q 20,-34 40,0
                L 360, 360
                L 0, 360
                Z
              "
            />
          </clipPath>

          {/* Clip path for Compact Body Liquid Filling (Curved rounded body) */}
          <clipPath id={`compactBodyClip_${mascotId}`}>
            <path
              d="
                M 10, 80
                q 18.8,-28 37.7,0
                q 18.8,-28 37.7,0
                q 18.8,-28 37.7,0
                q 18.8,-28 37.7,0
                q 18.8,-28 37.7,0
                q 18.8,-28 37.7,0
                q 18.8,-28 37.7,0
                q 18.8,-28 37.7,0
                q 18.8,-28 37.7,0
                L 350, 205
                Q 350, 255 300, 258
                Q 180, 268 60, 258
                Q 10, 255 10, 205
                L 10, 80
                Z
              "
            />
          </clipPath>
        </defs>

        {/* Listening wave halo if listening */}
        {isListening && (
          <motion.ellipse
            cx="180"
            cy="150"
            rx="170"
            ry="140"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="3.5"
            initial={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: [0.8, 0, 0.8], scale: [0.95, 1.15, 0.95] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
          />
        )}
        {/* MASCOT PHYSICAL TRACKING WRAPPER: Tilts and leans whole body towards cursor/finger */}
        <motion.g
          animate={{
            rotate: bodyTiltX,
            x: (lookTarget?.x ?? 0) * 12, // Physical follow translation
            y: bodyLeanY,
          }}
          transition={{ type: 'spring', damping: 22, stiffness: 140 }}
          style={{ transformOrigin: '50% 100%' }}
        >
          {/* MASCOT BODY WITH PRESERVED SCALLOPED/WAVY TOP */}
          {isLarge ? (
            <g>
              {/* 1. Base Solid Under-Layer: Retains underEmotion during transition */}
              <path
                d="
                  M 0, 95
                  q 20,-34 40,0
                  q 20,-34 40,0
                  q 20,-34 40,0
                  q 20,-34 40,0
                  q 20,-34 40,0
                  q 20,-34 40,0
                  q 20,-34 40,0
                  q 20,-34 40,0
                  q 20,-34 40,0
                  L 360, 360
                  L 0, 360
                  Z
                "
                fill={getEmotionGradient(underEmotion, theme)}
                filter={`url(#jellyGlow_under_${mascotId})`}
              />

              {/* Subsurface Luminous Glow Core (Under) */}
              <ellipse
                cx="180"
                cy="185"
                rx="140"
                ry="95"
                fill={`url(#jellyCoreGlow_under_${mascotId})`}
                filter="url(#jellyCoreBlur)"
              />

              {/* 2. Top Cross-Fade Layer: Seamlessly fades in new emotion over 0.65s */}
              {topEmotion !== underEmotion && (
                <motion.g
                  key={`crossfade-large-${fadeKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.65, ease: 'easeInOut' }}
                >
                  <path
                    d="
                      M 0, 95
                      q 20,-34 40,0
                      q 20,-34 40,0
                      q 20,-34 40,0
                      q 20,-34 40,0
                      q 20,-34 40,0
                      q 20,-34 40,0
                      q 20,-34 40,0
                      q 20,-34 40,0
                      q 20,-34 40,0
                      L 360, 360
                      L 0, 360
                      Z
                    "
                    fill={getEmotionGradient(topEmotion, theme)}
                    filter={`url(#jellyGlow_top_${mascotId})`}
                  />
                  <ellipse
                    cx="180"
                    cy="185"
                    rx="140"
                    ry="95"
                    fill={`url(#jellyCoreGlow_top_${mascotId})`}
                    filter="url(#jellyCoreBlur)"
                  />
                </motion.g>
              )}

              {/* Shimmering Specular Jelly Rim Highlight (Kilau basah tepian jeli segar) */}
              <motion.path
                d="
                  M 8, 93
                  q 19,-31 38,0
                  q 19,-31 38,0
                  q 19,-31 38,0
                  q 19,-31 38,0
                  q 19,-31 38,0
                  q 19,-31 38,0
                  q 19,-31 38,0
                  q 19,-31 38,0
                  q 19,-31 38,0
                "
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              />

              {/* 3. DYNAMIC INCOMING TRANSITION WAVE LAYER (WITH SOFT OPACITY DISSOLVE) */}
              {incomingEmotion && (
                <g clipPath={`url(#largeBodyClip_${mascotId})`}>
                  {transitionDirection === 'up' ? (
                    // DOPAMINE WAVE: Sweeps RISING UP from bottom to top (320 -> -75)
                    <motion.g
                      key={`up-${transitionKey}`}
                      initial={{ y: 320, opacity: 0.6 }}
                      animate={{
                        y: -75,
                        opacity: [0.6, 1, 1, 0],
                      }}
                      transition={{
                        y: { duration: 0.76, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.76, times: [0, 0.25, 0.75, 1], ease: 'easeOut' },
                      }}
                    >
                      <motion.path
                        d="
                          M -60, 0
                          q 55, -14 110, 0
                          q 55, 14 110, 0
                          q 55, -14 110, 0
                          q 55, 14 110, 0
                          q 55, -14 110, 0
                          L 490, 360
                          L -60, 360
                          Z
                        "
                        fill={getEmotionGradient(incomingEmotion, theme)}
                        filter={`url(#jellyGlow_top_${mascotId})`}
                        animate={{ x: [-35, 15, -35] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                      />
                      {/* Organic liquid crest rim line */}
                      <motion.path
                        d="
                          M -60, 0
                          q 55, -14 110, 0
                          q 55, 14 110, 0
                          q 55, -14 110, 0
                          q 55, 14 110, 0
                          q 55, -14 110, 0
                        "
                        fill="none"
                        stroke="url(#liquidWaveRim)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        animate={{ x: [-35, 15, -35] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                      />
                    </motion.g>
                  ) : (
                    // DEPRESSION WAVE: Sweeps FALLING DOWN from top to bottom (-320 -> 90)
                    <motion.g
                      key={`down-${transitionKey}`}
                      initial={{ y: -320, opacity: 0.6 }}
                      animate={{
                        y: 90,
                        opacity: [0.6, 1, 1, 0],
                      }}
                      transition={{
                        y: { duration: 0.78, ease: [0.35, 0, 0.25, 1] },
                        opacity: { duration: 0.78, times: [0, 0.25, 0.75, 1], ease: 'easeOut' },
                      }}
                    >
                      <motion.path
                        d="
                          M -60, -100
                          L 490, -100
                          L 490, 300
                          q -55, 14 -110, 0
                          q -55, -14 -110, 0
                          q -55, 14 -110, 0
                          q -55, -14 -110, 0
                          q -55, 14 -110, 0
                          L -60, 300
                          Z
                        "
                        fill={getEmotionGradient(incomingEmotion, theme)}
                        filter={`url(#jellyGlow_top_${mascotId})`}
                        animate={{ x: [15, -35, 15] }}
                        transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                      />
                      <motion.path
                        d="
                          M 490, 300
                          q -55, 14 -110, 0
                          q -55, -14 -110, 0
                          q -55, 14 -110, 0
                          q -55, -14 -110, 0
                          q -55, 14 -110, 0
                        "
                        fill="none"
                        stroke="url(#liquidWaveRim)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        animate={{ x: [15, -35, 15] }}
                        transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                      />
                    </motion.g>
                  )}
                </g>
              )}

              {/* 3. TRANSLUCENT JELLY MICRO-BUBBLES (ALWAYS VISIBLE IN SOLID JELLY) */}
              <g opacity="0.36">
                {/* Bubble 1 (lower left) */}
                <motion.circle
                  cx="50"
                  cy="235"
                  r="7.5"
                  fill="url(#bubbleGloss)"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                />
                <circle cx="47" cy="232" r="1.8" fill="#ffffff" opacity="0.5" />

                {/* Bubble 2 (lower right) */}
                <motion.circle
                  cx="310"
                  cy="240"
                  r="8.5"
                  fill="url(#bubbleGloss)"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                  animate={{ y: [0, -7, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.5 }}
                />
                <circle cx="307" cy="237" r="2.1" fill="#ffffff" opacity="0.5" />

                {/* Bubble 3 (bottom left) */}
                <motion.circle
                  cx="85"
                  cy="255"
                  r="6.5"
                  fill="url(#bubbleGloss)"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.9 }}
                />
                <circle cx="83" cy="253" r="1.7" fill="#ffffff" opacity="0.4" />

                {/* Bubble 4 (bottom right) */}
                <motion.circle
                  cx="275"
                  cy="256"
                  r="7"
                  fill="url(#bubbleGloss)"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.0, ease: 'easeInOut', delay: 1.3 }}
                />
                <circle cx="273" cy="254" r="1.8" fill="#ffffff" opacity="0.4" />
              </g>
            </g>
          ) : (
            // Compact header mascot
            <g>
              {/* 1. Base Solid Under-Layer */}
              <path
                d="
                  M 10, 80
                  q 18.8,-28 37.7,0
                  q 18.8,-28 37.7,0
                  q 18.8,-28 37.7,0
                  q 18.8,-28 37.7,0
                  q 18.8,-28 37.7,0
                  q 18.8,-28 37.7,0
                  q 18.8,-28 37.7,0
                  q 18.8,-28 37.7,0
                  q 18.8,-28 37.7,0
                  L 350, 205
                  Q 350, 255 300, 258
                  Q 180, 268 60, 258
                  Q 10, 255 10, 205
                  L 10, 80
                  Z
                "
                fill={getEmotionGradient(underEmotion, theme)}
                filter={`url(#jellyGlow_under_${mascotId})`}
              />

              {/* 2. Top Cross-Fade Layer: Seamlessly fades in new emotion over 0.65s */}
              {topEmotion !== underEmotion && (
                <motion.path
                  key={`crossfade-compact-${fadeKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.65, ease: 'easeInOut' }}
                  d="
                    M 10, 80
                    q 18.8,-28 37.7,0
                    q 18.8,-28 37.7,0
                    q 18.8,-28 37.7,0
                    q 18.8,-28 37.7,0
                    q 18.8,-28 37.7,0
                    q 18.8,-28 37.7,0
                    q 18.8,-28 37.7,0
                    q 18.8,-28 37.7,0
                    q 18.8,-28 37.7,0
                    L 350, 205
                    Q 350, 255 300, 258
                    Q 180, 268 60, 258
                    Q 10, 255 10, 205
                    L 10, 80
                    Z
                  "
                  fill={getEmotionGradient(topEmotion, theme)}
                  filter={`url(#jellyGlow_top_${mascotId})`}
                />
              )}

              {/* 3. DYNAMIC INCOMING TRANSITION WAVE LAYER FOR COMPACT MASCOT */}
              {incomingEmotion && (
                <g clipPath={`url(#compactBodyClip_${mascotId})`}>
                  {transitionDirection === 'up' ? (
                    // DOPAMINE WAVE: Sweeps RISING UP (340 -> -40)
                    <motion.g
                      key={`up-c-${transitionKey}`}
                      initial={{ y: 340, opacity: 0.6 }}
                      animate={{
                        y: -40,
                        opacity: [0.6, 1, 1, 0],
                      }}
                      transition={{
                        y: { duration: 0.76, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.76, times: [0, 0.25, 0.75, 1], ease: 'easeOut' },
                      }}
                    >
                      <motion.path
                        d="
                          M -60, 0
                          q 55, -12 110, 0
                          q 55, 12 110, 0
                          q 55, -12 110, 0
                          q 55, 12 110, 0
                          q 55, -12 110, 0
                          L 490, 420
                          L -60, 420
                          Z
                        "
                        fill={getEmotionGradient(incomingEmotion, theme)}
                        filter={`url(#jellyGlow_top_${mascotId})`}
                        animate={{ x: [-35, 15, -35] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                      />
                      <motion.path
                        d="
                          M -60, 0
                          q 55, -12 110, 0
                          q 55, 12 110, 0
                          q 55, -12 110, 0
                          q 55, 12 110, 0
                          q 55, -12 110, 0
                        "
                        fill="none"
                        stroke="url(#liquidWaveRim)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        animate={{
                          x: [-35, 15, -35],
                        }}
                        transition={{
                          x: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
                        }}
                      />
                    </motion.g>
                  ) : (
                    // DEPRESSION WAVE: Sweeps FALLING DOWN (-340 -> 95)
                    <motion.g
                      key={`down-c-${transitionKey}`}
                      initial={{ y: -340, opacity: 0.6 }}
                      animate={{
                        y: 95,
                        opacity: [0.6, 1, 1, 0],
                      }}
                      transition={{
                        y: { duration: 0.78, ease: [0.35, 0, 0.25, 1] },
                        opacity: { duration: 0.78, times: [0, 0.25, 0.75, 1], ease: 'easeOut' },
                      }}
                    >
                      <motion.path
                        d="
                          M -60, -80
                          L 490, -80
                          L 490, 280
                          q -55, 12 -110, 0
                          q -55, -12 -110, 0
                          q -55, 12 -110, 0
                          q -55, -12 -110, 0
                          q -55, 12 -110, 0
                          Z
                        "
                        fill={getEmotionGradient(incomingEmotion, theme)}
                        filter={`url(#jellyGlow_top_${mascotId})`}
                        animate={{ x: [15, -35, 15] }}
                        transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                      />
                      <motion.path
                        d="
                          M 490, 280
                          q -55, 12 -110, 0
                          q -55, -12 -110, 0
                          q -55, 12 -110, 0
                          q -55, -12 -110, 0
                          q -55, 12 -110, 0
                        "
                        fill="none"
                        stroke="url(#liquidWaveRim)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        animate={{
                          x: [15, -35, 15],
                        }}
                        transition={{
                          x: { repeat: Infinity, duration: 2.0, ease: 'easeInOut' },
                        }}
                      />
                    </motion.g>
                  )}
                </g>
              )}

              {/* Subtle transparent bubbles inside compact header mascot */}
              <g opacity="0.28">
                <circle cx="50" cy="210" r="6" fill="url(#bubbleGloss)" />
                <circle cx="48" cy="208" r="1.5" fill="#ffffff" opacity="0.6" />
                <circle cx="310" cy="215" r="7" fill="url(#bubbleGloss)" />
                <circle cx="308" cy="213" r="1.8" fill="#ffffff" opacity="0.6" />
              </g>
            </g>
          )}

          {/* EXPRESSIVE EYEBROWS */}
          <g id="eyebrows">
            {isAngry ? (
              // Sharp furrowed angry brows slanted steeply inward
              <>
                <motion.path
                  d="M 96, 98 L 152, 122"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 264, 98 L 208, 122"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
              </>
            ) : isThinking ? (
              // Inquisitive thinking brows: right brow arched high up with curiosity, left brow tilted
              <>
                <motion.path
                  d="M 104, 114 Q 126, 118 148, 112"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 212, 110 Q 234, 84 256, 102"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </>
            ) : isSurprised ? (
              // High arched surprised wonder brows
              <>
                <motion.path
                  d="M 104, 96 Q 126, 82 148, 96"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 212, 96 Q 234, 82 256, 96"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </>
            ) : isBored ? (
              // Flat drooped sleepy/bored brows
              <>
                <motion.path
                  d="M 104, 116 L 148, 122"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 212, 122 L 256, 116"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </>
            ) : isSad ? (
              // Sad drooped downward tilted brows
              <>
                <motion.path
                  d="M 104, 122 L 148, 110"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 212, 110 L 256, 122"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </>
            ) : isHappy || isExcited || isCelebrating || isProud ? (
              // Joyful raised gentle curved happy brows
              <>
                <motion.path
                  d="M 104, 110 Q 126, 94 148, 110"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 212, 110 Q 234, 94 256, 110"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              // Relaxed soft curved idle brows
              <>
                <motion.path
                  d="M 106, 115 Q 126, 105 146, 115"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 214, 115 Q 234, 105 254, 115"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </>
            )}
          </g>

          {/* LEFT EYE */}
          <g id="leftEye">
            {isSleepy ? (
              // Sleepy closed eye curved peaceful line
              <motion.path
                d="M 104, 155 Q 126, 172 148, 155"
                fill="none"
                stroke="#0f172a"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            ) : isHappy ? (
              // Joyful crescent curve happy smiling eye
              <motion.path
                d="M 102, 158 Q 126, 134 150, 158"
                fill="none"
                stroke="#0f172a"
                strokeWidth="6"
                strokeLinecap="round"
              />
            ) : isGiggle ? (
              // Giggle closed squinting happy eye
              <motion.path
                d="M 104, 158 Q 126, 142 148, 158"
                fill="none"
                stroke="#0f172a"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            ) : (
              <>
                {/* White eyeball */}
                <ellipse cx="126" cy="155" rx="30" ry="46" fill="#ffffff" />

                {/* Eye Contents: Pupil + Eyelid Shutter */}
                <g clipPath={`url(#leftEyeClip_${mascotId})`}>
                  {/* Tracking Pupil */}
                  <motion.g
                    animate={{
                      x: pupilOffsetX,
                      y: pupilOffsetY,
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                  >
                    <ellipse
                      cx="126"
                      cy="155"
                      rx={isExcited ? 21 : isSurprised ? 23 : isBored ? 16 : 18}
                      ry={isExcited ? 29 : isSurprised ? 32 : isBored ? 20 : 26}
                      fill="#0f172a"
                    />
                    {/* Sparkle highlights inside pupil */}
                    {isExcited || isCelebrating ? (
                      <>
                        {/* 4-point sparkle star in pupil */}
                        <path
                          d="M 120, 140 Q 120, 144 116, 144 Q 120, 144 120, 148 Q 120, 144 124, 144 Q 120, 144 120, 140 Z"
                          fill="#ffffff"
                        />
                        <circle cx="132" cy="164" r="3.5" fill="#ffffff" opacity="0.9" />
                      </>
                    ) : (
                      <>
                        <circle cx="120" cy="144" r={5.5} fill="#ffffff" opacity="0.95" />
                        <circle cx="132" cy="164" r={2.8} fill="#ffffff" opacity="0.8" />
                      </>
                    )}
                  </motion.g>

                  {/* Eyelid Shutter: glides top-down for blink, or rests halfway for BORED sleepy eyes */}
                  <motion.g
                    initial={false}
                    animate={{
                      y: isBlinking ? 35 : isBored ? -35 : -125,
                    }}
                    transition={{
                      duration: isBlinking ? 0.12 : 0.25,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                  >
                    <path
                      d="M 90, 60 L 162, 60 L 162, 175 Q 126, 188 90, 175 Z"
                      fill={getEmotionGradient(topEmotion, theme)}
                    />
                    <path
                      d="M 90, 175 Q 126, 188 162, 175"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth={isBored ? '4' : '3.5'}
                      strokeLinecap="round"
                    />
                  </motion.g>

                  {/* Angry inward slanted eyelid crease */}
                  {isAngry && (
                    <path
                      d="M 92, 125 L 160, 150"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Sad outward slanted eyelid crease */}
                  {isSad && (
                    <path
                      d="M 92, 148 L 158, 126"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              </>
            )}
          </g>

          {/* RIGHT EYE */}
          <g id="rightEye">
            {isSleepy ? (
              // Sleepy closed eye curved peaceful line
              <motion.path
                d="M 212, 155 Q 234, 172 256, 155"
                fill="none"
                stroke="#0f172a"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            ) : isHappy ? (
              // Joyful crescent curve happy smiling eye
              <motion.path
                d="M 210, 158 Q 234, 134 258, 158"
                fill="none"
                stroke="#0f172a"
                strokeWidth="6"
                strokeLinecap="round"
              />
            ) : isGiggle ? (
              // Giggle closed squinting happy eye
              <motion.path
                d="M 212, 158 Q 234, 142 256, 158"
                fill="none"
                stroke="#0f172a"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            ) : isProud ? (
              // Proud cheeky winking right eye
              <motion.path
                d="M 214, 156 Q 234, 142 254, 156"
                fill="none"
                stroke="#0f172a"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            ) : (
              <>
                {/* White eyeball */}
                <ellipse cx="234" cy="155" rx="30" ry="46" fill="#ffffff" />

                {/* Eye Contents: Pupil + Eyelid Shutter */}
                <g clipPath={`url(#rightEyeClip_${mascotId})`}>
                  {/* Tracking Pupil */}
                  <motion.g
                    animate={{
                      x: pupilOffsetX,
                      y: pupilOffsetY,
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                  >
                    <ellipse
                      cx="234"
                      cy="155"
                      rx={isExcited ? 21 : isSurprised ? 23 : isBored ? 16 : 18}
                      ry={isExcited ? 29 : isSurprised ? 32 : isBored ? 20 : 26}
                      fill="#0f172a"
                    />
                    {isExcited || isCelebrating ? (
                      <>
                        <path
                          d="M 228, 140 Q 228, 144 224, 144 Q 228, 144 228, 148 Q 228, 144 232, 144 Q 228, 144 228, 140 Z"
                          fill="#ffffff"
                        />
                        <circle cx="240" cy="164" r="3.5" fill="#ffffff" opacity="0.9" />
                      </>
                    ) : (
                      <>
                        <circle cx="228" cy="144" r={5.5} fill="#ffffff" opacity="0.95" />
                        <circle cx="240" cy="164" r={2.8} fill="#ffffff" opacity="0.8" />
                      </>
                    )}
                  </motion.g>

                  {/* Eyelid Shutter: glides top-down for blink, or rests halfway for BORED sleepy eyes */}
                  <motion.g
                    initial={false}
                    animate={{
                      y: isBlinking ? 35 : isBored ? -35 : -125,
                    }}
                    transition={{
                      duration: isBlinking ? 0.12 : 0.25,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                  >
                    <path
                      d="M 198, 60 L 270, 60 L 270, 175 Q 234, 188 198, 175 Z"
                      fill={getEmotionGradient(topEmotion, theme)}
                    />
                    <path
                      d="M 198, 175 Q 234, 188 270, 175"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth={isBored ? '4' : '3.5'}
                      strokeLinecap="round"
                    />
                  </motion.g>

                  {/* Angry inward slanted eyelid crease */}
                  {isAngry && (
                    <path
                      d="M 268, 125 L 200, 150"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Sad outward slanted eyelid crease */}
                  {isSad && (
                    <path
                      d="M 268, 148 L 202, 126"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              </>
            )}
          </g>

          {/* CHEEKS / BLUSH (PIPI MERONA BERWARNA SESUAI EMOSI) */}
          <g id="cheeks">
            {/* Left Cheek */}
            <motion.ellipse
              cx="92"
              cy="182"
              rx={isExcited ? 22 : isAngry ? 24 : isHappy ? 20 : 17}
              ry={isExcited ? 13 : isAngry ? 15 : isHappy ? 12 : 10}
              fill={
                isAngry
                  ? '#f43f5e'
                  : isExcited
                  ? '#f472b6'
                  : isHappy
                  ? '#fbbf24'
                  : isThinking
                  ? '#22d3ee'
                  : isCelebrating
                  ? '#34d399'
                  : isSurprised
                  ? '#fb923c'
                  : isProud
                  ? '#fde047'
                  : isGiggle
                  ? '#fda4af'
                  : isBored
                  ? '#c084fc'
                  : '#38bdf8'
              }
              opacity={
                isAngry
                  ? 0.85
                  : isExcited
                  ? 0.8
                  : isHappy
                  ? 0.7
                  : isThinking
                  ? 0.55
                  : isCelebrating || isGiggle
                  ? 0.75
                  : isProud
                  ? 0.65
                  : isBored
                  ? 0.35
                  : 0.4
              }
              animate={
                isExcited || isHappy
                  ? { scale: [1, 1.15, 1], opacity: [0.7, 0.9, 0.7] }
                  : isAngry
                  ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            />
            {/* Right Cheek */}
            <motion.ellipse
              cx="268"
              cy="182"
              rx={isExcited ? 22 : isAngry ? 24 : isHappy ? 20 : 17}
              ry={isExcited ? 13 : isAngry ? 15 : isHappy ? 12 : 10}
              fill={
                isAngry
                  ? '#f43f5e'
                  : isExcited
                  ? '#f472b6'
                  : isHappy
                  ? '#fbbf24'
                  : isThinking
                  ? '#22d3ee'
                  : isCelebrating
                  ? '#34d399'
                  : isSurprised
                  ? '#fb923c'
                  : isProud
                  ? '#fde047'
                  : isGiggle
                  ? '#fda4af'
                  : isBored
                  ? '#c084fc'
                  : '#38bdf8'
              }
              opacity={
                isAngry
                  ? 0.85
                  : isExcited
                  ? 0.8
                  : isHappy
                  ? 0.7
                  : isThinking
                  ? 0.55
                  : isCelebrating || isGiggle
                  ? 0.75
                  : isProud
                  ? 0.65
                  : isBored
                  ? 0.35
                  : 0.4
              }
              animate={
                isExcited || isHappy
                  ? { scale: [1, 1.15, 1], opacity: [0.7, 0.9, 0.7] }
                  : isAngry
                  ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            />
          </g>

          {/* MOUTH & EXPRESSIONS */}
          <g id="mouth">
            {isTalking ? (
              talkingFrame % 2 === 0 ? (
                <path d="M 170, 234 Q 192, 258 214, 222 Q 192, 234 170, 234 Z" fill="#0f172a" />
              ) : (
                <path d="M 172, 230 Q 192, 245 214, 218" fill="none" stroke="#0f172a" strokeWidth="7.5" strokeLinecap="round" />
              )
            ) : isAngry ? (
              // Angry downturned pouty mouth
              <motion.path
                d="M 164, 242 Q 178, 226 192, 236 Q 206, 226 220, 242"
                fill="none"
                stroke="#0f172a"
                strokeWidth="7.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
            ) : isBored ? (
              // Bored wavy flat mouth line
              <motion.path
                d="M 172, 234 Q 182, 231 192, 235 Q 202, 239 212, 234"
                fill="none"
                stroke="#0f172a"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
            ) : isSleepy ? (
              // Sleepy soft curved gentle mouth
              <motion.path
                d="M 180, 235 Q 192, 242 204, 235"
                fill="none"
                stroke="#0f172a"
                strokeWidth="5"
                strokeLinecap="round"
              />
            ) : isGiggle ? (
              // Giggle open vibrating grin
              <g>
                <path d="M 170, 224 Q 192, 258 214, 224 Z" fill="#0f172a" />
                <path d="M 182, 242 Q 192, 256 202, 242 Z" fill="#ff4081" />
              </g>
            ) : isProud ? (
              // Proud cheeky confident smirk
              <path
                d="M 178, 230 Q 198, 242 222, 220"
                fill="none"
                stroke="#0f172a"
                strokeWidth="7"
                strokeLinecap="round"
              />
            ) : isThinking ? (
              // Thinking pensive/curious mouth curve
              <motion.path
                d="M 176, 234 Q 194, 226 210, 238"
                fill="none"
                stroke="#0f172a"
                strokeWidth="6.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
            ) : isCelebrating ? (
              // Celebrating joyful wide cheering grin with pink tongue
              <g>
                <path d="M 164, 220 Q 192, 268 220, 220 Z" fill="#0f172a" />
                <path d="M 178, 242 Q 192, 264 206, 242 Z" fill="#ff4081" />
              </g>
            ) : isHappy ? (
              // Happy wide open joyful mouth with pink tongue
              <g>
                <path d="M 166, 224 Q 192, 262 218, 224 Q 192, 234 166, 224 Z" fill="#0f172a" />
                <path d="M 180, 240 Q 192, 256 204, 240 Z" fill="#ff4081" />
              </g>
            ) : isExcited ? (
              // Excited open cheering/eating mouth
              <g>
                <path d="M 166, 222 Q 192, 264 218, 222 Z" fill="#0f172a" />
                <path d="M 180, 240 Q 192, 258 204, 240 Z" fill="#ff4081" />
              </g>
            ) : isSurprised ? (
              // Surprised round "O" mouth
              <circle cx="192" cy="236" r="11" fill="#0f172a" />
            ) : isSad ? (
              <path d="M 168, 238 Q 192, 222 216, 238" fill="none" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
            ) : (
              // Default calm gentle sweet smile
              <path d="M 174, 230 Q 192, 244 210, 230" fill="none" stroke="#0f172a" strokeWidth="6.5" strokeLinecap="round" />
            )}
          </g>

          {/* EMOTION MICRO-EFFECT OVERLAYS */}
          {/* 1. Sleepy floating Zzz */}
          {isSleepy && (
            <motion.g
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: [-5, -35], x: [0, 12, 18], scale: [0.6, 1, 1.2] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeOut' }}
            >
              <text x="245" y="112" fill="#818cf8" fontSize="22" fontWeight="bold" fontFamily="sans-serif">
                Zzz...
              </text>
            </motion.g>
          )}

          {/* 2. Angry steam puff marks */}
          {isAngry && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.08, 0.95] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
            >
              <path d="M 82, 94 L 94, 106 M 94, 94 L 82, 106" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />
              <path d="M 266, 94 L 278, 106 M 278, 94 L 266, 106" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />
            </motion.g>
          )}

          {/* 3. Thinking idea sparkle */}
          {isThinking && (
            <motion.g
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: [0.95, 1.05, 0.95], rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              <circle cx="270" cy="94" r="9" fill="#22d3ee" opacity="0.85" />
              <text x="266" y="99" fill="#0891b2" fontSize="13" fontWeight="black">?</text>
            </motion.g>
          )}

          {/* 4. Proud victory star */}
          {isProud && (
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            >
              <text x="268" y="96" fontSize="17">✨</text>
            </motion.g>
          )}
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
