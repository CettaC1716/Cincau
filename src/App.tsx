import React, { useState, useEffect } from 'react';
import { OnboardingView } from './components/OnboardingView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { KidsRegistrationModal } from './components/KidsRegistrationModal';
import { MascotTheme, ChildProfile } from './types';

export default function App() {
  const [mascotTheme, setMascotTheme] = useState<MascotTheme>('cyan-jelly');
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);
  const [registrationInitialStep, setRegistrationInitialStep] = useState<number>(0);
  const [hasPassedWelcome, setHasPassedWelcome] = useState<boolean>(false);

  // Load saved child profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cincau_child_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setChildProfile(parsed);
        setHasPassedWelcome(true);
      } else {
        // New user starts at Welcome Screen
        setHasPassedWelcome(false);
      }
    } catch {
      setHasPassedWelcome(false);
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
    setHasPassedWelcome(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('cincau_child_profile');
    } catch {
      // ignore
    }
    setChildProfile(null);
    setHasPassedWelcome(false);
  };

  return (
    <main className="w-full min-h-screen h-dvh bg-white tablet:bg-[#eaf0f6] flex items-center justify-center p-0 tablet:p-3 tablet-md:p-6 select-none overflow-hidden landscape-mobile-fill">
      {/* 
        Adaptive Responsive Architecture:
        - Mobile Phones & Landscape: 100% edge-to-edge fullscreen with zero letterboxing.
        - Tablet Portrait (>=600px, >=768px): Spacious ergonomic capsule up to 840px width with natural proportions.
      */}
      <div className="w-full h-full tablet:h-[95vh] tablet:max-h-[980px] tablet:max-w-[760px] tablet-md:max-w-[840px] landscape:w-full landscape:h-full landscape:max-w-none landscape:max-h-none landscape:rounded-none landscape:border-0 landscape:shadow-none bg-white rounded-none tablet:rounded-[36px] overflow-hidden shadow-none tablet:shadow-[0_24px_64px_rgba(0,0,0,0.12)] border-0 tablet:border-[6px] tablet:border-neutral-200/90 flex flex-col relative text-neutral-900 transition-all duration-300 landscape-mobile-capsule">
        {!hasPassedWelcome ? (
          <WelcomeScreen
            mascotTheme={mascotTheme}
            onStartRegistration={() => {
              setRegistrationInitialStep(0);
              setIsRegistrationOpen(true);
            }}
            onSignInExisting={() => {
              setRegistrationInitialStep(12); // Direct to Sign-In step
              setIsRegistrationOpen(true);
            }}
          />
        ) : (
          <OnboardingView
            mascotTheme={mascotTheme}
            onToggleTheme={toggleMascotTheme}
            onStart={() => {}}
            childProfile={childProfile}
            onOpenRegistration={() => {
              setRegistrationInitialStep(0);
              setIsRegistrationOpen(true);
            }}
            onLogout={handleLogout}
          />
        )}

        {/* Kids Registration Onboarding Modal */}
        <KidsRegistrationModal
          isOpen={isRegistrationOpen}
          onClose={() => {
            setIsRegistrationOpen(false);
            setHasPassedWelcome(true);
          }}
          onComplete={handleRegistrationComplete}
          mascotTheme={mascotTheme}
          initialProfile={childProfile}
          initialStep={registrationInitialStep}
        />
      </div>
    </main>
  );
}
