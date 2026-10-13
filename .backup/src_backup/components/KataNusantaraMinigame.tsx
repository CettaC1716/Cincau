import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

interface WordChallenge {
  targetWord: string;
  category: string;
  hint: string;
  syllables: string[];
}

const WORDS: WordChallenge[] = [
  { targetWord: 'KOMODO', category: 'Satwa Langka NTT', hint: 'Kadal raksasa purba dari Pulau Komodo', syllables: ['KO', 'MO', 'DO'] },
  { targetWord: 'DURIAN', category: 'Buah Khas Nusantara', hint: 'Raja buah dengan duri tajam dan aroma harum', syllables: ['DUR', 'I', 'AN'] },
  { targetWord: 'CENDRAWASIH', category: 'Burung Surga Papua', hint: 'Burung cantik berwarna-warni dari hutan Papua', syllables: ['CEN', 'DRA', 'WA', 'SIH'] },
  { targetWord: 'ANGKLUNG', category: 'Alat Musik Bambu', hint: 'Alat musik bambu goyang dari Jawa Barat', syllables: ['ANG', 'KLUNG'] },
];

interface KataNusantaraProps {
  onClose: (earnedFood: number, earnedStars: number) => void;
}

export const KataNusantaraMinigame: React.FC<KataNusantaraProps> = ({ onClose }) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [availableSyllables, setAvailableSyllables] = useState<string[]>(() => {
    return [...WORDS[0].syllables].sort(() => Math.random() - 0.5);
  });
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const current = WORDS[wordIdx];

  const handlePickSyllable = (syllable: string, idx: number) => {
    playPopSound();
    const newSelected = [...selectedSyllables, syllable];
    const newAvailable = availableSyllables.filter((_, i) => i !== idx);

    setSelectedSyllables(newSelected);
    setAvailableSyllables(newAvailable);

    // Check if formed full word
    const formed = newSelected.join('');
    if (formed === current.targetWord) {
      playCheerSound();
      setScore(s => s + 1);

      setTimeout(() => {
        if (wordIdx + 1 < WORDS.length) {
          const nextIdx = wordIdx + 1;
          setWordIdx(nextIdx);
          setSelectedSyllables([]);
          setAvailableSyllables([...WORDS[nextIdx].syllables].sort(() => Math.random() - 0.5));
        } else {
          setIsDone(true);
        }
      }, 1000);
    }
  };

  const handleResetCurrent = () => {
    playPopSound();
    setSelectedSyllables([]);
    setAvailableSyllables([...current.syllables].sort(() => Math.random() - 0.5));
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
        className="w-full max-w-lg bg-emerald-50 rounded-3xl shadow-2xl border-4 border-emerald-400 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 p-4 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Mini-Game 2D Literasi
            </span>
            <h3 className="text-xl font-black tracking-tight mt-0.5 flex items-center gap-1.5">
              <span>🏝️ Petualangan Kata Nusantara</span>
            </h3>
          </div>
          <button
            onClick={() => onClose(1, 5)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          {!isDone ? (
            <>
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-emerald-800 mb-2">
                  <span>Tantangan {wordIdx + 1} dari {WORDS.length}</span>
                  <span className="bg-emerald-200 text-emerald-950 px-2.5 py-0.5 rounded-full">⭐ Skor: {score}</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-center mb-4">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide block">{current.category}</span>
                  <p className="text-sm font-extrabold text-neutral-800 mt-1">"{current.hint}"</p>
                </div>

                {/* Teratai Water Scene */}
                <div className="h-32 bg-gradient-to-b from-sky-200 to-teal-200 rounded-2xl border-2 border-teal-300 relative flex items-center justify-center overflow-hidden mb-4">
                  {/* Water Ripples */}
                  <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

                  {/* Formed Word Pad */}
                  <div className="flex gap-2 z-10">
                    {selectedSyllables.length === 0 ? (
                      <span className="text-xs font-bold text-teal-800 bg-white/80 px-3 py-1.5 rounded-xl border border-teal-300">
                        Pilih suku kata daun teratai di bawah!
                      </span>
                    ) : (
                      selectedSyllables.map((syl, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-4 py-2 bg-emerald-500 text-white font-black text-lg rounded-2xl border-2 border-emerald-300 shadow-md flex items-center justify-center"
                        >
                          {syl}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Available Lotus Leaf Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {availableSyllables.map((syl, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handlePickSyllable(syl, idx)}
                      className="px-5 py-3 bg-emerald-400 hover:bg-emerald-500 text-white font-black text-xl rounded-2xl border-3 border-emerald-200 shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <span>🪷</span>
                      <span>{syl}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleResetCurrent}
                  className="w-1/3 py-2.5 bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl hover:bg-neutral-300 cursor-pointer"
                >
                  Ulangi Kata
                </button>
                <button
                  onClick={() => onClose(1, 5)}
                  className="w-2/3 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 cursor-pointer"
                >
                  Selesai Bermain! 🥣
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <span className="text-5xl block mb-2">🎉</span>
              <h2 className="text-2xl font-black text-emerald-950">Hebat Sekali!</h2>
              <p className="text-xs font-bold text-emerald-800 mt-1">
                Kamu berhasil menyusun seluruh kata Nusantara dan mengumpulkan Mangkuk Makanan Cincau!
              </p>
              <button
                onClick={() => onClose(1, 5)}
                className="mt-6 w-full py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-md cursor-pointer"
              >
                Ambil Hadiah 🥣 +1 Makanan & ⭐ +5 Bintang
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
