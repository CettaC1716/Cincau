import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, MapPin, Sparkles, Compass, BookOpen, Sun, Droplets, Bug, Play, Pause, ChevronLeft, ChevronRight, Info } from 'lucide-react';

// Interface for Flora Item Data
export interface FloraItem {
  id: string;
  name: string;
  latinName: string;
  tag: string;
  image: string;
  fragrance: string;
  color: string;
  badgeChoice: string;
  careLight: string;
  careWater: string;
  careEcosystem: string;
  secretFact: string;
  fairytaleTitle: string;
  fairytaleText: string;
  originLocation: string;
  originCoords: { lat: number; lng: number };
  continent: string;
  funFactMap: string;
}

// 10 Curated Botanic Flora Collection Data
export const FLORA_DATASET: FloraItem[] = [
  {
    id: 'mawar-merah',
    name: 'Mawar Merah',
    latinName: 'Rosa rubiginosa',
    tag: '☀️ Suka Sinar Matahari',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Sangat Harum & Manis',
    color: 'Merah Merekah',
    badgeChoice: 'Favorit Taman Istana',
    careLight: 'Pencahayaan Penuh (6–8 Jam/Hari)',
    careWater: 'Siram Lembut Pagi & Sore Hari',
    careEcosystem: 'Penyerbuk Lebah Madu & Kupu-kupu',
    secretFact: 'Duri mawar sebenarnya adalah duri pelindung khusus (prickles) yang membantu batang merambat dan menjaga kelembaban dari terik matahari!',
    fairytaleTitle: 'Putri Kelopak Mawar & Kristal Embun Pagi',
    fairytaleText: 'Dahulu kala di taman istana yang indah, ada sebatang mawar merah yang tersenyum saat embun pagi menyapa. Ketika matahari bersinar hangat, mawar itu membukakan kelopak anggunnya dan membagikan keharuman manis kepada lebah-lebah cilik yang melintas. Mawar ini mengajarkan kita untuk selalu berbagi kebaikan dan keceriaan!',
    originLocation: 'Persia & Asia Barat',
    originCoords: { lat: 32.4279, lng: 53.6880 },
    continent: 'Asia',
    funFactMap: 'Taman mawar tertua di dunia telah mekar di Jerman selama lebih dari 1.000 tahun berturut-turut!'
  },
  {
    id: 'bunga-matahari',
    name: 'Bunga Matahari',
    latinName: 'Helianthus annuus',
    tag: '🌻 Mengikuti Sinar',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Aroma Segar Biji Keemasan',
    color: 'Kuning Keemasan',
    badgeChoice: 'Simbol Keceriaan Cilik',
    careLight: 'Matahari Terik Sepanjang Hari',
    careWater: 'Penyiraman Rutin Tanah Lembap',
    careEcosystem: 'Makanan Burung Cilik & Lebah',
    secretFact: 'Bunga Matahari muda selalu menoleh mengikuti arah matahari dari timur ke barat setiap hari! Fenomena ajaib ini disebut Heliotropisme.',
    fairytaleTitle: 'Petualangan Si Kuning Mengejar Matahari',
    fairytaleText: 'Si Kuning adalah Bunga Matahari kecil yang ceria di padang luas. Setiap pagi, ia menyapa matahari dengan senyuman paling lebar. Si Kuning selalu menengadah ke langit tinggi, menyerap kehangatan cahaya untuk membagikan biji-biji lezat kepada burung-burung sahabatnya.',
    originLocation: 'Amerika Utara',
    originCoords: { lat: 37.0902, lng: -95.7129 },
    continent: 'Amerika Utara',
    funFactMap: 'Satu kuntum Bunga Matahari raksasa sebenarnya terdiri dari ribuan bunga-bunga kecil yang bersatu dengan indah!'
  },
  {
    id: 'lidah-buaya',
    name: 'Lidah Buaya',
    latinName: 'Aloe vera',
    tag: '🌱 Gel Sejuk Ajaib',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Aroma Herbal Alami',
    color: 'Hijau Bintik Perak',
    badgeChoice: 'Pahlawan Obat Cilik',
    careLight: 'Cahaya Terang Tak Langsung',
    careWater: 'Hemat Air (Siram 1x Seminggu)',
    careEcosystem: 'Pembersih Udara Alami',
    secretFact: 'Daun tebal Lidah Buaya menyimpan gel bening sejuk yang mengandung 99% air dan kaya nutrisi untuk menyejukkan kulit!',
    fairytaleTitle: 'Pahlawan Gel Hijau Penyejuk Kulit',
    fairytaleText: 'Di sudut kebun obat, tumbuhlah Lidah Buaya yang sabar. Ketika teman-temannya kepanasan karena sengatan matahari sore, Lidah Buaya dengan senang hati menawarkan gel beningnya yang sejuk bagaikan es krim untuk menyegarkan kembali dedaunan di sekitarnya.',
    originLocation: 'Jazirah Arab & Afrika',
    originCoords: { lat: 23.8859, lng: 45.0792 },
    continent: 'Asia - Afrika',
    funFactMap: 'Lidah Buaya telah dimanfaatkan sejak zaman Mesir Kuno dan dijuluki sebagai Tanaman Keabadian!'
  },
  {
    id: 'lavender',
    name: 'Bunga Lavender',
    latinName: 'Lavandula angustifolia',
    tag: '💜 Aroma Penenang',
    image: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Murni & Menenangkan',
    color: 'Ungu Soft Pastel',
    badgeChoice: 'Pengusir Nyamuk Alami',
    careLight: 'Sinar Matahari Hangat',
    careWater: 'Siram Sedikit Saat Tanah Kering',
    careEcosystem: 'Favorit Kupu-kupu Ungu',
    secretFact: 'Aroma Lavender membuat manusia merasa rileks dan tidur nyenyak, tetapi aroma yang sama sangat tidak disukai oleh nyamuk dan serangga nakal!',
    fairytaleTitle: 'Penjaga Malam & Bintang Lavender',
    fairytaleText: 'Ketika malam tiba di lembah gundukan, Bunga Lavender menghembuskan aroma harum nan lembut ke udara. Aroma ajaib ini menemani anak-anak tidur lelap bermimpi indah seraya menjaga malam dari gangguan nyamuk nakal.',
    originLocation: 'Mediterania & Eropa Selatan',
    originCoords: { lat: 41.9028, lng: 12.4964 },
    continent: 'Eropa',
    funFactMap: 'Ladang lavender di Provence, Prancis menarik jutaan kupu-kupu cantik setiap musim panas!'
  },
  {
    id: 'rafflesia-arnoldii',
    name: 'Rafflesia Arnoldii',
    latinName: 'Rafflesia arnoldii',
    tag: '🌺 Bunga Raksasa Langka',
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Aroma Khas Unik Penarik Lalat',
    color: 'Merah Bintik Putih',
    badgeChoice: 'Puspa Langka Indonesia',
    careLight: 'Teduh Hutan Hujan Tropis',
    careWater: 'Kelembapan Hutan Alami',
    careEcosystem: 'Menarik Lalat Penyerbuk Hutan',
    secretFact: 'Rafflesia Arnoldii adalah bunga tunggal terbesar di dunia! Tingginya bisa mencapai 1 meter tanpa memiliki daun, batang, maupun akar!',
    fairytaleTitle: 'Raksasa Lembut dari Hutan Sumatra',
    fairytaleText: 'Jauh di dalam hutan hujan Sumatra yang lebat, bersembunyi seekor puspa raksasa bernama Rafflesia. Meskipun penampilannya sangat besar dan heboh, Rafflesia adalah sahabat hutan yang ramah tempat lalat-lalat hutan membantu penyerbukan.',
    originLocation: 'Bengkulu & Sumatra, Indonesia',
    originCoords: { lat: -0.7893, lng: 113.9213 },
    continent: 'Asia Tenggara',
    funFactMap: 'Bunga Rafflesia membutuhkan waktu hingga 9 bulan untuk tumbuh, tetapi hanya mekar sempurna selama 5 hingga 7 hari saja!'
  },
  {
    id: 'kantong-semar',
    name: 'Kantong Semar',
    latinName: 'Nepenthes sp.',
    tag: '🦟 Tanaman Karnivora Unik',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Aroma Cairan Nektar Manis',
    color: 'Hijau Corak Merah Hutan',
    badgeChoice: 'Penjebak Serangga Cilik',
    careLight: 'Cahaya Hutan Baur',
    careWater: 'Kelembapan Tinggi & Air Hujan',
    careEcosystem: 'Pengendali Serangga Hutan',
    secretFact: 'Kantong Semar memiliki cairan nektar licin di tepi kantongnya. Saat nyamuk atau lalat tergelincir masuk, tanaman ini mencerna nutrisinya!',
    fairytaleTitle: 'Cangkir Ajaib Penjaga Hutan',
    fairytaleText: 'Kantong Semar memiliki bentuk seperti cangkir minum yang unik gantung di ranting pohon. Ia mengundang serangga pengganggu yang lewat untuk singgah bertamu, menjaga populasi serangga hutan tetap seimbang dan harmonis.',
    originLocation: 'Kalimantan & Indonesia',
    originCoords: { lat: -0.9619, lng: 114.5548 },
    continent: 'Asia Tenggara',
    funFactMap: 'Beberapa spesies Kantong Semar raksasa di Kalimantan begitu besar hingga bisa menampung 2 liter air!'
  },
  {
    id: 'teratai-raksasa',
    name: 'Teratai Raksasa',
    latinName: 'Victoria amazonica',
    tag: '🌊 Daun Terapung Kuat',
    image: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Aroma Pisang & Nanas Tropis',
    color: 'Bunga Putih Mekar Ungu',
    badgeChoice: 'Ratu Sungai Amazon',
    careLight: 'Sinar Terik Permukaan Air',
    careWater: 'Air Hangat Kolam/Sungai',
    careEcosystem: 'Rumah Katak Pohon Cilik',
    secretFact: 'Daun Teratai Raksasa Amazon memiliki diameter hingga 3 meter! Urat daun bawahnya sangat kuat sehingga mampu menopang beban anak kecil!',
    fairytaleTitle: 'Perahu Daun Raksasa Amazon',
    fairytaleText: 'Di sungai Amazon yang luas, berlayar daun-daun teratai hijau bundar berukuran raksasa. Katak-katak pohon bernyanyi riang di atasnya bagaikan mendayung perahu ajaib sembari menikmati megahnya bunga teratai yang mekar di malam hari.',
    originLocation: 'Sungai Amazon, Amerika Selatan',
    originCoords: { lat: -3.4653, lng: -62.2159 },
    continent: 'Amerika Selatan',
    funFactMap: 'Bunga Teratai Raksasa mekar di malam hari berwarna putih bersih, lalu berubah menjadi merah muda keunguan pada hari kedua!'
  },
  {
    id: 'pohon-baobab',
    name: 'Pohon Baobab',
    latinName: 'Adansonia digitata',
    tag: '🌳 Pohon Kehidupan 3000 Tahun',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Aroma Kayu Kering Sabana',
    color: 'Batang Cokelat Emas Raksasa',
    badgeChoice: 'Benteng Air Sabana',
    careLight: 'Matahari Terik Sabana',
    careWater: 'Menyimpan Air di Batang',
    careEcosystem: 'Rumah Burung & Burung Hantu',
    secretFact: 'Pohon Baobab sanggup menyimpan hingga 120.000 liter air di dalam batangnya yang gembung untuk bertahan hidup melewati musim kemarau panjang!',
    fairytaleTitle: 'Istana Air Raksasa Madagaskar',
    fairytaleText: 'Di padang sabana yang gersang, berdiri Pohon Baobab yang gagah. Batangnya yang besar bak istana menjadi tempat berlindung hewan-hewan sabana dan memberikan air sejuk bagi siapa saja yang kehausan.',
    originLocation: 'Madagaskar & Afrika',
    originCoords: { lat: -18.7669, lng: 46.8691 },
    continent: 'Afrika',
    funFactMap: 'Baobab sering disebut "Tree of Life" (Pohon Kehidupan) karena memberikan makanan, air, obat-obatan, dan tempat tinggal bagi mahluk hidup!'
  },
  {
    id: 'titan-arum',
    name: 'Titan Arum',
    latinName: 'Amorphophallus titanum',
    tag: '👑 Bunga Tinggi Megah',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Aroma Khas Hutan Tropis',
    color: 'Ungu Tua & Kuning Mahkota',
    badgeChoice: 'Bunga Bangkai Megah',
    careLight: 'Teduh Bawah Kanopi Hutan',
    careWater: 'Tanah Humus Lembap',
    careEcosystem: 'Menarik Kumbang Hutan',
    secretFact: 'Titan Arum adalah perbungaan tidak bercabang tertinggi di dunia! Tingginya saat mekar sempurna bisa mencapai lebih dari 3 meter!',
    fairytaleTitle: 'Ksatria Tinggi Penjaga Hutan',
    fairytaleText: 'Tinggi membumbung di hutan Sumatra, Titan Arum berdiri seperti mahkota ksatria hutan. Ketika mekar, ia menyebarkan kehangatan dan aroma khusus yang memanggil kumbang-kumbang sahabat untuk datang merayakan pesta mekar bunga.',
    originLocation: 'Hutan Hujan Sumatra, Indonesia',
    originCoords: { lat: -0.5897, lng: 101.3431 },
    continent: 'Asia Tenggara',
    funFactMap: 'Suhu di dalam tongkol Titan Arum bisa mencapai 36°C saat mekar, menyebarkan kehangatan bak tubuh manusia!'
  },
  {
    id: 'venus-flytrap',
    name: 'Venus Flytrap',
    latinName: 'Dionaea muscipula',
    tag: '⚡ Jebakan Kilat Serangga',
    image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=800&q=80',
    fragrance: 'Aroma Nektar Manis Pemicu',
    color: 'Hijau Dalam Merah Cerah',
    badgeChoice: 'Monster Cilik Ramah',
    careLight: 'Cahaya Terang Berkelanjutan',
    careWater: 'Air Hujan Murni Tanpa Mineral',
    careEcosystem: 'Pembersih Serangga Pengganggu',
    secretFact: 'Venus Flytrap bisa mengatupkan daun jebakannya hanya dalam waktu 0.1 detik jika rambut pemicunya tersentuh 2 kali beruntun!',
    fairytaleTitle: 'Jebakan Ajaib Si Rambut Pemicu',
    fairytaleText: 'Venus Flytrap memiliki engsel daun unik bernuansa merah muda. Saat lalat pengganggu hinggap dan menyentuh rambut pemicunya yang halus, "Jeb!" daunnya mengatup cepat dengan lembut seperti tepuk tangan gembira!',
    originLocation: 'Carolina Utara, Amerika Serikat',
    originCoords: { lat: 35.7596, lng: -79.0193 },
    continent: 'Amerika Utara',
    funFactMap: 'Venus Flytrap bisa menghitung! Ia hanya mengatup jika rambutnya tersentuh dua kali dalam kurun waktu 20 detik!'
  }
];

// Helper to synthesize Botanic Audio Chime via Web Audio API
const playBotanicalSoundEffect = (type: 'rustle' | 'chime' | 'speech') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'rustle') {
      // Wind rustle + bee buzz synth sound
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      // Bee buzz oscillator overlay
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.2);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.05, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.4);
      osc.stop(now + 0.35);
    } else if (type === 'chime') {
      // Crystal chime C5 - E5 - G5 - C6
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    }
  } catch {
    // Fail silently if browser blocks audio
  }
};

interface FloraExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFloraId?: string;
}

export const FloraExplorerModal: React.FC<FloraExplorerModalProps> = ({
  isOpen,
  onClose,
  initialFloraId = 'mawar-merah'
}) => {
  const [activeFloraIndex, setActiveFloraIndex] = useState(0);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isPlayingStoryVoice, setIsPlayingStoryVoice] = useState(false);
  const [audioFeedbackText, setAudioFeedbackText] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Set initial flora based on prop
  useEffect(() => {
    if (initialFloraId) {
      const idx = FLORA_DATASET.findIndex(f => f.id === initialFloraId);
      if (idx !== -1) setActiveFloraIndex(idx);
    }
  }, [initialFloraId]);

  const currentFlora = FLORA_DATASET[activeFloraIndex] || FLORA_DATASET[0];

  // Stop speech when modal closes or flora changes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeFloraIndex, isOpen]);

  // Handle Voice Narration via Web Speech API
  const handleToggleStoryVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Maaf, peramban Anda belum mendukung fitur narasi suara otomatis.');
      return;
    }

    if (isPlayingStoryVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingStoryVoice(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `${currentFlora.fairytaleTitle}. ${currentFlora.fairytaleText}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1.1;

      utterance.onstart = () => setIsPlayingStoryVoice(true);
      utterance.onend = () => setIsPlayingStoryVoice(false);
      utterance.onerror = () => setIsPlayingStoryVoice(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Pronounce Flora Name
  const handlePronounceName = () => {
    playBotanicalSoundEffect('chime');
    setAudioFeedbackText(`🔊 Melafalkan: ${currentFlora.name} (${currentFlora.latinName})`);
    setTimeout(() => setAudioFeedbackText(null), 2500);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${currentFlora.name}. Nama Latin: ${currentFlora.latinName}`);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play Rustle Sound Effect
  const handlePlayRustleSound = () => {
    playBotanicalSoundEffect('rustle');
    setAudioFeedbackText('🍃 *Gemerisik Daun & Dengung Lebah Madu* 🐝');
    setTimeout(() => setAudioFeedbackText(null), 2200);
  };

  // Navigate Carousel
  const handleSelectFlora = (index: number) => {
    setActiveFloraIndex(index);
    playBotanicalSoundEffect('chime');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/75 backdrop-blur-md font-['Quicksand',sans-serif]">
        {/* Main Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-[#09221a] text-amber-50 rounded-[2.5rem] border-2 border-emerald-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#051812]/90 border-b border-emerald-500/20 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-[#051812]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-wide text-amber-300 uppercase flex items-center gap-2">
                  <span>Mengenal Flora & Bunga 3D</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Edisi Botani
                  </span>
                </h2>
                <p className="text-xs text-emerald-200/70">Eksplorasi Kebun Raya Interaktif & Koleksi Flora Dunia</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-emerald-950/80 hover:bg-emerald-800 text-amber-200 hover:text-white transition-all border border-emerald-500/30 shadow-md cursor-pointer group"
              title="Tutup Modal"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Audio Feedback Toast */}
          <AnimatePresence>
            {audioFeedbackText && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-400 to-emerald-400 text-[#051812] px-5 py-2 rounded-full font-extrabold text-xs shadow-xl border border-white/40 flex items-center gap-2"
              >
                <span>{audioFeedbackText}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Body: Split 2 Columns */}
          <div className="p-5 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* LEFT COLUMN: 3D Botanic Figurin Showcase */}
              <div className="md:col-span-5 flex flex-col justify-between bg-gradient-to-b from-[#0e3328] to-[#061812] rounded-[2rem] p-4 sm:p-5 border border-emerald-500/30 shadow-inner relative overflow-hidden group">
                
                {/* Top Overlay Tag */}
                <div className="flex items-center justify-between gap-2 z-10">
                  <span className="text-xs font-mono font-bold italic text-emerald-300/90 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                    {currentFlora.latinName}
                  </span>
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
                    {currentFlora.tag}
                  </span>
                </div>

                {/* Figurin Center Image Showcase */}
                <div className="relative my-4 flex items-center justify-center min-h-[240px] sm:min-h-[280px]">
                  {/* Glowing Background Pulse */}
                  <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-emerald-500/15 blur-2xl animate-pulse" />
                  
                  <motion.img
                    key={currentFlora.id}
                    initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 250 }}
                    src={currentFlora.image}
                    alt={currentFlora.name}
                    className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-2xl border-2 border-emerald-400/30 relative z-10 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Left Showcase Action Capsule */}
                <div className="z-10 bg-[#051812]/90 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-emerald-300/70 font-semibold uppercase">Suara Suasana</p>
                      <p className="text-xs font-bold text-amber-200">Gemerisik Kebun</p>
                    </div>
                  </div>

                  <button
                    onClick={handlePlayRustleSound}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#051812] font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Dengar</span>
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Botanic Facts, 3 Care Cards & Action Buttons */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                
                {/* Header Badge & Title */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      🌸 {currentFlora.fragrance}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      🎨 {currentFlora.color}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-400/20 text-rose-300 border border-rose-400/30">
                      ⭐ {currentFlora.badgeChoice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                      {currentFlora.name}
                    </h1>

                    <button
                      onClick={handlePronounceName}
                      className="px-3 py-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
                      title="Dengar Pelafalan Nama Flora"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pelafalan</span>
                    </button>
                  </div>
                </div>

                {/* 3 Care Cards (Syarat Tumbuh: Sinar, Air, Sahabat Alam) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card 1: Light */}
                  <div className="bg-[#051c15] p-3.5 rounded-2xl border border-amber-500/20 flex flex-col justify-between space-y-1 hover:border-amber-400/40 transition-colors">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                      <Sun className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Sinar Hangat</span>
                    </div>
                    <p className="text-[11px] font-medium text-emerald-100/90 leading-tight">
                      {currentFlora.careLight}
                    </p>
                  </div>

                  {/* Card 2: Water */}
                  <div className="bg-[#051c15] p-3.5 rounded-2xl border border-sky-500/20 flex flex-col justify-between space-y-1 hover:border-sky-400/40 transition-colors">
                    <div className="flex items-center gap-2 text-sky-400 font-extrabold text-xs">
                      <Droplets className="w-4 h-4 shrink-0 text-sky-400" />
                      <span>Cukup Air</span>
                    </div>
                    <p className="text-[11px] font-medium text-emerald-100/90 leading-tight">
                      {currentFlora.careWater}
                    </p>
                  </div>

                  {/* Card 3: Ecosystem Friend */}
                  <div className="bg-[#051c15] p-3.5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between space-y-1 hover:border-emerald-400/40 transition-colors">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                      <Bug className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Sahabat Alam</span>
                    </div>
                    <p className="text-[11px] font-medium text-emerald-100/90 leading-tight">
                      {currentFlora.careEcosystem}
                    </p>
                  </div>
                </div>

                {/* Secret Botanic Fact Banner */}
                <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-transparent p-3.5 sm:p-4 rounded-2xl border border-amber-400/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-0.5">
                      💡 Rahasia Flora Unik:
                    </h4>
                    <p className="text-xs text-amber-100/95 leading-relaxed">
                      {currentFlora.secretFact}
                    </p>
                  </div>
                </div>

                {/* 2 Main Action Buttons: Story Narrative & World Atlas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Action 1: Story Narrative */}
                  <button
                    onClick={() => {
                      setIsStoryModalOpen(true);
                      handleToggleStoryVoice();
                    }}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-[#051812] font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Putar Dongeng Flora</span>
                  </button>

                  {/* Action 2: Botanical World Atlas */}
                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#051812] font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Buka Peta Asal Flora</span>
                  </button>
                </div>

              </div>
            </div>

            {/* BOTTOM CAROUSEL SHELF: 10 Flora Collection Cards */}
            <div className="pt-4 border-t border-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <span>🌿 Koleksi Flora Kebun Raya (10 Tanaman)</span>
                </h3>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (carouselRef.current) carouselRef.current.scrollBy({ left: -220, behavior: 'smooth' });
                    }}
                    className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors cursor-pointer border border-emerald-500/30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (carouselRef.current) carouselRef.current.scrollBy({ left: 220, behavior: 'smooth' });
                    }}
                    className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors cursor-pointer border border-emerald-500/30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Cards */}
              <div
                ref={carouselRef}
                className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2"
              >
                {FLORA_DATASET.map((flora, idx) => {
                  const isActive = idx === activeFloraIndex;
                  return (
                    <motion.div
                      key={flora.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelectFlora(idx)}
                      className={`relative w-40 sm:w-44 shrink-0 rounded-2xl p-2.5 transition-all cursor-pointer overflow-hidden border ${
                        isActive
                          ? 'bg-gradient-to-b from-amber-500/20 to-emerald-500/20 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                          : 'bg-[#051812] border-emerald-500/20 hover:border-emerald-400/50'
                      }`}
                    >
                      <img
                        src={flora.image}
                        alt={flora.name}
                        className="w-full h-24 object-cover rounded-xl mb-2 border border-emerald-500/20"
                      />
                      <h5 className={`text-xs font-black truncate ${isActive ? 'text-amber-300' : 'text-emerald-100'}`}>
                        {flora.name}
                      </h5>
                      <p className="text-[10px] text-emerald-300/70 truncate italic font-mono">
                        {flora.latinName}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>

        {/* SUB-MODAL 1: Dongeng Narasi Flora (Story Narrative Modal) */}
        <AnimatePresence>
          {isStoryModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-lg bg-[#0a2920] border-2 border-amber-400/40 rounded-3xl p-6 text-amber-50 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
                  <div className="flex items-center gap-2 text-amber-300 font-black text-base">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <span>Dongeng Ramah Anak</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsStoryModalOpen(false);
                      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                      setIsPlayingStoryVoice(false);
                    }}
                    className="p-2 rounded-full bg-emerald-950 text-amber-200 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-amber-300 mb-2">
                    📖 {currentFlora.fairytaleTitle}
                  </h3>
                  <p className="text-sm text-emerald-100 leading-relaxed font-medium bg-[#051812] p-4 rounded-2xl border border-emerald-500/30">
                    "{currentFlora.fairytaleText}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleToggleStoryVoice}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-[#051812] font-black text-xs uppercase flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {isPlayingStoryVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlayingStoryVoice ? 'Hentikan Suara' : 'Putar Narasi Suara'}</span>
                  </button>

                  <span className="text-[10px] text-amber-300/80 italic font-medium">
                    *Narasi Suara Ramah Anak
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SUB-MODAL 2: Botanical World Atlas (Peta Asal Flora) */}
        <AnimatePresence>
          {isMapModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-xl bg-[#09221a] border-2 border-emerald-400/40 rounded-3xl p-6 text-amber-50 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-black text-base">
                    <Compass className="w-5 h-5 text-emerald-400" />
                    <span>Botanical World Atlas</span>
                  </div>
                  <button
                    onClick={() => setIsMapModalOpen(false)}
                    className="p-2 rounded-full bg-emerald-950 text-amber-200 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated World Map Graphic Box */}
                <div className="relative w-full h-52 bg-[#04120e] rounded-2xl border border-emerald-500/30 overflow-hidden flex flex-col items-center justify-center p-4 group">
                  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  
                  {/* Pin Location Badge */}
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/50 animate-bounce">
                      <MapPin className="w-6 h-6 text-amber-400" />
                    </div>
                    <span className="text-base font-black text-amber-300">
                      📍 {currentFlora.originLocation}
                    </span>
                    <span className="text-xs font-mono text-emerald-300/80 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/30">
                      Koordinat: {currentFlora.originCoords.lat}° N, {currentFlora.originCoords.lng}° E ({currentFlora.continent})
                    </span>
                  </div>
                </div>

                <div className="bg-[#051812] p-4 rounded-2xl border border-emerald-500/30 space-y-1">
                  <h5 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    🌐 Fakta Geografis Botani:
                  </h5>
                  <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                    {currentFlora.funFactMap}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsMapModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-[#051812] font-black text-xs uppercase hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    Tutup Peta
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
};
