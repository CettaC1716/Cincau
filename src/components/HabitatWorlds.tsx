import React from 'react';

export const HabitatWorlds: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <div className="w-full h-full relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-amber-50/30 to-emerald-50/40" />

        {/* Sunbeams */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-gradient-radial from-amber-200/40 via-sky-100/20 to-transparent rounded-full blur-2xl animate-pulse" />

        {/* Ambient Background Light & Soft Mists */}
        <div className="absolute top-12 left-4 w-40 h-20 bg-sky-100/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-20 right-6 w-48 h-24 bg-amber-100/25 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Jelly Bits */}
        <div className="absolute top-1/3 left-10 text-amber-400 text-lg animate-bounce">✨</div>
        <div className="absolute top-1/2 right-12 text-cyan-400 text-base animate-pulse">🌟</div>
        <div className="absolute top-2/3 left-16 text-emerald-400 text-sm animate-ping [animation-delay:1.5s]">💫</div>
      </div>
    </div>
  );
};
