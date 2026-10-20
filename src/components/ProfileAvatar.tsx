import React, { useState } from 'react';

interface ProfileAvatarProps {
  gender?: 'boy' | 'girl';
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ gender = 'boy', className = 'w-10 h-10' }) => {
  const isGirl = gender === 'girl';
  const [imgError, setImgError] = useState(false);

  // Path to user-provided profile images in public folder
  const imageSrc = isGirl ? '/girlprofile.png' : '/boyprofile.png';

  if (!imgError) {
    return (
      <div className={`relative overflow-hidden rounded-full flex items-center justify-center bg-white shadow-inner ${className}`}>
        <img
          src={imageSrc}
          alt={isGirl ? 'Girl Profile' : 'Boy Profile'}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Fallback SVG avatar if image file is not yet placed in public root
  return (
    <div className={`relative overflow-hidden rounded-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 shadow-inner ${className}`}>
      {isGirl ? (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <circle cx="100" cy="100" r="100" fill="#FEF3C7" />
          <circle cx="48" cy="108" r="14" fill="#D97706" />
          <circle cx="152" cy="108" r="14" fill="#D97706" />
          <path d="M 40 100 Q 20 120 25 150 Q 28 165 35 175 L 45 160 Q 38 140 46 115 Z" fill="#292524" />
          <path d="M 160 100 Q 180 120 175 150 Q 172 165 165 175 L 155 160 Q 162 140 154 115 Z" fill="#292524" />
          <polygon points="100,60 140,85 140,125 100,150 60,125 60,85" fill="#D97706" />
          <rect x="75" y="98" width="12" height="16" rx="3" fill="#292524" />
          <rect x="113" y="98" width="12" height="16" rx="3" fill="#292524" />
          <path d="M 85 133 Q 100 146 115 133 Z" fill="#EF4444" />
          <path d="M 60 70 Q 100 35 140 70 L 145 55 Q 100 20 55 55 Z" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
          <path d="M 50 62 Q 100 50 150 62 L 145 78 Q 100 66 55 78 Z" fill="#EF4444" />
        </svg>
      ) : (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <circle cx="100" cy="100" r="100" fill="#E0F2FE" />
          <circle cx="48" cy="108" r="14" fill="#D97706" />
          <circle cx="152" cy="108" r="14" fill="#D97706" />
          <polygon points="100,60 140,85 140,125 100,150 60,125 60,85" fill="#D97706" />
          <rect x="75" y="98" width="12" height="16" rx="3" fill="#292524" />
          <rect x="113" y="98" width="12" height="16" rx="3" fill="#292524" />
          <path d="M 85 133 Q 100 146 115 133 Z" fill="#EF4444" />
          <path d="M 60 70 Q 100 35 140 70 L 145 55 Q 100 20 55 55 Z" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
          <path d="M 50 62 Q 100 50 150 62 L 145 78 Q 100 66 55 78 Z" fill="#EF4444" />
        </svg>
      )}
    </div>
  );
};
