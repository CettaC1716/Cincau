import React from 'react';

// Detailed Red Apple with natural curves, wooden stem, green leaf, and glossy highlights
export const RedAppleSVG: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="redAppleGrad" x1="16" y1="12" x2="48" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF6B75" />
        <stop offset="45%" stopColor="#EF3844" />
        <stop offset="100%" stopColor="#C41C27" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="32" y1="6" x2="48" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8CE07E" />
        <stop offset="100%" stopColor="#4FA63E" />
      </linearGradient>
      <radialGradient id="appleHighlight" cx="24" cy="24" r="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Apple Stem */}
    <path
      d="M32 18 C33 13, 37 8, 42 6 C41 9, 38 14, 34 18 Z"
      fill="#6B4226"
    />

    {/* Green Leaf */}
    <path
      d="M33 14 C40 8, 48 10, 50 16 C44 20, 36 18, 33 14 Z"
      fill="url(#leafGrad)"
    />
    <path
      d="M35 15 Q42 13 47 15"
      stroke="#388E28"
      strokeWidth="1"
      strokeLinecap="round"
    />

    {/* Apple Body */}
    <path
      d="M32 18
         C25 18, 12 21, 10 32
         C8 44, 18 56, 26 58
         C30 59, 32 57, 32 57
         C32 57, 34 59, 38 58
         C46 56, 56 44, 54 32
         C52 21, 39 18, 32 18 Z"
      fill="url(#redAppleGrad)"
    />

    {/* Top indented dimple shadow */}
    <ellipse cx="32" cy="20" rx="3.5" ry="1.5" fill="#9B141E" opacity="0.6" />

    {/* Glossy specular highlight */}
    <ellipse cx="22" cy="28" rx="8" ry="12" fill="url(#appleHighlight)" transform="rotate(-18 22 28)" />
    <circle cx="18" cy="23" r="2.5" fill="#FFFFFF" opacity="0.75" />
  </svg>
);

// Golden Bonus Apple with luminous halo and sparkle
export const GoldenAppleSVG: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-lg select-none ${className}`}
  >
    <defs>
      <linearGradient id="goldAppleGrad" x1="16" y1="12" x2="48" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="40%" stopColor="#FFD54F" />
        <stop offset="100%" stopColor="#FFA000" />
      </linearGradient>
      <linearGradient id="goldLeafGrad" x1="32" y1="6" x2="48" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="100%" stopColor="#FFB300" />
      </linearGradient>
      <radialGradient id="goldHighlight" cx="24" cy="24" r="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="goldAura" cx="32" cy="36" r="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE082" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFE082" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Golden Aura Glow */}
    <circle cx="32" cy="36" r="26" fill="url(#goldAura)" />

    {/* Apple Stem */}
    <path
      d="M32 18 C33 13, 37 8, 42 6 C41 9, 38 14, 34 18 Z"
      fill="#8D6E63"
    />

    {/* Golden Leaf */}
    <path
      d="M33 14 C40 8, 48 10, 50 16 C44 20, 36 18, 33 14 Z"
      fill="url(#goldLeafGrad)"
    />

    {/* Apple Body */}
    <path
      d="M32 18
         C25 18, 12 21, 10 32
         C8 44, 18 56, 26 58
         C30 59, 32 57, 32 57
         C32 57, 34 59, 38 58
         C46 56, 56 44, 54 32
         C52 21, 39 18, 32 18 Z"
      fill="url(#goldAppleGrad)"
    />

    {/* Top dimple shadow */}
    <ellipse cx="32" cy="20" rx="3.5" ry="1.5" fill="#E65100" opacity="0.4" />

    {/* Glossy specular highlight */}
    <ellipse cx="22" cy="28" rx="8" ry="12" fill="url(#goldHighlight)" transform="rotate(-18 22 28)" />
    <circle cx="18" cy="23" r="3" fill="#FFFFFF" opacity="0.9" />

    {/* Sparkle Glints */}
    <path d="M46 22 L48 26 L52 28 L48 30 L46 34 L44 30 L40 28 L44 26 Z" fill="#FFFFFF" opacity="0.9" />
    <path d="M14 44 L15 47 L18 48 L15 49 L14 52 L13 49 L10 48 L13 47 Z" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// Rotten / Dangerous Apple to avoid (-1 Life)
export const RottenAppleSVG: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="rottenAppleGrad" x1="16" y1="12" x2="48" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7E57C2" />
        <stop offset="45%" stopColor="#512DA8" />
        <stop offset="100%" stopColor="#311B92" />
      </linearGradient>
      <linearGradient id="wiltedLeaf" x1="32" y1="6" x2="48" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8D6E63" />
        <stop offset="100%" stopColor="#4E342E" />
      </linearGradient>
    </defs>

    {/* Bent Dark Stem */}
    <path
      d="M32 18 C30 12, 34 7, 39 8 C37 11, 35 15, 33 18 Z"
      fill="#3E2723"
    />

    {/* Wilted Drooping Leaf */}
    <path
      d="M33 15 C38 12, 44 16, 43 21 C39 22, 35 19, 33 15 Z"
      fill="url(#wiltedLeaf)"
    />

    {/* Rotten Apple Body with Nibble Dent */}
    <path
      d="M32 18
         C25 18, 12 21, 10 32
         C8 44, 18 56, 26 58
         C30 59, 32 57, 32 57
         C32 57, 34 59, 38 58
         C46 56, 56 44, 54 32
         C52 26, 48 23, 44 24
         C42 21, 37 19, 32 18 Z"
      fill="url(#rottenAppleGrad)"
    />

    {/* Rotten Soft Spots (spots of decay) */}
    <circle cx="24" cy="38" r="6" fill="#311B92" opacity="0.6" />
    <circle cx="22" cy="36" r="3.5" fill="#1A237E" opacity="0.7" />
    <circle cx="42" cy="42" r="5" fill="#311B92" opacity="0.6" />

    {/* Warning Skull / Danger cross detail */}
    <g transform="translate(26, 26) scale(0.65)">
      <path d="M4 4 L14 14 M14 4 L4 14" stroke="#D1C4E9" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Stink / Poison Cloud Wisps */}
    <path d="M18 14 Q22 8 20 2" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
    <path d="M44 14 Q48 10 46 4" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
  </svg>
);

// Star Cincau bonus item (+5 points)
export const StarItemSVG: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="starGrad" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF59D" />
        <stop offset="50%" stopColor="#FFCA28" />
        <stop offset="100%" stopColor="#FF8F00" />
      </linearGradient>
    </defs>
    <path
      d="M24 3
         L30 16
         L44 18
         L34 28
         L36 42
         L24 35
         L12 42
         L14 28
         L4 18
         L18 16 Z"
      fill="url(#starGrad)"
      stroke="#FF6F00"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Inner Star Sparkle */}
    <circle cx="24" cy="22" r="4" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// Heart Life Indicator
export const HeartLifeSVG: React.FC<{ active?: boolean; size?: number }> = ({ active = true, size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heartRed" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF5252" />
        <stop offset="100%" stopColor="#D50000" />
      </linearGradient>
    </defs>
    {active ? (
      <>
        <path
          d="M16 28 C16 28, 4 20, 4 11 C4 6, 8 3, 12 4 C14.5 4.5, 16 7, 16 7 C16 7, 17.5 4.5, 20 4 C24 3, 28 6, 28 11 C28 20, 16 28, 16 28 Z"
          fill="url(#heartRed)"
        />
        {/* Heart highlight */}
        <ellipse cx="10" cy="9" rx="2.5" ry="4" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 10 9)" />
      </>
    ) : (
      <path
        d="M16 28 C16 28, 4 20, 4 11 C4 6, 8 3, 12 4 C14.5 4.5, 16 7, 16 7 C16 7, 17.5 4.5, 20 4 C24 3, 28 6, 28 11 C28 20, 16 28, 16 28 Z"
        fill="#CFD8DC"
        stroke="#90A4AE"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
    )}
  </svg>
);

// Trophy Icon for Victory
export const TrophySVG: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="trophyGold" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="50%" stopColor="#FFC107" />
        <stop offset="100%" stopColor="#FF8F00" />
      </linearGradient>
    </defs>
    {/* Base Stand */}
    <rect x="22" y="52" width="20" height="6" rx="2" fill="#5D4037" />
    <path d="M26 44 L38 44 L36 52 L28 52 Z" fill="#795548" />
    <rect x="30" y="38" width="4" height="6" fill="#FFA000" />
    {/* Cup Bowl */}
    <path d="M16 12 L48 12 C48 26, 40 38, 32 38 C24 38, 16 26, 16 12 Z" fill="url(#trophyGold)" />
    {/* Handles */}
    <path d="M16 16 C10 16, 8 24, 16 28" stroke="#FFB300" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M48 16 C54 16, 56 24, 48 28" stroke="#FFB300" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Star on Cup */}
    <path d="M32 20 L33.5 24 L37.5 24.5 L34.5 27 L35.5 31 L32 29 L28.5 31 L29.5 27 L26.5 24.5 L30.5 24 Z" fill="#FFFFFF" />
  </svg>
);

// Orchard Green Tree for Scene Backdrop
export const OrchardTreeSVG: React.FC<{ size?: number; className?: string }> = ({ size = 120, className = '' }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Trunk */}
    <path d="M44 80 L56 80 L58 130 L42 130 Z" fill="#6D4C41" />
    {/* Leaf Canopy Layers */}
    <circle cx="50" cy="55" r="38" fill="#5EAF48" />
    <circle cx="34" cy="46" r="26" fill="#76C85E" />
    <circle cx="66" cy="46" r="26" fill="#76C85E" />
    <circle cx="50" cy="32" r="26" fill="#88DA6E" />
    {/* Little apples on tree */}
    <circle cx="36" cy="40" r="4.5" fill="#EF5350" />
    <circle cx="64" cy="44" r="4.5" fill="#EF5350" />
    <circle cx="48" cy="24" r="4" fill="#EF5350" />
  </svg>
);

// Soft Cartoon Cloud
export const CloudSVG: React.FC<{ width?: number; className?: string }> = ({ width = 120, className = '' }) => (
  <svg width={width} height={width * 0.55} viewBox="0 0 120 66" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M24 50
         C12 50, 4 42, 6 32
         C8 22, 18 18, 26 20
         C30 10, 44 4, 58 8
         C70 4, 86 10, 88 22
         C98 20, 110 26, 112 36
         C114 46, 104 50, 96 50 Z"
      fill="#FFFFFF"
      fillOpacity="0.85"
    />
  </svg>
);
