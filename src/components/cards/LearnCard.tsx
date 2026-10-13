import React from 'react';
import { motion } from 'motion/react';
import { LearnCardItem } from '../../types';

interface LearnCardProps {
  card: LearnCardItem;
  onClick: () => void;
}

export const LearnCard: React.FC<LearnCardProps> = ({ card, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`w-[178px] mobile-lg:w-[195px] tablet:w-[235px] tablet-md:w-[260px] shrink-0 snap-start rounded-[22px] tablet:rounded-[26px] bg-white/95 backdrop-blur-xs border-2 ${card.cardBorder} shadow-lg shadow-amber-950/10 flex flex-col justify-between overflow-hidden cursor-pointer transition-all group select-none`}
    >
      <div className={`h-15 mobile-lg:h-18 tablet:h-24 bg-gradient-to-br ${card.headerBg} relative flex flex-col items-center justify-center p-2 mobile-lg:p-2.5 overflow-hidden border-b border-black/5`}>
        <span className={`absolute top-2 left-2 text-[10px] tablet:text-xs font-black px-2.5 py-0.5 rounded-full bg-white/95 shadow-2xs border border-white/80 ${card.badgeColor}`}>
          {card.category}
        </span>

        {card.illustrationType === 'math' ? (
          <div className="text-2xl mobile-lg:text-3xl tablet:text-4xl font-black text-orange-950/90 tracking-widest flex items-center gap-1.5 mt-0.5">
            <span>×</span>
            <span>÷</span>
            <span>+</span>
            <span>−</span>
          </div>
        ) : card.illustrationType === 'literacy' ? (
          <div className="text-2xl mobile-lg:text-3xl tablet:text-4xl font-black text-amber-950/90 tracking-wider flex items-center gap-1 font-serif mt-0.5">
            <span>a</span>
            <span>s</span>
            <span>d</span>
            <span>f</span>
          </div>
        ) : card.illustrationType === 'custom' ? (
          <div className="text-2xl mobile-lg:text-3xl tablet:text-4xl text-sky-700/85 drop-shadow-sm mt-0.5">
            ✦
          </div>
        ) : card.illustrationType === 'art' ? (
          <div className="text-2xl mobile-lg:text-3xl tablet:text-4xl drop-shadow-md group-hover:scale-115 transition-transform duration-200 mt-0.5">
            🎨
          </div>
        ) : card.illustrationType === 'history' ? (
          <div className="text-2xl mobile-lg:text-3xl tablet:text-4xl drop-shadow-md group-hover:scale-115 transition-transform duration-200 mt-0.5">
            🏛️
          </div>
        ) : (
          <div className="text-2xl mobile-lg:text-3xl tablet:text-4xl drop-shadow-md group-hover:scale-115 transition-transform duration-200 mt-0.5">
            🪐
          </div>
        )}
      </div>

      <div className={`p-3 mobile-lg:p-3.5 tablet:p-4 flex-1 flex flex-col justify-between ${card.bodyBg}`}>
        <div>
          <h4 className="font-black text-xs tablet:text-base text-neutral-900 leading-tight">
            {card.title}
          </h4>
          <p className="text-[10px] mobile-lg:text-[11px] tablet:text-[13px] text-neutral-600 font-medium mt-0.5 leading-snug line-clamp-2">
            {card.subtitle}
          </p>
        </div>

        <div className="mt-2 pt-2 tablet:mt-2.5 tablet:pt-2.5 border-t border-black/5 flex items-center justify-between">
          <span className="text-[10px] tablet:text-xs font-extrabold px-2 py-0.5 rounded-lg bg-white shadow-2xs border border-neutral-100 text-neutral-700">
            {card.reward}
          </span>
          <span className={`text-xs tablet:text-sm font-black ${card.accentColor} flex items-center gap-0.5 group-hover:translate-x-1 transition-transform`}>
            <span>Buka</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
