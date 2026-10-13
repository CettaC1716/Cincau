import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, Sparkles } from 'lucide-react';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

interface SnackItem {
  id: string;
  name: string;
  icon: string;
  price: number;
}

const SNACKS: SnackItem[] = [
  { id: '1', name: 'Kue Lapis Rainbow', icon: '🍰', price: 3000 },
  { id: '2', name: 'Es Cincau Hijau', icon: '🥤', price: 5000 },
  { id: '3', name: 'Lemper Ketan Gurih', icon: '🍙', price: 2000 },
  { id: '4', name: 'Onde-Onde Wijen', icon: '🍡', price: 4000 },
];

interface PasarHitungProps {
  onClose: (earnedFood: number, earnedStars: number) => void;
}

export const PasarHitungMinigame: React.FC<PasarHitungProps> = ({ onClose }) => {
  const [snackIdx, setSnackIdx] = useState(0);
  const [paidTotal, setPaidTotal] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const current = SNACKS[snackIdx];

  const handleAddCoin = (amount: number) => {
    playPopSound();
    const newTotal = paidTotal + amount;
    setPaidTotal(newTotal);

    if (newTotal === current.price) {
      playCheerSound();
      setScore(s => s + 1);

      setTimeout(() => {
        if (snackIdx + 1 < SNACKS.length) {
          setSnackIdx(prev => prev + 1);
          setPaidTotal(0);
        } else {
          setIsDone(true);
        }
      }, 1000);
    }
  };

  const handleResetMoney = () => {
    playPopSound();
    setPaidTotal(0);
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
        className="w-full max-w-lg bg-orange-50 rounded-3xl shadow-2xl border-4 border-orange-400 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-4 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Mini-Game 2D Matematika
            </span>
            <h3 className="text-xl font-black tracking-tight mt-0.5 flex items-center gap-1.5">
              <span>🏪 Teka-Teki Hitung Pasar Cincau</span>
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
                <div className="flex justify-between items-center text-xs font-bold text-amber-900 mb-2">
                  <span>Jajan {snackIdx + 1} dari {SNACKS.length}</span>
                  <span className="bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full">⭐ Skor: {score}</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200 text-center mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{current.icon}</span>
                    <div className="text-left">
                      <h4 className="font-extrabold text-neutral-900 text-base">{current.name}</h4>
                      <span className="text-xs text-amber-800 font-bold block">Harga Jajan Pasar</span>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-amber-100 text-amber-950 font-black text-lg rounded-xl border border-amber-300">
                    Rp {current.price.toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Total Counter Box */}
                <div className="bg-amber-100/80 p-4 rounded-2xl border-2 border-amber-300 text-center mb-4">
                  <span className="text-xs font-bold text-amber-800 block">Uang yang Sudah Kamu Masukkan:</span>
                  <span className={`text-3xl font-black block mt-0.5 ${paidTotal === current.price ? 'text-emerald-600' : paidTotal > current.price ? 'text-rose-600' : 'text-amber-950'}`}>
                    Rp {paidTotal.toLocaleString('id-ID')}
                  </span>
                  {paidTotal === current.price && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block mt-2">
                      ✨ Pas Sekali! Pembayaran Berhasil!
                    </span>
                  )}
                  {paidTotal > current.price && (
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full inline-block mt-2">
                      ⚠️ Kelebihan! Teka tombol Hitung Ulang di bawah!
                    </span>
                  )}
                </div>

                {/* Money Coin Buttons */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleAddCoin(1000)}
                    className="p-3 bg-amber-200 hover:bg-amber-300 border-2 border-amber-400 rounded-2xl font-black text-sm text-amber-950 cursor-pointer shadow-sm active:scale-95"
                  >
                    🪙 Rp 1.000
                  </button>
                  <button
                    onClick={() => handleAddCoin(2000)}
                    className="p-3 bg-amber-300 hover:bg-amber-400 border-2 border-amber-500 rounded-2xl font-black text-sm text-amber-950 cursor-pointer shadow-sm active:scale-95"
                  >
                    💵 Rp 2.000
                  </button>
                  <button
                    onClick={() => handleAddCoin(5000)}
                    className="p-3 bg-amber-400 hover:bg-amber-500 border-2 border-amber-600 rounded-2xl font-black text-sm text-amber-950 cursor-pointer shadow-sm active:scale-95"
                  >
                    💵 Rp 5.000
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleResetMoney}
                  className="w-1/3 py-2.5 bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl hover:bg-neutral-300 cursor-pointer"
                >
                  Hitung Ulang
                </button>
                <button
                  onClick={() => onClose(1, 5)}
                  className="w-2/3 py-2.5 bg-amber-600 text-white font-black text-xs rounded-xl hover:bg-amber-700 cursor-pointer"
                >
                  Selesai Belanja! 🥣
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <span className="text-5xl block mb-2">🎉</span>
              <h2 className="text-2xl font-black text-amber-950">Pasar Cincau Laris Manis!</h2>
              <p className="text-xs font-bold text-amber-800 mt-1">
                Kamu pandai menghitung pecahan uang Rupiah dan membelikan Cincau jajan pasar!
              </p>
              <button
                onClick={() => onClose(1, 5)}
                className="mt-6 w-full py-3 bg-amber-600 text-white font-black rounded-2xl shadow-md cursor-pointer"
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
