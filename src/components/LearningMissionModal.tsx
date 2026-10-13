import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, XCircle, X } from 'lucide-react';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

export interface MissionQuestion {
  id: string;
  category: string;
  fase: 'A' | 'B' | 'C';
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SAMPLE_MISSIONS: Record<string, MissionQuestion[]> = {
  A: [
    {
      id: 'misi-a-1',
      category: 'Membaca & Suku Kata',
      fase: 'A',
      title: 'Membaca Suku Kata Pintar',
      question: 'Hewan khas Indonesia yang gagah ini punya nama berawalan "KO". Manakah susunan suku kata yang tepat?',
      options: ['KO - MO - DO', 'KU - DA - LA', 'KO - DOK - RA'],
      correctIndex: 0,
      explanation: 'Hebat! Komodo adalah kadal purba terbesar yang hidup di Nusa Tenggara Timur!',
    },
    {
      id: 'misi-a-2',
      category: 'Hitung Kelereng Cincau',
      fase: 'A',
      title: 'Matematika Berhitung Ceria',
      question: 'Cincau punya 3 kelereng biru, lalu Budi memberinya 2 kelereng hijau. Berapa kelereng Cincau sekarang?',
      options: ['4 kelereng', '5 kelereng', '6 kelereng'],
      correctIndex: 1,
      explanation: 'Benar sekali! 3 + 2 = 5 kelereng kelereng berkilau!',
    },
    {
      id: 'misi-a-3',
      category: 'IPAS Alam Sekitar',
      fase: 'A',
      title: 'Kenali Hewan di Sekitar',
      question: 'Hewan yang bisa terbang di taman bunga dan memiliki sayap warna-warni indah adalah...',
      options: ['Ikan Emas', 'Kupu-Kupu 🦋', 'Kura-Kura'],
      correctIndex: 1,
      explanation: 'Pintar! Kupu-kupu menghisap nektar bunga dan menjaga kelestarian alam.',
    },
  ],
  B: [
    {
      id: 'misi-b-1',
      category: 'Matematika Pecahan & Kali',
      fase: 'B',
      title: 'Teka-Teki Belanja Cincau',
      question: 'Jika 1 keranjang berisi 4 buah apel segar, berapa buah apel di dalam 3 keranjang?',
      options: ['10 apel', '12 apel', '15 apel'],
      correctIndex: 1,
      explanation: 'Tepat! 4 × 3 = 12 buah apel segar untuk Cincau!',
    },
    {
      id: 'misi-b-2',
      category: 'Sains Flora & Fauna',
      fase: 'B',
      title: 'Adaptasi Tumbuhan',
      question: 'Tumbuhan kaktus menyimpan cadangan air di bagian tubuhnya yaitu...',
      options: ['Batang berdaging', 'Bunga', 'Ujung duri'],
      correctIndex: 0,
      explanation: 'Tepat! Batang kaktus tebal untuk menyimpan air di lingkungan kering.',
    },
    {
      id: 'misi-b-3',
      category: 'Budaya Nusantara',
      fase: 'B',
      title: 'Alat Musik Tradisional',
      question: 'Alat musik bambu yang dimainkan dengan cara digoyangkan dari Jawa Barat adalah...',
      options: ['Gamelan', 'Angklung', 'Sasando'],
      correctIndex: 1,
      explanation: 'Luar biasa! Angklung adalah warisan budaya dunia dari Indonesia!',
    },
  ],
  C: [
    {
      id: 'misi-c-1',
      category: 'IPAS Siklus Air & Energi',
      fase: 'C',
      title: 'Siklus Air Hujan',
      question: 'Proses penguapan air laut dan sungai menjadi uap air akibat panas matahari disebut...',
      options: ['Kondensasi', 'Evaporasi', 'Presipitasi'],
      correctIndex: 1,
      explanation: 'Tepat sekali! Evaporasi adalah tahap penguapan air dalam siklus hidrologi.',
    },
    {
      id: 'misi-c-2',
      category: 'Logika & Pecahan',
      fase: 'C',
      title: 'Tantangan Pecahan Pasar',
      question: 'Cincau memotong satu loyang kue cincau menjadi 8 potong sama besar. Jika Budi makan 2 potong, berapa bagian yang dimakan?',
      options: ['1/4 bagian', '1/2 bagian', '3/8 bagian'],
      correctIndex: 0,
      explanation: 'Keren! 2/8 disederhanakan menjadi 1/4 bagian kue!',
    },
    {
      id: 'misi-c-3',
      category: 'Sejarah & Pengetahuan',
      fase: 'C',
      title: 'Pahlawan & Kemerdekaan',
      question: 'Teks Proklamasi Kemerdekaan Indonesia diketik rapi oleh tokoh pemuda bernama...',
      options: ['Sayuti Melik', 'Sukarni', 'Moh. Hatta'],
      correctIndex: 0,
      explanation: 'Hebat! Sayuti Melik adalah pengetik naskah proklamasi yang bersejarah.',
    },
  ],
};

interface LearningMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fase: 'A' | 'B' | 'C';
  onMissionSuccess: (foodEarned: number, starsEarned: number) => void;
}

export const LearningMissionModal: React.FC<LearningMissionModalProps> = ({
  isOpen,
  onClose,
  fase,
  onMissionSuccess,
}) => {
  const missions = SAMPLE_MISSIONS[fase] || SAMPLE_MISSIONS.A;
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentMission = missions[missionIndex % missions.length];

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
    setMissionIndex((prev) => (prev + 1) % missions.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📖</span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Misi Belajar • Fase {fase}
                </span>
                <h3 className="font-black text-sm tracking-tight block">
                  {currentMission.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 flex flex-col gap-4">
            {/* Category badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {currentMission.category}
              </span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <span>🥣 +1 Makanan</span>
                <span>⭐ +5 Bintang</span>
              </span>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/40 border border-amber-200/80">
              <p className="text-base font-extrabold text-neutral-800 leading-snug">
                {currentMission.question}
              </p>
            </div>

            {/* Answer Options */}
            <div className="flex flex-col gap-2.5">
              {currentMission.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentMission.correctIndex;
                let optionClasses = 'border-2 border-neutral-200 bg-white text-neutral-800 hover:border-amber-400';

                if (isAnswerChecked) {
                  if (isCorrect) {
                    optionClasses = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    optionClasses = 'border-2 border-rose-400 bg-rose-50 text-rose-950';
                  }
                } else if (isSelected) {
                  optionClasses = 'border-2 border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-300';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerChecked}
                    className={`w-full p-3.5 rounded-2xl text-left text-sm font-bold transition-all flex items-center justify-between cursor-pointer active:scale-98 ${optionClasses}`}
                  >
                    <span>{option}</span>
                    {isAnswerChecked && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerChecked && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Result */}
            {isAnswerChecked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl border text-xs font-bold ${
                  isSuccess
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-extrabold text-sm">
                  {isSuccess ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Luar Biasa, Jawabanmu Benar! 🎉</span>
                    </>
                  ) : (
                    <span>Hampir Benar! Coba pelajari lagi ya 😊</span>
                  )}
                </div>
                <p>{currentMission.explanation}</p>
                {isSuccess && (
                  <div className="mt-2 text-xs font-black text-amber-700 bg-white/80 p-2 rounded-xl border border-amber-200">
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
                  className={`w-full py-3 rounded-2xl font-black text-sm text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    selectedAnswer === null
                      ? 'bg-neutral-300 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 active:scale-95 hover:shadow-lg'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Kirim Jawaban</span>
                </button>
              ) : (
                <div className="flex w-full gap-2.5">
                  <button
                    onClick={handleNextMission}
                    className="flex-1 py-3 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs active:scale-95 hover:bg-amber-200 transition-all cursor-pointer"
                  >
                    Misi Berikutnya ➔
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md active:scale-95 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Suapi Cincau 🥣</span>
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
