import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Check, 
  Download, 
  MoreVertical, 
  Star, 
  Edit3, 
  X, 
  ChevronDown, 
  Sparkles, 
  Home, 
  Bookmark, 
  Share2, 
  Eraser,
  ArrowRight,
  Layers
} from 'lucide-react';
import { CharviMascot } from './CharviMascot';
import { MascotTheme, CharviEmotion, ChildProfile } from '../types';
import { playPopSound, playCheerSound } from '../utils/audioEffects';
import { MengenalHewanModal } from './MengenalHewanModal';
import { FloraInteractiveModal } from './FloraInteractiveModal';
import { FloraInteractiveCard } from './FloraInteractiveCard';
import { FaunaInteractiveCard } from './FaunaInteractiveCard';

interface ToycadLearningRoomProps {
  onClose: () => void;
  mascotTheme?: MascotTheme;
  childProfile?: ChildProfile | null;
}

interface LearningModuleItem {
  id: string;
  category: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  image: string;
  progressPercent: number;
  progressLabel: string;
  isSaved: boolean;
  isDownloaded: boolean;
  cardTheme: 'white' | 'butter' | 'dark';
}

const INITIAL_MODULES: LearningModuleItem[] = [
  {
    id: 'mod-ipas',
    category: 'ipas',
    badge: 'BARU • IPAS',
    badgeColor: 'bg-[#ff4d00] text-white',
    title: 'Tata Surya & Planet 3D',
    subtitle: 'Capaian Fase B: Eksplorasi 8 Orbit Menakjubkan',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    progressPercent: 80,
    progressLabel: '80% SELESAI',
    isSaved: true,
    isDownloaded: true,
    cardTheme: 'butter'
  },
  {
    id: 'mod-matematika',
    category: 'matematika',
    badge: 'MATEMATIKA',
    badgeColor: 'bg-[#ffd000] text-black',
    title: 'Pecahan Kue Ceria',
    subtitle: 'Bagi pizza dan kue balok dengan potongan 3D',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    progressPercent: 45,
    progressLabel: '45% SELESAI',
    isSaved: false,
    isDownloaded: false,
    cardTheme: 'white'
  },
  {
    id: 'mod-seni',
    category: 'seni',
    badge: 'PRAKARYA & SENI',
    badgeColor: 'bg-[#b3f51b] text-black',
    title: 'Studio Kriya & Wayang',
    subtitle: 'Seni Rupa & Kriya Tradisional Nusantara',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    progressPercent: 100,
    progressLabel: 'SIAP BERKARYA',
    isSaved: true,
    isDownloaded: true,
    cardTheme: 'dark'
  },
  {
    id: 'mod-pancasila',
    category: 'pancasila',
    badge: 'PENDIDIKAN PANCASILA',
    badgeColor: 'bg-[#38bdf8] text-black',
    title: 'Gotong Royong & Garuda 3D',
    subtitle: 'Simbol Sila & Nilai Karakter Pancasila',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    progressPercent: 10,
    progressLabel: 'SIAP BELAJAR',
    isSaved: false,
    isDownloaded: false,
    cardTheme: 'butter'
  },
  {
    id: 'mod-pjok',
    category: 'pjok',
    badge: 'PJOK & OLAHRAGA',
    badgeColor: 'bg-[#ff4d00] text-white',
    title: 'Gerak Kebugaran 3D',
    subtitle: 'Senam Irama & Gerak Dasar Atletik Ceria',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    progressPercent: 20,
    progressLabel: 'AKTIVITAS FISIK',
    isSaved: false,
    isDownloaded: false,
    cardTheme: 'white'
  },
  {
    id: 'mod-bahasa',
    category: 'bahasa',
    badge: 'BAHASA INDONESIA',
    badgeColor: 'bg-[#ffd000] text-black',
    title: 'Petualangan Menulis Cerita',
    subtitle: 'Menyusun kalimat & dongeng bergambar 3D',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    progressPercent: 60,
    progressLabel: 'LITERASI 3D',
    isSaved: true,
    isDownloaded: false,
    cardTheme: 'dark'
  }
];

export const ToycadLearningRoom: React.FC<ToycadLearningRoomProps> = ({
  onClose,
  mascotTheme = 'cyan-jelly',
  childProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modules, setModules] = useState<LearningModuleItem[]>(INITIAL_MODULES);
  const [selectedFase, setSelectedFase] = useState<string>(
    childProfile?.fase ? `Kelas ${childProfile.fase === 'A' ? '1-2' : childProfile.fase === 'B' ? '4' : '5-6'} SD • FASE ${childProfile.fase}` : 'Kelas 4 SD • FASE B'
  );

  // Modals & Sheets
  const [isFaseModalOpen, setIsFaseModalOpen] = useState(false);
  const [activeLaunchModal, setActiveLaunchModal] = useState<LearningModuleItem | null>(null);
  const [activeCardMenu, setActiveCardMenu] = useState<LearningModuleItem | null>(null);
  const [isMengenalHewanModalOpen, setIsMengenalHewanModalOpen] = useState(false);
  const [isFloraInteractiveModalOpen, setIsFloraInteractiveModalOpen] = useState(false);

  // Stylus / Pena Pintar State
  const [isPenaActive, setIsPenaActive] = useState(false);
  const [stylusColor, setStylusColor] = useState('#b3f51b');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Mascot dynamic emotion
  const [mascotEmotion, setMascotEmotion] = useState<CharviEmotion>('happy');

  // Carousel Drag & Smooth Slide State (4 Cards Visible on Tablet Landscape & Desktop)
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(scrollLeft / maxScroll);
    }
  };

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [modules, activeCategory, activeTab]);

  // Global mouseup and touchend listener to guarantee drag states never get stuck
  useEffect(() => {
    const handleGlobalRelease = () => {
      if (isMouseDownRef.current) {
        isMouseDownRef.current = false;
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 60);
      }
      if (isPillsMouseDownRef.current) {
        isPillsMouseDownRef.current = false;
        setTimeout(() => {
          hasPillsDraggedRef.current = false;
        }, 60);
      }
    };

    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    return () => {
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
    };
  }, []);

  // Keyboard shortcut (Escape key) to cleanly dismiss active modals or tools
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeCardMenu) {
          setActiveCardMenu(null);
        } else if (activeLaunchModal) {
          setActiveLaunchModal(null);
        } else if (isFaseModalOpen) {
          setIsFaseModalOpen(false);
        } else if (isPenaActive) {
          setIsPenaActive(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCardMenu, activeLaunchModal, isFaseModalOpen, isPenaActive, onClose]);

  const handleCarouselMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const handleCarouselMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
      e.preventDefault();
      carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
      updateScrollState();
    }
  };

  const handleCarouselMouseUp = () => {
    isMouseDownRef.current = false;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 60);
  };

  // Filter Pills Drag & Smooth Slide State
  const pillsRef = useRef<HTMLDivElement | null>(null);
  const isPillsMouseDownRef = useRef<boolean>(false);
  const pillsStartXRef = useRef<number>(0);
  const pillsScrollLeftRef = useRef<number>(0);
  const hasPillsDraggedRef = useRef<boolean>(false);

  const handlePillsMouseDown = (e: React.MouseEvent) => {
    if (!pillsRef.current) return;
    isPillsMouseDownRef.current = true;
    hasPillsDraggedRef.current = false;
    pillsStartXRef.current = e.pageX - pillsRef.current.offsetLeft;
    pillsScrollLeftRef.current = pillsRef.current.scrollLeft;
  };

  const handlePillsMouseMove = (e: React.MouseEvent) => {
    if (!isPillsMouseDownRef.current || !pillsRef.current) return;
    const x = e.pageX - pillsRef.current.offsetLeft;
    const walk = (x - pillsStartXRef.current) * 1.6;
    if (Math.abs(walk) > 4) {
      hasPillsDraggedRef.current = true;
      e.preventDefault();
      pillsRef.current.scrollLeft = pillsScrollLeftRef.current - walk;
    }
  };

  const handlePillsMouseUp = () => {
    isPillsMouseDownRef.current = false;
    setTimeout(() => {
      hasPillsDraggedRef.current = false;
    }, 60);
  };

  // Canvas drawing setup with drawing retention across resizes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const curW = canvas.width;
      const curH = canvas.height;
      const targetW = window.innerWidth;
      const targetH = window.innerHeight;

      if (curW === targetW && curH === targetH) return;

      // Preserve existing drawing before resizing
      let savedData: ImageData | null = null;
      const ctx = canvas.getContext('2d');
      if (ctx && curW > 0 && curH > 0) {
        try {
          savedData = ctx.getImageData(0, 0, curW, curH);
        } catch {
          // ignore
        }
      }

      canvas.width = targetW;
      canvas.height = targetH;

      if (ctx && savedData) {
        try {
          ctx.putImageData(savedData, 0, 0);
        } catch {
          // ignore
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isPenaActive]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPenaActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    ctx.strokeStyle = stylusColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    // Draw an immediate dot so single clicks/taps register without moving
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPenaActive || !isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = stylusColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Filter modules
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchTab = activeTab === 'all' || (activeTab === 'saved' && m.isSaved);
      const matchCat = activeCategory === 'all' || m.category === activeCategory;
      return matchTab && matchCat;
    });
  }, [modules, activeTab, activeCategory]);

  const savedCount = useMemo(() => {
    return modules.filter((m) => m.isSaved).length;
  }, [modules]);

  // Toggle Save / Bookmark
  const handleToggleSave = (item: LearningModuleItem) => {
    setModules((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, isSaved: !m.isSaved } : m))
    );
    setActiveCardMenu(null);
  };

  // Toggle Download Offline
  const handleToggleDownload = (item: LearningModuleItem) => {
    setModules((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, isDownloaded: true } : m))
    );
    playCheerSound();
    setActiveCardMenu(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0e0f12] text-slate-900 select-none flex flex-col">
      {/* ================= USER UPLOADED PAPERCRAFT ISLAND BACKGROUND (FULL HD BRIGHTNESS) ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/AEtjO1Xb_vDrWKXXkrVz0aZB1AoUlas1khLRunNKr3jxQgiijiBnr01FTgxj12mxYngT3fLi3dmT7Vk-pny2rrqVBTI2X1qzBPkzWyLEbo4TGe0ydJZVPNdbHlVB0FgGij6aEGC3ukDj9e8KF_H8LBorqN3hExMjYSYgI1wCu8Ugyvs0fGLnjuMGpmDzlFYHbXnMtdqvb3P7gUtbe7jYJEz_MMuUaHxidofVV62ph_Uq8mnqrOwc07Sc0F9C9o8N=s2560')`,
            backgroundPosition: 'center center',
          }}
        />
        {/* Soft, minimal top & bottom subtle scrim so papercraft artwork stays 100% bright & crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40 pointer-events-none" />
      </div>



      {/* ================= MAIN SCROLLABLE WRAPPER (NO BOTTOM DOCK) ================= */}
      <div className="relative z-10 flex-1 overflow-y-auto tablet:overflow-hidden px-3 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-2 sm:pb-3 flex flex-col justify-start max-w-[1680px] w-full h-full mx-auto">
        
        {/* ================= TOP HEADER NAVIGATION ================= */}
        <header className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 w-full mb-2 sm:mb-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-3xl bg-black/50 backdrop-blur-xl border border-white/10 z-40 shrink-0">
          {/* Brand & Fase Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full border border-white/10 text-xs font-black transition-all cursor-pointer"
              title="Kembali ke Beranda Cincau"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Beranda</span>
            </button>

            {/* Fase Selector Pill */}
            <button
              onClick={() => {
                playPopSound();
                setIsFaseModalOpen(true);
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#b3f51b]/50 text-white shadow-md active:scale-95 transition-all cursor-pointer"
              title="Pilih Jenjang / Fase Kurikulum"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#b3f51b] shadow-[0_0_8px_#b3f51b] animate-pulse inline-block flex-shrink-0" />
              <span className="text-xs font-black tracking-wide uppercase truncate max-w-[150px] sm:max-w-none">
                {selectedFase}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-white/60 ml-0.5" />
            </button>

            {/* XP Stars - Moved here next to class button */}
            <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 shadow-md text-white select-none">
              <Star className="w-4 h-4 text-[#ffd000] fill-[#ffd000]" />
              <span className="font-black text-xs text-[#ffd000]">240</span>
            </div>
          </div>

          {/* Segmented Capsule Switch (Katalog vs Tersimpan) */}
          <div className="flex items-center bg-black/80 backdrop-blur-xl p-1 rounded-full border border-white/10 shadow-2xl">
            <button
              onClick={() => {
                playPopSound();
                setActiveTab('all');
              }}
              className={`px-5 sm:px-7 py-2 rounded-full font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Katalog Modul
            </button>
            <button
              onClick={() => {
                playPopSound();
                setActiveTab('saved');
              }}
              className={`px-5 sm:px-7 py-2 rounded-full font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Tersimpan ({savedCount})
            </button>
          </div>

          {/* Right Action Tools: Integrated Mascot & Pena Pintar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => {
                playPopSound();
                setMascotEmotion((prev) => (prev === 'excited' ? 'celebrating' : 'excited'));
              }}
            >
              {/* Mascot Mini */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 relative drop-shadow-md group-hover:scale-110 transition-transform">
                <CharviMascot
                  variant="compact-header"
                  emotion={mascotEmotion}
                  theme={mascotTheme}
                  className="w-full h-full scale-125"
                />
              </div>

              {/* Pena Pintar Header Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playPopSound();
                  setIsPenaActive(!isPenaActive);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-md active:scale-95 transition-all cursor-pointer ${
                  isPenaActive 
                    ? 'bg-[#b3f51b] text-black border-[#b3f51b]' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                }`}
              >
                <Edit3 className={`w-3.5 h-3.5 ${isPenaActive ? 'text-black' : 'text-[#b3f51b]'}`} />
                <span className="text-xs font-black uppercase tracking-tight">
                  {isPenaActive ? 'Pena Aktif' : 'Pena Pintar'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* ================= QUICK SUBJECT FILTER PILLS (SMOOTH DRAGGABLE & EXTENDED BOUNDARIES) ================= */}
        <div
          ref={pillsRef}
          onMouseDown={handlePillsMouseDown}
          onMouseMove={handlePillsMouseMove}
          onMouseUp={handlePillsMouseUp}
          onMouseLeave={handlePillsMouseUp}
          onWheel={(e) => {
            if (pillsRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              pillsRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-2 mb-2 sm:mb-3 overflow-x-auto py-1 px-1 sm:px-2 scroll-smooth no-scrollbar select-none cursor-grab active:cursor-grabbing w-full shrink-0"
        >
          {[
            { id: 'all', label: 'Pengetahuan umum', icon: '✨' },
            { id: 'agama', label: 'Agama & Budi Pekerti', color: 'bg-[#ff4d00]' },
            { id: 'pancasila', label: 'Pendidikan Pancasila', color: 'bg-[#38bdf8]' },
            { id: 'bahasa', label: 'Bahasa Indonesia', color: 'bg-[#b3f51b]' },
            { id: 'matematika', label: 'Matematika', color: 'bg-[#ffd000]' },
            { id: 'ipas', label: 'IPAS (Kls 3-6)', color: 'bg-[#00c8ff]' },
            { id: 'pjok', label: 'PJOK (Olahraga)', color: 'bg-[#ff4d00]' },
            { id: 'seni', label: 'Seni & Budaya', color: 'bg-[#b3f51b]' },
            { id: 'p5', label: 'Projek P5', color: 'bg-[#ff4d00]' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (hasPillsDraggedRef.current) return;
                  playPopSound();
                  setActiveCategory(cat.id);
                  if (carouselRef.current) {
                    carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 shrink-0 active:scale-95 transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-white text-black shadow-lg ring-2 ring-white/60'
                    : 'bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md hover:border-white/30'
                }`}
              >
                {cat.icon && <span className="text-sm leading-none">{cat.icon}</span>}
                {cat.color && <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />}
                <span className="whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
          {/* Boundary spacer to prevent last capsule clipping */}
          <div className="w-8 sm:w-12 shrink-0 h-1 pointer-events-none" aria-hidden="true" />
        </div>

        {/* ================= MAIN 4-CARD CHUNKY CAROUSEL SHELF ================= */}
        {/* Exactly 4 cards visible on tablet landscape & desktop, rest smoothly scrollable right-to-left */}
        <main
          ref={carouselRef}
          onMouseDown={handleCarouselMouseDown}
          onMouseMove={handleCarouselMouseMove}
          onMouseUp={handleCarouselMouseUp}
          onMouseLeave={handleCarouselMouseUp}
          onScroll={updateScrollState}
          onWheel={(e) => {
            if (carouselRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              carouselRef.current.scrollLeft += e.deltaY;
              updateScrollState();
            }
          }}
          className="flex-1 min-h-0 w-full flex flex-row gap-4 sm:gap-5 items-stretch overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pt-1 pb-3 px-1.5 my-0 select-none cursor-grab active:cursor-grabbing"
        >
          {/* HERO TALL CARD 1: Buku Interaktif Flora 3D (Edisi Botani & Bunga Ceria) */}
          {activeCategory === 'all' && (
            <FloraInteractiveCard 
              isDraggingRef={hasDraggedRef}
              onExplore={() => {
                playCheerSound();
                setIsFloraInteractiveModalOpen(true);
              }}
            />
          )}

          {/* HERO TALL CARD 3: Buku Interaktif Satwa Rimba & Dunia 3D (Edisi World Wonders Fauna) */}
          {activeCategory === 'all' && (
            <FaunaInteractiveCard 
              isDraggingRef={hasDraggedRef}
              onExplore={() => {
                playCheerSound();
                setIsMengenalHewanModalOpen(true);
              }}
            />
          )}

          {/* HERO TALL CARD: Mulai Belajar 3D (Original P5 Card - only shown in P5 category now) */}
          {activeCategory === 'p5' && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="toycad-card-item relative bg-white rounded-[2.2rem] p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden border border-white/80 group transition-all shrink-0"
            >
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff4d00] text-white text-[11px] font-black uppercase tracking-wider mb-3 shadow-sm">
                  PROJEK P5 & PRAKARYA
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-[1.08] mb-1.5 font-['Plus_Jakarta_Sans']">
                  Mulai Belajar 3D
                </h2>
                <p className="text-slate-600 font-bold text-xs leading-relaxed line-clamp-2">
                  Pilih modul dan gambar rancangan tugas tematikmu langsung dengan stylus.
                </p>
              </div>

              {/* Sentuh & Buat Circular Playful Zone */}
              <div className="my-4 relative flex items-center justify-center py-2">
                <div className="relative w-36 sm:w-40 h-36 sm:h-40 rounded-full bg-[#f4f7ea] flex items-center justify-center p-3 shadow-inner">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (hasDraggedRef.current) return;
                      playCheerSound();
                      setActiveLaunchModal({
                        id: 'mod-p5-studio',
                        category: 'p5',
                        badge: 'PROJEK P5',
                        badgeColor: 'bg-[#ff4d00] text-white',
                        title: 'Mulai Belajar 3D',
                        subtitle: 'Studio Pemodelan Bebas Tematik P5',
                        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
                        progressPercent: 100,
                        progressLabel: 'STUDIO AKTIF',
                        isSaved: true,
                        isDownloaded: true,
                        cardTheme: 'white'
                      });
                    }}
                    className="w-24 sm:w-28 h-24 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#b3f51b] to-[#ffd000] p-3 flex flex-col items-center justify-center shadow-lg -rotate-6 transition-transform cursor-pointer"
                  >
                    <Sparkles className="w-7 h-7 text-black mb-1" />
                    <span className="text-[10px] font-black text-black">SENTUH & BUAT</span>
                  </motion.div>

                  <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-[#ff4d00] flex items-center justify-center text-white shadow-md">
                    <Edit3 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Bottom Play Action */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (hasDraggedRef.current) return;
                    playCheerSound();
                    setActiveLaunchModal({
                      id: 'mod-p5-studio',
                      category: 'p5',
                      badge: 'PROJEK P5',
                      badgeColor: 'bg-[#ff4d00] text-white',
                      title: 'Mulai Belajar 3D',
                      subtitle: 'Studio Pemodelan Bebas Tematik P5',
                      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
                      progressPercent: 100,
                      progressLabel: 'STUDIO AKTIF',
                      isSaved: true,
                      isDownloaded: true,
                      cardTheme: 'white'
                    });
                  }}
                  className="w-12 h-12 rounded-full bg-[#b3f51b] hover:bg-[#a1e410] active:scale-95 text-black flex items-center justify-center shadow-[0_8px_20px_rgba(176,242,20,0.4)] transition-all cursor-pointer"
                  title="Mulai Sentuh & Buat"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </button>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  18 Modul Siap
                </span>
              </div>
            </motion.div>
          )}

          {/* DYNAMIC MODULE CARDS */}
          {filteredModules.map((item) => {
            const isDark = item.cardTheme === 'dark';
            const isButter = item.cardTheme === 'butter';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`toycad-card-item relative rounded-[2.2rem] shadow-2xl flex flex-col justify-between overflow-hidden p-5 sm:p-6 border transition-all shrink-0 ${
                  isDark
                    ? 'bg-[#16171b] text-white border-white/10'
                    : isButter
                    ? 'bg-[#fff9d9] text-black border-white/60'
                    : 'bg-white text-black border-white/80'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <button
                    onClick={() => {
                      if (hasDraggedRef.current) return;
                      playPopSound();
                      setActiveCardMenu(item);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md cursor-pointer ${
                      isDark ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-black/85 hover:bg-black text-white'
                    }`}
                    title="Opsi Modul"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Title & Subtitle */}
                <div>
                  <h3 className={`text-lg sm:text-xl font-black leading-tight tracking-tight mb-1 truncate ${isDark ? 'text-white' : 'text-black'}`}>
                    {item.title}
                  </h3>
                  <p className={`font-semibold text-xs leading-snug line-clamp-2 ${isDark ? 'text-white/60' : 'text-slate-700'}`}>
                    {item.subtitle}
                  </p>
                </div>

                {/* Card Image Preview Banner */}
                <div
                  onClick={() => {
                    if (hasDraggedRef.current) return;
                    playPopSound();
                    setActiveLaunchModal(item);
                  }}
                  className="relative w-full flex-1 min-h-[140px] max-h-[220px] rounded-2xl overflow-hidden my-2.5 sm:my-3 bg-slate-900 shadow-md cursor-pointer group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Progress Tag Badge */}
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[9px] font-extrabold tracking-wide">
                    {item.progressLabel}
                  </div>

                  {/* Offline / Download Icon Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasDraggedRef.current) return;
                      playPopSound();
                      handleToggleDownload(item);
                    }}
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#b3f51b] text-black flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
                    title={item.isDownloaded ? 'Tersimpan Offline' : 'Unduh Offline'}
                  >
                    {item.isDownloaded ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Bottom Play Action & Percentage */}
                <div className="flex items-center gap-3 justify-between pt-1">
                  <button
                    onClick={() => {
                      if (hasDraggedRef.current) return;
                      playCheerSound();
                      setActiveLaunchModal(item);
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#b3f51b] hover:bg-[#a1e410] active:scale-95 text-black flex items-center justify-center shadow-[0_8px_20px_rgba(176,242,20,0.4)] transition-all cursor-pointer"
                    title="Mulai Sesi Belajar"
                  >
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </button>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    {item.progressPercent}% Selesai
                  </span>
                </div>
              </motion.div>
            );
          })}
        </main>

        {/* Bottom Smooth Scroll Indicator Track */}
        <div className="flex items-center justify-between w-full mt-1.5 px-1 text-white select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b3f51b] animate-pulse" />
            <span className="text-[11px] font-black tracking-wider uppercase text-white/70">
              Kurikulum Merdeka 3D • Geser Bebas
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-extrabold text-white/60 hidden sm:inline">
              Alur Belajar Siswa
            </span>
            <div className="w-24 sm:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#b3f51b] to-[#ffd000] rounded-full transition-all duration-200"
                style={{ width: `${Math.max(25, Math.min(100, (scrollProgress * 75) + 25))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= PENA PINTAR DRAWING CANVAS OVERLAY ================= */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`fixed inset-0 z-50 cursor-crosshair ${
          isPenaActive ? 'pointer-events-auto block' : 'pointer-events-none hidden'
        }`}
        style={{ touchAction: 'none' }}
      />

      {/* PENA PINTAR FLOATING CONTROLS */}
      {isPenaActive && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 flex flex-col items-center gap-2.5 bg-black/85 backdrop-blur-xl border border-white/20 p-2.5 rounded-full shadow-2xl animate-in fade-in">
          <button
            onClick={() => setStylusColor('#b3f51b')}
            className={`w-7 h-7 rounded-full bg-[#b3f51b] border-2 transition-transform ${
              stylusColor === '#b3f51b' ? 'scale-115 border-white ring-2 ring-lime-400' : 'border-white/60'
            }`}
            title="Warna Hijau Lime"
          />
          <button
            onClick={() => setStylusColor('#ffd000')}
            className={`w-7 h-7 rounded-full bg-[#ffd000] border-2 transition-transform ${
              stylusColor === '#ffd000' ? 'scale-115 border-white ring-2 ring-yellow-400' : 'border-white/60'
            }`}
            title="Warna Kuning"
          />
          <button
            onClick={() => setStylusColor('#ff4d00')}
            className={`w-7 h-7 rounded-full bg-[#ff4d00] border-2 transition-transform ${
              stylusColor === '#ff4d00' ? 'scale-115 border-white ring-2 ring-orange-400' : 'border-white/60'
            }`}
            title="Warna Oranye"
          />
          <button
            onClick={clearCanvas}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs active:scale-90 transition-all cursor-pointer"
            title="Hapus Goresan Canvas"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPenaActive(false)}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs active:scale-90 transition-all cursor-pointer"
            title="Tutup Mode Pena"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= MODAL: PEMBUKA MODUL INTERAKTIF 3D ================= */}
      <AnimatePresence>
        {activeLaunchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLaunchModal(null)}
              className="absolute inset-0"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={activeLaunchModal.title}
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#16171b] border border-white/15 rounded-[2.5rem] p-6 sm:p-7 shadow-2xl text-white z-10 flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#b3f51b] animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#b3f51b]">
                    Memuat Sesi 3D Interaktif
                  </span>
                </div>
                <button
                  onClick={() => setActiveLaunchModal(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
                {activeLaunchModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                {activeLaunchModal.subtitle}
              </p>

              {/* 3D Visualizer Preview Box */}
              <div className="relative w-full h-44 rounded-2xl bg-black/60 border border-white/10 overflow-hidden mb-5 flex items-center justify-center">
                <img
                  src={activeLaunchModal.image}
                  alt={activeLaunchModal.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#ffd000]/20 border border-[#ffd000]/50 flex items-center justify-center text-[#ffd000] mb-2 animate-bounce">
                    <Layers className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-extrabold text-white">Visualisasi Objek 3D & Rotasi Aktif</span>
                  <span className="text-[10px] text-slate-300 mt-0.5">Dapat diputar 360°, dizoom, dan digambar dengan stylus</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveLaunchModal(null)}
                  className="w-1/3 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-black text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    playCheerSound();
                    setActiveLaunchModal(null);
                  }}
                  className="w-2/3 py-3 rounded-full bg-[#b3f51b] hover:bg-[#a1e410] text-black font-extrabold text-xs sm:text-sm active:scale-95 shadow-[0_6px_16px_rgba(176,242,20,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Masuk Ruang Belajar</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: CARD OPTIONS (3-DOT MENU) ================= */}
      <AnimatePresence>
        {activeCardMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCardMenu(null)}
              className="absolute inset-0"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Opsi Modul"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xs bg-[#18191c] border border-white/15 rounded-3xl p-5 shadow-2xl text-white z-10"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <span className="text-sm font-black truncate text-white">
                  {activeCardMenu.title}
                </span>
                <button
                  onClick={() => setActiveCardMenu(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggleSave(activeCardMenu)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-xs sm:text-sm font-bold text-left transition-all cursor-pointer"
                >
                  <Bookmark className={`w-4 h-4 ${activeCardMenu.isSaved ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                  <span>{activeCardMenu.isSaved ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}</span>
                </button>

                <button
                  onClick={() => {
                    playPopSound();
                    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                      navigator.clipboard.writeText(window.location.href).catch(() => {});
                    }
                    setActiveCardMenu(null);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-xs sm:text-sm font-bold text-left transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#38bdf8]" />
                  <span>Bagikan ke Teman Kelas</span>
                </button>

                <button
                  onClick={() => handleToggleDownload(activeCardMenu)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-xs sm:text-sm font-bold text-left transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#b3f51b]" />
                  <span>{activeCardMenu.isDownloaded ? 'Sudah Tersimpan Offline' : 'Unduh Modul Offline'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: FASE SELECTOR ================= */}
      <AnimatePresence>
        {isFaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFaseModalOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Pilih Jenjang dan Fase"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#16171b] border border-white/15 rounded-[2.5rem] p-7 shadow-2xl text-white z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#b3f51b] shadow-[0_0_8px_#b3f51b]" />
                  <h3 className="text-lg font-black text-white">Pilih Jenjang & Fase</h3>
                </div>
                <button
                  onClick={() => setIsFaseModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-white/70 mb-5 leading-relaxed">
                Pilih jenjang kelas peserta didik untuk menyesuaikan capaian pembelajaran dan modul tematik 3D.
              </p>

              <div className="flex flex-col gap-3">
                {[
                  { id: 'Kelas 1-2 SD • FASE A', title: 'FASE A (Kelas 1 - 2 SD)', desc: 'Literasi dasar, bilangan awal & eksplorasi bentuk' },
                  { id: 'Kelas 4 SD • FASE B', title: 'FASE B (Kelas 3 - 4 SD)', desc: 'Operasi hitung, IPAS bumi & gotong royong' },
                  { id: 'Kelas 5-6 SD • FASE C', title: 'FASE C (Kelas 5 - 6 SD)', desc: 'Sistem tata surya, pecahan kompleks & kriya mandiri' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      playCheerSound();
                      setSelectedFase(f.id);
                      setIsFaseModalOpen(false);
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer ${
                      selectedFase === f.id
                        ? 'bg-[#b3f51b]/15 border-[#b3f51b]/60'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div>
                      <div className={`font-black text-sm ${selectedFase === f.id ? 'text-[#b3f51b]' : 'text-white'}`}>
                        {f.title} {selectedFase === f.id ? '• Aktif' : ''}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{f.desc}</div>
                    </div>
                    {selectedFase === f.id ? (
                      <Check className="w-5 h-5 text-[#b3f51b]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mengenal Hewan Custom Modal */}
      <MengenalHewanModal 
        isOpen={isMengenalHewanModalOpen}
        onClose={() => setIsMengenalHewanModalOpen(false)}
      />

      {/* Flora Interactive Custom Modal */}
      <FloraInteractiveModal
        isOpen={isFloraInteractiveModalOpen}
        onClose={() => setIsFloraInteractiveModalOpen(false)}
      />
    </div>
  );
};
