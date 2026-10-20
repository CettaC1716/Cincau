import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  X, 
  ChevronRight, 
  Sparkles, 
  Home, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  RotateCcw, 
  Map as MapIcon,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Leaf,
  Check,
  Lock,
  Stars
} from 'lucide-react';
import { ANIMAL_DATA, AnimalTag, QuickFact } from '../data/animals';
import { ChildFriendlyGeoMap } from './ChildFriendlyGeoMap';

const TagIcon: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    case 'sparkles':
      return <Sparkles className="w-3.5 h-3.5" />;
    case 'book':
      return <BookOpen className="w-3.5 h-3.5" />;
    case 'sound':
      return <Volume2 className="w-3.5 h-3.5" />;
    case 'stars':
      return <Stars className="w-3.5 h-3.5" />;
    case 'leaf':
      return <Leaf className="w-3.5 h-3.5" />;
    case 'shield':
      return <ShieldCheck className="w-3.5 h-3.5" />;
    case 'home':
      return <Home className="w-3.5 h-3.5" />;
    case 'check':
    default:
      return <Check className="w-3.5 h-3.5" />;
  }
};

// --- Sound Synthesizer Engine (adapted from the provided HTML) ---
let audioCtx: AudioContext | null = null;
const ensureAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

const playPopChime = () => {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch(e) {}
};

const SoundSynthesizer: Record<string, () => void> = {
  singa: () => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.01, now);
    master.gain.linearRampToValueAtTime(0.5, now + 0.25);
    master.gain.exponentialRampToValueAtTime(0.4, now + 1.2);
    master.gain.exponentialRampToValueAtTime(0.001, now + 2.3);
    master.connect(ctx.destination);

    const sub = ctx.createOscillator();
    const subG = ctx.createGain();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(75, now);
    sub.frequency.linearRampToValueAtTime(115, now + 0.35);
    sub.frequency.exponentialRampToValueAtTime(45, now + 2.2);
    subG.gain.setValueAtTime(0.45, now);
    sub.connect(subG);
    subG.connect(master);
    sub.start(now);
    sub.stop(now + 2.3);

    const throat = ctx.createOscillator();
    const throatFilter = ctx.createBiquadFilter();
    throatFilter.type = 'bandpass';
    throatFilter.frequency.setValueAtTime(260, now);
    throatFilter.frequency.linearRampToValueAtTime(360, now + 0.4);
    throatFilter.Q.setValueAtTime(3.5, now);
    throat.type = 'square';
    throat.frequency.setValueAtTime(125, now);
    throat.frequency.linearRampToValueAtTime(155, now + 0.3);
    throat.frequency.exponentialRampToValueAtTime(75, now + 2.0);
    throat.connect(throatFilter);
    throatFilter.connect(master);
    throat.start(now);
    throat.stop(now + 2.3);
  },
  gajah: () => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.01, now);
    master.gain.linearRampToValueAtTime(0.4, now + 0.15);
    master.gain.exponentialRampToValueAtTime(0.001, now + 1.7);
    master.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(520, now);
    filter.frequency.exponentialRampToValueAtTime(1450, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(600, now + 1.5);
    filter.Q.setValueAtTime(4.2, now);

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(280, now);
    osc1.frequency.exponentialRampToValueAtTime(460, now + 0.32);
    osc1.frequency.exponentialRampToValueAtTime(230, now + 1.6);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(285, now);
    osc2.frequency.exponentialRampToValueAtTime(470, now + 0.32);
    osc2.frequency.exponentialRampToValueAtTime(225, now + 1.6);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(master);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.7);
    osc2.stop(now + 1.7);
  },
  panda: () => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.22, 0.44].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(340 - idx * 25, now + offset);
      osc.frequency.exponentialRampToValueAtTime(160, now + offset + 0.12);
      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
    const chirp = ctx.createOscillator();
    const cGain = ctx.createGain();
    chirp.type = 'sine';
    chirp.frequency.setValueAtTime(700, now + 0.65);
    chirp.frequency.exponentialRampToValueAtTime(1300, now + 0.82);
    chirp.frequency.exponentialRampToValueAtTime(950, now + 0.98);
    cGain.gain.setValueAtTime(0.18, now + 0.65);
    cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.98);
    chirp.connect(cGain);
    cGain.connect(ctx.destination);
    chirp.start(now + 0.65);
    chirp.stop(now + 0.98);
  },
  jerapah: () => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.linearRampToValueAtTime(190, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(115, now + 1.6);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.6);
  },
  harimau: () => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.01, now);
    master.gain.linearRampToValueAtTime(0.48, now + 0.3);
    master.gain.exponentialRampToValueAtTime(0.001, now + 1.9);
    master.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.linearRampToValueAtTime(155, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(65, now + 1.8);
    osc.connect(master);
    osc.start(now);
    osc.stop(now + 1.9);
  },
  kanguru: () => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.35].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(230 + i * 40, now + t);
      osc.frequency.exponentialRampToValueAtTime(620 + i * 60, now + t + 0.22);
      gain.gain.setValueAtTime(0.28, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.24);
    });
  },
  lumbalumba: () => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const click = ctx.createOscillator();
      const clickG = ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(2500 + i * 200, now + i * 0.08);
      clickG.gain.setValueAtTime(0.12, now + i * 0.08);
      clickG.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.04);
      click.connect(clickG);
      clickG.connect(ctx.destination);
      click.start(now + i * 0.08);
      click.stop(now + i * 0.08 + 0.04);
    }
    const whistle = ctx.createOscillator();
    const wGain = ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(1450, now + 0.38);
    whistle.frequency.exponentialRampToValueAtTime(2900, now + 0.65);
    whistle.frequency.exponentialRampToValueAtTime(1850, now + 0.95);
    wGain.gain.setValueAtTime(0.22, now + 0.38);
    wGain.gain.exponentialRampToValueAtTime(0.001, now + 0.98);
    whistle.connect(wGain);
    wGain.connect(ctx.destination);
    whistle.start(now + 0.38);
    whistle.stop(now + 0.98);
  }
};






interface MengenalHewanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MengenalHewanModal: React.FC<MengenalHewanModalProps> = ({ isOpen, onClose }) => {
  const [currentKey, setCurrentKey] = useState('singa');
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [heroMode, setHeroMode] = useState<'habitat' | 'audio' | 'map'>('habitat');
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipAnimalName, setVipModalAnimalTitle] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathError, setMathError] = useState(false);

  // Story state
  const [isNarrating, setIsNarrating] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [narrationSpeed, setNarrationSpeed] = useState(360);
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cardsTrackRef = useRef<HTMLDivElement | null>(null);

  // UI state
  const [topBanner, setTopBanner] = useState<{ emoji: string; text: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null);
  const [isFading, setIsFading] = useState(false);

  const animal = ANIMAL_DATA[currentKey];

  const showTopBanner = useCallback((emoji: string, text: string) => {
    setTopBanner({ emoji, text });
    setTimeout(() => setTopBanner(null), 4500);
  }, []);

  const showToast = useCallback((msg: string, icon = 'auto_awesome') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3400);
  }, []);

  const stopStoryNarration = useCallback(() => {
    setIsNarrating(false);
    if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const handleAnimalSelect = useCallback((key: string) => {
    if (key === currentKey) {
      triggerSound();
      return;
    }
    playPopChime();
    setIsFading(true);
    stopStoryNarration();
    setCurrentWordIdx(0);
    setTimeout(() => {
      setCurrentKey(key);
      setIsFading(false);
      const data = ANIMAL_DATA[key];
      if (SoundSynthesizer[key]) SoundSynthesizer[key]();
      showTopBanner(data.emoji, data.bannerFact);
      showToast(data.toastMsg, 'verified');
    }, 200);
  }, [currentKey, showTopBanner, showToast, stopStoryNarration]);

  const triggerSound = useCallback(() => {
    if (isPlayingSound) return;
    setIsPlayingSound(true);
    if (SoundSynthesizer[currentKey]) SoundSynthesizer[currentKey]();
    showTopBanner(animal.emoji, animal.bannerFact);
    showToast(`Mendengarkan suara asli: ${animal.name}! 🔊`, 'volume_up');
    setTimeout(() => setIsPlayingSound(false), 2200);
  }, [currentKey, isPlayingSound, animal, showTopBanner, showToast]);

  // Story Logic
  const words = useMemo(() => animal.story.text.split(' '), [animal]);

  const speakStorySpeech = useCallback((textToSpeak: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = narrationSpeed === 360 ? 0.95 : 0.72;
      utterance.pitch = 1.05;
      utterance.onend = () => {
        stopStoryNarration();
      };
      utterance.onerror = () => {
        stopStoryNarration();
      };
      window.speechSynthesis.speak(utterance);
    }
  }, [narrationSpeed, stopStoryNarration]);

  const stepStoryNarration = useCallback(() => {
    setCurrentWordIdx((prev) => {
      const next = prev + 1;
      if (next >= words.length) {
        stopStoryNarration();
        showToast('Hore! Dongeng selesai dibacakan! 🎉', 'celebration');
        return prev;
      }
      return next;
    });
  }, [words.length, stopStoryNarration, showToast]);

  useEffect(() => {
    if (isNarrating) {
      storyTimerRef.current = setTimeout(stepStoryNarration, narrationSpeed);
    }
    return () => {
      if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    };
  }, [isNarrating, currentWordIdx, narrationSpeed, stepStoryNarration]);

  const startStoryNarration = useCallback(() => {
    if (currentWordIdx >= words.length - 1) {
      setCurrentWordIdx(0);
    }
    setIsNarrating(true);
    speakStorySpeech(animal.story.text);
  }, [currentWordIdx, words.length, speakStorySpeech, animal.story.text]);

  const handleVipSubmit = () => {
    if (parseInt(mathAnswer) === 10) {
      showToast('Selamat Datang di Paket Langganan VIP Ranger! Fitur lengkap siap dijelajahi! 🎉', 'verified');
      setIsVipModalOpen(false);
    } else {
      setMathError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-0 tablet:p-3 lg:p-6 overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-full tablet:max-h-[98dvh] tablet:h-[98dvh] tablet:max-w-[1340px] bg-[#001711] rounded-none tablet:rounded-[2.2rem] shadow-2xl overflow-hidden flex flex-col border-0 tablet:border-3 border-[#ffc880]/20"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 23, 17, 0.76), rgba(0, 23, 17, 0.86)), url('https://lh3.googleusercontent.com/aida/AEtjO1Wrqgq4OsrnIBSycc_r1PPqDclE13RiK7so8lQSLa5Gr8Hza-44K-5sU3KSKYzXh9bZUuxb8a3-q1EqMcMmmhN35WLjN170or-z9PaEBZLakyxkEmCm4Di4kdxn6msyGcEY_9J7Ph_KKJUBYCnKXOLmymlLbe0BuLpgMNIyXNJ--ePdkB6QwGdYFsjbV7Gaaby9oiEbA_M9ZPYXvuKykZcx1NrvWudcW1qfLT3dZFtALoNPOlDe2C7s')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Top Banner */}
        <AnimatePresence>
          {topBanner && (
            <motion.div 
              initial={{ y: -100, x: '-50%', opacity: 0 }}
              animate={{ y: 20, x: '-50%', opacity: 1 }}
              exit={{ y: -100, x: '-50%', opacity: 0 }}
              className="fixed left-1/2 z-[110] flex items-center gap-3 bg-[#1e3a31]/95 border-2 border-[#ffc880]/60 px-5 py-3 rounded-full shadow-2xl backdrop-blur-md max-w-[92vw] whitespace-nowrap"
            >
              <div className="w-10 h-10 rounded-full bg-[#f5a623] text-[#644000] flex items-center justify-center shrink-0 text-xl shadow-inner">
                {topBanner.emoji}
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#ffc880]">Kabar Seru Rimba</span>
                <span className="text-sm tablet:text-base text-[#ffddb4] font-black">{topBanner.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 sm:px-5 tablet:px-6 lg:px-8 py-2 tablet:py-3 flex flex-col justify-between gap-2 tablet:gap-2.5">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
              <button onClick={onClose} className="flex items-center gap-1.5 text-[#d7c3ae] hover:text-[#ffc880] transition-colors text-xs font-black uppercase tracking-wider cursor-pointer">
                <Home className="w-4 h-4 text-[#ffc880]" />
                <span>Habitat Rimba</span>
              </button>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <span className="text-[#ffc880] font-black text-xs uppercase tracking-wider">{animal.breadcrumb}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f5a623] animate-pulse shadow-[0_0_8px_#f5a623]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ffc880]">Mode Edukasi Interaktif</span>
              </div>
              <button 
                onClick={onClose}
                className="w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] rounded-full bg-black/40 hover:bg-red-500/20 text-white flex items-center justify-center border border-white/20 transition-all active:scale-95 cursor-pointer shadow-md touch-target"
                title="Tutup Modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Main Showcase Grid (2-column on tablet & desktop) */}
          <div className={`grid grid-cols-1 md:grid-cols-12 tablet:grid-cols-12 gap-2.5 tablet:gap-3.5 lg:gap-5 items-stretch flex-1 min-h-0 transition-all duration-300 ${isFading ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}>
            
            {/* Hero Card - Area Utama Kotak Habitat (Singa Afrika, dll) with inline Dongeng Suara & Peta Asal */}
            <div className="md:col-span-5 tablet:col-span-5 relative group overflow-hidden rounded-[1.8rem] tablet:rounded-[2rem] bg-gradient-to-b from-[#fcdac2] to-[#e4a886] flex flex-col justify-between shadow-2xl h-full min-h-[330px] tablet:min-h-0 border-2 tablet:border-3 border-white/10">
              {/* Floating Tab Selector on Top of the Habitat Box */}
              <div className="absolute top-2.5 inset-x-2.5 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1 bg-black/65 backdrop-blur-md p-1 rounded-full border border-white/20 pointer-events-auto shadow-md">
                  <button
                    onClick={() => {
                      playPopChime();
                      setHeroMode('habitat');
                      if (isNarrating) stopStoryNarration();
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] sm:text-xs transition-all cursor-pointer ${
                      heroMode === 'habitat' 
                        ? 'bg-[#f5a623] text-[#644000] shadow-sm' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>📸</span>
                    <span>Habitat</span>
                  </button>

                  <button
                    onClick={() => {
                      playPopChime();
                      if (heroMode === 'audio') {
                        if (isNarrating) stopStoryNarration();
                        else startStoryNarration();
                      } else {
                        setHeroMode('audio');
                        startStoryNarration();
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] sm:text-xs transition-all cursor-pointer ${
                      heroMode === 'audio' 
                        ? 'bg-[#f5a623] text-[#644000] shadow-sm' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>📖</span>
                    <span>Dongeng</span>
                  </button>

                  <button
                    onClick={() => {
                      playPopChime();
                      setHeroMode('map');
                      if (isNarrating) stopStoryNarration();
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] sm:text-xs transition-all cursor-pointer ${
                      heroMode === 'map' 
                        ? 'bg-[#0f766e] text-white shadow-sm' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>🧭</span>
                    <span>Peta Asal</span>
                  </button>
                </div>

                {/* Status Indicator */}
                {heroMode === 'audio' && isNarrating && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/90 text-white font-black text-[9px] border border-white/30 animate-pulse pointer-events-auto shadow-md">
                    <Volume2 className="w-3 h-3" />
                    <span>Mendongeng...</span>
                  </span>
                )}
              </div>

              {/* VIEW 1: HABITAT PHOTO */}
              {heroMode === 'habitat' && (
                <div className="absolute inset-0 bg-[#07241d]">
                  <img 
                    src={animal.img} 
                    alt={animal.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

                  {/* Habitat Callout Banner at Bottom */}
                  <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between">
                    <div className="bg-black/60 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-white/15 text-left">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#ffc880] block">Habitat Satwa</span>
                      <span className="text-xs sm:text-sm font-black text-white">{animal.name} ({animal.breadcrumb})</span>
                    </div>

                    <button
                      onClick={triggerSound}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f5a623] hover:bg-[#ffb955] text-[#644000] flex items-center justify-center font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
                      title="Dengar Suara Auman"
                    >
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 2: INLINE AUDIO STORY PLAYER */}
              {heroMode === 'audio' && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f26] via-[#051c17] to-[#02110e] flex flex-col justify-between p-3 pt-13 text-left z-20">
                  {/* Story Mini Thumbnail & Title */}
                  <div className="flex items-center gap-2.5 bg-black/45 p-2 rounded-2xl border border-white/10 shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-[#f5a623]/40 shadow-sm relative">
                      <img src={animal.img} alt={animal.name} className="w-full h-full object-cover" />
                      {isNarrating && (
                        <div className="absolute inset-0 bg-amber-500/25 animate-pulse flex items-center justify-center">
                          <Volume2 className="w-4 h-4 text-amber-300 animate-bounce" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-wider text-[#ffc880]">
                        Pemutar Dongeng Audio Satwa
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white truncate">
                        {animal.story.title}
                      </h4>
                    </div>
                  </div>

                  {/* Read-Along Synced Text */}
                  <div className="flex-1 my-2 p-3 bg-black/40 rounded-2xl border border-white/10 overflow-y-auto no-scrollbar flex flex-col justify-center">
                    <div className="text-xs sm:text-sm font-bold text-[#cae9dd] leading-relaxed select-none">
                      {words.map((word: string, idx: number) => (
                        <motion.span
                          key={idx}
                          animate={{ 
                            backgroundColor: idx < currentWordIdx ? '#f5a623' : 'transparent',
                            color: idx < currentWordIdx ? '#001711' : '#cae9dd',
                            scale: idx === currentWordIdx - 1 ? 1.08 : 1
                          }}
                          className="inline-block mr-1.5 px-1.5 py-0.5 rounded-md cursor-pointer hover:text-[#ffc880] transition-colors"
                          onClick={() => {
                            playPopChime();
                            setCurrentWordIdx(idx);
                            setIsNarrating(false);
                          }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="bg-black/50 p-2 rounded-2xl border border-white/10 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playPopChime();
                          if (isNarrating) {
                            stopStoryNarration();
                          } else {
                            startStoryNarration();
                          }
                        }}
                        className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#f5a623] hover:bg-[#ffb955] text-[#644000] font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{isNarrating ? 'Jeda' : 'Putar'}</span>
                      </button>

                      <button
                        onClick={() => {
                          playPopChime();
                          stopStoryNarration();
                          setCurrentWordIdx(0);
                        }}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        title="Ulangi dari Awal"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 text-[9px] font-black">
                      <button
                        onClick={() => {
                          playPopChime();
                          setNarrationSpeed(360);
                        }}
                        className={`px-2 py-0.5 rounded-full transition-all ${narrationSpeed === 360 ? 'bg-[#f5a623] text-[#644000]' : 'text-neutral-400'}`}
                      >
                        1.0x
                      </button>
                      <button
                        onClick={() => {
                          playPopChime();
                          setNarrationSpeed(560);
                        }}
                        className={`px-2 py-0.5 rounded-full transition-all ${narrationSpeed === 560 ? 'bg-[#f5a623] text-[#644000]' : 'text-neutral-400'}`}
                      >
                        0.7x 🐢
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: INLINE CHILD-FRIENDLY GEOGRAPHIC MAP */}
              {heroMode === 'map' && (
                <div className="absolute inset-0 z-20">
                  <ChildFriendlyGeoMap
                    animalKey={currentKey}
                    animalName={animal.name}
                    animalEmoji={animal.emoji}
                    onClose={() => setHeroMode('habitat')}
                  />
                </div>
              )}
            </div>

            {/* Info Card - Formatted matching Flora Modal layout with dark green rimba theme */}
            <div className="md:col-span-7 tablet:col-span-7 relative overflow-hidden rounded-[1.8rem] tablet:rounded-[2rem] bg-[#132f27]/90 p-3 tablet:p-3.5 lg:p-5 flex flex-col justify-between shadow-2xl border-2 tablet:border-3 border-white/10 h-full min-h-0" style={{ 
              backgroundImage: `linear-gradient(rgba(19, 47, 39, 0.94), rgba(7, 36, 29, 0.96)), url('https://lh3.googleusercontent.com/aida/AEtjO1Wrqgq4OsrnIBSycc_r1PPqDclE13RiK7so8lQSLa5Gr8Hza-44K-5sU3KSKYzXh9bZUuxb8a3-q1EqMcMmmhN35WLjN170or-z9PaEBZLakyxkEmCm4Di4kdxn6msyGcEY_9J7Ph_KKJUBYCnKXOLmymlLbe0BuLpgMNIyXNJ--ePdkB6QwGdYFsjbV7Gaaby9oiEbA_M9ZPYXvuKykZcx1NrvWudcW1qfLT3dZFtALoNPOlDe2C7s')`,
              backgroundSize: 'cover'
            }}>
              <div className="relative z-10 flex flex-col gap-1.5 tablet:gap-2">
                {/* 1. Header Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {animal.tags.map((tag: AnimalTag, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        playPopChime();
                        showToast(tag.fact, 'lightbulb');
                      }}
                      className={`px-2.5 py-0.5 tablet:px-3 tablet:py-1 rounded-full text-[9px] tablet:text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all active:scale-95 cursor-pointer ${tag.class}`}
                    >
                      <TagIcon icon={tag.icon} />
                      <span>{tag.label}</span>
                    </button>
                  ))}
                </div>

                {/* 2. Title Row & Audio Button */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl sm:text-2xl tablet:text-2xl lg:text-3xl font-black text-[#ffc880] tracking-tight leading-none mb-1">{animal.name}</h1>
                    <button 
                      onClick={triggerSound}
                      className="relative px-3.5 py-1.5 rounded-full bg-[#f5a623]/20 border border-[#f5a623]/60 text-[#ffc880] hover:bg-[#f5a623]/30 transition-all text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 shadow-xs"
                    >
                      {isPlayingSound && (
                        <span className="absolute -inset-1 rounded-full border-2 border-[#f5a623] animate-ping opacity-75 pointer-events-none" />
                      )}
                      <Volume2 className={`w-4 h-4 text-[#f5a623] ${isPlayingSound ? 'animate-bounce' : ''}`} />
                      <span>{isPlayingSound ? 'Mengaum...' : 'Dengar Suara'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-[#baeed9] mt-0.5">
                    <span>{animal.story.caption}</span>
                    <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[#baeed9]">({animal.latin})</span>
                  </p>
                </div>

                {/* 3. Quick Facts Section */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f5a623]" />
                    <span className="text-[10px] tablet:text-[11px] font-black uppercase tracking-wider text-[#ffc880]">Fakta Kilat Ramah Anak</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 tablet:gap-2">
                    {animal.quickFacts.map((fact: QuickFact, i: number) => (
                      <div 
                        key={i}
                        className={`bg-black/30 border ${fact.border} rounded-xl tablet:rounded-2xl p-2 tablet:p-2.5 flex flex-col items-center text-center gap-0.5 tablet:gap-1 transition-all hover:bg-black/40 cursor-pointer`}
                        onClick={() => {
                          playPopChime();
                          if (i === 2) setHeroMode('map');
                        }}
                      >
                        <div className={`w-8 h-8 tablet:w-9 tablet:h-9 rounded-full ${fact.bg} flex items-center justify-center text-lg tablet:text-xl shadow-inner shrink-0`}>
                          {fact.icon}
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[11px] tablet:text-xs font-black text-[#ffc880] uppercase tracking-wider">{fact.title}</span>
                          <p className="text-[10px] sm:text-xs text-[#d7c3ae] font-bold leading-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: fact.text }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Interactive Tale Summary Banner */}
                <div 
                  onClick={() => {
                    playPopChime();
                    setHeroMode('audio');
                    startStoryNarration();
                  }}
                  className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 shadow-2xs text-left bg-black/40 hover:bg-black/55 border border-[#f5a623]/30 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg shrink-0 bg-[#f5a623]/20 border border-[#f5a623]/40">
                    📜
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5 text-[#ffc880]">
                      <span className="truncate">{animal.story.title}</span>
                      <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-[#f5a623] text-[#644000] shrink-0">Dongeng Rimba</span>
                    </span>
                    <p className="text-xs sm:text-sm text-[#ffddb4] font-bold leading-snug mt-0.5 line-clamp-2">
                      {animal.story.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. Primary Action Callout Buttons - Inline Toggles */}
              <div className="relative z-10 pt-1.5 tablet:pt-2 flex items-center gap-2">
                <button 
                  onClick={() => {
                    playPopChime();
                    const nextMode = heroMode === 'audio' ? 'habitat' : 'audio';
                    setHeroMode(nextMode);
                    if (nextMode === 'audio') {
                      startStoryNarration();
                    } else {
                      stopStoryNarration();
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 tablet:py-2.5 rounded-full font-black border-2 transition-all cursor-pointer text-xs tablet:text-sm active:scale-95 ${
                    heroMode === 'audio'
                      ? 'bg-[#ffb955] text-[#4d2403] border-white shadow-[0_0_15px_rgba(245,166,35,0.7)] ring-2 ring-amber-300'
                      : 'bg-[#f5a623] text-[#644000] border-[#ffddb4] shadow-[0_3px_0_#644000] hover:bg-[#ffb955]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#644000]" />
                  <span className="tracking-tight truncate">
                    {heroMode === 'audio' ? 'Tutup Dongeng' : 'Putar Dongeng Suara'}
                  </span>
                </button>

                <button 
                  onClick={() => {
                    playPopChime();
                    const nextMode = heroMode === 'map' ? 'habitat' : 'map';
                    setHeroMode(nextMode);
                    if (isNarrating) stopStoryNarration();
                  }}
                  className={`flex items-center justify-center gap-1.5 px-3.5 py-2 tablet:py-2.5 rounded-full font-black border-2 transition-all cursor-pointer text-xs shrink-0 active:scale-95 ${
                    heroMode === 'map'
                      ? 'bg-[#0f766e] text-white border-white shadow-[0_0_15px_rgba(15,118,110,0.7)] ring-2 ring-teal-300'
                      : 'bg-[#0f766e] text-white border-[#5eead4] shadow-[0_3px_0_#064e3b] hover:bg-[#0d5c56]'
                  }`}
                >
                  <MapIcon className="w-4 h-4 text-white" />
                  <span>{heroMode === 'map' ? 'Tutup Peta' : 'Peta Asal'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Section (Bottom, visible in one screen) */}
          <div className="shrink-0 flex flex-col gap-1 tablet:gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 tablet:w-7 tablet:h-7 rounded-full bg-[#f5a623] flex items-center justify-center text-[#644000]">
                  <Stars className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm tablet:text-base lg:text-lg font-black text-[#cae9dd] tracking-tight">Koleksi Satwa Rimba</h2>
                <span className="text-[10px] text-[#ffc880] font-bold hidden sm:inline">• Ketuk untuk Mengganti</span>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => {
                    if (cardsTrackRef.current) {
                      cardsTrackRef.current.scrollBy({ left: -220, behavior: 'smooth' });
                      playPopChime();
                    }
                  }}
                  className="w-7 h-7 tablet:w-8 tablet:h-8 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                  title="Geser Kiri"
                >
                  <ArrowLeft className="w-3.5 h-3.5 tablet:w-4 tablet:h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (cardsTrackRef.current) {
                      cardsTrackRef.current.scrollBy({ left: 220, behavior: 'smooth' });
                      playPopChime();
                    }
                  }}
                  className="w-7 h-7 tablet:w-8 tablet:h-8 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                  title="Geser Kanan"
                >
                  <ArrowRight className="w-3.5 h-3.5 tablet:w-4 tablet:h-4" />
                </button>
              </div>
            </div>

            <div ref={cardsTrackRef} className="flex gap-2.5 tablet:gap-3.5 overflow-x-auto no-scrollbar pt-3 pb-3.5 px-2 -my-2 snap-x scroll-smooth items-center">
              {Object.keys(ANIMAL_DATA).map((key) => {
                const item = ANIMAL_DATA[key];
                const isActive = currentKey === key;
                return (
                  <motion.div
                    key={key}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAnimalSelect(key)}
                    className={`snap-start shrink-0 w-22 h-22 sm:w-24 sm:h-24 tablet:w-26 tablet:h-26 lg:w-34 lg:h-34 rounded-xl tablet:rounded-2xl overflow-hidden relative cursor-pointer border-2 tablet:border-3 transition-all duration-300 origin-center ${
                      isActive 
                        ? 'border-[#f5a623] shadow-lg shadow-[#f5a623]/30 scale-105 z-20 ring-2 ring-[#ffddb4]' 
                        : 'border-white/10 opacity-75 hover:opacity-100 hover:border-white/40 hover:z-10'
                    }`}
                  >
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-1.5 left-2 right-2">
                      <span className="text-white font-black text-[11px] tablet:text-xs block leading-tight">{item.breadcrumb}</span>
                      <span className="text-[#ffc880] text-[8px] tablet:text-[9px] font-bold italic line-clamp-1">({item.latin})</span>
                    </div>
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 bg-[#f5a623] text-[#644000] px-1.5 py-0.5 rounded-full text-[8px] font-black flex items-center gap-0.5 shadow-md">
                        <Sparkles className="w-2 h-2" /> AKTIF
                      </div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* VIP LOCKED CARDS MOCKUP */}
              <motion.div 
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playPopChime();
                  setVipModalAnimalTitle('Beruang Kutub');
                  setIsVipModalOpen(true);
                }}
                className="snap-start shrink-0 w-22 h-22 sm:w-24 sm:h-24 tablet:w-26 tablet:h-26 lg:w-34 lg:h-34 rounded-xl tablet:rounded-2xl overflow-hidden relative cursor-pointer border-2 tablet:border-3 border-white/10 opacity-60 grayscale hover:opacity-90 transition-all origin-center hover:z-10"
              >
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1UM4h37dgUZZKJZVTQJoFXuKOX_ey73Z8myLd7Y4b5NyjK3YLcWWwXmmDk6PxTj4esKYE8QcghF3LtJLsSGNItcdwORpHgzb20uXWr3zVlYfvuUTlVRgp4ChQR8LN4TU6JLI6BMRI6XaAlpSRo63gnwFVeWiJvpvj2qg12Dx2Bvt0RrnIIKmwNS10B5z4y6L33dcoUtXuw-nGQZHGYAzN_helMWwi6Jlp83fNj_ilvdM0eK70X65x4R" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-1.5">
                  <Lock className="w-5 h-5 tablet:w-6 tablet:h-6 text-[#f5a623] mb-0.5" />
                  <span className="text-[#ffc880] font-black text-[8px] tablet:text-[9px] uppercase tracking-wider">VIP RANGER</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>





        {/* VIP Parental Modal */}
        <AnimatePresence>
          {isVipModalOpen && (
            <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
               <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsVipModalOpen(false)}
                className="absolute inset-0"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg bg-[#132f27] border-4 border-[#f5a623] rounded-[3rem] shadow-2xl overflow-hidden p-8 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#f5a623] flex items-center justify-center text-2xl">🌟</div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#baeed9]">Parental Gate</span>
                        <h3 className="text-xl font-black text-[#ffc880]">Koleksi VIP: {vipAnimalName}</h3>
                      </div>
                   </div>
                   <button onClick={() => setIsVipModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"><X /></button>
                </div>

                <div className="bg-[#07241d] p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                   <p className="text-sm text-[#cae9dd] font-bold">Selesaikan tantangan di bawah untuk membuka fitur ini:</p>
                   <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-[#ffc880] bg-black/40 px-6 py-3 rounded-2xl border border-[#f5a623]/30">6 + 4 = ?</span>
                      <input 
                        type="number" 
                        value={mathAnswer}
                        onChange={(e) => {
                          setMathAnswer(e.target.value);
                          setMathError(false);
                        }}
                        placeholder="?"
                        className="flex-1 bg-black/20 border-2 border-white/10 rounded-2xl px-4 py-3 text-center text-2xl font-black text-[#ffc880] focus:border-[#f5a623] outline-none"
                      />
                   </div>
                   {mathError && <span className="text-red-400 text-xs font-black text-center">Jawaban salah, coba lagi ya Ayah/Bunda!</span>}
                   <button 
                    onClick={handleVipSubmit}
                    className="w-full bg-[#f5a623] text-[#644000] py-4 rounded-2xl font-black text-lg shadow-xl"
                   >
                     Buka Akses
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   {['Bebas Iklan', 'Audio Kuis', 'Tanpa Batas', 'Lencana Ranger'].map((perk, i) => (
                     <div key={i} className="flex items-center gap-2 bg-white/5 p-3 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-[#f5a623]" />
                        <span className="text-[10px] font-black text-[#cae9dd]">{perk}</span>
                     </div>
                   ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 right-8 z-[150] bg-[#1e3a31]/95 border-2 border-[#ffc880]/60 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-4 max-w-sm"
            >
              <div className="w-10 h-10 rounded-full bg-[#f5a623] text-[#644000] flex items-center justify-center shrink-0 shadow-lg">
                {toast.icon === 'lightbulb' ? <Lightbulb /> : <Sparkles />}
              </div>
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-[#ffc880] block mb-1">Catatan Petualang Cilik</span>
                <span className="text-xs text-white font-bold leading-tight">{toast.msg}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.main>
    </div>
  );
};
