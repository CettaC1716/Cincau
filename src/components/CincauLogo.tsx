import React from 'react';

interface CincauLogoProps {
  variant?: 'green' | 'black';
  className?: string;
  showShadow?: boolean;
  onClick?: () => void;
}

export const CincauLogo: React.FC<CincauLogoProps> = ({
  variant = 'green',
  className = 'w-48 h-auto',
  showShadow = true,
  onClick,
}) => {
  const isBlack = variant === 'black';

  return (
    <div
      onClick={onClick}
      className={`relative inline-block shrink-0 select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <img
        src={isBlack ? '/logos/cincau_logo_black.svg' : '/logos/cincau_logo_green.svg'}
        alt="Cincau Logo"
        className={`${className} ${showShadow ? 'drop-shadow-md' : ''} transition-all duration-300 pointer-events-none object-contain`}
      />
    </div>
  );
};
