import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, XCircle, X } from 'lucide-react';
import { playPopSound, playCheerSound } from '../utils/audioEffects';
import { PlayfulConfetti } from './PlayfulConfetti';

import { SAMPLE_MISSIONS, MissionQuestion } from '../data/missions';

export type { MissionQuestion };

interface LearningMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fase: 'A' | 'B' | 'C';
  category?: string;
  onMissionSuccess: (foodEarned: number, starsEarned: number) => void;
}

export const LearningMissionModal: React.FC<LearningMissionModalProps> = ({
  isOpen,
  onClose,
  fase,
  category,
  onMissionSuccess,
}) => {
  const allFaseMissions = SAMPLE_MISSIONS[fase] || SAMPLE_MISSIONS.A;
  
  // Filter missions by category if provided, otherwise use all missions for that fase
  const missions = category 
    ? allFaseMissions.filter(m => m.category.toLowerCase().includes(category.toLowerCase()) || m.id.includes(category.toLowerCase()))
    : allFaseMissions;
    
  // Fallback to all fase missions if filter results in empty list
  const activeMissions = missions.length > 0 ? missions : allFaseMissions;

  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentMission = activeMissions[missionIndex % activeMissions.length];

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    playPopSound();
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerChecked(true);

    if (selectedAnswer === currentMission.correctIndex) {
      playCheerSound();
      setIsSuccess(true);
      onMissionSuccess(1, 5); // +1 Food Bowl, +5 Stars!
    } else {
      playPopSound();
      setIsSuccess(false);
    }
  };

  const handleNextMission = () => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setIsSuccess(false);
    setMissionIndex((prev) => (prev + 1) % activeMissions.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 tablet:p-5 bg-amber-950/45 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border-2 border-amber-100 overflow-hidden flex flex-col pointer-events-auto"
        >
          {/* Playful Confetti Effect when answered correctly */}
          <PlayfulConfetti isActive={isSuccess} />

          {/* Header */}
          <div className="px-5 py-3.5 bg-amber-50 text-amber-950 flex items-center justify-between border-b-2 border-amber-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-xl shrink-0">
                📚
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                  Fase {fase} ✨
                </span>
                <h3 className="font-bold text-sm tablet:text-base tracking-tight block text-amber-950 mt-0.5">
                  {currentMission.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold border border-stone-200 flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Tutup"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 tablet:p-5 flex flex-col gap-4 overflow-y-auto max-h-[82vh]">
            {/* Category badge & reward preview */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-amber-950 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
                {currentMission.category}
              </span>
              <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <span>🥣 +1 Makanan</span>
                <span>⭐ +5 Bintang</span>
              </span>
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-3xl bg-stone-50 border-2 border-stone-100 shadow-sm">
              <p className="text-sm tablet:text-base font-bold text-amber-950 leading-snug">
                {currentMission.question}
              </p>
            </div>

            {/* Answer Options */}
            <div className="flex flex-col gap-3">
              {currentMission.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentMission.correctIndex;
                let optionClasses = 'border-2 border-amber-50 bg-white text-amber-950 hover:border-amber-200 shadow-sm';

                if (isAnswerChecked) {
                  if (isCorrect) {
                    optionClasses = 'border-2 border-emerald-300 bg-emerald-50 text-emerald-900 font-bold shadow-sm';
                  } else if (isSelected) {
                    optionClasses = 'border-2 border-rose-200 bg-rose-50 text-rose-900 font-bold shadow-sm';
                  }
                } else if (isSelected) {
                  optionClasses = 'border-2 border-amber-300 bg-amber-50 text-amber-900 font-bold shadow-sm ring-1 ring-amber-100';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerChecked}
                    className={`w-full p-4 rounded-3xl text-left text-sm font-bold transition-all flex items-center justify-between cursor-pointer active:translate-y-0.5 active:shadow-none ${optionClasses}`}
                  >
                    <span>{option}</span>
                    {isAnswerChecked && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 stroke-[3]" />
                    )}
                    {isAnswerChecked && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 text-rose-500 shrink-0 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Result */}
            {isAnswerChecked && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`p-4 rounded-3xl border-2 text-[11px] font-bold shadow-sm ${
                  isSuccess
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-black text-sm tablet:text-base">
                  {isSuccess ? (
                    <>
                      <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                      <span>Luar Biasa, Jawabanmu Benar! 🎉</span>
                    </>
                  ) : (
                    <span>Hampir Benar! Coba pelajari lagi ya 😊</span>
                  )}
                </div>
                <p className="font-bold text-xs leading-relaxed">{currentMission.explanation}</p>
                {isSuccess && (
                  <div className="mt-2.5 text-xs font-black text-amber-950 bg-amber-100 p-2.5 rounded-2xl border border-amber-300 shadow-2xs">
                    ✨ Hadiah Berhasil Dikumpulkan: 1 Mangkuk Makanan Cincau 🥣 & 5 Bintang ⭐! Cincau di sebelah kiri siap disuapi!
                  </div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all ${
                    selectedAnswer === null
                      ? 'bg-stone-100 text-stone-300 border border-stone-200 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 shadow-md active:translate-y-0.5 cursor-pointer'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Kirim Jawaban ✨</span>
                </button>
              ) : (
                <div className="flex w-full gap-2.5">
                  <button
                    onClick={handleNextMission}
                    className="flex-1 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[11px] shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    Misi Lanjut ➔
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-md active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Suapi 🥣</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
