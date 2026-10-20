import React from 'react';

interface SalonItemIconProps extends React.SVGProps<SVGSVGElement> {
  type: 'glasses' | 'crown' | 'bow' | 'star' | 'flower' | 'palette';
  className?: string;
}

export const SalonItemIcon: React.FC<SalonItemIconProps> = ({ type, className = 'w-10 h-10', ...props }) => {
  switch (type) {
    case 'glasses':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="20" cy="36" r="14" stroke="#78350F" strokeWidth="4" fill="#FEF3C7" fillOpacity="0.6" />
          <circle cx="44" cy="36" r="14" stroke="#78350F" strokeWidth="4" fill="#FEF3C7" fillOpacity="0.6" />
          <path d="M 34 36 L 30 36" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <path d="M 6 30 L 2 26" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <path d="M 58 30 L 62 26" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <path d="M 12 48 L 16 24 L 28 36 L 32 16 L 36 36 L 48 24 L 52 48 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="16" cy="24" r="3" fill="#EF4444" />
          <circle cx="32" cy="16" r="3.5" fill="#3B82F6" />
          <circle cx="48" cy="24" r="3" fill="#EF4444" />
          <rect x="10" y="48" width="44" height="6" rx="3" fill="#D97706" stroke="#B45309" strokeWidth="2" />
        </svg>
      );
    case 'bow':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="32" cy="32" r="7" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
          <path d="M 27 28 C 16 16, 6 24, 14 36 C 22 42, 28 37, 28 32 Z" fill="#F87171" stroke="#991B1B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 37 28 C 48 16, 58 24, 50 36 C 42 42, 36 37, 36 32 Z" fill="#F87171" stroke="#991B1B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 28 38 L 22 52 L 28 48 L 34 52 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <path d="M 32 8 L 39.5 23 L 56 25.5 L 44 37 L 47 54 L 32 46 L 17 54 L 20 37 L 8 25.5 L 24.5 23 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="32" cy="30" r="4" fill="#FEF08A" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="32" cy="22" r="10" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
          <circle cx="22" cy="32" r="10" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
          <circle cx="42" cy="32" r="10" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
          <circle cx="32" cy="42" r="10" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
          <circle cx="32" cy="32" r="8" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );
    case 'palette':
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <path d="M 32 8 C 16 8, 8 20, 8 34 C 8 48, 20 56, 34 56 C 42 56, 48 50, 48 44 C 48 40, 44 36, 40 36 C 36 36, 34 32, 36 28 C 38 24, 46 22, 50 28 C 54 22, 50 8, 32 8 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="3" />
          <circle cx="22" cy="24" r="4" fill="#EF4444" />
          <circle cx="36" cy="18" r="4" fill="#3B82F6" />
          <circle cx="20" cy="40" r="4" fill="#10B981" />
          <circle cx="36" cy="44" r="4" fill="#8B5CF6" />
        </svg>
      );
  }
};
