import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronLeft, 
  Check, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight,
  RotateCcw,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CharviMascot } from './CharviMascot';
import { ChildProfile, MascotTheme, CharviEmotion } from '../types';
import { playPopSound, playCheerSound } from '../utils/audioEffects';
import { MemberCard } from './MemberCard';
import { INTEREST_STICKERS } from '../data/stickers';

interface KidsRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: ChildProfile) => void;
  mascotTheme?: MascotTheme;
  initialProfile?: ChildProfile | null;
  initialStep?: number;
}

// Quick name suggestions (Pawchi style suggestion chips)
const NAME_SUGGESTIONS = ['Bintang', 'Langit', 'Pelangi', 'Cahaya', 'Jagoan', 'Alana'];

export const KidsRegistrationModal: React.FC<KidsRegistrationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  mascotTheme = 'cyan-jelly',
  initialProfile,
  initialStep = 0,
}) => {
  // 0: Intro Splash, 1: Nametag Card, 2: Gender/Role, 3: Birthday Certificate, 4: Learning Fase, 5: Sticker Board, 6: Daily Screen Time Ruler, 7: Parent Shield, 8: Sunrise Run, 9: 3D Member Card
  const [step, setStep] = useState<number>(initialStep);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep ?? 0);
    }
  }, [isOpen, initialStep]);

  // Form State
  const [childName, setChildName] = useState<string>(initialProfile?.name || '');
  const [gender, setGender] = useState<'boy' | 'girl'>(initialProfile?.gender || 'boy');
  const [birthDate, setBirthDate] = useState<{ day: number; month: number; year: number }>(
    initialProfile?.birthDate || { day: 1, month: 1, year: 2018 }
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [pickerDay, setPickerDay] = useState<number>(birthDate.day);
  const [pickerMonth, setPickerMonth] = useState<number>(birthDate.month);
  const [pickerYear, setPickerYear] = useState<number>(birthDate.year);

  const [fase, setFase] = useState<'A' | 'B' | 'C'>(initialProfile?.fase || 'A');
  const [selectedStickers, setSelectedStickers] = useState<string[]>(
    initialProfile?.stickers || ['stories', 'math', 'drawing']
  );
  const [playDurationMinutes, setPlayDurationMinutes] = useState<number>(30);
  const [parentEmail, setParentEmail] = useState<string>(initialProfile?.parentEmail || '');
  const [parentPassword, setParentPassword] = useState<string>('');

  // 3D Member card flip state
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Sunrise Run Interstitial states
  const [runProgress, setRunProgress] = useState<number>(0);
  const [runStatusIndex, setRunStatusIndex] = useState<number>(0);
  const [mascotEmotion, setMascotEmotion] = useState<CharviEmotion>('excited');



  const totalWorkflowSteps = 9;


  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#00e5ff', '#10b981', '#f59e0b', '#ec4899', '#f97316']
      });
    } catch {
      // ignore
    }
  };

  // Sync mascot emotion to step
  useEffect(() => {
    if (step === 0) setMascotEmotion('excited');
    else if (step === 1) setMascotEmotion(childName.trim() ? 'happy' : 'listening');
    else if (step === 2) setMascotEmotion('happy');
    else if (step === 3) setMascotEmotion('excited');
    else if (step === 4) setMascotEmotion('proud');
    else if (step === 5) setMascotEmotion('excited');
    else if (step === 6) setMascotEmotion('encouraging');
    else if (step === 7) setMascotEmotion('thinking');
    else if (step === 8) setMascotEmotion('celebrating');
    else if (step === 9) setMascotEmotion('celebrating');
  }, [step, childName]);

  // Sunrise Run Animation Progress Loop (Step 8)
  const RUN_MESSAGES = [
    `Cincau sedang mengemas perlengkapan petualangan ${childName || 'si kecil'}... 🎒`,
    `Menempelkan ${selectedStickers.length} stiker minat ke buku petualang... ✨`,
    `Menyesuaikan kurikulum Fase ${fase} yang seru & tepat... 📚`,
    `Menghitung porsi waktu bermain seimbang (${playDurationMinutes} menit)... ⏰`,
    'Mencetak kartu petualang resmi Cincau Club... 🪪',
    'Hore! Kartu petualangmu sudah selesai! 🎉'
  ];

  useEffect(() => {
    if (step === 8) {
      setRunProgress(0);
      setRunStatusIndex(0);

      const interval = setInterval(() => {
        setRunProgress((prev) => {
          const next = prev + 18;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              playCheerSound();
              triggerConfetti();
              setStep(9); // Go to 3D Card Reveal
            }, 500);
            return 100;
          }
          return next;
        });
      }, 700);

      const msgInterval = setInterval(() => {
        setRunStatusIndex((prev) => (prev + 1) % RUN_MESSAGES.length);
      }, 750);

      return () => {
        clearInterval(interval);
        clearInterval(msgInterval);
      };
    }
  }, [step]);

  // Sticker toggle handler
  const handleToggleSticker = (id: string) => {
    playPopSound();
    setSelectedStickers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    playPopSound();
    if (step === 7) {
      // From Parent Shield to Sunrise Run Transition
      setStep(8);
      return;
    }
    if (step === 9) {
      // Finish registration!
      finishRegistration();
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalWorkflowSteps));
  };

  const handleBack = () => {
    playPopSound();
    if (step > 0 && step !== 8) {
      setStep((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  const finishRegistration = () => {
    playCheerSound();
    triggerConfetti();
    const finalProfile: ChildProfile = {
      name: childName.trim() || 'Bintang',
      gender,
      birthDate: birthDate || { day: 1, month: 1, year: 2018 },
      fase,
      favoriteSubject: selectedStickers[0] || 'Dongeng & Cerita',
      learningGoals: selectedStickers.map(
        (id) => INTEREST_STICKERS.find((s) => s.id === id)?.name || id
      ),
      playDuration: `${playDurationMinutes} Menit`,
      stickers: selectedStickers,
      memberId: `CINCAU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      hasOwnDevice: true,
      voiceInteractionEnabled: true,
      parentEmail: parentEmail || 'orangtua@cincau.id',
      isRegistered: true,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('cincau_child_profile', JSON.stringify(finalProfile));
    } catch {
      // ignore
    }

    onComplete(finalProfile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-0 tablet:p-6 select-none overflow-hidden">
      {/* Modal Phone vs Tablet Container - Warm Cream Paper Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full h-full tablet:h-auto tablet:max-h-[92vh] tablet:max-w-[580px] tablet-md:max-w-[640px] landscape:max-w-none landscape:w-full landscape:h-full bg-[#FFFDF7] rounded-none tablet:rounded-[36px] shadow-2xl flex flex-col overflow-hidden relative border-0 tablet:border-4 border-[#FED7AA]/80"
      >
        {/* Top Header Bar */}
        {step !== 7 && (
          <div className="w-full px-5 pt-3.5 pb-1.5 flex items-center justify-between shrink-0 z-20">
            {step > 0 && step !== 8 ? (
              <button
                onClick={handleBack}
                className="min-h-[44px] min-w-[44px] rounded-2xl bg-white shadow-xs border border-amber-200/80 flex items-center justify-center text-amber-900 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
                title="Kembali"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-11" />
            )}

            {/* Pawchi Style Progress Dots / Indicators (Steps 1 to 7) */}
            {step > 0 && step <= 7 && (
              <div className="flex items-center gap-1.5 bg-amber-100/70 px-3 py-1.5 rounded-full border border-amber-200/60">
                {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
                  <div
                    key={dot}
                    className={`transition-all duration-300 rounded-full ${
                      dot === step
                        ? 'w-5 h-2 bg-gradient-to-r from-amber-500 to-orange-500'
                        : dot < step
                        ? 'w-2 h-2 bg-amber-400'
                        : 'w-2 h-2 bg-amber-200/80'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Skip / Close Button */}
            <button
              onClick={() => {
                playPopSound();
                if (step === 0 || step === 9) {
                  onClose();
                } else {
                  finishRegistration();
                }
              }}
              className="min-h-[44px] flex items-center text-xs font-bold text-amber-900/60 hover:text-amber-950 px-3 py-1.5 rounded-full hover:bg-amber-100/50 transition-colors cursor-pointer"
            >
              {step === 0 ? 'Tutup' : step === 9 ? 'Selesai' : 'Lewati'}
            </button>
          </div>
        )}

        {/* Content Body Container */}
        <div className="flex-1 w-full overflow-y-auto px-5 tablet:px-7 py-2 flex flex-col justify-between no-scrollbar relative">
          <AnimatePresence mode="wait">
            {/* ================= STEP 0: PAWCHI WARM INTRO SPLASH ================= */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="flex-1 flex flex-col items-center justify-between py-2 text-center"
              >
                <div className="flex-1 flex flex-col items-center justify-center my-auto">
                  {/* Mascot Peeking Box */}
                  <div className="relative w-36 h-36 tablet:w-44 tablet:h-44 my-2 flex items-center justify-center">
                    <div className="absolute inset-0 bg-amber-200/40 rounded-full blur-xl animate-pulse" />
                    <div className="w-32 h-32 tablet:w-40 tablet:h-40 bg-[#FFF7ED] rounded-[32px] border-3 border-amber-300 flex items-center justify-center shadow-md relative overflow-hidden">
                      <CharviMascot
                        variant="compact-header"
                        emotion={mascotEmotion}
                        theme={mascotTheme}
                        className="w-28 h-28 tablet:w-34 tablet:h-34 drop-shadow-md"
                      />
                    </div>
                  </div>

                  <h1 className="text-2xl tablet:text-3xl font-black text-neutral-900 tracking-tight mt-3">
                    Halo, Petualang Cilik! 🌿
                  </h1>
                  <p className="text-xs tablet:text-sm text-neutral-600 font-medium max-w-xs mt-1.5 leading-relaxed">
                    Yuk buat kartu anggota resmi Cincau Club agar petualangan belajar & bermainmu semakin seru!
                  </p>
                </div>

                <div className="w-full max-w-xs space-y-2 mt-4 pb-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300 active:scale-95 transition-transform"
                  >
                    <span>Mulai Pendaftaran 🚀</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <button
                    onClick={() => {
                      playPopSound();
                      finishRegistration();
                    }}
                    className="w-full py-2 text-xs font-bold text-neutral-500 hover:text-amber-800 transition-colors cursor-pointer text-center"
                  >
                    Sudah punya akun? <span className="text-orange-600 underline">Masuk langsung</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 1: PASSPORT NAMETAG CARD (Pawchi 00:18) ================= */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="flex-1 flex flex-col justify-between py-1 text-center"
              >
                <div>
                  <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight">
                    Siapa nama si kecil? ✏️
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-1">
                    Tuliskan di kartu petualang kecil ini!
                  </p>

                  {/* Aesthetic Memo Board style Input Card */}
                  <div className="mt-6 bg-[#FFFDF5] rounded-[24px] p-6 tablet:p-8 border-4 border-[#5C4033] shadow-[0_20px_60px_rgba(92,64,51,0.25)] relative max-w-[340px] tablet:max-w-[400px] mx-auto overflow-visible group">
                    {/* Yellow Sticky Tape at Top Left */}
                    <div className="absolute -top-3.5 left-6 w-24 h-7 bg-amber-300 shadow-sm rotate-[-2deg] rounded-xs border border-amber-400/60 z-20" />

                    <div className="text-left mb-1">
                      <span className="text-[10px] tablet:text-xs font-black uppercase text-[#5C4033]/60 tracking-[0.2em] font-handwriting">
                        NAMA PETUALANG
                      </span>
                    </div>

                    <div className="relative py-2">
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="Ketik namamu..."
                        autoFocus
                        className="w-full text-left text-3xl tablet:text-4xl font-black text-[#2D2D2D] bg-transparent outline-none placeholder:text-neutral-300 font-handwriting py-1 border-b-3 border-[#5C4033]/15 focus:border-[#5C4033]/40 transition-colors"
                      />
                    </div>

                    {/* Cincau Mascot Peeking in bottom corner */}
                    <div className="absolute -bottom-6 -right-4 w-24 h-24 tablet:w-28 tablet:h-28 pointer-events-none drop-shadow-xl z-20">
                      <CharviMascot
                        variant="large-bottom"
                        emotion={childName.trim() ? 'excited' : 'listening'}
                        theme={mascotTheme}
                        className="w-full h-full scale-110"
                      />
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Cincau Sarankan:
                    </span>
                    <div className="flex flex-wrap justify-center gap-1.5 max-w-xs mx-auto">
                      {NAME_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            playPopSound();
                            setChildName(suggestion);
                          }}
                          className="px-3 py-1 rounded-full bg-white border border-amber-300/80 text-amber-900 text-xs font-bold hover:bg-amber-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs mx-auto mt-4 pb-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    disabled={!childName.trim()}
                    onClick={handleNext}
                    className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      childName.trim()
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-amber-500/25 border-2 border-amber-300'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none border-2 border-neutral-300'
                    }`}
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 2: BOY OR GIRL TACTILE CARDS (Pawchi 00:26) ================= */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="flex-1 flex flex-col justify-between py-1 text-center"
              >
                <div>
                  <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight">
                    Jagoan Cilik atau Putri Cilik? 🌟
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-1">
                    Agar Cincau bisa memanggil {childName} dengan tepat!
                  </p>

                  {/* Two Big Tactile Cards */}
                  <div className="grid grid-cols-2 gap-3.5 max-w-sm mx-auto mt-6">
                    <button
                      onClick={() => {
                        playPopSound();
                        setGender('boy');
                      }}
                      className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        gender === 'boy'
                          ? 'border-sky-500 bg-sky-50/90 shadow-md ring-4 ring-sky-200/70 scale-102'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 shadow-sm'
                      }`}
                    >
                      {gender === 'boy' && (
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                      <span className="text-4xl mb-2">👦</span>
                      <span className="text-sm font-black text-sky-950">Jagoan Cilik</span>
                      <span className="text-[10px] text-sky-700 font-bold mt-0.5">Anak Laki-Laki</span>
                    </button>

                    <button
                      onClick={() => {
                        playPopSound();
                        setGender('girl');
                      }}
                      className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        gender === 'girl'
                          ? 'border-pink-500 bg-pink-50/90 shadow-md ring-4 ring-pink-200/70 scale-102'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 shadow-sm'
                      }`}
                    >
                      {gender === 'girl' && (
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                      <span className="text-4xl mb-2">👧</span>
                      <span className="text-sm font-black text-pink-950">Putri Cilik</span>
                      <span className="text-[10px] text-pink-700 font-bold mt-0.5">Anak Perempuan</span>
                    </button>
                  </div>

                  {/* Mascot Encouragement */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/60 py-2 px-4 rounded-2xl max-w-xs mx-auto border border-amber-200">
                    <span>✨</span>
                    <span>Siap berpetualang bersama Cincau!</span>
                  </div>
                </div>

                <div className="w-full max-w-xs mx-auto mt-4 pb-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 3: BIRTHDAY CERTIFICATE CARD (Akta Kelahiran Cincau) ================= */}
            {step === 3 && (
              <motion.div
                key="step-3-birthday"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="flex-1 flex flex-col justify-between py-1 text-center relative"
              >
                <div>
                  <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight">
                    Kapan hari ulang tahunmu? 🎂
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-1 max-w-xs mx-auto">
                    Cincau akan mengingatkanmu 3 hari sebelum ulang tahunmu agar bisa menyiapkan kue! ✨
                  </p>

                  {/* AKTA KELAHIRAN CINCAU CARD - Memo Board Style */}
                  <div className="mt-6 bg-[#FFFDF5] rounded-[24px] p-5 tablet:p-7 border-4 border-[#5C4033] shadow-[0_20px_60px_rgba(92,64,51,0.25)] relative max-w-[340px] tablet:max-w-[400px] mx-auto overflow-visible group">
                    {/* Yellow Sticky Tape at Top Center */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-amber-300 shadow-sm rotate-[-0.5deg] rounded-xs border border-amber-400/60 z-20" />

                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-2 border-b-2 border-[#5C4033]/15 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🐾</span>
                        <span className="text-[10px] tablet:text-xs font-black uppercase text-[#5C4033] tracking-widest font-handwriting">
                          AKTA KELAHIRAN CINCAU
                        </span>
                      </div>
                      <span className="text-xs">🌿</span>
                    </div>

                    {/* 3 Slot Boxes: DAY, MONTH, YEAR */}
                    <div className="grid grid-cols-3 gap-2.5 my-5">
                      {/* DAY Slot */}
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setPickerDay(birthDate.day);
                          setPickerMonth(birthDate.month);
                          setPickerYear(birthDate.year);
                          setIsDatePickerOpen(true);
                        }}
                        className="bg-[#FDF8ED] border-2 border-amber-300 rounded-2xl p-2.5 flex flex-col items-center justify-center hover:bg-amber-50 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        <span className="text-2xl font-black text-[#5C4033] font-handwriting">
                          {String(birthDate.day).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-black uppercase text-amber-800 tracking-wider mt-0.5 font-handwriting">
                          HARI
                        </span>
                      </button>

                      {/* MONTH Slot */}
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setPickerDay(birthDate.day);
                          setPickerMonth(birthDate.month);
                          setPickerYear(birthDate.year);
                          setIsDatePickerOpen(true);
                        }}
                        className="bg-[#FDF8ED] border-2 border-amber-300 rounded-2xl p-2.5 flex flex-col items-center justify-center hover:bg-amber-50 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        <span className="text-2xl font-black text-[#5C4033] font-handwriting">
                          {String(birthDate.month).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-black uppercase text-amber-800 tracking-wider mt-0.5 font-handwriting">
                          BULAN
                        </span>
                      </button>

                      {/* YEAR Slot */}
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setPickerDay(birthDate.day);
                          setPickerMonth(birthDate.month);
                          setPickerYear(birthDate.year);
                          setIsDatePickerOpen(true);
                        }}
                        className="bg-[#FDF8ED] border-2 border-amber-300 rounded-2xl p-2.5 flex flex-col items-center justify-center hover:bg-amber-50 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        <span className="text-2xl font-black text-[#5C4033] font-handwriting">
                          {birthDate.year}
                        </span>
                        <span className="text-[9px] font-black uppercase text-amber-800 tracking-wider mt-0.5 font-handwriting">
                          TAHUN
                        </span>
                      </button>
                    </div>

                    {/* Birthday Cake Drawing in bottom right */}
                    <div className="absolute -bottom-4 -right-2 text-4xl opacity-90 drop-shadow-md pointer-events-none rotate-6">
                      🎂
                    </div>
                  </div>

                  {/* Option Pills Below Card */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setIsDatePickerOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-amber-300/90 text-amber-900 text-xs font-bold hover:bg-amber-50 active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>📅 Cuma ingat tahunnya</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        const currYear = new Date().getFullYear();
                        setBirthDate({ day: 1, month: 1, year: currYear - 7 });
                        playCheerSound();
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-amber-500 text-white border border-amber-400 text-xs font-bold hover:bg-amber-600 active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>🎈 Belum yakin — pilih umur</span>
                    </button>
                  </div>

                  {/* Cincau Mascot Speech Bubble */}
                  <div className="mt-4 flex items-center justify-center gap-2 max-w-xs mx-auto">
                    <div className="w-12 h-12 relative shrink-0">
                      <CharviMascot
                        variant="compact-header"
                        emotion="excited"
                        theme={mascotTheme}
                        className="w-full h-full drop-shadow-md"
                      />
                      <div className="absolute -top-1 -right-1 text-sm">🥳</div>
                    </div>
                    <div className="bg-amber-100/80 border border-amber-300/80 rounded-2xl p-2.5 text-left text-[11px] font-bold text-amber-950 shadow-2xs leading-snug">
                      "Aku akan menghitung mundur untukmu — gak ada lagi yang lupa hari spesialmu!"
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs mx-auto mt-4 pb-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300 active:scale-95 transition-transform"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 4: FASE BELAJAR CARDS (Pawchi 00:21) ================= */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="flex-1 flex flex-col justify-between py-1 text-center"
              >
                <div>
                  <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight">
                    Fase & Usia Belajar 🎒
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-1">
                    Pilih fase kurikulum yang paling pas untuk {childName}!
                  </p>

                  {/* Fase Selection Board - Memo Style */}
                  <div className="mt-6 bg-[#FFFDF5] rounded-[24px] p-5 tablet:p-7 border-4 border-[#5C4033] shadow-[0_20px_60px_rgba(92,64,51,0.25)] relative max-w-[360px] tablet:max-w-[420px] mx-auto overflow-visible group">
                    {/* Yellow Sticky Tape at Top Right */}
                    <div className="absolute -top-3.5 right-8 w-24 h-7 bg-amber-300 shadow-sm rotate-[1.5deg] rounded-xs border border-amber-400/60 z-20" />

                    <div className="space-y-3 mt-1">
                      {[
                        {
                          faseKey: 'A' as const,
                          title: 'Fase A: PAUD & TK',
                          subtitle: 'Usia 4–6 Tahun',
                          desc: 'Mengenal huruf, angka 1-10, warna & bentuk alam',
                          icon: '🌱',
                          color: 'border-emerald-400 bg-emerald-50/50',
                        },
                        {
                          faseKey: 'B' as const,
                          title: 'Fase B: SD Kelas 1–2',
                          subtitle: 'Usia 6–8 Tahun',
                          desc: 'Membaca lancar, hitung cepat & cerita inspiratif',
                          icon: '🌿',
                          color: 'border-sky-400 bg-sky-50/50',
                        },
                        {
                          faseKey: 'C' as const,
                          title: 'Fase C: SD Kelas 3–4',
                          subtitle: 'Usia 8–10 Tahun',
                          desc: 'Logika matematika, sains ceria & teka-teki kata',
                          icon: '🌳',
                          color: 'border-amber-400 bg-amber-50/50',
                        },
                      ].map((item) => {
                        const isSelected = fase === item.faseKey;
                        return (
                          <button
                            key={item.faseKey}
                            onClick={() => {
                              playPopSound();
                              setFase(item.faseKey);
                            }}
                            className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer font-handwriting ${
                              isSelected
                                ? `${item.color} shadow-sm ring-3 ring-amber-200 border-[#5C4033] scale-[1.02]`
                                : 'border-[#5C4033]/15 bg-white/60 hover:bg-white hover:border-[#5C4033]/30 shadow-xs'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl drop-shadow-sm">{item.icon}</span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs tablet:text-sm font-black text-[#5C4033]">{item.title}</h4>
                                  <span className="text-[10px] font-black text-[#5C4033]/60">({item.subtitle})</span>
                                </div>
                                <p className="text-[10px] tablet:text-[11px] text-[#5C4033]/80 font-black mt-0.5 leading-tight">{item.desc}</p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#5C4033] text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Check className="w-3.5 h-3.5 stroke-[4]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs mx-auto mt-4 pb-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 5: STICKER BOARD (Pawchi 00:44) ================= */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="flex-1 flex flex-col justify-between py-1 text-center"
              >
                <div>
                  <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight">
                    Papan Stiker Minat {childName}! 🎨
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    Tempelkan stiker ke papan — Cincau akan menyesuaikan misi harian!
                  </p>

                  {/* Interactive Sticker Board Area */}
                  <div className="mt-3 bg-amber-50/70 p-3.5 rounded-3xl border-2 border-dashed border-amber-300 max-w-md mx-auto shadow-inner">
                    <div className="flex items-center justify-between pb-1.5 px-1 border-b border-amber-200/60 mb-2">
                      <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                        PAPAN TEMPEL STIKER
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                        ✨ {selectedStickers.length} stiker terpilih
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {INTEREST_STICKERS.map((sticker) => {
                        const isStuck = selectedStickers.includes(sticker.id);
                        return (
                          <motion.button
                            key={sticker.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleToggleSticker(sticker.id)}
                            className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                              isStuck
                                ? `bg-white ${sticker.color} ${sticker.rotation} shadow-sm ring-2 ring-amber-300 scale-102`
                                : 'bg-white/80 border-neutral-200 hover:border-neutral-300 text-neutral-600'
                            }`}
                          >
                            {isStuck && (
                              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-2xs">
                                ✓
                              </div>
                            )}
                            <span className="text-xl mb-1">{sticker.icon}</span>
                            <span className="text-[10px] font-black leading-tight text-center line-clamp-1">
                              {sticker.name}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs mx-auto mt-3 pb-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    disabled={selectedStickers.length === 0}
                    onClick={handleNext}
                    className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedStickers.length > 0
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-amber-500/25 border-2 border-amber-300'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none border-2 border-neutral-300'
                    }`}
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 6: DAILY TIME RULER SLIDER (Pawchi 00:51) ================= */}
            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="flex-1 flex flex-col justify-between py-1 text-center"
              >
                <div>
                  <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight">
                    Porsi Waktu Layar Seimbang ⏰
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-1">
                    Berapa target waktu bermain & belajar yang sehat setiap hari?
                  </p>

                  {/* Ruler & Mascot Feedback Box */}
                  <div className="mt-5 bg-white rounded-3xl p-5 border-2 border-amber-200/90 shadow-md max-w-sm mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-14 h-14 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center justify-center shrink-0">
                        <CharviMascot
                          variant="compact-header"
                          emotion="happy"
                          theme={mascotTheme}
                          className="w-12 h-12"
                        />
                      </div>
                      <div className="text-left">
                        <span className="text-2xl font-black text-amber-950 font-mono">
                          {playDurationMinutes} Menit
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 block">
                          {playDurationMinutes <= 20
                            ? 'Porsi Ringan & Cepat 🌿'
                            : playDurationMinutes <= 35
                            ? 'Porsi Ideal & Sehat! ⭐ (Rekomendasi)'
                            : 'Porsi Petualang Aktif 🚀'}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Slider Track */}
                    <div className="mt-4 px-2">
                      <input
                        type="range"
                        min="15"
                        max="60"
                        step="5"
                        value={playDurationMinutes}
                        onChange={(e) => {
                          playPopSound();
                          setPlayDurationMinutes(parseInt(e.target.value));
                        }}
                        className="w-full h-3 bg-amber-100 rounded-full accent-orange-500 cursor-pointer"
                      />

                      {/* Ruler ticks */}
                      <div className="flex justify-between text-[9px] font-bold text-neutral-400 mt-2">
                        <span>15 Mnt</span>
                        <span className="text-orange-600 font-black">30 Mnt (Ideal)</span>
                        <span>45 Mnt</span>
                        <span>60 Mnt</span>
                      </div>
                    </div>

                    <div className="mt-4 p-2.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-left">
                      <p className="text-[10px] font-medium text-amber-900 leading-snug">
                        💡 <strong>Tips Cincau:</strong> Waktu 20–30 menit membantu anak fokus menyerap materi tanpa membuat mata lelah.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs mx-auto mt-4 pb-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 7: PARENT SHIELD STEP ================= */}
            {step === 7 && (
              <motion.div
                key="step-7"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="flex-1 flex flex-col justify-between py-1 text-center"
              >
                <div>
                  <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight">
                    Pengaman Akun Orang Tua 🔐
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-1">
                    Simpan progres belajar {childName} agar bisa dibuka di perangkat mana pun!
                  </p>

                  <div className="mt-4 bg-white rounded-3xl p-5 border-2 border-amber-200/90 shadow-md max-w-sm mx-auto space-y-3 text-left">
                    <div>
                      <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block mb-1">
                        Email Orang Tua:
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="w-4 h-4 text-amber-500 absolute left-3.5 pointer-events-none" />
                        <input
                          type="email"
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          placeholder="orangtua@email.com"
                          className="w-full pl-10 pr-4 py-2.5 text-xs font-bold text-neutral-900 bg-neutral-50 border-2 border-neutral-200 rounded-2xl outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block mb-1">
                        PIN / Kata Sandi Orang Tua:
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="w-4 h-4 text-amber-500 absolute left-3.5 pointer-events-none" />
                        <input
                          type="password"
                          value={parentPassword}
                          onChange={(e) => setParentPassword(e.target.value)}
                          placeholder="Minimal 4 digit..."
                          className="w-full pl-10 pr-4 py-2.5 text-xs font-bold text-neutral-900 bg-neutral-50 border-2 border-neutral-200 rounded-2xl outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[10px] font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Data aman, bebas iklan luar, dan terlindungi.</span>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs mx-auto mt-4 pb-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300"
                  >
                    <span>Cetak Kartu Petualang! ✨</span>
                    <Sparkles className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 8: THE SUNRISE RUN INTERSTITIAL (Pawchi 01:38-01:46) ================= */}
            {step === 8 && (
              <motion.div
                key="step-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 w-full flex flex-col justify-between items-center py-4 text-center overflow-hidden"
              >
                {/* Night-to-Sunrise Sky Stage */}
                <div className="w-full flex-1 rounded-3xl relative overflow-hidden flex flex-col items-center justify-between p-5 bg-gradient-to-b from-[#1E1B4B] via-[#4338CA] to-[#FB923C] shadow-lg border-2 border-indigo-400/50">
                  {/* Twinkling Stars & Moon */}
                  <div className="absolute top-4 left-6 text-yellow-200/90 text-sm animate-pulse">✨</div>
                  <div className="absolute top-8 right-10 text-yellow-200/80 text-xs animate-ping">⭐</div>
                  <div className="absolute top-5 right-6 w-7 h-7 rounded-full bg-yellow-100/90 shadow-lg shadow-yellow-200/40" />

                  {/* Header Status */}
                  <div className="z-10 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-white text-xs font-black tracking-wide">
                    Sedang Menyiapkan Petualangan...
                  </div>

                  {/* Running Mascot Animation on Grass Hill */}
                  <div className="w-full relative flex flex-col items-center justify-end z-10 my-auto">
                    {/* Mascot bounding along */}
                    <motion.div
                      animate={{
                        y: [-4, 6, -4],
                        rotate: [-2, 3, -2],
                      }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 tablet:w-28 tablet:h-28 drop-shadow-2xl"
                    >
                      <CharviMascot
                        variant="compact-header"
                        emotion="excited"
                        theme={mascotTheme}
                        className="w-full h-full"
                      />
                    </motion.div>

                    {/* Rolling Green Grass Hill */}
                    <div className="w-[120%] h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-t-[100%] mt-1 flex items-center justify-around px-8 text-white/50 text-[10px]">
                      <span>🌱</span>
                      <span>🌼</span>
                      <span>🌿</span>
                      <span>🌸</span>
                      <span>🌱</span>
                    </div>
                  </div>

                  {/* Dynamic Changing Status Text */}
                  <div className="z-10 w-full max-w-sm">
                    <p className="text-xs tablet:text-sm font-extrabold text-white drop-shadow-md min-h-[36px] flex items-center justify-center leading-snug">
                      {RUN_MESSAGES[runStatusIndex]}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mt-2 p-0.5 border border-white/20">
                      <motion.div
                        style={{ width: `${runProgress}%` }}
                        className="h-full bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 9: FLIPPABLE 3D MEMBER CARD REVEAL (Pawchi 01:47) ================= */}
            {step === 9 && (
              <motion.div
                key="step-9"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="flex-1 flex flex-col justify-between py-1 text-center"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] mb-1 border border-amber-300">
                    <Award className="w-3.5 h-3.5 text-orange-600" />
                    <span>KARTU PETUALANG RESMI TERVERIFIKASI</span>
                  </div>

                  <h2 className="text-xl tablet:text-2xl font-black text-neutral-900 tracking-tight">
                    Ini Kartu Petualang {childName}! 🎉
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5 mb-3">
                    Ketuk kartu untuk memutar & melihat bagian belakang! ✨
                  </p>

                  <MemberCard
                    mascotTheme={mascotTheme}
                    isFlipped={isCardFlipped}
                    onFlip={setIsCardFlipped}
                    childProfile={{
                      name: childName,
                      fase: fase,
                      gender: gender,
                      birthDate: birthDate,
                      playDuration: `${playDurationMinutes} Menit`,
                      stickers: selectedStickers,
                      memberId: 'CINCAU-2026-VIP',
                      favoriteSubject: ''
                    }}
                  />
                </div>

                <div className="w-full max-w-xs mx-auto mt-3 pb-2 space-y-1.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-300"
                  >
                    <span>Mulai Petualangan Bersama Cincau! 🚀</span>
                  </motion.button>

                  <button
                    onClick={() => {
                      playPopSound();
                      setIsCardFlipped((prev) => !prev);
                    }}
                    className="w-full py-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Putar Balik Kartu</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* BOTTOM SHEET WHEEL DATE PICKER ("Kapan si kecil lahir?") */}
      <AnimatePresence>
        {isDatePickerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-xs p-0 tablet:p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDatePickerOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm tablet:max-w-md bg-[#FFFDF7] rounded-t-[36px] tablet:rounded-[36px] p-6 shadow-2xl border-t-4 tablet:border-4 border-amber-300 z-10 flex flex-col items-center text-center pointer-events-auto"
            >
              {/* Drag handle */}
              <div className="w-12 h-1.5 bg-amber-300/80 rounded-full mx-auto mb-4" />

              <h3 className="text-lg font-black text-neutral-900 mb-1">
                Kapan si kecil lahir? 🎂
              </h3>
              <p className="text-xs font-bold text-neutral-500 mb-4">
                Pilih tanggal, bulan, dan tahun kelahiran:
              </p>

              {/* Wheel Picker Container */}
              <div className="w-full relative bg-amber-50/80 rounded-2xl border-2 border-amber-200/90 p-3 my-2 overflow-hidden">
                {/* Center Highlight Bar */}
                <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-10 bg-amber-200/80 border-y-2 border-amber-400 rounded-xl pointer-events-none z-0" />

                <div className="grid grid-cols-3 gap-2 relative z-10">
                  {/* DAY WHEEL */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-amber-800 mb-1">HARI</span>
                    <select
                      value={pickerDay}
                      onChange={(e) => setPickerDay(Number(e.target.value))}
                      className="w-full bg-transparent text-center font-black text-xl text-neutral-900 py-2 outline-none font-mono cursor-pointer"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {String(d).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* MONTH WHEEL */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-amber-800 mb-1">BULAN</span>
                    <select
                      value={pickerMonth}
                      onChange={(e) => setPickerMonth(Number(e.target.value))}
                      className="w-full bg-transparent text-center font-black text-xl text-neutral-900 py-2 outline-none font-mono cursor-pointer"
                    >
                      {[
                        'Jan (01)', 'Feb (02)', 'Mar (03)', 'Apr (04)', 'Mei (05)', 'Jun (06)',
                        'Jul (07)', 'Agu (08)', 'Sep (09)', 'Okt (10)', 'Nov (11)', 'Des (12)'
                      ].map((m, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* YEAR WHEEL */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-amber-800 mb-1">TAHUN</span>
                    <select
                      value={pickerYear}
                      onChange={(e) => setPickerYear(Number(e.target.value))}
                      className="w-full bg-transparent text-center font-black text-xl text-neutral-900 py-2 outline-none font-mono cursor-pointer"
                    >
                      {Array.from({ length: 16 }, (_, i) => 2010 + i).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={() => {
                  playCheerSound();
                  setBirthDate({ day: pickerDay, month: pickerMonth, year: pickerYear });
                  setIsDatePickerOpen(false);
                }}
                className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-md border-2 border-amber-300 active:scale-95 transition-transform cursor-pointer"
              >
                Pilih Tanggal Ini ✨
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
