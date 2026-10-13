import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

export interface MissionData {
  id: string;
  title: string;
  category: string;
  fase: 'A' | 'B' | 'C';
  rewardFood: number;
  rewardStars: number;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

const FASE_MISSIONS: Record<string, MissionData[]> = {
  // FASE A (Kelas 1-2)
  'fase-a-1': [{
    id: 'fase-a-1',
    title: '📖 Membaca Suku Kata Pintar',
    category: 'Bahasa Indonesia - Fase A',
    fase: 'A',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Mana suku kata yang benar untuk hewan "K-O-M-O-D-O"?',
        options: ['KO - MO - DO', 'KOM - OD - O', 'KO - MOD - O'],
        correctIndex: 0,
        explanation: 'Hebat! KO-MO-DO terdiri dari 3 suku kata terbuka yang mudah diucapkan.'
      },
      {
        question: 'Pilih kata santun saat meminta bantuan Cincau:',
        options: ['"Ambilkan!"', '"Tolong bantu aku ya, Cincau."', '"Cepat!"'],
        correctIndex: 1,
        explanation: 'Pintar! Mengucapkan "Tolong" dan "Terima Kasih" adalah karakter anak berbudi luhur.'
      }
    ]
  }],
  'fase-a-2': [{
    id: 'fase-a-2',
    title: '🔢 Hitung Kelereng Cincau',
    category: 'Matematika - Fase A',
    fase: 'A',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Cincau punya 4 kelereng merah dan dapat 3 kelereng biru. Berapa jumlahnya?',
        options: ['6 kelereng', '7 kelereng', '8 kelereng'],
        correctIndex: 1,
        explanation: '4 + 3 = 7 kelereng! Kamu jago berhitung!'
      },
      {
        question: 'Manakah angka yang lebih besar dari 8?',
        options: ['5', '7', '9'],
        correctIndex: 2,
        explanation: '9 lebih besar daripada 8. Wah, makin pintar!'
      }
    ]
  }],
  'fase-a-3': [{
    id: 'fase-a-3',
    title: '🌿 Kenali Hewan di Sekitar',
    category: 'IPAS Alam - Fase A',
    fase: 'A',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Hewan khas Indonesia yang berenang dengan lincah dan bernapas dengan insang adalah...',
        options: ['Kucing', 'Ikan Gurame', 'Burung Merpati'],
        correctIndex: 1,
        explanation: 'Ikan bernapas menggunakan insang di dalam air!'
      },
      {
        question: 'Bagaimana cara kita menjaga kebersihan taman tempat Cincau bermain?',
        options: ['Membuang sampah pada tempatnya', 'Membiarkan plastik berserakan', 'Mencabut semua bunga'],
        correctIndex: 0,
        explanation: 'Membuang sampah pada tempatnya menjaga alam tetap asri!'
      }
    ]
  }],

  // FASE B (Kelas 3-4)
  'fase-b-1': [{
    id: 'fase-b-1',
    title: '📜 Cerita Rakyat Nusantara',
    category: 'Literasi & Budaya - Fase B',
    fase: 'B',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Kisah Malin Kundang mengajarkan kita untuk selalu...',
        options: ['Sombong kepada teman', 'Berdamai dan berbakti kepada Orang Tua', 'Tidak mau belajar'],
        correctIndex: 1,
        explanation: 'Berbakti kepada orang tua adalah pesan moral berharga dari Nusantara!'
      }
    ]
  }],
  'fase-b-2': [{
    id: 'fase-b-2',
    title: '⚖️ Pecahan Pasar Cincau',
    category: 'Matematika - Fase B',
    fase: 'B',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Cincau memotong 1 kue agar-agar menjadi 4 bagian sama besar. 1 bagian nilainya...',
        options: ['1/2', '1/3', '1/4'],
        correctIndex: 2,
        explanation: '1 bagian dari 4 potongan sama besar adalah pecahan 1/4 (seperempat)!'
      }
    ]
  }],
  'fase-b-3': [{
    id: 'fase-b-3',
    title: '⚡ Energi & Lingkungan Hijau',
    category: 'IPAS Sains - Fase B',
    fase: 'B',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Sumber energi terbesar di bumi yang menyinari taman Cincau setiap pagi adalah...',
        options: ['Matahari', 'Baterai', 'Lampu Tidur'],
        correctIndex: 0,
        explanation: 'Matahari adalah sumber energi utama bagi semua tumbuhan dan makhluk hidup!'
      }
    ]
  }],

  // FASE C (Kelas 5-6)
  'fase-c-1': [{
    id: 'fase-c-1',
    title: '🌌 Tata Surya & Planet 3D',
    category: 'Sains & Teknologi - Fase C',
    fase: 'C',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Planet tempat tinggal kita yang kaya akan oksigen dan air adalah...',
        options: ['Mars', 'Bumi', 'Yupiter'],
        correctIndex: 1,
        explanation: 'Bumi adalah planet indah bersuasana sejuk tempat kita dan Cincau tinggal!'
      }
    ]
  }],
  'fase-c-2': [{
    id: 'fase-c-2',
    title: '🏛️ Peta Pahlawan Indonesia',
    category: 'Sejarah & IPS - Fase C',
    fase: 'C',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Tokoh pahlawan emansipasi wanita Indonesia yang memperjuangkan pendidikan anak adalah...',
        options: ['R.A. Kartini', 'Pangeran Diponegoro', 'Ki Hajar Dewantara'],
        correctIndex: 0,
        explanation: 'R.A. Kartini memperjuangkan hak belajar dan pendidikan bagi seluruh anak Indonesia!'
      }
    ]
  }],
  'fase-c-3': [{
    id: 'fase-c-3',
    title: '🧪 Lab Wujud Benda',
    category: 'Fisika Cilik - Fase C',
    fase: 'C',
    rewardFood: 1,
    rewardStars: 5,
    questions: [
      {
        question: 'Perubahan wujud dari cair menjadi padat saat Cincau membekukan sirup gula adalah...',
        options: ['Mencair', 'Membeku', 'Menguap'],
        correctIndex: 1,
        explanation: 'Proses dari cair ke padat dinamakan Membeku!'
      }
    ]
  }]
};

interface MissionModalProps {
  missionId: string;
  missionTitle: string;
  fase: 'A' | 'B' | 'C';
  onClose: (earnedFood: number, earnedStars: number) => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  missionId,
  missionTitle,
  fase,
  onClose,
}) => {
  const missionList = FASE_MISSIONS[missionId] || FASE_MISSIONS['fase-a-1'];
  const mission = missionList[0];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const question = mission.questions[currentQ];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    playPopSound();
    setSelectedOpt(idx);
    setIsAnswered(true);
    const correct = idx === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playCheerSound();
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < mission.questions.length) {
      setCurrentQ(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsComplete(true);
      playCheerSound();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Misi Kurikulum Merdeka • Fase {fase}
            </span>
            <h3 className="text-lg font-extrabold tracking-tight mt-0.5 flex items-center gap-1.5">
              <span>{missionTitle}</span>
            </h3>
          </div>
          <button
            onClick={() => onClose(0, 0)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between min-h-[300px]">
          {!isComplete ? (
            <>
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-amber-800 mb-2">
                  <span>Soal {currentQ + 1} dari {mission.questions.length}</span>
                  <span className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    <span>Hadiah: 🥣 +1 Makanan, ⭐ +5 Bintang</span>
                  </span>
                </div>

                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 mb-4 text-neutral-800 font-bold text-base leading-snug">
                  {question.question}
                </div>

                <div className="space-y-2.5">
                  {question.options.map((opt, idx) => {
                    let btnStyle = 'bg-white border-neutral-200 text-neutral-800 hover:border-amber-400';
                    if (isAnswered) {
                      if (idx === question.correctIndex) {
                        btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-extrabold';
                      } else if (idx === selectedOpt) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 font-extrabold';
                      } else {
                        btnStyle = 'bg-neutral-50 border-neutral-200 text-neutral-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3.5 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && idx === question.correctIndex && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-2xl text-xs font-semibold ${
                      isCorrect ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {isCorrect ? '✨ ' : '💡 '} {question.explanation}
                  </motion.div>
                )}
              </div>

              {isAnswered && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={handleNext}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black text-sm shadow-md hover:from-amber-600 hover:to-orange-600 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{currentQ + 1 < mission.questions.length ? 'Soal Berikutnya ➔' : 'Selesaikan Misi! ✨'}</span>
                </motion.button>
              )}
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3 animate-bounce">
                <Award className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-amber-900">Misi Selesai! 🎉</h2>
              <p className="text-sm font-bold text-neutral-600 mt-1 max-w-xs">
                Luar biasa! Kamu telah menyelesaikan Misi Belajar Kurikulum Merdeka.
              </p>

              <div className="flex gap-4 my-6">
                <div className="bg-amber-100 border border-amber-300 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                  <span className="text-2xl">🥣</span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-amber-800 block">Dapat Makanan</span>
                    <span className="text-lg font-black text-amber-950">+1 Mangkuk</span>
                  </div>
                </div>
                <div className="bg-yellow-100 border border-yellow-300 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-yellow-800 block">Dapat Bintang</span>
                    <span className="text-lg font-black text-yellow-950">+5 Bintang</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onClose(1, 5)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Simpan Hadiah & Suapi Cincau! 🥣</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
