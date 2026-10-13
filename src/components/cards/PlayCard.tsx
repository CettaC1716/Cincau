import React from 'react';
import { motion } from 'motion/react';
import { PlayCardItem } from '../../types';

interface PlayCardProps {
  card: PlayCardItem;
  onClick: () => void;
}

export const PlayCard: React.FC<PlayCardProps> = ({ card, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`w-[178px] mobile-lg:w-[195px] tablet:w-[235px] tablet-md:w-[260px] shrink-0 snap-start rounded-[22px] tablet:rounded-[26px] bg-white/95 backdrop-blur-xs border-2 ${card.cardBorder} shadow-lg shadow-emerald-950/10 flex flex-col justify-between overflow-hidden cursor-pointer transition-all group select-none`}
    >
      <div className={`h-15 mobile-lg:h-18 tablet:h-24 bg-gradient-to-br ${card.headerBg} relative flex flex-col items-center justify-center p-2 mobile-lg:p-2.5 overflow-hidden border-b border-black/5`}>
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-white/20 rounded-full blur-xs pointer-events-none" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/20 rounded-full blur-xs pointer-events-none" />

        <span className={`absolute top-2 left-2 text-[10px] tablet:text-xs font-black px-2.5 py-0.5 rounded-full bg-white/95 shadow-2xs border border-white/80 ${card.badgeColor}`}>
          {card.badge}
        </span>

        <div className="text-2xl mobile-lg:text-3xl tablet:text-4xl drop-shadow-md group-hover:scale-115 transition-transform duration-200 mt-0.5">
          {card.icon}
        </div>
      </div>

      <div className="p-3 mobile-lg:p-3.5 tablet:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-black text-xs tablet:text-base text-neutral-900 leading-tight">
            {card.title}
          </h4>
          <p className="text-[10px] mobile-lg:text-[11px] tablet:text-[13px] text-neutral-500 font-medium mt-0.5 leading-snug line-clamp-1">
            {card.subtitle}
          </p>
        </div>

        <div className="mt-2 pt-2 tablet:mt-2.5 tablet:pt-2.5 border-t border-neutral-100 flex items-center justify-between">
          <span className={`text-[10px] tablet:text-xs font-extrabold px-2 py-0.5 rounded-lg ${card.rewardColor}`}>
            {card.reward}
          </span>
          <span className={`text-xs tablet:text-sm font-black text-white px-2.5 mobile-lg:px-3 py-1 mobile-lg:py-1.5 rounded-xl shadow-xs ${card.btnBg} group-hover:shadow-md transition-all`}>
            Main ▶
          </span>
        </div>
      </div>
    </motion.div>
  );
};
