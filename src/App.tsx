import { useState, useEffect } from 'react';
import { OnboardingView } from './components/OnboardingView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { KidsRegistrationModal } from './components/KidsRegistrationModal';
import { ToycadPlayRoom } from './components/ToycadPlayRoom';
import { MascotTheme, ChildProfile } from './types';

export default function App() {
  const [mascotTheme, setMascotTheme] = useState<MascotTheme>('cyan-jelly');
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);
  const [registrationInitialStep, setRegistrationInitialStep] = useState<number>(0);
  const [hasPassedWelcome, setHasPassedWelcome] = useState<boolean>(false);
  const [isPlayRoomDirectOpen, setIsPlayRoomDirectOpen] = useState<boolean>(false);

  // Load saved child profile and check URL params
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('room') === 'play' || urlParams.get('tab') === 'play' || urlParams.get('play') === 'true') {
        setIsPlayRoomDirectOpen(true);
      }
    } catch {
      // ignore
    }

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
    <main className="w-full h-screen h-dvh bg-white flex flex-col items-center justify-start p-0 select-none overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col relative text-neutral-900 overflow-hidden">
        {!hasPassedWelcome ? (
          <WelcomeScreen
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
            childProfile={childProfile}
            onOpenRegistration={() => {
              setRegistrationInitialStep(0);
              setIsRegistrationOpen(true);
            }}
            onLogout={handleLogout}
          />
        )}

        {/* Dedicated Fullscreen 3D Play Room (Nusantara Interactive Map) */}
        {isPlayRoomDirectOpen && (
          <ToycadPlayRoom
            onClose={() => setIsPlayRoomDirectOpen(false)}
            mascotTheme={mascotTheme}
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
