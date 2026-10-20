import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotTheme } from '../types';
import { CharviMascot } from './CharviMascot';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

export interface ToycadPlayRoomProps {
  onClose: () => void;
  mascotTheme?: MascotTheme;
}

export type BiomeKey = 'pantai' | 'sawah' | 'hutan' | 'gunung' | 'canyon' | 'lembah' | 'danau' | 'karya';

export interface BiomeInfo {
  key: BiomeKey;
  title: string;
  pinLabel: string;
  badge: string;
  desc: string;
  progress: string;
  ratio: string;
  reward: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  ctaText: string;
  nextLevel: string;
  pinStyle: { top: string; left: string };
  icon: string;
  fxCoords: { cx: number; cy: number; r: number };
}

export const BIOMES_DATA: Record<BiomeKey, BiomeInfo> = {
  pantai: {
    key: 'pantai',
    title: 'Dermaga Literasi Indonesia',
    pinLabel: 'Dermaga Literasi',
    badge: 'PESISIR & DERMAGA • BAHASA',
    desc: 'Tulis dongeng fantasi di pesisir pasir, pecahkan pantun dermaga, dan rangkai menara kata ajaib!',
    progress: '65%',
    ratio: '5/8 Bab',
    reward: '+60 Poin',
    color: '#34d399',
    badgeBg: 'rgba(52, 211, 153, 0.2)',
    badgeBorder: 'rgba(52, 211, 153, 0.4)',
    ctaText: 'Mulai Membaca Dongeng',
    nextLevel: 'Buka Tantangan Puisi ➔',
    pinStyle: { top: '64%', left: '28.5%' },
    icon: 'sailing',
    fxCoords: { cx: 285, cy: 410, r: 85 },
  },
  sawah: {
    key: 'sawah',
    title: 'Sawah Terasering & Ketahanan Pangan',
    pinLabel: 'Sawah Terasering',
    badge: 'TERASERING • IPAS & EKOLOGI',
    desc: 'Pelajari sistem subak nusantara, daur hidup tanaman padi, dan ekosistem sawah bertingkat!',
    progress: '40%',
    ratio: '3/8 Bab',
    reward: '+45 Poin',
    color: '#a3e635',
    badgeBg: 'rgba(163, 230, 53, 0.2)',
    badgeBorder: 'rgba(163, 230, 53, 0.4)',
    ctaText: 'Jelajahi Ekosistem Sawah',
    nextLevel: 'Buka Modul Terasering ➔',
    pinStyle: { top: '40%', left: '31%' },
    icon: 'grass',
    fxCoords: { cx: 310, cy: 240, r: 90 },
  },
  hutan: {
    key: 'hutan',
    title: 'Jelajahi Hutan IPAS',
    pinLabel: 'Jelajahi Hutan IPAS',
    badge: 'BIOMA UTAMA • IPAS',
    desc: 'Jelajahi keanekaragaman hayati nusantara, rantai makanan rimba tropis, dan siklus air alam!',
    progress: '50%',
    ratio: '4/8 Bab',
    reward: '+50 Poin',
    color: '#22c55e',
    badgeBg: 'rgba(34, 197, 94, 0.2)',
    badgeBorder: 'rgba(34, 197, 94, 0.4)',
    ctaText: 'Jelajahi Hutan IPAS',
    nextLevel: 'Buka Level 2 (8 Bab) ➔',
    pinStyle: { top: '70.8%', left: '46.5%' },
    icon: 'forest',
    fxCoords: { cx: 465, cy: 425, r: 95 },
  },
  gunung: {
    key: 'gunung',
    title: 'Puncak Bintang Pancasila',
    pinLabel: 'Puncak Pancasila',
    badge: 'PUNCAK GUNUNG • NILAI LUHUR',
    desc: 'Petualangan nilai luhur Garuda di puncak gunung berapi, tradisi gotong royong, dan toleransi!',
    progress: '75%',
    ratio: '6/8 Bab',
    reward: '+70 Poin',
    color: '#facc15',
    badgeBg: 'rgba(250, 204, 21, 0.2)',
    badgeBorder: 'rgba(250, 204, 21, 0.4)',
    ctaText: 'Raih Bintang Karakter',
    nextLevel: 'Buka Proyek Toleransi ➔',
    pinStyle: { top: '33.3%', left: '51.5%' },
    icon: 'volcano',
    fxCoords: { cx: 515, cy: 200, r: 100 },
  },
  canyon: {
    key: 'canyon',
    title: 'Tebing Cadas Matematika & Air Terjun',
    pinLabel: 'Tebing Matematika',
    badge: 'TEBING TERAKOTA • GEOMETRI',
    desc: 'Bangun tangga balok pecahan di tebing terakota, pecahkan teka-teki ketinggian air terjun kristal!',
    progress: '25%',
    ratio: '2/8 Bab',
    reward: '+75 Poin',
    color: '#fb923c',
    badgeBg: 'rgba(251, 146, 60, 0.2)',
    badgeBorder: 'rgba(251, 146, 60, 0.4)',
    ctaText: 'Bongkar Balok Geometri',
    nextLevel: 'Buka Pecahan Lanjut ➔',
    pinStyle: { top: '46.6%', left: '72%' },
    icon: 'landscape',
    fxCoords: { cx: 720, cy: 280, r: 90 },
  },
  lembah: {
    key: 'lembah',
    title: 'Bukit Pinus Budi Pekerti & Agama',
    pinLabel: 'Bukit Budi Pekerti',
    badge: 'LEMBAH EMAS • AKHLAK MULIA',
    desc: 'Pelajari budi pekerti luhur, kerukunan antar sahabat, dan teladan kebaikan di bawah pohon pinus!',
    progress: '30%',
    ratio: '2/8 Bab',
    reward: '+35 Poin',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeBorder: 'rgba(245, 158, 11, 0.4)',
    ctaText: 'Pelajari Budi Pekerti',
    nextLevel: 'Buka Kisah Teladan ➔',
    pinStyle: { top: '75.8%', left: '74%' },
    icon: 'favorite',
    fxCoords: { cx: 740, cy: 455, r: 85 },
  },
  danau: {
    key: 'danau',
    title: 'Teluk Bahasa Inggris & Dunia',
    pinLabel: 'Teluk Bahasa Inggris',
    badge: 'ALIRAN SUNGAI • ENGLISH KIDS',
    desc: 'Belajar percakapan ceria di sungai kristal nusantara, mengenal satwa dunia dalam bahasa Inggris!',
    progress: '25%',
    ratio: '2/8 Bab',
    reward: '+45 Poin',
    color: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    badgeBorder: 'rgba(56, 189, 248, 0.4)',
    ctaText: 'Explore English Adventure',
    nextLevel: 'Open Conversation Level 2 ➔',
    pinStyle: { top: '70%', left: '60%' },
    icon: 'water',
    fxCoords: { cx: 600, cy: 420, r: 85 },
  },
  karya: {
    key: 'karya',
    title: 'Studio Karya P5 & Gelanggang Bugar',
    pinLabel: 'Studio Karya P5',
    badge: 'PADANG SELATAN • KOKURIKULER',
    desc: 'Kreasi kriya digital nusantara, gerak jasmani terpadu, dan pameran hasil karya petualang!',
    progress: '50%',
    ratio: '4/8 Bab',
    reward: '+80 Poin',
    color: '#c084fc',
    badgeBg: 'rgba(192, 132, 252, 0.2)',
    badgeBorder: 'rgba(192, 132, 252, 0.4)',
    ctaText: 'Buka Studio Karya P5',
    nextLevel: 'Buka Workshop Digital ➔',
    pinStyle: { top: '85%', left: '58%' },
    icon: 'palette',
    fxCoords: { cx: 580, cy: 510, r: 80 },
  },
};

const ISLAND_BG_IMAGE = 'https://lh3.googleusercontent.com/aida/AEtjO1Xb_vDrWKXXkrVz0aZB1AoUlas1khLRunNKr3jxQgiijiBnr01FTgxj12mxYngT3fLi3dmT7Vk-pny2rrqVBTI2X1qzBPkzWyLEbo4TGe0ydJZVPNdbHlVB0FgGij6aEGC3ukDj9e8KF_H8LBorqN3hExMjYSYgI1wCu8Ugyvs0fGLnjuMGpmDzlFYHbXnMtdqvb3P7gUtbe7jYJEz_MMuUaHxidofVV62ph_Uq8mnqrOwc07Sc0F9C9o8N=s2560';

export const ToycadPlayRoom: React.FC<ToycadPlayRoomProps> = ({
  onClose,
  mascotTheme = 'cyan-jelly',
}) => {
  // State
  const [activeBiomeKey, setActiveBiomeKey] = useState<BiomeKey>('hutan');
  const [currentZoom, setCurrentZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [angleLabel, setAngleLabel] = useState<string>('Depan 0°');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isMissionDrawerExpanded, setIsMissionDrawerExpanded] = useState<boolean>(false);
  const [activePhase, setActivePhase] = useState<{ grade: string; code: string }>({ grade: 'Kelas 4 SD', code: 'FASE B' });

  // Modal Visibility
  const [showAngleModal, setShowAngleModal] = useState<boolean>(false);
  const [showPhaseModal, setShowPhaseModal] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string, icon = 'check_circle') => {
    setToast({ msg, icon });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // Gesture/Dragging Refs
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanningClass, setIsPanningClass] = useState<boolean>(false);

  const minZoom = 1.0;
  const maxZoom = 1.85;
  const zoomStep = 0.15;

  const clampOffsets = useCallback((zoom: number, px: number, py: number) => {
    if (!viewportRef.current) return { x: 0, y: 0 };
    const w = viewportRef.current.clientWidth || window.innerWidth;
    const h = viewportRef.current.clientHeight || window.innerHeight;
    const maxPanX = Math.max(0, ((zoom - 1) * w) / 2);
    const maxPanY = Math.max(0, ((zoom - 1) * h) / 2);
    const clampedX = Math.max(-maxPanX, Math.min(maxPanX, px));
    const clampedY = Math.max(-maxPanY, Math.min(maxPanY, py));
    return { x: clampedX, y: clampedY };
  }, []);

  // Handle Zooming
  const handleZoomIn = () => {
    playPopSound();
    setCurrentZoom((prev) => {
      const next = Math.min(maxZoom, +(prev + zoomStep).toFixed(2));
      showToast(`Zoom: ${Math.round(next * 100)}%`, 'zoom_in');
      return next;
    });
  };

  const handleZoomOut = () => {
    playPopSound();
    setCurrentZoom((prev) => {
      let next = Math.max(minZoom, +(prev - zoomStep).toFixed(2));
      if (next <= minZoom + 0.01) {
        next = minZoom;
        setPanX(0);
        setPanY(0);
      }
      showToast(`Zoom: ${Math.round(next * 100)}%`, 'zoom_out');
      return next;
    });
  };

  const handleResetZoom = () => {
    playPopSound();
    setCurrentZoom(1.0);
    setPanX(0);
    setPanY(0);
    showToast('Peta di-reset ke skala awal (100%)', 'crop_free');
  };

  // Wheel Zoom
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setCurrentZoom((prev) => Math.min(maxZoom, +(prev + 0.1).toFixed(2)));
      } else {
        setCurrentZoom((prev) => {
          const next = Math.max(minZoom, +(prev - 0.1).toFixed(2));
          if (next <= minZoom) {
            setPanX(0);
            setPanY(0);
          }
          return next;
        });
      }
    };

    vp.addEventListener('wheel', handleWheel, { passive: false });
    return () => vp.removeEventListener('wheel', handleWheel);
  }, []);

  // Mouse & Touch Pan Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    if (currentZoom <= 1.0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('#biomeDetailCard') || target.closest('#missionDrawerContainer')) {
      return;
    }

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartPosRef.current = { x: e.clientX - panX, y: e.clientY - panY };
    setIsPanningClass(true);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const newX = e.clientX - dragStartPosRef.current.x;
    const newY = e.clientY - dragStartPosRef.current.y;

    if (Math.abs(newX - panX) > 4 || Math.abs(newY - panY) > 4) {
      hasMovedRef.current = true;
    }

    const { x: cx, y: cy } = clampOffsets(currentZoom, newX, newY);
    setPanX(cx);
    setPanY(cy);
  }, [clampOffsets, currentZoom, panX, panY]);

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsPanningClass(false);
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 60);
  };

  // Pin Click
  const handlePinClick = (key: BiomeKey, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMovedRef.current) return;
    playPopSound();
    setActiveBiomeKey(key);
  };

  // Audio speech
  const toggleAudioSpeech = () => {
    playPopSound();
    setIsAudioMuted((prev) => {
      const next = !prev;
      if (next) {
        showToast('Panduan Suara dinonaktifkan (Mute)', 'volume_off');
      } else {
        const curr = BIOMES_DATA[activeBiomeKey];
        showToast(`Panduan Suara Aktif: ${curr.title}!`, 'volume_up');
      }
      return next;
    });
  };

  const playBiomeAudio = () => {
    playPopSound();
    const curr = BIOMES_DATA[activeBiomeKey];
    showToast(`🎧 Memutar narasi panduan: ${curr.title}`, 'headphones');
  };

  const startBiomeMission = () => {
    playCheerSound();
    const curr = BIOMES_DATA[activeBiomeKey];
    showToast(`🚀 Memulai petualangan di ${curr.title}! Memuat misi...`, 'play_circle');
  };

  const rotateWorldTo = (deg: number, label: string) => {
    playPopSound();
    setCurrentAngle(deg);
    setAngleLabel(label);
    showToast(`Sudut Pandang Pulau: ${label}`, 'explore');
    setShowAngleModal(false);
  };

  const selectPhase = (grade: string, code: string) => {
    playPopSound();
    setActivePhase({ grade, code });
    showToast(`Beralih ke kurikulum ${grade} (${code})!`, 'school');
    setShowPhaseModal(false);
  };

  const activeBiome = BIOMES_DATA[activeBiomeKey];

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0b0e] text-white font-sans antialiased overflow-hidden select-none">
      {/* ======================================================== */}
      {/* FULLSCREEN INTERACTIVE STAGE & VIEWPORT */}
      {/* ======================================================== */}
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-full overflow-hidden select-none ${
          currentZoom > 1.05 ? 'cursor-grab' : 'cursor-default'
        } ${isPanningClass ? 'cursor-grabbing!' : ''}`}
      >
        {/* MAP STAGE WITH HD ISLAND IMAGE */}
        <div
          id="mapStage"
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url('${ISLAND_BG_IMAGE}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            transform: `translate3d(${panX}px, ${panY}px, 0px) ${
              currentAngle ? `perspective(1200px) rotateY(${currentAngle * 0.15}deg)` : ''
            } scale(${currentZoom})`,
            transformOrigin: '50% 50%',
          }}
        >
          {/* SVG INTERACTIVE HITBOXES & LIGHT FX OVERLAYS */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
              </filter>

              {/* Spotlight / Biome Aura Gradients */}
              <radialGradient id="grad-pantai" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-sawah" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#A3E635" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#A3E635" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-hutan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-gunung" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FACC15" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-canyon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FB923C" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-lembah" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-danau" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-karya" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dotted Connecting Trails */}
            <path d="M 285 410 Q 275 320 310 240" fill="none" stroke="#34D399" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />
            <path d="M 310 240 Q 400 220 515 200" fill="none" stroke="#A3E635" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />
            <path d="M 285 410 Q 380 430 465 425" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />
            <path d="M 465 425 Q 490 350 515 200" fill="none" stroke="#A3E635" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />
            <path d="M 515 200 Q 640 230 720 280" fill="none" stroke="#FB923C" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />
            <path d="M 720 280 Q 640 370 600 420" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />
            <path d="M 600 420 Q 660 480 740 455" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />
            <path d="M 465 425 Q 520 480 580 510" fill="none" stroke="#C084FC" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />

            {/* Spotlight pools for biomes */}
            {(Object.keys(BIOMES_DATA) as BiomeKey[]).map((k) => {
              const b = BIOMES_DATA[k];
              const isActive = activeBiomeKey === k;
              return (
                <g key={`fx-${k}`} className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                  <circle cx={b.fxCoords.cx} cy={b.fxCoords.cy} r={b.fxCoords.r} fill={`url(#grad-${k})`} filter="url(#softGlow)" />
                  <circle cx={b.fxCoords.cx} cy={b.fxCoords.cy} className="animate-ping" style={{ animationDuration: '3s' }} r={b.fxCoords.r * 0.4} fill="none" stroke={b.color} strokeWidth="1.5" opacity="0.6" />
                </g>
              );
            })}
          </svg>

          {/* 8 TACTILE STADIUM PINS GEOGRAPHICALLY TIED TO BIOMES */}
          {(Object.keys(BIOMES_DATA) as BiomeKey[]).map((k) => {
            const b = BIOMES_DATA[k];
            const isActive = activeBiomeKey === k;

            return (
              <div
                key={`pin-${k}`}
                style={{
                  top: b.pinStyle.top,
                  left: b.pinStyle.left,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-30 select-none transition-all duration-300 ${
                  isActive ? 'scale-108 -translate-y-1.5 z-45 opacity-100' : 'opacity-75 hover:opacity-100'
                }`}
              >
                {/* Cincau Mascot Token if this is the active biome */}
                {isActive && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-bounce z-40">
                    <div className="w-11 h-11 rounded-full bg-[#A3E635]/35 p-1 border-2 border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.85)] overflow-hidden bg-black/75 flex items-center justify-center">
                      <CharviMascot
                        variant="compact-header"
                        theme={mascotTheme}
                        emotion="excited"
                        className="w-full h-full scale-125 drop-shadow-md"
                      />
                    </div>
                    <div className="w-2.5 h-1 bg-black/60 rounded-full blur-[1px] mt-0.5" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => handlePinClick(k, e)}
                  style={{
                    borderColor: isActive ? b.color : 'rgba(255, 255, 255, 0.15)',
                    boxShadow: isActive ? `0 0 22px ${b.badgeBg}` : '0 6px 20px rgba(0,0,0,0.6)',
                  }}
                  className="flex items-center gap-2 bg-[#141419]/95 backdrop-blur-xl px-3.5 py-1.5 rounded-full border cursor-pointer transition-all duration-300 active:scale-95"
                >
                  <div
                    style={{ backgroundColor: `${b.color}33`, color: b.color }}
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  >
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {b.icon}
                    </span>
                  </div>
                  <span className="font-bold text-xs text-white whitespace-nowrap">{b.pinLabel}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* FLOATING MICRO-HUD OVERLAYS */}
        {/* ======================================================== */}

        {/* Top Left: Branding, Phase Selector & Back Button */}
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-40 flex items-center gap-2">
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#141419]/90 backdrop-blur-xl border border-white/15 text-white hover:bg-neutral-800 transition-colors shadow-xl cursor-pointer"
            title="Kembali ke Beranda Utama"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>

          <div className="flex items-center gap-2 bg-[#141419]/90 backdrop-blur-xl border border-white/15 rounded-full px-3.5 py-2 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-pulse" />
            <span className="text-xs font-black text-white tracking-wider uppercase">Pulau MerdekaKids</span>
          </div>

          <div
            onClick={() => {
              playPopSound();
              setShowPhaseModal(true);
            }}
            className="hidden sm:flex items-center gap-1.5 bg-[#141419]/90 hover:bg-[#1f1f26] backdrop-blur-xl border border-white/15 hover:border-white/30 rounded-full px-3.5 py-2 shadow-xl cursor-pointer transition-all active:scale-95"
          >
            <span className="text-xs font-bold text-neutral-200">{activePhase.grade}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-xs font-black text-[#A3E635]">{activePhase.code}</span>
            <span className="material-symbols-outlined text-sm text-neutral-400">expand_more</span>
          </div>
        </div>

        {/* Top Right: Audio Guide & 360 View Controls */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-40 flex items-center gap-2">
          <button
            onClick={toggleAudioSpeech}
            type="button"
            className="flex items-center gap-2 bg-[#141419]/90 hover:bg-[#1f1f26] backdrop-blur-xl border border-white/15 px-3.5 sm:px-4 py-2 rounded-full shadow-xl cursor-pointer transition-all active:scale-95"
          >
            <span
              className={`material-symbols-outlined text-[#FACC15] text-base ${!isAudioMuted ? 'animate-bounce' : ''}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isAudioMuted ? 'volume_off' : 'volume_up'}
            </span>
            <span className="hidden sm:inline text-xs font-extrabold text-white">Panduan Suara</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setShowAngleModal(true);
            }}
            type="button"
            className="flex items-center gap-1.5 bg-[#141419]/90 hover:bg-[#1f1f26] backdrop-blur-xl border border-white/15 hover:border-[#38BDF8] px-3.5 py-2 rounded-full shadow-xl text-neutral-300 transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm text-[#38BDF8]">explore</span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase text-[#38BDF8] tracking-wider">{angleLabel}</span>
          </button>
        </div>

        {/* Bottom Left: Dynamic Reactive Biome Detail Card */}
        <div
          id="biomeDetailCard"
          className="absolute bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 w-[290px] sm:w-[330px] max-w-[340px] bg-[#141419]/95 backdrop-blur-2xl rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-white/15 transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2 sm:gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                style={{
                  backgroundColor: activeBiome.badgeBg,
                  borderColor: activeBiome.badgeBorder,
                  color: activeBiome.color,
                }}
                className="border font-black text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider transition-colors duration-300"
              >
                {activeBiome.badge}
              </span>
              <div className="flex items-center gap-1 bg-black/60 border border-[#FACC15]/40 px-2 py-0.5 rounded-full text-[#FACC15] shadow-inner shrink-0">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-[10px] sm:text-[11px] font-black text-white">{activeBiome.reward}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight leading-snug">
                {activeBiome.title}
              </h3>
              <p className="text-xs text-neutral-300 line-clamp-2 mt-0.5 leading-snug font-medium">
                {activeBiome.desc}
              </p>
            </div>

            {/* Progress Bar Card */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1 sm:gap-1.5">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className="font-black text-white flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#A3E635]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Progres Belajar
                </span>
                <span className="font-extrabold text-white text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                  {activeBiome.ratio}
                </span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden shadow-inner">
                <div
                  style={{ width: activeBiome.progress, backgroundColor: activeBiome.color }}
                  className="h-full rounded-full transition-all duration-500 ease-out"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-neutral-400">
                <span className="flex items-center gap-1 text-[#FACC15] font-bold">
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                  Kuis Siap Diuji!
                </span>
                <span className="text-[9px] text-neutral-300 font-semibold">{activeBiome.nextLevel}</span>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="pt-0.5 flex items-center justify-between gap-2">
              <button
                onClick={startBiomeMission}
                style={{ backgroundColor: activeBiome.color }}
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg hover:scale-102 active:scale-95 transition-all cursor-pointer text-neutral-950"
              >
                <span className="material-symbols-outlined text-base text-neutral-950 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                <span className="text-neutral-950 font-black tracking-tight">{activeBiome.ctaText}</span>
              </button>
              <button
                onClick={playBiomeAudio}
                type="button"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer border border-white/15 shrink-0"
                title="Dengarkan Panduan Suara"
              >
                <span className="material-symbols-outlined text-sm text-[#FACC15]" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Right: Missions Pull-Up Drawer */}
        <div
          id="missionDrawerContainer"
          className="absolute bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end select-none transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Collapsed Trigger Pill */}
          <button
            onClick={() => {
              playPopSound();
              setIsMissionDrawerExpanded((prev) => !prev);
            }}
            type="button"
            className="group flex items-center gap-2 sm:gap-3 bg-[#141419]/95 hover:bg-[#1a1a22] backdrop-blur-xl border border-[#FACC15]/40 hover:border-[#FACC15] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-[#FACC15]/20"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FACC15] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FACC15]" />
              </span>
              <span className="font-black text-xs sm:text-sm text-white tracking-tight flex items-center gap-1">
                <span>🎯</span> 3 Misi Menanti!
              </span>
            </div>
            <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full border border-[#FACC15]/30 text-[#FACC15] text-[10px] sm:text-[11px] font-black">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span>+120 XP</span>
            </div>
            <span className={`material-symbols-outlined text-neutral-400 group-hover:text-white text-base transition-transform duration-300 ${isMissionDrawerExpanded ? 'rotate-180' : ''}`}>
              expand_less
            </span>
          </button>

          {/* Expanded Drawer Card */}
          <AnimatePresence>
            {isMissionDrawerExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className="flex flex-col max-w-sm w-[290px] sm:w-[350px] bg-[#141419]/95 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-[#FACC15]/30 mt-2 z-50"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FACC15]/20 flex items-center justify-center text-[#FACC15]">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>target</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">Misi Petualang Cilik</h4>
                      <p className="text-[10px] text-neutral-400 font-medium">Selesaikan misi harian!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMissionDrawerExpanded(false)}
                    type="button"
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2.5">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 hover:border-[#A3E635]/40 transition-all">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#A3E635]/20 flex items-center justify-center text-[#A3E635] shrink-0">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white leading-tight">Rantai Makanan Rimba</span>
                        <span className="text-[9px] font-bold text-[#A3E635] mt-0.5">Selesai ✓</span>
                      </div>
                    </div>
                    <button className="px-2 py-0.5 bg-[#A3E635]/20 text-[#A3E635] font-black text-[9px] rounded-md border border-[#A3E635]/30">Review</button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-[#FACC15]/40 flex items-center justify-between gap-2 hover:border-[#FACC15] transition-all ring-1 ring-[#FACC15]/30">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FACC15]/20 flex items-center justify-center text-[#FACC15] shrink-0">
                        <span className="material-symbols-outlined text-sm animate-pulse">military_tech</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white leading-tight">Tebing Pecahan Balok</span>
                        <span className="text-[9px] font-extrabold text-[#FACC15] mt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">lock_open</span>Siap Dikerjakan
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={startBiomeMission}
                      className="px-2.5 py-1 bg-[#FACC15] text-neutral-950 font-black text-[10px] rounded-lg active:scale-95 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>+70 XP</span>
                      <span className="material-symbols-outlined text-xs font-black">play_arrow</span>
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400 font-medium flex items-center gap-1 text-[10px]">
                    <span className="material-symbols-outlined text-xs text-[#FACC15]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> Total Bonus: <strong className="text-[#FACC15]">+120 XP</strong>
                  </span>
                  <button onClick={() => setIsMissionDrawerExpanded(false)} type="button" className="text-[#FACC15] hover:underline font-bold text-[10px] cursor-pointer">Ciutkan</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zoom & Reset HUD (Anchored Right) */}
        <div
          id="zoomControls"
          className="absolute right-4 bottom-24 sm:right-6 sm:bottom-20 z-40 flex flex-col items-center bg-[#141419]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-1 shadow-2xl gap-0.5 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleZoomIn}
            type="button"
            title="Perbesar Peta (+)"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-[#FACC15] font-bold">add</span>
          </button>
          <button
            onClick={handleResetZoom}
            type="button"
            title="Reset Skala (100%)"
            className="px-2 py-1 rounded hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-all cursor-pointer text-center"
          >
            <span className="text-[9px] font-black tracking-wider text-[#FACC15] block">
              {Math.round(currentZoom * 100)}%
            </span>
          </button>
          <button
            onClick={handleZoomOut}
            disabled={currentZoom <= minZoom + 0.01}
            type="button"
            title="Perkecil Peta (-)"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm text-[#38BDF8] font-bold">remove</span>
          </button>
        </div>
      </div>

      {/* TOAST FEEDBACK CAPSULE */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 bg-[#141419]/95 text-white border border-[#FACC15]/40 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 pointer-events-none"
          >
            <span className="material-symbols-outlined text-[#FACC15] text-lg">{toast.icon}</span>
            <span className="text-xs font-bold text-neutral-100">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: KONTROL SUDUT PANDANG 360 */}
      <AnimatePresence>
        {showAngleModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowAngleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#141419] border border-white/15 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#38BDF8] text-xl">explore</span>
                  <h3 className="text-sm font-black text-white">Kontrol Sudut Pandang 360°</h3>
                </div>
                <button
                  onClick={() => setShowAngleModal(false)}
                  type="button"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              <p className="text-xs text-neutral-300 mt-3">Putar arah pulau master tunggal untuk mengamati bioma dari berbagai sudut:</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => rotateWorldTo(0, 'Depan 0°')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                    currentAngle === 0 ? 'border-[#38BDF8] text-[#38BDF8]' : 'border-white/10 text-white'
                  }`}
                >
                  <span className="text-xs font-black">🧭 Depan (0°)</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Perspektif Utama</span>
                </button>
                <button
                  onClick={() => rotateWorldTo(90, 'Kanan 90°')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                    currentAngle === 90 ? 'border-[#38BDF8] text-[#38BDF8]' : 'border-white/10 text-white'
                  }`}
                >
                  <span className="text-xs font-black">➡️ Kanan (90°)</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Sisi Cadas</span>
                </button>
                <button
                  onClick={() => rotateWorldTo(180, 'Belakang 180°')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                    currentAngle === 180 ? 'border-[#38BDF8] text-[#38BDF8]' : 'border-white/10 text-white'
                  }`}
                >
                  <span className="text-xs font-black">🔄 Belakang (180°)</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Sisi Gunung</span>
                </button>
                <button
                  onClick={() => rotateWorldTo(270, 'Kiri 270°')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                    currentAngle === 270 ? 'border-[#38BDF8] text-[#38BDF8]' : 'border-white/10 text-white'
                  }`}
                >
                  <span className="text-xs font-black">⬅️ Kiri (270°)</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Sisi Pantai</span>
                </button>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-neutral-400">
                <span>Arah Aktif: <strong className="text-[#38BDF8] font-bold">{angleLabel}</strong></span>
                <button onClick={() => rotateWorldTo(0, 'Depan 0°')} className="text-[#FACC15] hover:underline text-[11px] font-bold cursor-pointer">Reset 0°</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: PILIH FASE BELAJAR KURIKULUM MERDEKA */}
      <AnimatePresence>
        {showPhaseModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowPhaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#141419] border border-white/15 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#A3E635] text-xl">school</span>
                  <h3 className="text-sm font-black text-white">Pilih Fase Belajar</h3>
                </div>
                <button
                  onClick={() => setShowPhaseModal(false)}
                  type="button"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-2.5 mt-4">
                <button
                  onClick={() => selectPhase('Kelas 1-2', 'FASE A')}
                  className={`flex items-center justify-between p-3 rounded-2xl bg-white/5 border hover:border-[#A3E635] text-left cursor-pointer transition-all hover:scale-102 ${
                    activePhase.code === 'FASE A' ? 'border-[#A3E635]' : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white">Fase A (Kelas 1 - 2)</span>
                    <span className="text-[10px] text-neutral-400">Pengenalan Huruf, Angka & Alam Sekitar</span>
                  </div>
                  <span className="material-symbols-outlined text-neutral-500 text-sm">arrow_forward</span>
                </button>

                <button
                  onClick={() => selectPhase('Kelas 4 SD', 'FASE B')}
                  className={`flex items-center justify-between p-3 rounded-2xl bg-white/5 border text-left cursor-pointer transition-all ${
                    activePhase.code === 'FASE B' ? 'border-[#A3E635]' : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#A3E635] flex items-center gap-1.5">
                      Fase B (Kelas 3 - 4) <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#A3E635]/20 text-[#A3E635] font-bold">Aktif</span>
                    </span>
                    <span className="text-[10px] text-neutral-400">Eksplorasi Konsep, Logika Sains & Proyek Profil</span>
                  </div>
                  <span className="material-symbols-outlined text-[#A3E635] text-base">check_circle</span>
                </button>

                <button
                  onClick={() => selectPhase('Kelas 5-6', 'FASE C')}
                  className={`flex items-center justify-between p-3 rounded-2xl bg-white/5 border hover:border-[#A3E635] text-left cursor-pointer transition-all hover:scale-102 ${
                    activePhase.code === 'FASE C' ? 'border-[#A3E635]' : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white">Fase C (Kelas 5 - 6)</span>
                    <span className="text-[10px] text-neutral-400">Pemecahan Masalah Kritis & Sains Lanjutan</span>
                  </div>
                  <span className="material-symbols-outlined text-neutral-500 text-sm">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
