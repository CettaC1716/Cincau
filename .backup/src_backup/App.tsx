import React, { useState, useEffect } from 'react';
import { OnboardingView } from './components/OnboardingView';
import { KidsRegistrationModal } from './components/KidsRegistrationModal';
import { MascotTheme, ChildProfile } from './types';

export default function App() {
  const [mascotTheme, setMascotTheme] = useState<MascotTheme>('cyan-jelly');
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);

  // Load saved child profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cincau_child_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setChildProfile(parsed);
      } else {
        setIsRegistrationOpen(true);
      }
    } catch {
      setIsRegistrationOpen(true);
    }
  }, []);

  const themes: MascotTheme[] = ['cyan-jelly', 'classic-orange', 'emerald-mint', 'berry-purple', 'sunny-banana'];
  const toggleMascotTheme = () => {
    setMascotTheme((prev) => {
      const idx = themes.indexOf(prev);
      return themes[(idx + 1) % themes.length];
    });
  };

  const handleRegistrationComplete = (profile: ChildProfile) => {
    setChildProfile(profile);
    setIsRegistrationOpen(false);
  };

  return (
    <main className="w-full min-h-screen h-dvh bg-white tablet:bg-[#edf2f7] flex items-center justify-center p-0 tablet:p-6 select-none overflow-hidden landscape-mobile-fill">
      {/* 
        Strict Phone (<600px) vs Tablet (>=600px) Responsive Architecture:
        - Phone (<600px): Full-screen app, 0 padding, no borders, fluid 100% viewport.
        - Tablet (>=600px): Beautifully framed device capsule, max-w-[700px], rounded-[36px], bounded mascot scale so nothing stretches or overflows.
      */}
      <div className="w-full h-full tablet:h-[92vh] tablet:max-h-[860px] tablet:max-w-[700px] bg-white rounded-none tablet:rounded-[36px] overflow-hidden shadow-none tablet:shadow-[0_24px_64px_rgba(0,0,0,0.12)] border-0 tablet:border-[6px] tablet:border-neutral-200/90 flex flex-col relative text-neutral-900 transition-all duration-300 landscape-mobile-capsule">
        <OnboardingView
          mascotTheme={mascotTheme}
          onToggleTheme={toggleMascotTheme}
          onStart={() => {}}
          childProfile={childProfile}
          onOpenRegistration={() => setIsRegistrationOpen(true)}
        />

        {/* Kids Registration Onboarding Modal */}
        <KidsRegistrationModal
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
          onComplete={handleRegistrationComplete}
          mascotTheme={mascotTheme}
          initialProfile={childProfile}
        />
      </div>
    </main>
  );
}
