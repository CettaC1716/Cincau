import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { CingcauMascotEmotion } from '../../types/appleCatch';

interface CingcauGameMascotProps {
  emotion?: CingcauMascotEmotion;
  targetAppleRelativeX?: number; // -1 (left) to 1 (right) relative to Cingcau
  targetAppleRelativeY?: number; // 0 (overhead) to 1 (low)
  moveDirection?: 'left' | 'right' | 'idle';
  isSquishing?: boolean; // triggered upon catching apple
  isDamaged?: boolean;   // triggered upon hitting rotten fruit
  size?: number;
  className?: string;
}

export const CingcauGameMascot: React.FC<CingcauGameMascotProps> = ({
  emotion = 'idle',
  targetAppleRelativeX = 0,
  targetAppleRelativeY = 0,
  moveDirection = 'idle',
  isSquishing = false,
  isDamaged = false,
  size = 120,
  className = '',
}) => {
  // Eye pupil tracking math: pupils gaze toward the nearest apple
  const pupilOffset = useMemo(() => {
    if (emotion === 'recoil_damage') return { x: 0, y: -2 };
    if (emotion === 'disappointed') return { x: 0, y: 6 };
    if (emotion === 'celebrating') return { x: 0, y: -4 };

    // Clamped tracking offsets
    const rawX = targetAppleRelativeX * 8;
    const rawY = targetAppleRelativeY * 6 - 2;
    return {
      x: Math.max(-8, Math.min(8, rawX)),
      y: Math.max(-6, Math.min(6, rawY)),
    };
  }, [emotion, targetAppleRelativeX, targetAppleRelativeY]);

  // Movement body tilt
  const tiltAngle = moveDirection === 'left' ? -8 : moveDirection === 'right' ? 8 : 0;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`} style={{ width: size }}>
      {/* Dynamic Ground Shadow */}
      <motion.div
        animate={{
          scaleX: isSquishing ? 1.3 : isDamaged ? 0.9 : [0.95, 1.05, 0.95],
          opacity: [0.35, 0.45, 0.35],
        }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="w-[85%] h-3.5 bg-neutral-900/20 rounded-full blur-[2px] absolute -bottom-1"
      />

      {/* Mascot Main Body Container with Squash & Stretch */}
      <motion.div
        animate={
          isDamaged
            ? {
                x: [-8, 8, -6, 6, -3, 3, 0],
                y: [0, -6, 4, 0],
                rotate: [0, -10, 10, -5, 5, 0],
                scaleY: [1, 0.85, 1.15, 0.95, 1],
                scaleX: [1, 1.15, 0.85, 1.05, 1],
              }
            : isSquishing
            ? {
                scaleY: [1, 0.72, 1.18, 0.92, 1],
                scaleX: [1, 1.25, 0.86, 1.06, 1],
                y: [0, 8, -6, 2, 0],
              }
            : emotion === 'celebrating'
            ? {
                y: [0, -18, 0, -12, 0],
                rotate: [0, 4, -4, 2, 0],
                scaleY: [1, 1.12, 0.92, 1.06, 1],
                scaleX: [1, 0.92, 1.08, 0.96, 1],
              }
            : {
                y: [0, -4, 0],
                rotate: tiltAngle,
                scaleY: [1, 1.03, 0.98, 1],
                scaleX: [1, 0.98, 1.02, 1],
              }
        }
        transition={
          isDamaged
            ? { duration: 0.45 }
            : isSquishing
            ? { duration: 0.42, ease: [0.175, 0.885, 0.32, 1.275] }
            : emotion === 'celebrating'
            ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 2.4, ease: 'easeInOut' }
        }
        className="relative w-full h-auto flex justify-center"
      >
        <svg
          viewBox="0 0 160 160"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible filter drop-shadow-md"
        >
          <defs>
            {/* Primary Cingcau Body Jelly Gradient (Vibrant Sky Cyan / Emerald) */}
            <linearGradient id="cingcauBodyGrad" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#48CAE4" />
              <stop offset="40%" stopColor="#00B4D8" />
              <stop offset="85%" stopColor="#0096C7" />
              <stop offset="100%" stopColor="#023E8A" />
            </linearGradient>

            {/* Damage Body Tint */}
            <linearGradient id="cingcauDamagedGrad" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F77F00" />
              <stop offset="50%" stopColor="#D62828" />
              <stop offset="100%" stopColor="#9D0208" />
            </linearGradient>

            {/* Glossy Top Catching Surface Highlight */}
            <linearGradient id="topCatchingSurface" x1="30" y1="25" x2="130" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Cheek Blush Gradient */}
            <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF70A6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FF70A6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Tiny Cute Little Feet */}
          <rect x="42" y="132" width="22" height="14" rx="7" fill="#0077B6" />
          <rect x="96" y="132" width="22" height="14" rx="7" fill="#0077B6" />

          {/* MAIN SQUISHY CUBE BODY (Rounded Square with organic curves) */}
          <rect
            x="22"
            y="26"
            width="116"
            height="112"
            rx="36"
            fill={isDamaged ? 'url(#cingcauDamagedGrad)' : 'url(#cingcauBodyGrad)'}
          />

          {/* TOP AREA CATCHING RIM HIGHLIGHT (The visual target where apples land) */}
          <path
            d="M34 46 C34 32, 54 28, 80 28 C106 28, 126 32, 126 46 C126 36, 106 32, 80 32 C54 32, 34 36, 34 46 Z"
            fill="#FFFFFF"
            opacity="0.65"
          />

          {/* Subsurface Jelly Glow Ellipse */}
          <ellipse cx="80" cy="52" rx="46" ry="16" fill="url(#topCatchingSurface)" />

          {/* Specular Edge Highlights */}
          <path
            d="M32 50 C30 75, 30 105, 42 120"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* GOOGLY EYES & PUPILS */}
          {/* Left Eyeball */}
          <g transform="translate(48, 68)">
            <ellipse cx="0" cy="0" rx="16" ry="19" fill="#FFFFFF" />
            {/* Pupil */}
            <motion.g
              animate={{
                x: pupilOffset.x,
                y: pupilOffset.y,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            >
              <circle cx="0" cy="0" r="8.5" fill="#1A1A24" />
              <circle cx="-3" cy="-3.5" r="3.2" fill="#FFFFFF" />
              <circle cx="3" cy="2.5" r="1.5" fill="#FFFFFF" />
            </motion.g>
          </g>

          {/* Right Eyeball */}
          <g transform="translate(112, 68)">
            <ellipse cx="0" cy="0" rx="16" ry="19" fill="#FFFFFF" />
            {/* Pupil */}
            <motion.g
              animate={{
                x: pupilOffset.x,
                y: pupilOffset.y,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            >
              <circle cx="0" cy="0" r="8.5" fill="#1A1A24" />
              <circle cx="-3" cy="-3.5" r="3.2" fill="#FFFFFF" />
              <circle cx="3" cy="2.5" r="1.5" fill="#FFFFFF" />
            </motion.g>
          </g>

          {/* EYEBROWS / EXAGGERATED EMOTIONS */}
          {emotion === 'recoil_damage' ? (
            // Angry/Hurt slanted eyebrows
            <g>
              <path d="M36 50 L58 56" stroke="#03045E" strokeWidth="4" strokeLinecap="round" />
              <path d="M124 50 L102 56" stroke="#03045E" strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : emotion === 'worried' || emotion === 'disappointed' ? (
            // Worried sad arched eyebrows
            <g>
              <path d="M38 54 Q48 48 58 52" stroke="#03045E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M102 52 Q112 48 122 54" stroke="#03045E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : emotion === 'happy_catch' || emotion === 'celebrating' ? (
            // Excited arched eyebrows lifted high
            <g>
              <path d="M38 46 Q48 40 58 46" stroke="#03045E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M102 46 Q112 40 122 46" stroke="#03045E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            // Normal gentle alert eyebrows
            <g>
              <path d="M40 48 Q48 44 56 48" stroke="#03045E" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M104 48 Q112 44 120 48" stroke="#03045E" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* CHEEKS (Rosy Pink Jelly Blush) */}
          <circle cx="36" cy="88" r="9" fill="url(#cheekBlush)" />
          <circle cx="124" cy="88" r="9" fill="url(#cheekBlush)" />

          {/* MOUTH SHAPES BASED ON EMOTION */}
          {emotion === 'happy_catch' || emotion === 'celebrating' ? (
            // Wide Open Joyful Laughing Mouth with Pink Tongue
            <g transform="translate(80, 96)">
              <path d="M-15 0 Q0 22 15 0 Z" fill="#1A1A24" />
              <path d="M-9 5 Q0 18 9 5 Z" fill="#FF5D8F" />
            </g>
          ) : emotion === 'recoil_damage' ? (
            // Pained Squiggle / Grimace Mouth
            <path
              d="M68 98 Q74 92 80 98 Q86 104 92 98"
              stroke="#1A1A24"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          ) : emotion === 'disappointed' || emotion === 'worried' ? (
            // Sad downturned mouth
            <path
              d="M70 102 Q80 94 90 102"
              stroke="#1A1A24"
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Calm, happy sweet smile
            <path
              d="M71 96 Q80 104 89 96"
              stroke="#1A1A24"
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Tiny Waving Arms */}
          <path
            d={isSquishing ? "M18 84 Q10 88 14 96" : "M18 84 Q8 78 12 70"}
            stroke="#0077B6"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={isSquishing ? "M142 84 Q150 88 146 96" : "M142 84 Q152 78 148 70"}
            stroke="#0077B6"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
};
