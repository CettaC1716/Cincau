import React, { useRef, useEffect } from 'react';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

interface BentoActionCardsProps {
  selectedMode?: 'learn' | 'play' | null;
  onSelectMode: (mode: 'learn' | 'play') => void;
  onOpenLearningRoom?: () => void;
  onOpenPlayRoom?: () => void;
  onOpenDrawingStudio?: () => void;
  className?: string;
  isCompact?: boolean;
}

const SPARK_COLORS = ['#a3e635', '#38bdf8', '#fb923c', '#facc15', '#f43f5e', '#818cf8'];

const BENTO_IMAGES = {
  // IMAGE_29: Budi & Siti belajar bersama di bawah pohon perpustakaan ajaib
  membaca: 'https://lh3.googleusercontent.com/aida/AEtjO1XYV3u5DXyEQCSM01Tw4jZqQYJlUnYuyOE8ab91u8Blys4uCtnVyD_wa0rdAiliIEJPIseHklm_0kuws6u0ZGcvfUnacNwwYWmTS5YQvJbFWkrq5NZOrf4IINJ6WeRSeQwhjCf_4J63DXiTAaXuDwIJOrnYPRuw6BUrcEgyeHZOiiV2D86nis8JnF6AxEO_7yYiyFk8WegBdPEF2wNmqRTLG9espokln23YBKbXVGFPFQ8HkmTDMPHoMeE',
  // IMAGE_28: Budi menerbangkan pesawat kertas ajaib
  mainGame: 'https://lh3.googleusercontent.com/aida/AEtjO1X3dl4AVbNPja_CVWO1pUSOyNzU2392sCkzyygSDhOfbAAoOWqFcuj_o9xBk-skggaA9k02J491hjAOLviuwcuIPN2bmmjZe2fLXbYsrvYqNHkjBJ0y4G7HxNhUD5XGI0Uo4FHO1ANKd3ZiMKHRJIHMhYYrEe2rkduZqOjSbMU4Nomcd7fH4oU3tgGa5nE-2a7xu3sP93mIpJXh8O1fvuRLk5HPR_799guhDUNQ1a3nsZkxsvOyx1Zkvxw',
  // IMAGE_27: Siti melukis dengan kuas ajaib dan pelangi
  menggambar: 'https://lh3.googleusercontent.com/aida/AEtjO1WAD5u9xIGRv1BJ740OeQYJERGc_lc_WJgZ4BhSyKvsaC0Uq3Px72Jl0BBuJ5dCl5lbyGrWbvwPNd4fCx4MmWIThv8PvI1XB3QyJPsvxrFcmIhiwFUG3s3q8EZC7QTUtrQRg4b557Ja5ZpdkPohJE9z2p8u6lsPBfrhVzsfVPpXj3T7bWhHRec48Y_2HXRswFJ5u9n0wfmPELWCTPQOgSHCMiOLd2AOa14-EnTcryEo7We2oTGDahmwcg',
};

export const BentoActionCards: React.FC<BentoActionCardsProps> = ({
  selectedMode,
  onSelectMode,
  onOpenLearningRoom,
  onOpenPlayRoom,
  onOpenDrawingStudio,
  className = '',
  isCompact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup 3D Tilt Physics
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = container.querySelectorAll<HTMLElement>('.tilt-card');

    const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    };

    const handleMouseLeave = (card: HTMLElement) => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    const listeners: { card: HTMLElement; onMove: (e: MouseEvent) => void; onLeave: () => void }[] = [];

    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => handleMouseMove(e, card);
      const onLeave = () => handleMouseLeave(card);

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      listeners.push({ card, onMove, onLeave });
    });

    return () => {
      listeners.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  // Sparkle generator
  const spawnSparkles = (e: React.MouseEvent<HTMLElement>, card: HTMLElement) => {
    const rect = card.getBoundingClientRect();
    const originX = e.clientX - rect.left;
    const originY = e.clientY - rect.top;

    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'click-sparkle';

      const size = Math.floor(Math.random() * 10) + 8;
      const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];

      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
      const distance = Math.floor(Math.random() * 50) + 40;
      const tx = `${Math.cos(angle) * distance}px`;
      const ty = `${Math.sin(angle) * distance}px`;

      particle.style.left = `${originX - size / 2}px`;
      particle.style.top = `${originY - size / 2}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.setProperty('--tx', tx);
      particle.style.setProperty('--ty', ty);

      particle.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="${color}">
        <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z"/>
      </svg>`;

      card.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  };

  // Ripple effect
  const triggerRipple = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    circle.classList.add('ripple-circle');

    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;

    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  const handleCardClick = (
    e: React.MouseEvent<HTMLElement>,
    actionType: 'learn' | 'play' | 'draw'
  ) => {
    const card = e.currentTarget as HTMLElement;
    spawnSparkles(e, card);
    triggerRipple(e);

    if (actionType === 'learn') {
      playCheerSound();
      if (onOpenLearningRoom) onOpenLearningRoom();
      else onSelectMode('learn');
    } else if (actionType === 'play') {
      playPopSound();
      if (onOpenPlayRoom) onOpenPlayRoom();
      else onSelectMode('play');
    } else {
      playPopSound();
      if (onOpenDrawingStudio) onOpenDrawingStudio();
    }
  };

  return (
    <div
      ref={containerRef}
      data-purpose="bento-grid-wrapper"
      className={`relative z-20 grid grid-cols-1 tablet:grid-cols-12 tablet-md:grid-cols-12 ${isCompact ? 'gap-4 sm:gap-5' : 'gap-5 tablet:gap-5 tablet-md:gap-6'} w-full max-w-[1400px] mx-auto items-stretch px-2.5 sm:px-4 ${className}`}
    >
      {/* Ambient Floating Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none rounded-[32px]">
        <div className="absolute top-[12%] left-[8%] w-7 h-7 rounded-lg bg-purple-200/40 rotate-12 backdrop-blur-sm shadow-sm" style={{ animation: 'floatDrift 7s ease-in-out infinite' }} />
        <div className="absolute top-[18%] right-[12%] w-9 h-9 rounded-full bg-amber-200/50 backdrop-blur-sm shadow-sm" style={{ animation: 'floatDrift 9s ease-in-out infinite 1.5s' }} />
        <div className="absolute bottom-[14%] left-[10%] w-8 h-8 bg-purple-200/40 rotate-45 rounded-md backdrop-blur-sm shadow-sm" style={{ animation: 'floatDrift 8s ease-in-out infinite 0.7s' }} />
        <div className="absolute bottom-[18%] right-[8%] w-6 h-6 bg-rose-300/40 rounded-full backdrop-blur-sm shadow-sm" style={{ animation: 'floatDrift 6.5s ease-in-out infinite 2s' }} />
        <div className="absolute top-[50%] left-[3%] w-5 h-5 bg-sky-200/40 rotate-12 rounded-md backdrop-blur-sm shadow-sm" style={{ animation: 'floatDrift 8.5s ease-in-out infinite 3s' }} />
        <div className="absolute top-[65%] right-[6%] w-7 h-7 border-2 border-pink-200/60 rounded-xl rotate-45 backdrop-blur-sm shadow-sm" style={{ animation: 'floatDrift 7.5s ease-in-out infinite 1.2s' }} />
      </div>

      {/* LEFT COLUMN (Hero Area: Membaca) */}
      <section 
        onClick={(e) => handleCardClick(e, 'learn')}
        className={`card-enter-1 tilt-card tablet:col-span-7 tablet-md:col-span-7 h-[380px] tablet:h-[400px] tablet-md:h-[420px] lg:h-[520px] rounded-[32px] bg-white border border-white/70 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.985] transition-all duration-300 ease-out cursor-pointer relative flex flex-col justify-between overflow-hidden group ${
          selectedMode === 'learn' ? 'ring-4 ring-[#a3e635] shadow-[0_0_25px_rgba(163,230,53,0.35)]' : ''
        }`}
      >
        {/* Top Content */}
        <div className="relative z-20 p-6 tablet-md:p-8 lg:p-10 select-none">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-lime-100 text-lime-900 border border-lime-200/80 mb-3 group-hover:bg-lime-200 transition-colors">UTAMA • LITERASI</span>
          <h2 className="text-3xl tablet-md:text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight mb-2 group-hover:text-black transition-colors font-sans">Membaca</h2>
          <p className="text-xs tablet-md:text-sm lg:text-base font-medium text-slate-500 max-w-[340px] leading-relaxed group-hover:text-slate-600 transition-colors">Eksplorasi Kurikulum Merdeka & Tantangan Seru Bersama</p>
        </div>

        {/* Magical 3D Diorama Illustration */}
        <div className="absolute inset-0 overflow-hidden flex items-end justify-center pointer-events-none rounded-[32px]">
          <img 
            alt="Budi & Siti belajar bersama di bawah pohon perpustakaan ajaib" 
            className="w-full h-full object-cover object-bottom rounded-[32px] transition-transform duration-500 ease-out group-hover:scale-105 animate-float-diorama" 
            src={BENTO_IMAGES.membaca}
            referrerPolicy="no-referrer"
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 12%, rgba(0,0,0,0.45) 28%, rgba(0,0,0,0.9) 46%, black 65%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 12%, rgba(0,0,0,0.45) 28%, rgba(0,0,0,0.9) 46%, black 65%)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/80 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white via-white/85 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Action Area */}
        <div className="relative z-20 p-6 tablet-md:p-8 lg:p-10 flex items-center justify-between">
          <button 
            type="button"
            className="interactive-btn btn-lime-pulse inline-flex items-center gap-3 px-5 tablet-md:px-6 py-3 tablet-md:py-4 rounded-full bg-[#a3e635] text-[#0f172a] font-extrabold text-sm tablet-md:text-base shadow-[0_10px_25px_rgba(163,230,53,0.5)] active:scale-95 transition-all duration-200 hover:brightness-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#a3e635]/40 group/btn"
          >
            <span>Mulai Membaca</span>
            <div className="w-7 h-7 tablet-md:w-8 tablet-md:h-8 rounded-full bg-black/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0f172a] fill-current ml-0.5 group-hover/btn:translate-x-0.5 transition-transform" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* RIGHT COLUMN (Two stacked wide cards) */}
      <div className="tablet:col-span-5 tablet-md:col-span-5 flex flex-col justify-between gap-4 tablet:gap-4 tablet-md:gap-6 h-full">
        {/* CARD 2 (Top Right: Main Game) */}
        <section 
          onClick={(e) => handleCardClick(e, 'play')}
          className={`card-enter-2 flex-1 min-h-[190px] tablet:min-h-[190px] tablet-md:min-h-[200px] lg:min-h-[245px] rounded-[32px] bg-white border border-white/70 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.985] transition-all duration-300 ease-out cursor-pointer p-5 tablet:p-5 tablet-md:p-6 lg:p-7 relative flex justify-between overflow-hidden group tilt-card ${
            selectedMode === 'play' ? 'ring-4 ring-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.35)]' : ''
          }`}
        >
          {/* Left Content */}
          <div className="relative z-20 max-w-[210px] select-none flex flex-col justify-between h-full">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block group-hover:text-sky-600 transition-colors">PETUALANGAN GAME</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mt-1 mb-2 font-sans">Main Game</h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-2">Petualangan interaktif seru dengan misi menyenangkan.</p>
            </div>
            <div className="pt-4">
              <button className="interactive-btn relative overflow-hidden w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center text-white shadow-lg shadow-slate-900/20 active:scale-90 active:rotate-3 transition-all duration-200 hover:bg-[#0f172a] hover:scale-105 cursor-pointer focus:outline-none group/btn">
                <svg className="w-5 h-5 fill-current ml-0.5 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Character 3D Diorama Visual */}
          <div className="absolute right-0 bottom-0 top-0 w-[270px] sm:w-[300px] pointer-events-none overflow-hidden flex items-end justify-end rounded-r-[32px] z-10">
            <img 
              alt="Budi menerbangkan pesawat kertas ajaib" 
              className="w-full h-full object-cover object-center rounded-r-[32px] transition-transform duration-500 ease-out group-hover:scale-105 animate-boy-bounce" 
              src={BENTO_IMAGES.mainGame}
              referrerPolicy="no-referrer"
              style={{ 
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 12%, black 35%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 12%, black 35%)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-20% to-transparent to-45% pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Plane Glint */}
            <div className="absolute top-[30%] left-[35%] z-20 w-3 h-3 text-sky-400 animate-plane-glint">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
              </svg>
            </div>
          </div>
        </section>

        {/* CARD 3 (Bottom Right: Menggambar) */}
        <section 
          onClick={(e) => handleCardClick(e, 'draw')}
          className="card-enter-3 flex-1 min-h-[190px] tablet:min-h-[190px] tablet-md:min-h-[200px] lg:min-h-[245px] rounded-[32px] bg-white border border-white/70 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.985] transition-all duration-300 ease-out cursor-pointer p-5 tablet:p-5 tablet-md:p-6 lg:p-7 relative flex justify-between overflow-hidden group tilt-card"
        >
          {/* Left Content */}
          <div className="relative z-20 max-w-[210px] select-none flex flex-col justify-between h-full">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block group-hover:text-amber-600 transition-colors">KREASI & SENI</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mt-1 mb-2 font-sans">Menggambar</h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-2">Kanvas kreasi warna-warni penuh imajinasi anak.</p>
            </div>
            <div className="pt-4">
              <button className="interactive-btn relative overflow-hidden w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center text-white shadow-lg shadow-slate-900/20 active:scale-90 active:rotate-3 transition-all duration-200 hover:bg-[#0f172a] hover:scale-105 cursor-pointer focus:outline-none group/btn">
                <svg className="w-5 h-5 fill-current ml-0.5 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Character 3D Diorama Visual */}
          <div className="absolute right-0 bottom-0 top-0 w-[270px] sm:w-[300px] pointer-events-none overflow-hidden flex items-end justify-end rounded-r-[32px] z-10">
            <img 
              alt="Siti melukis dengan kuas ajaib dan pelangi" 
              className="w-full h-full object-cover object-center rounded-r-[32px] transition-transform duration-500 ease-out group-hover:scale-105 animate-girl-draw" 
              src={BENTO_IMAGES.menggambar}
              referrerPolicy="no-referrer"
              style={{ 
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 12%, black 35%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 12%, black 35%)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-20% to-transparent to-45% pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Pencil Sparkle */}
            <div className="absolute bottom-[35%] left-[25%] z-20 w-3 h-3 text-amber-400 animate-pencil-sparkle">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
