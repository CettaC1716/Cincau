import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Undo,
  Trash2,
  Grid,
  Sparkles,
  X,
  Award,
  CheckCircle2,
  Edit,
  Brush,
  Paintbrush,
  Wand2,
  Eraser,
  PaintBucket,
  Plus,
  Play,
  Cloud,
  Palette
} from 'lucide-react';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

interface DrawingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ToolType = 'pencil' | 'crayon' | 'watercolor' | 'glow' | 'eraser' | 'bucket';

const MASCOT_IMAGES = {
  budi: 'https://lh3.googleusercontent.com/aida/AEtjO1WhPU5gNWxcdmbh_YzALEyOvWb0TlIlK7KyujnFH4ET4syYyEh2YT9J4rijXWU3ClD1skdvpOx4dEyzbrT1N6kNL_t9NSNpyoPMpNwqLU_2L-lL48k--uvpjAMwhjlf6MEV-ebO4N_xzAygwxfPUm2DD_LgiAlvEIArnEn1QexrXJl_OwrOgFLopB-ENIQI-tpu1Id68l-mKyyDUNM-0t_axl_aPmE7_5HL9szK6l3FwL9511FmgqlaqyI',
  siti: 'https://lh3.googleusercontent.com/aida/AEtjO1WKOvw2t8ScDWiUYnj5aJ_1_J6D0Uz2vH83YbbL0oH4Ruj-ZHNAYB775sBQ34SNfBBds6FqixPI1_jOztCUivflsAWGB8Ogb90iJFPEMx-yPrgwlYOOMimd3u3Pm85C5R4TseIodJynmsWI_Xlgx-xDeoq2P4-SI2FyaBkBhboj9RQo5SVVom1tUlmWsUvWON7ocFk9CeSXpiH5erMRkiRx4rRmWsjGwutwODrLI_u2S99TXfkw4BRLjsg',
};

const PALETTE_COLORS = [
  { name: 'Merah Stroberi', hex: '#EF4444' },
  { name: 'Oranye Jeruk', hex: '#F97316' },
  { name: 'Kuning Pisang', hex: '#FACC15' },
  { name: 'Hijau Limau', hex: '#A3E635' },
  { name: 'Hijau Mint', hex: '#10B981' },
  { name: 'Biru Langit', hex: '#0EA5E9' },
  { name: 'Ungu Permen', hex: '#8B5CF6' },
  { name: 'Merah Muda Ceria', hex: '#EC4899' },
  { name: 'Cokelat Kayu', hex: '#78350F' },
  { name: 'Biru Tua / Hitam', hex: '#1E293B' },
  { name: 'Putih Kapur', hex: '#FFFFFF' },
];

export const DrawingStudioModal: React.FC<DrawingStudioModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drawing state
  const [currentTool, setCurrentTool] = useState<ToolType>('pencil');
  const [currentColor, setCurrentColor] = useState<string>('#EF4444');
  const [currentSize, setCurrentSize] = useState<number>(10);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [currentXP, setCurrentXP] = useState<number>(120);

  // Drawer & Modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<'stickers' | 'coloring'>('stickers');
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Undo / Redo history stack
  const [historyStack, setHistoryStack] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Mouse / Touch drawing state
  const isDrawingRef = useRef<boolean>(false);
  const lastCoordsRef = useRef<{ x: number; y: number } | null>(null);

  // Trigger Toast Notification
  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMsg(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  }, []);

  // Save Canvas Snapshot
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistoryStack((prev) => {
      const nextStack = prev.slice(0, historyStep + 1);
      if (nextStack.length >= 25) nextStack.shift();
      return [...nextStack, snapshot];
    });
    setHistoryStep((prev) => Math.min(prev + 1, 24));
  }, [historyStep]);

  // Init Canvas Dimensions
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistoryStack([initialSnapshot]);
    setHistoryStep(0);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  }, [isOpen, initCanvas]);

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyStep <= 0) return;
    playPopSound();
    const nextStep = historyStep - 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.putImageData(historyStack[nextStep], 0, 0);
    setHistoryStep(nextStep);
    showToast('Goresan diurungkan (Undo)');
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    playPopSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
    showToast('Kanvas telah dibersihkan kembali putih!');
  };

  // Fill Canvas with color
  const fillCanvasWithColor = (color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    saveSnapshot();
    showToast(`Kanvas diwarnai latar ${color}!`);
  };

  // Get coordinates
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Drawing Stroke
  const startStroke = (e: React.MouseEvent | React.TouchEvent) => {
    if ('button' in e && e.button !== 0) return;
    const coords = getCanvasCoords(e);

    if (currentTool === 'bucket') {
      fillCanvasWithColor(currentColor);
      return;
    }

    isDrawingRef.current = true;
    lastCoordsRef.current = coords;
  };

  const drawStroke = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !lastCoordsRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    const dpr = window.devicePixelRatio || 1;
    const effectiveSize = currentSize * dpr;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lastCoordsRef.current.x, lastCoordsRef.current.y);
    ctx.lineTo(coords.x, coords.y);

    if (currentTool === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = effectiveSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      ctx.stroke();
    } else if (currentTool === 'crayon') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = effectiveSize * 1.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = currentColor;
      ctx.shadowBlur = 4 * dpr;
      ctx.stroke();
    } else if (currentTool === 'watercolor') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = effectiveSize * 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.38;
      ctx.shadowColor = currentColor;
      ctx.shadowBlur = 6 * dpr;
      ctx.stroke();
    } else if (currentTool === 'glow') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = effectiveSize * 1.3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.95;
      ctx.shadowColor = currentColor;
      ctx.shadowBlur = 16 * dpr;
      ctx.stroke();
    } else if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = effectiveSize * 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      ctx.stroke();
    }

    ctx.restore();
    lastCoordsRef.current = coords;
  };

  const endStroke = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastCoordsRef.current = null;
      saveSnapshot();
    }
  };

  // Stamp Mascot Image onto Canvas
  const stampMascot = (key: 'budi' | 'siti') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playCheerSound();
    const imgUrl = MASCOT_IMAGES[key];
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      const targetW = 180 * dpr;
      const targetH = 180 * dpr;
      const posX = (canvas.width - targetW) / 2 + (Math.random() * 80 - 40) * dpr;
      const posY = (canvas.height - targetH) / 2 + (Math.random() * 80 - 40) * dpr;

      ctx.save();
      ctx.drawImage(img, posX, posY, targetW, targetH);
      ctx.restore();

      saveSnapshot();
      showToast(`✨ Stiker ${key === 'budi' ? 'Budi Juara' : 'Siti Ceria'} berhasil ditempel!`);
    };
    img.src = imgUrl;
  };

  // Stamp Emoji onto Canvas
  const stampEmoji = (emoji: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playCheerSound();
    const dpr = window.devicePixelRatio || 1;
    const posX = canvas.width / 2 + (Math.random() * 180 - 90) * dpr;
    const posY = canvas.height / 2 + (Math.random() * 180 - 90) * dpr;

    ctx.save();
    ctx.font = `${60 * dpr}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 6 * dpr;
    ctx.fillText(emoji, posX, posY);
    ctx.restore();

    saveSnapshot();
    showToast(`⭐ Stiker ${emoji} ditempel di kanvas!`);
  };

  // Draw Sketch Outline
  const drawSketchOutline = (sketchType: 'rumah' | 'burung' | 'mobil') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playPopSound();
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 4 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (sketchType === 'rumah') {
      ctx.beginPath();
      ctx.moveTo(cx - 180 * dpr, cy + 60 * dpr);
      ctx.lineTo(cx, cy - 120 * dpr);
      ctx.lineTo(cx + 180 * dpr, cy + 60 * dpr);
      ctx.lineTo(cx + 130 * dpr, cy + 170 * dpr);
      ctx.lineTo(cx - 130 * dpr, cy + 170 * dpr);
      ctx.closePath();
      ctx.stroke();

      ctx.strokeRect(cx - 35 * dpr, cy + 85 * dpr, 70 * dpr, 85 * dpr);
      ctx.strokeRect(cx - 110 * dpr, cy + 75 * dpr, 45 * dpr, 45 * dpr);
      ctx.strokeRect(cx + 65 * dpr, cy + 75 * dpr, 45 * dpr, 45 * dpr);
      showToast('🏠 Sketsa Rumah Nusantara siap diwarnai!');
    } else if (sketchType === 'burung') {
      ctx.beginPath();
      ctx.arc(cx, cy - 40 * dpr, 70 * dpr, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy + 80 * dpr, 100 * dpr, 65 * dpr, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 70 * dpr, cy - 45 * dpr);
      ctx.lineTo(cx + 120 * dpr, cy - 35 * dpr);
      ctx.lineTo(cx + 70 * dpr, cy - 25 * dpr);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(cx + 30 * dpr, cy - 50 * dpr, 7 * dpr, 0, Math.PI * 2);
      ctx.fill();
      showToast('🦅 Sketsa Burung Sahabat Hutan siap diwarnai!');
    } else if (sketchType === 'mobil') {
      ctx.strokeRect(cx - 170 * dpr, cy, 340 * dpr, 85 * dpr);
      ctx.beginPath();
      ctx.moveTo(cx - 110 * dpr, cy);
      ctx.lineTo(cx - 60 * dpr, cy - 75 * dpr);
      ctx.lineTo(cx + 85 * dpr, cy - 75 * dpr);
      ctx.lineTo(cx + 135 * dpr, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx - 85 * dpr, cy + 85 * dpr, 34 * dpr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 85 * dpr, cy + 85 * dpr, 34 * dpr, 0, Math.PI * 2);
      ctx.stroke();
      showToast('🚗 Sketsa Mobil Masa Depan siap diwarnai!');
    }

    ctx.restore();
    saveSnapshot();
  };

  // Save to Gallery
  const handleSaveToGallery = () => {
    playCheerSound();
    setCurrentXP((prev) => prev + 30);
    showToast('🎉 Hebat! Karyamu berhasil disimpan ke Galeri MerdekaKids! (+30 XP diperoleh)');
  };

  // Get active tool name label
  const getToolLabel = () => {
    switch (currentTool) {
      case 'pencil':
        return 'Pensil';
      case 'crayon':
        return 'Krayon';
      case 'watercolor':
        return 'Cat Air';
      case 'glow':
        return 'Neon';
      case 'eraser':
        return 'Hapus';
      case 'bucket':
        return 'Ember Cat';
      default:
        return 'Alat';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 w-screen h-screen bg-[#121316] text-[#e3e2e6] overflow-hidden select-none font-sans"
      >
        {/* Fullscreen Canvas Workspace */}
        <div ref={containerRef} className="fixed inset-0 w-full h-full bg-white z-0">
          {/* Grid Pattern */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-25 z-10 transition-opacity"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
          )}

          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={startStroke}
            onMouseMove={drawStroke}
            onMouseUp={endStroke}
            onMouseLeave={endStroke}
            onTouchStart={startStroke}
            onTouchMove={drawStroke}
            onTouchEnd={endStroke}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          />

          {/* Footer Context Info */}
          <div className="absolute bottom-3 left-24 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <CheckCircle2 className="w-4 h-4 text-lime-400" />
            <span>Kurikulum Merdeka Seni Rupa: Eksplorasi Garis &amp; Bentuk</span>
          </div>

          <div className="absolute bottom-3 right-20 z-10 pointer-events-none hidden md:block text-xs text-slate-400 font-bold">
            Pena Pintar Studio v2.4 • Kanvas Penuh
          </div>
        </div>

        {/* 1. FLOATING SLEEK TOP HEADER BAR */}
        <header className="fixed top-3 left-3 right-3 z-40 pointer-events-none flex items-center justify-between gap-3">
          {/* Left Pill: Title & Badge */}
          <div className="pointer-events-auto flex items-center gap-2.5 bg-[#1f1f23]/90 backdrop-blur-xl px-4 py-2 rounded-full border border-[#343538]/40 shadow-2xl">
            <button
              onClick={() => { playPopSound(); onClose(); }}
              className="w-7 h-7 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center transition-all mr-1"
              title="Keluar / Tutup"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-xl font-extrabold text-white tracking-tight hidden md:inline">
              Pena Pintar
            </span>
            <span className="bg-[#d73b00] text-[#fffbff] px-2.5 py-0.5 rounded-full text-[10px] font-black">
              FASE A/B • SD
            </span>
          </div>

          {/* Center Pill: Undo, Active Stroke Indicator, Redo */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#1f1f23]/90 backdrop-blur-xl px-2 py-1.5 rounded-full border border-[#343538]/40 shadow-2xl">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyStep <= 0}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#292a2d] text-[#c2cab0] hover:text-white hover:bg-[#38393c] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
              title="Urungkan (Undo)"
            >
              <Undo className="w-4 h-4" />
            </button>

            <div className="px-2.5 py-1 flex items-center gap-2 max-w-[150px] sm:max-w-[220px]">
              <span
                className="w-3 h-3 rounded-full shadow-inner transition-colors shrink-0"
                style={{ backgroundColor: currentTool === 'eraser' ? '#ffffff' : currentColor }}
              />
              <span className="text-xs font-bold text-white truncate">
                {getToolLabel()} ({currentSize}px)
              </span>
            </div>
          </div>

          {/* Right Pill: XP, Grid, Clear, Download, Drawer Toggle */}
          <div className="pointer-events-auto flex items-center gap-2 bg-[#1f1f23]/90 backdrop-blur-xl px-2.5 py-1.5 rounded-full border border-[#343538]/40 shadow-2xl">
            {/* XP Counter Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#1b1b1f] px-3 py-1 rounded-full shadow-inner">
              <Award className="w-4 h-4 text-[#a3e635]" />
              <span className="text-sm font-black text-[#a3e635]">+{currentXP} XP</span>
            </div>

            {/* Grid Toggle */}
            <button
              type="button"
              onClick={() => {
                setShowGrid(!showGrid);
                showToast(showGrid ? 'Garis bantu grid dinonaktifkan' : 'Garis bantu grid diaktifkan');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                showGrid ? 'bg-[#a3e635] text-[#213600]' : 'bg-[#1f1f23] text-white hover:bg-[#38393c]'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Garis</span>
            </button>

            {/* Clear Canvas */}
            <button
              type="button"
              onClick={handleClearCanvas}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#93000a] hover:bg-[#93000a]/80 text-[#ffdad6] text-xs font-bold transition-all shadow-xs"
              title="Bersihkan Kanvas"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Bersih</span>
            </button>

            <div className="h-5 w-px bg-[#343538] mx-0.5" />

            {/* Creative Drawer Toggle */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setIsDrawerOpen(!isDrawerOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#a3e635] text-[#213600] font-black text-xs shadow-[0_4px_12px_rgba(204,255,128,0.3)] hover:brightness-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Stiker &amp; Simpan</span>
            </button>
          </div>
        </header>

        {/* 2. LEFT FLOATING TACTILE TOOL DOCK */}
        <aside className="fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 bg-[#1b1b1f]/95 backdrop-blur-xl p-2 rounded-2xl border border-[#343538]/40 shadow-2xl">
          {/* Tool 1: Pensil */}
          <button
            type="button"
            onClick={() => { playPopSound(); setCurrentTool('pencil'); }}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all ${
              currentTool === 'pencil'
                ? 'bg-[#a3e635] text-[#213600] shadow-[0_4px_12px_rgba(204,255,128,0.35)] scale-105 font-bold'
                : 'bg-[#292a2d] text-white hover:bg-[#343538]'
            }`}
            title="Pensil Ajaib"
          >
            <Edit className="w-5 h-5" />
            <span className="text-[9px] font-extrabold leading-none mt-0.5">Pensil</span>
          </button>

          {/* Tool 2: Krayon */}
          <button
            type="button"
            onClick={() => { playPopSound(); setCurrentTool('crayon'); }}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all ${
              currentTool === 'crayon'
                ? 'bg-[#a3e635] text-[#213600] shadow-[0_4px_12px_rgba(204,255,128,0.35)] scale-105 font-bold'
                : 'bg-[#292a2d] text-white hover:bg-[#343538]'
            }`}
            title="Krayon Bertekstur"
          >
            <Brush className="w-5 h-5" />
            <span className="text-[9px] leading-none mt-0.5 font-bold">Krayon</span>
          </button>

          {/* Tool 3: Cat Air */}
          <button
            type="button"
            onClick={() => { playPopSound(); setCurrentTool('watercolor'); }}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all ${
              currentTool === 'watercolor'
                ? 'bg-[#a3e635] text-[#213600] shadow-[0_4px_12px_rgba(204,255,128,0.35)] scale-105 font-bold'
                : 'bg-[#292a2d] text-white hover:bg-[#343538]'
            }`}
            title="Kuas Cat Air Lembut"
          >
            <Paintbrush className="w-5 h-5" />
            <span className="text-[9px] leading-none mt-0.5 font-bold">Cat Air</span>
          </button>

          {/* Tool 4: Neon */}
          <button
            type="button"
            onClick={() => { playPopSound(); setCurrentTool('glow'); }}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all ${
              currentTool === 'glow'
                ? 'bg-[#a3e635] text-[#213600] shadow-[0_4px_12px_rgba(204,255,128,0.35)] scale-105 font-bold'
                : 'bg-[#292a2d] text-white hover:bg-[#343538]'
            }`}
            title="Spidol Neon Ajaib"
          >
            <Wand2 className="w-5 h-5" />
            <span className="text-[9px] leading-none mt-0.5 font-bold">Neon</span>
          </button>

          {/* Tool 5: Hapus */}
          <button
            type="button"
            onClick={() => { playPopSound(); setCurrentTool('eraser'); }}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all ${
              currentTool === 'eraser'
                ? 'bg-[#a3e635] text-[#213600] shadow-[0_4px_12px_rgba(204,255,128,0.35)] scale-105 font-bold'
                : 'bg-[#292a2d] text-white hover:bg-[#343538]'
            }`}
            title="Penghapus Bersih"
          >
            <Eraser className="w-5 h-5" />
            <span className="text-[9px] leading-none mt-0.5 font-bold">Hapus</span>
          </button>

          {/* Tool 6: Ember */}
          <button
            type="button"
            onClick={() => { playPopSound(); setCurrentTool('bucket'); }}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all ${
              currentTool === 'bucket'
                ? 'bg-[#a3e635] text-[#213600] shadow-[0_4px_12px_rgba(204,255,128,0.35)] scale-105 font-bold'
                : 'bg-[#292a2d] text-white hover:bg-[#343538]'
            }`}
            title="Ember Warna Latar"
          >
            <PaintBucket className="w-5 h-5" />
            <span className="text-[9px] leading-none mt-0.5 font-bold">Ember</span>
          </button>

          {/* Size Divider */}
          <div className="h-px w-8 bg-[#343538] my-1" />

          {/* Size Selector */}
          <div className="flex flex-col items-center gap-1 bg-[#1f1f23] p-1 rounded-full">
            <button
              type="button"
              onClick={() => { playPopSound(); setCurrentSize(4); }}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                currentSize === 4 ? 'bg-[#a3e635] text-[#213600]' : 'bg-[#0d0e11] text-slate-400'
              }`}
              title="Ukuran Thin (4px)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
            </button>

            <button
              type="button"
              onClick={() => { playPopSound(); setCurrentSize(10); }}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                currentSize === 10 ? 'bg-[#a3e635] text-[#213600]' : 'bg-[#0d0e11] text-slate-400'
              }`}
              title="Ukuran Medium (10px)"
            >
              <span className="w-3 h-3 rounded-full bg-current" />
            </button>

            <button
              type="button"
              onClick={() => { playPopSound(); setCurrentSize(22); }}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                currentSize === 22 ? 'bg-[#a3e635] text-[#213600]' : 'bg-[#0d0e11] text-slate-400'
              }`}
              title="Ukuran Thick (22px)"
            >
              <span className="w-4 h-4 rounded-full bg-current" />
            </button>
          </div>
        </aside>

        {/* 3. BOTTOM FLOATING HORIZONTAL COLOR PALETTE DOCK */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] bg-[#1b1b1f]/95 backdrop-blur-xl px-3.5 py-2 rounded-full border border-[#343538]/40 shadow-2xl flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline pl-1">
            Warna:
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {PALETTE_COLORS.map((col) => (
              <button
                key={col.hex}
                type="button"
                onClick={() => {
                  playPopSound();
                  setCurrentColor(col.hex);
                }}
                className={`w-9 h-9 min-w-[36px] rounded-full transition-all active:scale-95 shadow-md ${
                  currentColor === col.hex ? 'ring-4 ring-offset-2 ring-[#a3e635] scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>

          {/* Rainbow Picker */}
          <label className="flex items-center gap-1.5 bg-[#1f1f23] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#38393c] transition-all shrink-0 relative">
            <span
              className="w-5 h-5 rounded-full inline-block shadow-inner"
              style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
            />
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <span className="text-xs font-bold text-white hidden md:inline">Pelangi</span>
          </label>
        </div>

        {/* 4. RIGHT RETRACTABLE CREATIVE DRAWER */}
        <aside
          className={`fixed top-16 right-3 bottom-16 z-40 w-80 max-w-[calc(100vw-24px)] bg-[#1b1b1f]/95 backdrop-blur-2xl rounded-2xl border border-[#343538]/40 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-[calc(100%+24px)]'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-3 border-b border-[#343538]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#a3e635]" />
              <span className="font-extrabold text-white text-base">Kotak Kreatif</span>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-[#292a2d] hover:bg-[#38393c] text-white flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 no-scrollbar">
            {/* Big Action: Save to Gallery (+30 XP) */}
            <div className="bg-[#1f1f23] p-2.5 rounded-xl shadow-md flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleSaveToGallery}
                className="w-full py-3 px-3 rounded-full bg-[#a3e635] text-[#213600] font-black text-sm flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(204,255,128,0.35)] hover:brightness-105 active:scale-95 transition-all"
              >
                <Award className="w-5 h-5" />
                <span>Simpan Galeri (+30 XP)</span>
              </button>
              <div className="flex items-center justify-between px-1 text-slate-400 text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5 text-[#a3e635]" /> Otomatis Tersimpan
                </span>
                <span className="text-white">Format HD PNG</span>
              </div>
            </div>

            {/* Segmented Pill Switcher */}
            <div className="w-full bg-[#1f1f23] p-1 rounded-full flex items-center justify-between shadow-inner">
              <button
                type="button"
                onClick={() => setDrawerTab('stickers')}
                className={`w-1/2 py-1.5 rounded-full text-xs font-bold transition-all ${
                  drawerTab === 'stickers' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stiker Maskot
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('coloring')}
                className={`w-1/2 py-1.5 rounded-full text-xs font-bold transition-all ${
                  drawerTab === 'coloring' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Buku Sketsa
              </button>
            </div>

            {/* TAB PANEL 1: STICKERS */}
            {drawerTab === 'stickers' && (
              <div className="flex flex-col gap-3">
                {/* Official Mascot Stamping Card */}
                <div className="bg-[#1f1f23] rounded-xl p-2.5 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#d73b00] text-[#fffbff] px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                      MASKOT RESMI SD
                    </span>
                    <span className="text-[11px] text-[#a3e635] font-bold flex items-center gap-0.5">
                      Tap Tempel
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-0.5">
                    {/* Budi */}
                    <button
                      type="button"
                      onClick={() => stampMascot('budi')}
                      className="flex flex-col items-center bg-[#292a2d] p-2 rounded-xl hover:bg-[#38393c] transition-all text-left group active:scale-95"
                    >
                      <div className="w-full aspect-square bg-[#FAF9F5] rounded-xl overflow-hidden flex items-center justify-center p-1 relative">
                        <img
                          src={MASCOT_IMAGES.budi}
                          alt="Budi Juara"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-[#a3e635] rounded-full p-0.5">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <span className="text-xs font-black text-white mt-1">Budi Juara</span>
                      <span className="text-[10px] text-slate-400 font-bold">Karakter 3D</span>
                    </button>

                    {/* Siti */}
                    <button
                      type="button"
                      onClick={() => stampMascot('siti')}
                      className="flex flex-col items-center bg-[#292a2d] p-2 rounded-xl hover:bg-[#38393c] transition-all text-left group active:scale-95"
                    >
                      <div className="w-full aspect-square bg-[#FAF9F5] rounded-xl overflow-hidden flex items-center justify-center p-1 relative">
                        <img
                          src={MASCOT_IMAGES.siti}
                          alt="Siti Ceria"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-[#a3e635] rounded-full p-0.5">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <span className="text-xs font-black text-white mt-1">Siti Ceria</span>
                      <span className="text-[10px] text-slate-400 font-bold">Karakter 3D</span>
                    </button>
                  </div>
                </div>

                {/* Emoji Stamps Grid */}
                <div className="bg-[#1f1f23] rounded-xl p-2.5 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Stiker Hiasan</span>
                    <span className="text-[10px] text-slate-400 font-bold">Tap ke kanvas</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['⭐', '🌈', '☀️', '🦋', '🏕️', '🥇', '🚀', '🌳'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => stampEmoji(emoji)}
                        className="h-12 rounded-xl bg-[#292a2d] flex items-center justify-center text-xl hover:bg-[#a3e635]/20 hover:scale-110 active:scale-95 transition-all shadow-xs"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB PANEL 2: COLORING TEMPLATES */}
            {drawerTab === 'coloring' && (
              <div className="flex flex-col gap-2.5">
                <div className="bg-[#1f1f23] rounded-xl p-2.5 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Pilih Sketsa</span>
                    <span className="text-[10px] text-[#a3e635] font-bold">Tema Nusantara</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => drawSketchOutline('rumah')}
                    className="w-full bg-[#292a2d] hover:bg-[#38393c] p-2.5 rounded-xl flex items-center gap-2.5 text-left transition-all active:scale-95"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 p-1 text-2xl">
                      🏠
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">Rumah Nusantara</span>
                      <span className="text-[11px] text-slate-400 font-bold">Arsitektur Tradisional</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => drawSketchOutline('burung')}
                    className="w-full bg-[#292a2d] hover:bg-[#38393c] p-2.5 rounded-xl flex items-center gap-2.5 text-left transition-all active:scale-95"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 p-1 text-2xl">
                      🦅
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">Burung Garuda</span>
                      <span className="text-[11px] text-slate-400 font-bold">Flora &amp; Fauna Indah</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => drawSketchOutline('mobil')}
                    className="w-full bg-[#292a2d] hover:bg-[#38393c] p-2.5 rounded-xl flex items-center gap-2.5 text-left transition-all active:scale-95"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 p-1 text-2xl">
                      🚗
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">Mobil Listrik Pintar</span>
                      <span className="text-[11px] text-slate-400 font-bold">Kendaraan Canggih SD</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Mini Tutorial Card */}
            <div
              onClick={() => { playPopSound(); setIsTutorialOpen(true); }}
              className="bg-[#1f1f23] rounded-xl p-2.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#292a2d] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#fccd24] flex items-center justify-center text-slate-900 font-black text-lg shadow-xs">
                  🐥
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold">Tutorial Hari Ini</span>
                  <span className="text-xs font-extrabold text-[#ffe087]">Gambar Anak Ayam 3D</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#292a2d] text-white flex items-center justify-center hover:text-[#a3e635] transition-all">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          </div>
        </aside>

        {/* Toast Notification */}
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#38393c] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-[#8c947c]/30 text-sm font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-[#a3e635]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}

        {/* Tutorial Modal: Gambar Anak Ayam 3D */}
        <AnimatePresence>
          {isTutorialOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-[#1b1b1f] rounded-2xl p-5 border border-[#424936] shadow-2xl flex flex-col gap-4 text-white"
              >
                <div className="flex items-center justify-between border-b border-[#343538] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#fccd24] text-slate-900 flex items-center justify-center text-xl font-black shadow-xs">
                      🐥
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white leading-tight">
                        Tutorial: Gambar Anak Ayam 3D
                      </h3>
                      <p className="text-xs text-slate-400 font-bold">
                        Langkah mudah untuk seniman cilik
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTutorialOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#292a2d] hover:bg-[#38393c] text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 py-1">
                  <div className="flex items-start gap-3 p-3 bg-[#1f1f23] rounded-xl">
                    <span className="w-7 h-7 rounded-full bg-[#a3e635] text-[#213600] font-black flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Buat Dua Lingkaran</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Gambar lingkaran kecil untuk kepala dan lingkaran lebih besar di bawahnya untuk badan ayam warna kuning ceria.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#1f1f23] rounded-xl">
                    <span className="w-7 h-7 rounded-full bg-[#a3e635] text-[#213600] font-black flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Tambahkan Paruh &amp; Mata</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Gunakan warna oranye untuk paruh segitiga kecil, dan titik hitam mungil untuk mata bersinar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#1f1f23] rounded-xl">
                    <span className="w-7 h-7 rounded-full bg-[#a3e635] text-[#213600] font-black flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Sayap Lembut &amp; Kaki</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Goreskan bentuk kurva sayap di samping badan dan dua garis cakar oranye di bawahnya.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#343538]">
                  <button
                    type="button"
                    onClick={() => setIsTutorialOpen(false)}
                    className="px-4 py-2.5 rounded-full bg-[#1f1f23] hover:bg-[#292a2d] font-bold text-sm text-white"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTutorialOpen(false);
                      setIsDrawerOpen(false);
                      setCurrentColor('#FACC15');
                      setCurrentTool('pencil');
                      showToast('🎨 Pensil Kuning aktif! Yuk mulai gambar anak ayam!');
                    }}
                    className="px-4 py-2.5 rounded-full bg-[#a3e635] text-[#213600] font-black text-sm flex items-center gap-1.5 shadow-[0_4px_12px_rgba(204,255,128,0.3)] hover:brightness-105"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Mulai Menggambar</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
