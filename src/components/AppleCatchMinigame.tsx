import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { MascotTheme } from '../types';
import {
  AppleCatchGameState,
  FallingItem,
  AppleType,
  CatchParticle,
  FloatingScore,
  CingcauMascotEmotion,
} from '../types/appleCatch';
import { appleCatchAudio } from '../utils/appleCatchAudio';
import { CingcauGameMascot } from './appleCatch/CingcauGameMascot';
import {
  RedAppleSVG,
  GoldenAppleSVG,
  RottenAppleSVG,
  StarItemSVG,
  HeartLifeSVG,
  OrchardTreeSVG,
  CloudSVG,
} from './appleCatch/AppleCatchSVGAssets';
import { StartMenu } from './appleCatch/StartMenu';
import { HowToPlayModal } from './appleCatch/HowToPlayModal';
import { PauseMenu } from './appleCatch/PauseMenu';
import { GameOverModal } from './appleCatch/GameOverModal';
import { LevelCompleteModal } from './appleCatch/LevelCompleteModal';

interface AppleCatchMinigameProps {
  mascotTheme?: MascotTheme;
  onClose: (earnedFood: number, earnedStars: number) => void;
}

const STORAGE_KEY_HIGHSCORE = 'cingcau_apple_catch_highscore';
const STORAGE_KEY_MUTED = 'cingcau_apple_catch_muted';

export const AppleCatchMinigame: React.FC<AppleCatchMinigameProps> = ({
  mascotTheme = 'cyan-jelly',
  onClose,
}) => {
  // Game Flow State
  const [gameState, setGameState] = useState<AppleCatchGameState>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIGHSCORE);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60-second round
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
    } catch {
      return false;
    }
  });
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(1);

  // Mascot Animation States
  const [mascotX, setMascotX] = useState<number>(50); // percentage (0 - 100)
  const [mascotEmotion, setMascotEmotion] = useState<CingcauMascotEmotion>('idle');
  const [moveDirection, setMoveDirection] = useState<'left' | 'right' | 'idle'>('idle');
  const [isSquishing, setIsSquishing] = useState<boolean>(false);
  const [isDamaged, setIsDamaged] = useState<boolean>(false);
  const [nearestApplePos, setNearestApplePos] = useState<{ relX: number; relY: number }>({ relX: 0, relY: 0 });

  // Items, Particles, Floating Labels
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [particles, setParticles] = useState<CatchParticle[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  // Engine Refs
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const timeLeftRef = useRef<number>(60);
  const scoreRef = useRef<number>(0);
  const keysPressedRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const touchDirectionRef = useRef<'left' | 'right' | null>(null);
  const mascotTargetXRef = useRef<number>(50);
  const mascotCurrentXRef = useRef<number>(50);

  // Sync Audio Engine Mute State
  useEffect(() => {
    appleCatchAudio.setMuted(isMuted);
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(isMuted));
    } catch {}
  }, [isMuted]);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (!next) appleCatchAudio.playClick();
  };

  // Start / Restart Game Session
  const startNewGame = useCallback(() => {
    appleCatchAudio.playClick();
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    setTimeLeft(60);
    timeLeftRef.current = 60;
    setIsNewRecord(false);
    setFallingItems([]);
    setParticles([]);
    setFloatingScores([]);
    setMascotX(50);
    mascotCurrentXRef.current = 50;
    mascotTargetXRef.current = 50;
    setMascotEmotion('idle');
    setIsSquishing(false);
    setIsDamaged(false);
    spawnTimerRef.current = 0;
    lastTimeRef.current = performance.now();
    setGameState('playing');
  }, []);

  // Spawn a new falling item
  const spawnItem = (id: number): FallingItem => {
    const rand = Math.random();
    let type: AppleType = 'red_apple';
    let speed = 26 + Math.random() * 12; // base fall speed in % per second

    if (rand < 0.15) {
      type = 'golden_apple';
      speed = 34 + Math.random() * 10;
    } else if (rand < 0.28) {
      type = 'rotten_apple';
      speed = 28 + Math.random() * 14;
    } else if (rand < 0.36) {
      type = 'star_cincau';
      speed = 32 + Math.random() * 8;
    }

    return {
      id,
      type,
      x: 10 + Math.random() * 80, // keep within safe bounds
      y: -8,
      speed,
      rotation: (Math.random() - 0.5) * 30,
      rotationSpeed: (Math.random() - 0.5) * 40,
      size: type === 'star_cincau' ? 42 : 48,
    };
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressedRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressedRef.current.right = true;
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressedRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressedRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Pointer / Touch Dragging Handler directly across game arena
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    mascotTargetXRef.current = Math.max(12, Math.min(88, relativeX));
  };

  // Trigger Squish Effect upon Catching
  const triggerCatchSquish = () => {
    setIsSquishing(true);
    setMascotEmotion('happy_catch');
    setTimeout(() => {
      setIsSquishing(false);
      setMascotEmotion('idle');
    }, 420);
  };

  // Trigger Damage Recoil upon Hitting Rotten Fruit
  const triggerDamageRecoil = () => {
    setIsDamaged(true);
    setMascotEmotion('recoil_damage');
    setTimeout(() => {
      setIsDamaged(false);
      setMascotEmotion('idle');
    }, 480);
  };

  // Main 60FPS Game Physics & Collision Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    let nextItemId = Date.now();
    let secondAccumulator = 0;

    const gameLoop = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      // 1. Countdown timer
      secondAccumulator += deltaTime;
      if (secondAccumulator >= 1) {
        secondAccumulator -= 1;
        timeLeftRef.current -= 1;
        const currentSec = Math.max(0, timeLeftRef.current);
        setTimeLeft(currentSec);

        // Check level victory condition
        if (currentSec <= 0) {
          const finalScore = scoreRef.current;
          let stars = 1;
          if (finalScore >= 35) stars = 3;
          else if (finalScore >= 20) stars = 2;
          setStarsEarned(stars);

          // Update highscore
          setHighScore((prevHigh) => {
            const newBest = Math.max(prevHigh, finalScore);
            try {
              localStorage.setItem(STORAGE_KEY_HIGHSCORE, String(newBest));
            } catch {}
            return newBest;
          });

          appleCatchAudio.playLevelComplete();
          setGameState('levelcomplete');
          return; // Stop animation loop for this round
        }
      }

      // 2. Mascot Smooth Horizontal Movement
      const keyboardSpeed = 68; // % per second
      if (keysPressedRef.current.left || touchDirectionRef.current === 'left') {
        mascotTargetXRef.current = Math.max(12, mascotTargetXRef.current - keyboardSpeed * deltaTime);
        setMoveDirection('left');
      } else if (keysPressedRef.current.right || touchDirectionRef.current === 'right') {
        mascotTargetXRef.current = Math.min(88, mascotTargetXRef.current + keyboardSpeed * deltaTime);
        setMoveDirection('right');
      } else {
        setMoveDirection('idle');
      }

      // Smooth Lerp toward target X
      const lerpSpeed = 16 * deltaTime;
      mascotCurrentXRef.current += (mascotTargetXRef.current - mascotCurrentXRef.current) * Math.min(1, lerpSpeed);
      const curX = mascotCurrentXRef.current;
      setMascotX(curX);

      // 3. Falling Items Spawning
      spawnTimerRef.current += deltaTime;
      const spawnInterval = Math.max(0.65, 1.25 - (60 - timeLeftRef.current) * 0.008); // slightly faster over time
      if (spawnTimerRef.current >= spawnInterval) {
        spawnTimerRef.current = 0;
        setFallingItems((prev) => [...prev, spawnItem(nextItemId++)]);
      }

      // 4. Update Falling Items & Collision Detection
      const catcherY = 82; // Cingcau top catching rim is around 82% from top
      const catcherCatchWidth = 14; // Catching hitbox width in %

      setFallingItems((prevItems) => {
        let nearestXDiff = 0;
        let nearestDist = 999;

        const updated: FallingItem[] = [];
        const newParticles: CatchParticle[] = [];
        const newFloatingScores: FloatingScore[] = [];

        for (const item of prevItems) {
          const nextY = item.y + item.speed * deltaTime;
          const nextRotation = item.rotation + item.rotationSpeed * deltaTime;

          // Track nearest apple for Cingcau's googly eye gaze
          if (nextY < catcherY && nextY > 10) {
            const dist = Math.hypot(item.x - curX, nextY - catcherY);
            if (dist < nearestDist) {
              nearestDist = dist;
              nearestXDiff = (item.x - curX) / 25; // normalized -1 to 1
            }
          }

          // Collision Detection with Cingcau's Top Catching Rim
          const isAtCatcherHeight = nextY >= catcherY - 4 && nextY <= catcherY + 7;
          const isWithinCatcherX = Math.abs(item.x - curX) <= catcherCatchWidth;

          if (isAtCatcherHeight && isWithinCatcherX) {
            // Collision Occurred!
            if (item.type === 'red_apple') {
              appleCatchAudio.playCatchRed();
              triggerCatchSquish();
              scoreRef.current += 1;
              setScore(scoreRef.current);
              newFloatingScores.push({ id: Math.random(), text: '+1', x: item.x, y: item.y, color: '#EF3844', opacity: 1 });
              // Spawn red & sparkle particles
              for (let i = 0; i < 8; i++) {
                newParticles.push({
                  id: Math.random(),
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 40,
                  vy: -15 - Math.random() * 25,
                  color: i % 2 === 0 ? '#FF6B75' : '#8CE07E',
                  size: 6 + Math.random() * 4,
                  opacity: 1,
                  shape: i % 3 === 0 ? 'leaf' : 'circle',
                });
              }
            } else if (item.type === 'golden_apple') {
              appleCatchAudio.playCatchGold();
              triggerCatchSquish();
              scoreRef.current += 3;
              setScore(scoreRef.current);
              newFloatingScores.push({ id: Math.random(), text: '+3 ✨', x: item.x, y: item.y, color: '#F59E0B', opacity: 1 });
              // Golden sparkles
              for (let i = 0; i < 12; i++) {
                newParticles.push({
                  id: Math.random(),
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 60,
                  vy: -20 - Math.random() * 30,
                  color: '#FFD54F',
                  size: 8 + Math.random() * 6,
                  opacity: 1,
                  shape: 'star',
                });
              }
            } else if (item.type === 'star_cincau') {
              appleCatchAudio.playCatchStar();
              triggerCatchSquish();
              scoreRef.current += 5;
              setScore(scoreRef.current);
              newFloatingScores.push({ id: Math.random(), text: '+5 🌟', x: item.x, y: item.y, color: '#38BDF8', opacity: 1 });
              for (let i = 0; i < 14; i++) {
                newParticles.push({
                  id: Math.random(),
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 70,
                  vy: -25 - Math.random() * 35,
                  color: '#38BDF8',
                  size: 8 + Math.random() * 5,
                  opacity: 1,
                  shape: 'star',
                });
              }
            } else if (item.type === 'rotten_apple') {
              // Danger! Hit Rotten Fruit
              appleCatchAudio.playDamage();
              triggerDamageRecoil();
              newFloatingScores.push({ id: Math.random(), text: '-1 💔', x: item.x, y: item.y, color: '#7E57C2', opacity: 1 });
              setLives((l) => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  appleCatchAudio.playGameOver();
                  setGameState('gameover');
                }
                return Math.max(0, nextLives);
              });
            }
            continue; // Remove caught item
          }

          // Item Missed / Reached Bottom Ground
          if (nextY > 96) {
            if (item.type === 'red_apple') {
              appleCatchAudio.playMiss();
              // Missed fresh apple penalty (gentle life loss after multiple misses or warning)
              setLives((l) => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  appleCatchAudio.playGameOver();
                  setGameState('gameover');
                }
                return Math.max(0, nextLives);
              });
            }
            continue; // Remove fallen item
          }

          updated.push({
            ...item,
            y: nextY,
            rotation: nextRotation,
          });
        }

        // Update Nearest Apple for Mascot Pupils
        setNearestApplePos({ relX: nearestXDiff, relY: 0.5 });

        // Add new particles and scores
        if (newParticles.length > 0) {
          setParticles((p) => [...p, ...newParticles]);
        }
        if (newFloatingScores.length > 0) {
          setFloatingScores((f) => [...f, ...newFloatingScores]);
        }

        return updated;
      });

      // 5. Update Particle Lifecycles
      setParticles((prevP) =>
        prevP
          .map((p) => ({
            ...p,
            x: p.x + p.vx * deltaTime * 0.1,
            y: p.y + p.vy * deltaTime * 0.1,
            opacity: p.opacity - deltaTime * 1.6,
          }))
          .filter((p) => p.opacity > 0)
      );

      // 6. Update Floating Scores
      setFloatingScores((prevF) =>
        prevF
          .map((f) => ({
            ...f,
            y: f.y - 12 * deltaTime,
            opacity: f.opacity - deltaTime * 1.2,
          }))
          .filter((f) => f.opacity > 0)
      );

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState]);

  // Update & Check High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setIsNewRecord(true);
      try {
        localStorage.setItem(STORAGE_KEY_HIGHSCORE, String(score));
      } catch {}
    }
  }, [score, highScore]);

  // Return to start or exit to parent app
  const handleExitGame = () => {
    appleCatchAudio.playClick();
    // Grant collected fruits & stars to the main companion app
    const earnedFood = Math.max(1, Math.floor(score / 4));
    const earnedStars = Math.max(1, Math.floor(score / 8));
    onClose(earnedFood, earnedStars);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-0 tablet:p-4 select-none">
      {/* Game Responsive Capsule Container */}
      <div
        ref={gameAreaRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-full tablet:max-w-[560px] tablet-lg:max-w-[680px] tablet:max-h-[880px] bg-gradient-to-b from-[#BDEBFF] via-[#E1F7FF] to-[#A8E685] rounded-none tablet:rounded-[36px] overflow-hidden shadow-2xl border-0 tablet:border-4 tablet:border-white/90 flex flex-col justify-between"
      >
        {/* ================= SCREEN A: START MENU ================= */}
        <AnimatePresence>
          {gameState === 'start' && (
            <motion.div
              key="start-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40"
            >
              <StartMenu
                onStartGame={startNewGame}
                onOpenHowToPlay={() => {
                  appleCatchAudio.playClick();
                  setGameState('tutorial');
                }}
                highScore={highScore}
                isMuted={isMuted}
                onToggleSound={toggleSound}
                onCloseGame={handleExitGame}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= SCREEN B: HOW TO PLAY ================= */}
        <AnimatePresence>
          {gameState === 'tutorial' && (
            <motion.div
              key="tutorial-modal"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="absolute inset-0 z-40"
            >
              <HowToPlayModal
                onBack={() => {
                  appleCatchAudio.playClick();
                  setGameState('start');
                }}
                onStartGame={startNewGame}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= SCREEN C: MAIN GAMEPLAY SCENE ================= */}
        {/* Background Environment Layers */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Moving Clouds */}
          <motion.div
            animate={{ x: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
            className="absolute top-10 left-4 opacity-75"
          >
            <CloudSVG width={110} />
          </motion.div>
          <motion.div
            animate={{ x: [15, -15, 15] }}
            transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
            className="absolute top-16 right-4 opacity-70"
          >
            <CloudSVG width={95} />
          </motion.div>

          {/* Distant Hills & Trees */}
          <div className="absolute bottom-16 -left-10 opacity-80">
            <OrchardTreeSVG size={120} />
          </div>
          <div className="absolute bottom-16 -right-10 opacity-80">
            <OrchardTreeSVG size={120} />
          </div>

          {/* Rolling Orchard Ground */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#70B84D] to-[#8BC34A] rounded-t-[32px] border-t-4 border-[#A0D468]" />
        </div>

        {/* TOP HUD: Live Score, Highscore, Lives, Timer, Pause */}
        <div className="relative z-20 w-full px-4 pt-3 pb-2 flex items-center justify-between pointer-events-auto">
          {/* Left: Score & Timer */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-red-300 shadow-sm flex items-center gap-1.5">
              <span className="text-lg tablet:text-xl">🍎</span>
              <span className="text-sm tablet:text-base font-black text-red-600">{score}</span>
            </div>

            <div className="px-3 py-1.5 rounded-2xl bg-white/90 border-2 border-sky-200 shadow-sm text-xs tablet:text-sm font-black text-sky-800">
              ⏱️ {timeLeft}s
            </div>
          </div>

          {/* Right: 3 Lives & Pause Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-white/90 border-2 border-rose-200 shadow-sm">
              {[1, 2, 3].map((heartIdx) => (
                <HeartLifeSVG key={heartIdx} active={heartIdx <= lives} size={24} />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                appleCatchAudio.playClick();
                setGameState('paused');
              }}
              className="p-2 tablet:p-2.5 rounded-2xl bg-white/95 border-2 border-neutral-300 text-neutral-700 shadow-sm hover:bg-white cursor-pointer active:scale-95 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Jeda Permainan"
            >
              <Pause className="w-5 h-5 fill-neutral-700" />
            </motion.button>
          </div>
        </div>

        {/* FALLING ITEMS LAYER */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {fallingItems.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              }}
            >
              {item.type === 'red_apple' && <RedAppleSVG size={item.size} />}
              {item.type === 'golden_apple' && <GoldenAppleSVG size={item.size} />}
              {item.type === 'rotten_apple' && <RottenAppleSVG size={item.size} />}
              {item.type === 'star_cincau' && <StarItemSVG size={item.size} />}
            </div>
          ))}

          {/* BURST PARTICLES */}
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.shape !== 'leaf' ? p.color : undefined,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                opacity: p.opacity,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {p.shape === 'star' && <span className="text-xs">✨</span>}
              {p.shape === 'leaf' && <span className="text-xs">🍃</span>}
            </div>
          ))}

          {/* FLOATING SCORE LABELS (+1, +3, -1) */}
          {floatingScores.map((f) => (
            <div
              key={f.id}
              style={{
                position: 'absolute',
                left: `${f.x}%`,
                top: `${f.y}%`,
                color: f.color,
                opacity: f.opacity,
                transform: 'translate(-50%, -50%)',
              }}
              className="font-black text-lg tablet:text-xl drop-shadow-md pointer-events-none"
            >
              {f.text}
            </div>
          ))}
        </div>

        {/* ACTIVE CINGCAU MASCOT (THE CATCHER) */}
        <div
          className="absolute z-20 pointer-events-none transition-none"
          style={{
            left: `${mascotX}%`,
            bottom: '44px',
            transform: 'translateX(-50%)',
          }}
        >
          <CingcauGameMascot
            emotion={mascotEmotion}
            targetAppleRelativeX={nearestApplePos.relX}
            targetAppleRelativeY={nearestApplePos.relY}
            moveDirection={moveDirection}
            isSquishing={isSquishing}
            isDamaged={isDamaged}
            size={112}
          />
        </div>

        {/* ON-SCREEN MOBILE TOUCH CONTROLS (Bottom Corners) */}
        <div className="relative z-20 w-full px-4 pb-3 flex justify-between items-center pointer-events-auto">
          <button
            onPointerDown={() => {
              touchDirectionRef.current = 'left';
            }}
            onPointerUp={() => {
              touchDirectionRef.current = null;
            }}
            onPointerLeave={() => {
              touchDirectionRef.current = null;
            }}
            className="w-14 h-14 rounded-2xl bg-white/90 active:bg-white border-3 border-sky-300 text-sky-800 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition-transform touch-none"
            title="Geser Kiri"
          >
            <ChevronLeft className="w-8 h-8 stroke-[3]" />
          </button>

          <span className="text-[10px] tablet:text-xs font-bold text-emerald-950/70 bg-white/70 px-3 py-1 rounded-full pointer-events-none">
            Geser Layar / Tombol Panah
          </span>

          <button
            onPointerDown={() => {
              touchDirectionRef.current = 'right';
            }}
            onPointerUp={() => {
              touchDirectionRef.current = null;
            }}
            onPointerLeave={() => {
              touchDirectionRef.current = null;
            }}
            className="w-14 h-14 rounded-2xl bg-white/90 active:bg-white border-3 border-sky-300 text-sky-800 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition-transform touch-none"
            title="Geser Kanan"
          >
            <ChevronRight className="w-8 h-8 stroke-[3]" />
          </button>
        </div>

        {/* ================= SCREEN D: PAUSE MENU ================= */}
        <AnimatePresence>
          {gameState === 'paused' && (
            <PauseMenu
              onResume={() => {
                appleCatchAudio.playClick();
                lastTimeRef.current = performance.now();
                setGameState('playing');
              }}
              onRestart={startNewGame}
              onReturnToMenu={() => {
                appleCatchAudio.playClick();
                setGameState('start');
              }}
              isMuted={isMuted}
              onToggleSound={toggleSound}
              currentScore={score}
            />
          )}
        </AnimatePresence>

        {/* ================= SCREEN E: GAME OVER MODAL ================= */}
        <AnimatePresence>
          {gameState === 'gameover' && (
            <GameOverModal
              score={score}
              highScore={highScore}
              isNewRecord={isNewRecord}
              onRetry={startNewGame}
              onReturnToMenu={() => {
                appleCatchAudio.playClick();
                setGameState('start');
              }}
            />
          )}
        </AnimatePresence>

        {/* ================= SCREEN F: LEVEL COMPLETE MODAL ================= */}
        <AnimatePresence>
          {gameState === 'levelcomplete' && (
            <LevelCompleteModal
              score={score}
              highScore={highScore}
              starsEarned={starsEarned}
              onPlayAgain={startNewGame}
              onReturnToMenu={() => {
                appleCatchAudio.playClick();
                setGameState('start');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
