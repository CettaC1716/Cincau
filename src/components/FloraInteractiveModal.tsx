import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Volume2, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Leaf,
  BookOpen,
  Globe,
  Home,
  RotateCcw,
  VolumeX
} from 'lucide-react';

interface FloraItem {
  key: string;
  name: string;
  latin: string;
  image: string;
  badge: string;
  habitat: string;
  sun: string;
  water: string;
  benefit: string;
  taleTitle: string;
  taleSubtitle: string;
  taleSummary: string;
  originTitle: string;
  originFact: string;
  pinX: number;
  pinY: number;
  pinLabel: string;
}

const FLORA_REGISTRY: Record<string, FloraItem> = {
  mawar: {
    key: 'mawar',
    name: 'Mawar Merah',
    latin: 'Rosa rubiginosa',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1Uc7w-9V7ANpFPFzyoi6EIcnH6sGOLK-MMSV-L2yefm9JRzss8rpGRVzyL93_Agd_o9ty3ny5f9QmJueEtnZDZFskTm7WT4VYF0XxhooCh0ZsTrZCjJDjXFws3u8aKfRCewvtZ934ws1oZw2GiraYELNRBqpX7N4tY1e4Drl3ReW57R0gWVJvse6-B4oH34pnYRMg-k9ZEa_4_Ktsy-9Z7gzozHBn5MQSb4Hzi5IkCz3NX46Qcvd4e3',
    badge: '🌹 MAWAR MERAH',
    habitat: 'TAMAN PEKARANGAN RUMAH',
    sun: 'Suka berjemur 6 jam agar mekar ceria!',
    water: 'Cukup 1 kali sehari di pagi hari!',
    benefit: 'Aromanya harum disukai lebah madu!',
    taleTitle: 'Dongeng Putri Kelopak Mawar & Duri Setia',
    taleSubtitle: 'Kisah Harum Melindungi Sahabat Kebun',
    taleSummary: 'Duri di batang mawar adalah pelindung lembut agar tangkai dan bunganya yang wangi tidak mudah dirusak hewan besar saat mekar!',
    originTitle: 'Asal Usul Bunga Mawar',
    originFact: 'Mawar telah dibudidayakan lebih dari 5.000 tahun silam dari kawasan Asia Barat dan Persia kuno!',
    pinX: 470,
    pinY: 140,
    pinLabel: 'Persia & Asia Barat'
  },
  matahari: {
    key: 'matahari',
    name: 'Bunga Matahari',
    latin: 'Helianthus annuus',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1W7Wy03lXquDwaucQk8EQDn750TMgyealQtJi75booXUGLoVayfj0C5pmDb7GowSQknEmjRk_fViC7LHN_JbJpOJPUedVNGeIy5aG6l8fH_H2ryO2uwPOxUGCytDqY106nLnV-iUMHsy-94_Ri_vWlFwaj3eRHX4kVorxcDnkrYzV0P23oBJ-zbL7cwXFMuGAnGLn4zpPIksoeqn5b38gKGwVlHUGJvyTrxZPXMlcmyWt-A3MepBJA',
    badge: '🌻 BUNGA MATAHARI',
    habitat: 'FLORA KEBUN RUMAH',
    sun: 'Bunga selalu mengikuti arah matahari pagi hingga sore!',
    water: 'Siram 1-2 hari sekali di tanah gembur yang hangat.',
    benefit: 'Biji bergizi renyah & nektar manis penarik lebah madu.',
    taleTitle: 'Petualangan Si Biji Emas',
    taleSubtitle: 'Kisah Si Bunga Pengikut Mentari',
    taleSummary: 'Bunga matahari bukan cuma satu bunga lho! Tengahnya memiliki ribuan bunga kecil mungil yang bertumbuh jadi biji kuaci renyah.',
    originTitle: 'Asal Usul Bunga Matahari',
    originFact: 'Bunga Matahari berasal dari benua Amerika dan dibawa berkeliling dunia oleh para penjelajah botani berkat keindahannya!',
    pinX: 180,
    pinY: 150,
    pinLabel: 'Amerika Utara'
  },
  aloe: {
    key: 'aloe',
    name: 'Lidah Buaya',
    latin: 'Aloe vera',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UkSmyb0UuKcFGydQS-tKAcKJcd25i_xjgYjdfuUMkM9D-n-a2lvPCIF17I1XmmTggkrQjF-RxLHbvmF6vVEmsPxJDTFyhX_oYGM-2BhFaBoAWvwqDYikzJKP51lXpkzuP1pseGuJm5SFbT2bVOwsB7x5v80zbE_53YXoAZFQLSNo7S-NTFW0oskq-ctoQcOF1a5ECfrwu69mtDwY1WDQvcdUYIz6cAtH0SxKfrA7FWueDMWhT_hiec',
    badge: '🪴 LIDAH BUAYA',
    habitat: 'POT SUKULEN RUMAH',
    sun: 'Cukup sinar terang di dekat jendela rumah.',
    water: 'Hemat air, siram saat tanah kering 1-2 minggu sekali.',
    benefit: 'Gel dingin penyejuk kulit & pembersih udara alami.',
    taleTitle: 'Kisah Si Gel Dingin Penyembuh Luka',
    taleSubtitle: 'Sahabat P3K Alami Dalam Pot Rumah',
    taleSummary: 'Di dalam daun tebalnya, tersimpan cadangan air seperti spons ajaib yang siap menyejukkan kulit kita!',
    originTitle: 'Asal Usul Lidah Buaya',
    originFact: 'Berasal dari Jazirah Arab yang kering, tanaman ini jadi simbol kesehatan sejak zaman Mesir Kuno!',
    pinX: 440,
    pinY: 180,
    pinLabel: 'Jazirah Arab'
  },
  lavender: {
    key: 'lavender',
    name: 'Bunga Lavender',
    latin: 'Lavandula angustifolia',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1Vceuu6fCcHPNKCwpd_l3C3tfp89oBdBf-q5jAa97fgsu1v8hjA7dLy5GY0UgLxgujgYv3lhm5XvZDvhwRTZoRwc8LR1pVD455Yq9YWUZw9mDiYWKFfreaYXr-xWVLWAc6U2XUN9llthx2d8qtf76XuF_9WlM3IDFC-CZnlAUHsRCplv2S_MjgOM0VzIg7pBy8E97fknimuh_Keu9IAmuH2ViG6l4cIwFAlgbg_Nmpxt0F_hQKtt3I',
    badge: '🪻 BUNGA LAVENDER',
    habitat: 'KEBUN HERBAL AROMATIK',
    sun: 'Suka sinar matahari terik & udara kering berangin.',
    water: 'Siram sedang, jangan biarkan tanah terlalu becek.',
    benefit: 'Aroma wangi penenang tidur & pengusir nyamuk alami.',
    taleTitle: 'Lagu Pengantar Tidur di Lembah Ungu',
    taleSubtitle: 'Kisah Bunga Ajaib yang Menjaga Mimpi Indah',
    taleSummary: 'Aroma bunganya yang manis membuat kita merasa tenang, nyaman, dan nyamuk pun tidak berani mendekat.',
    originTitle: 'Asal Usul Lavender',
    originFact: 'Tumbuh liar di perbukitan Mediterania selatan Eropa dan pesisir Laut Tengah!',
    pinX: 410,
    pinY: 130,
    pinLabel: 'Laut Mediterania'
  },
  teratai: {
    key: 'teratai',
    name: 'Teratai Raksasa',
    latin: 'Victoria amazonica',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1Uapb7FzFLG1CWuq3zx6m-STRemxeDVA3r2EzmM737Z2JWFg8au-J4GC1fz6_bd-GxsYRNK3ZYk7_TZwSGDr-qaJJ7J6H3I1Hunxlar-AHLP3EeSU3VosGFVIjU4gECe8I3jWrT8how7yrN7RYMgfrJIfrlbKY6Mf2wOTtZsZtg3cWrFOvHSig-Z4WIO9T6OOXHEzHzIo5UzEtMFwDiNqZyO-8bcfq93tme8yuCANFmaWQ_MiHxx61Q',
    badge: '🪷 TERATAI RAKSASA',
    habitat: 'KOLAM AIR TENANG',
    sun: 'Suka mengapung di permukaan air kolam yang hangat.',
    water: 'Hidup di air tenang dengan lumpur subur di dasar kolam.',
    benefit: 'Rumah perlindungan ikan kecil & piring terapung kokoh.',
    taleTitle: 'Misteri Piring Terapung di Sungai Amazon',
    taleSubtitle: 'Kisah Daun Raksasa Berbunga Mekar Malam',
    taleSummary: 'Daunnya yang lebar memiliki urat berduri di bagian bawah dan tepian tegak yang membuatnya mengapung gagah.',
    originTitle: 'Asal Usul Teratai Raksasa Amazon',
    originFact: 'Berasal dari perairan rawa tenang Sungai Amazon di pedalaman hutan tropis Amerika Selatan!',
    pinX: 230,
    pinY: 280,
    pinLabel: 'Sungai Amazon'
  },
  rafflesia: {
    key: 'rafflesia',
    name: 'Rafflesia Arnoldii',
    latin: 'Rafflesia arnoldii',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1XizkDr4o_WQmUxmnbGMTRFyMZbgW6krXlRTQ43AqHeYIap0M7lFZV-BUhjfGq-SFzvE2aL9HOFueOfc09pH4puL19IEWURGOK_dmEm8BEJXqxIpgNbU3KxcTSetp9-1OLycj6ibJ0AXvqtb7-5PMctKGZdfzSeY-J4JDferoipzwRSE-xYhggZdk3AriR4Oyv4p2luqsZZS9KiBuzBAAyvh5oaIAh4PZc8LS3j7caBYFDCJyGkUP0',
    badge: '🌺 RAFFLESIA ARNOLDII',
    habitat: 'HUTAN HUJAN TROPIS',
    sun: 'Tumbuh rindang di dasar hutan tropis yang lembap.',
    water: 'Membutuhkan kelembapan udara & tanah humus hutan.',
    benefit: 'Bunga raksasa langka kebanggaan alam Nusantara.',
    taleTitle: 'Kisah Raksasa Merah Pengheboh Hutan',
    taleSubtitle: 'Bunga Tanpa Daun Bintang Nusantara',
    taleSummary: 'Rafflesia adalah bunga terbesar di dunia yang mekar unik tanpa daun dan tanpa batang!',
    originTitle: 'Asal Usul Rafflesia',
    originFact: 'Pertama kali ditemukan di pedalaman hutan Bengkulu, Sumatera, Indonesia!',
    pinX: 630,
    pinY: 290,
    pinLabel: 'Sumatera, Indonesia'
  },
  nepenthes: {
    key: 'nepenthes',
    name: 'Kantong Semar',
    latin: 'Nepenthes',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1VBs2SCBTw0M8iaWtJzOtcVq9iu4wtg3xWhkkGeiwU1dAmc7s0WZTMN3pTLG1H0brkBHTOr3IxYfiu3P8WFRU9w2OANrgIjR8SNzcNLTB0KVZawYYz0RYDBMAB0ajvDcnxAZEMOEhEx7zuEt0mGzAg32dPesuf7S5Fjk7tByGYhLuYkm_LtPmuHmDckB1JgqyS8tDztZchv2H7dcjlqjau8lUtrcxBRXEtkma12qt3xadFRTdtLmh15',
    badge: '🫙 KANTONG SEMAR',
    habitat: 'KARNIVORA TROPIS',
    sun: 'Suka tempat terang berudara basah & lembap.',
    water: 'Suka air hujan murni di tanah gambut hutan.',
    benefit: 'Piala penangkap serangga alami pengendali hama.',
    taleTitle: 'Piala Nektar Ajaib Penjaga Hutan',
    taleSubtitle: 'Kisah Kantong Perangkap Serangga',
    taleSummary: 'Kantongnya yang licin memiliki nektar manis yang menarik serangga sebagai makanan utamanya!',
    originTitle: 'Asal Usul Kantong Semar',
    originFact: 'Banyak ditemukan di hutan gambut pedalaman Kalimantan dan Sumatera!',
    pinX: 640,
    pinY: 280,
    pinLabel: 'Kalimantan, Indonesia'
  },
  baobab: {
    key: 'baobab',
    name: 'Pohon Baobab',
    latin: 'Adansonia',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1XNU9NphKX7hPagqzl1PLr8JJSH4QwGZG25W4YzH0E7Yy4ay3IEewDQv0gxGt7W6EtjQue3V99-av6iBGbgfdA37tfiETAI7fFEfogEJrw_gwBLHhc64cMWwEsl5vvl5vOb9iO1M3ELOEf7khxGVrOVE7b-yo85HWDukdpZKUh1oorkEdojvUXp8aiW7j_9MBxsc3KEx5sHQbUdwgtN2jzYLpHN6kQ9o8mv_MBqvMSBVU6Ll1Cilsc',
    badge: '🌳 POHON BAOBAB',
    habitat: 'SAVANA EKSOTIS',
    sun: 'Suka terik matahari padang savana yang hangat.',
    water: 'Menyimpan ribuan liter air di batang raksasanya.',
    benefit: 'Pohon kehidupan penyedia air & peneduh hewan.',
    taleTitle: 'Pohon Botol Raksasa Kehidupan',
    taleSubtitle: 'Kisah Penyelamat Gurun dan Savana',
    taleSummary: 'Batangnya yang membengkak tebal berfungsi seperti tangki air raksasa penahan kemarau!',
    originTitle: 'Asal Usul Baobab',
    originFact: 'Berasal dari pulau eksotis Madagaskar dan padang savana benua Afrika!',
    pinX: 420,
    pinY: 340,
    pinLabel: 'Madagaskar'
  },
  titan: {
    key: 'titan',
    name: 'Titan Arum',
    latin: 'Amorphophallus titanum',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1VB1x-PxWxQHLLdgE93iXh7uWZoqImZS8ystMzyu7fNXBvsZooIaxNAn4cPcFOhyT0eTMIphN8OxJVdoYb2KPMlk6IO8mKvvb-IzFu-OXxhKp0h9NRn1XggxO1Sojc_b7-fzEtdIPAy0rJktjsbWBZ3ItGaHKKIONrJzi3m-cuaYkZenEPbDyci9IyqOO7hJ5-Q84NU4u1qlzax6UT_TiA-vQq0hy0yARrtK6gmcSKYBV84xl3G1uA',
    badge: '🕯️ TITAN ARUM',
    habitat: 'FLORA LANGKA',
    sun: 'Tumbuh di lembah hutan tropis yang rindang.',
    water: 'Menyukai tanah humus hutan yang subur & basah.',
    benefit: 'Bunga tertinggi megah kebanggaan alam Indonesia.',
    taleTitle: 'Kisah Bunga Lilin Raksasa Tropis',
    taleSubtitle: 'Keajaiban Bunga Tertinggi di Bumi',
    taleSummary: 'Bunga ini bisa tumbuh tinggi mencapai 3 meter melebihi tinggi manusia dewasa!',
    originTitle: 'Asal Usul Titan Arum',
    originFact: 'Endemik asli dari hutan hujan tropis bukit barisan Sumatera!',
    pinX: 620,
    pinY: 295,
    pinLabel: 'Sumatera Utara'
  },
  venus: {
    key: 'venus',
    name: 'Venus Flytrap',
    latin: 'Dionaea muscipula',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1XvOj9TIurBRsuzhURgEIZyjW95dXH7qGahDj4jR-hWiFcTZxT1p0zBx5G9QGWBi_sPkJZcq8Hrk2OerhUwQ9Wx7ySkcuvS0719qr1Ezl-ok6KEh3WR5CifR9gPSq9RtM6NWuNuJXornZUNWMwdXeXKD_g3yIDm7CSSPr7jaIfd6UW8xRuuOO-1sWIIq2urpG-SINwtGp7HW-xx1SbM6w-3Ui2yV3fSSP2-VzAMc_n1IVUOWRlKWAks',
    badge: '🪴 VENUS FLYTRAP',
    habitat: 'KARNIVORA UNIK',
    sun: 'Suka cahaya terang di tanah rawa basah.',
    water: 'Membutuhkan air murni bebas mineral berlebih.',
    benefit: 'Perangkap rahang kilat pengendali lalat & laron.',
    taleTitle: 'Kisah Rahang Perangkap Kilat',
    taleSubtitle: 'Bunga Lincah Pemikat Lalat',
    taleSummary: 'Daunnya memiliki rambut halus pemicu yang akan mengatup dalam 0.1 detik saat disentuh serangga!',
    originTitle: 'Asal Usul Venus Flytrap',
    originFact: 'Berasal dari kawasan lahan basah pantai Karolina di Amerika Serikat!',
    pinX: 190,
    pinY: 160,
    pinLabel: 'Karolina, Amerika'
  }
};

interface FloraInteractiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloraInteractiveModal: React.FC<FloraInteractiveModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFloraKey, setSelectedFloraKey] = useState<string>('mawar');
  const [, setIsAudioBreezeActive] = useState(false);
  const [heroMode, setHeroMode] = useState<'habitat' | 'audio' | 'map'>('habitat');
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [narrationSpeed, setNarrationSpeed] = useState(360);

  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeFlora = FLORA_REGISTRY[selectedFloraKey] || FLORA_REGISTRY.mawar;

  const fullFloraStoryText = `${activeFlora.taleTitle}. ${activeFlora.taleSubtitle}. ${activeFlora.taleSummary} Mari rawat tanaman sahabat alam kita setiap hari!`;
  const storyWords = fullFloraStoryText.split(' ');

  // Web Audio Synthesizer: Breeze & Honeybee buzzing sound
  const triggerLeafBeeAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsAudioBreezeActive(true);

      const bufferSize = ctx.sampleRate * 1.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.08;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.2);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.4);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start();

      const beeOsc = ctx.createOscillator();
      beeOsc.type = 'sawtooth';
      beeOsc.frequency.setValueAtTime(190, ctx.currentTime + 0.2);
      beeOsc.frequency.linearRampToValueAtTime(240, ctx.currentTime + 0.8);
      beeOsc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 1.4);

      const beeGain = ctx.createGain();
      beeGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      beeGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.3);
      beeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);

      beeOsc.connect(beeGain);
      beeGain.connect(ctx.destination);
      beeOsc.start(ctx.currentTime + 0.2);
      beeOsc.stop(ctx.currentTime + 1.5);

      setTimeout(() => {
        setIsAudioBreezeActive(false);
      }, 1600);
    } catch {
      setIsAudioBreezeActive(false);
    }
  };

  const stopStoryNarration = () => {
    setIsSpeechPlaying(false);
    if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const startStoryNarration = () => {
    stopStoryNarration();
    if (currentWordIdx >= storyWords.length - 1) {
      setCurrentWordIdx(0);
    }
    triggerLeafBeeAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(fullFloraStoryText);
      utterance.lang = 'id-ID';
      utterance.rate = narrationSpeed === 360 ? 0.95 : 0.72;
      utterance.pitch = 1.05;
      utterance.onend = () => {
        setIsSpeechPlaying(false);
        if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
      };
      utterance.onerror = () => {
        setIsSpeechPlaying(false);
        if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeechPlaying(true);
    }
  };

  // Synced word counter for narration
  useEffect(() => {
    if (!isSpeechPlaying) return;
    const interval = narrationSpeed;
    const tick = () => {
      setCurrentWordIdx((prev) => {
        if (prev < storyWords.length - 1) {
          storyTimerRef.current = setTimeout(tick, interval);
          return prev + 1;
        } else {
          setIsSpeechPlaying(false);
          return prev;
        }
      });
    };
    storyTimerRef.current = setTimeout(tick, interval);
    return () => {
      if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    };
  }, [isSpeechPlaying, narrationSpeed, storyWords.length]);

  const speakText = (text: string) => {
    stopStoryNarration();
    triggerLeafBeeAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselTrackRef.current) return;
    const offset = direction === 'left' ? -280 : 280;
    carouselTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Close speech on modal unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-0 tablet:p-3 lg:p-6 overflow-hidden select-none font-['Nunito',sans-serif]">
        {/* Main Modal Container - Matches Fauna Modal (MengenalHewanModal) Dimensions & Proportions 100% */}
        <motion.main
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full h-full tablet:max-h-[98dvh] tablet:h-[98dvh] tablet:max-w-[1340px] rounded-none tablet:rounded-[2.2rem] shadow-2xl overflow-hidden flex flex-col border-0 tablet:border-3 border-amber-200/80"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/AEtjO1WSjJKRrSYS8-MAOu2yS0aiMSZLXxu9Mg0FLqftBFwOnbtnw4MawBCjtz3WJhv-TtIGZc-pFp7BwryMOkRdTFKihik6qpPc5YL92ZeCyc8gfK0IKHBzmC5_SMPXxx9934SaDDuVe0hyDvS3rOo5bK30lmw1YtPdcXdjlaZy4BnzbFeMHGBfXU-JkyMKJlT0F2ozPf7sHFL_v2MqN81Zvj9QH250lpcehKoWKAnPgFNJ_JiDOFSmUGcW')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'rgb(44, 26, 29)'
          }}
        >
          {/* Scrollable / Flexible Inner Frame */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 sm:px-5 tablet:px-6 lg:px-8 py-2 tablet:py-3 flex flex-col justify-between gap-2 tablet:gap-2.5" style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.76) 0%, rgba(255, 248, 240, 0.6) 60%, rgba(255, 243, 230, 0.4) 100%)' }}>
            
            {/* Header Bar matching Fauna Modal Header */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-amber-200/80 shadow-md">
                <button onClick={onClose} className="flex items-center gap-1.5 text-[#b45309] hover:text-[#991b1b] transition-colors text-xs font-black uppercase tracking-wider cursor-pointer">
                  <Home className="w-4 h-4 text-[#f5a623]" />
                  <span>Habitat Kebun</span>
                </button>
                <ChevronRight className="w-4 h-4 text-amber-400" />
                <span className="text-[#991b1b] font-black text-xs uppercase tracking-wider">{activeFlora.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-amber-200/80 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f5a623] animate-pulse shadow-[0_0_8px_#f5a623]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#b45309]">Mode Edukasi Interaktif</span>
                </div>
                <button 
                  onClick={onClose}
                  className="w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] rounded-full bg-white hover:bg-red-50 text-[#b45309] hover:text-red-600 flex items-center justify-center border-2 border-amber-200 transition-all active:scale-95 cursor-pointer shadow-md touch-target"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Main Showcase Grid (2-column on tablet & desktop matching Fauna Modal) */}
            <div className="grid grid-cols-1 md:grid-cols-12 tablet:grid-cols-12 gap-2.5 tablet:gap-3.5 lg:gap-5 items-stretch flex-1 min-h-0">
              
              {/* Hero Card - Area Utama Kotak Habitat Flora with inline Dongeng Suara & Peta Asal */}
              <div className="md:col-span-5 tablet:col-span-5 relative group overflow-hidden rounded-[1.8rem] tablet:rounded-[2rem] bg-gradient-to-b from-[#fcdac2] to-[#e4a886] flex flex-col justify-between shadow-2xl h-full min-h-[330px] tablet:min-h-0 border-2 tablet:border-3 border-white/20" id="heroFloraCard">
                {/* Floating Tab Selector on Top of the Habitat Box */}
                <div className="absolute top-2.5 inset-x-2.5 z-30 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1 bg-black/65 backdrop-blur-md p-1 rounded-full border border-white/20 pointer-events-auto shadow-md">
                    <button
                      onClick={() => {
                        setHeroMode('habitat');
                        if (isSpeechPlaying) stopStoryNarration();
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] sm:text-xs transition-all cursor-pointer ${
                        heroMode === 'habitat' 
                          ? 'bg-[#f5a623] text-[#644000] shadow-sm' 
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <span>📸</span>
                      <span>Habitat</span>
                    </button>

                    <button
                      onClick={() => {
                        if (heroMode === 'audio') {
                          if (isSpeechPlaying) stopStoryNarration();
                          else startStoryNarration();
                        } else {
                          setHeroMode('audio');
                          startStoryNarration();
                        }
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] sm:text-xs transition-all cursor-pointer ${
                        heroMode === 'audio' 
                          ? 'bg-[#f5a623] text-[#644000] shadow-sm' 
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <span>📖</span>
                      <span>Dongeng</span>
                    </button>

                    <button
                      onClick={() => {
                        setHeroMode('map');
                        if (isSpeechPlaying) stopStoryNarration();
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] sm:text-xs transition-all cursor-pointer ${
                        heroMode === 'map' 
                          ? 'bg-[#0f766e] text-white shadow-sm' 
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <span>🧭</span>
                      <span>Peta Asal</span>
                    </button>
                  </div>

                  {/* Status Indicator */}
                  {heroMode === 'audio' && isSpeechPlaying && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/90 text-white font-black text-[9px] border border-white/30 animate-pulse pointer-events-auto shadow-md">
                      <Volume2 className="w-3 h-3" />
                      <span>Mendongeng...</span>
                    </span>
                  )}
                </div>

                {/* VIEW 1: HABITAT PHOTO */}
                {heroMode === 'habitat' && (
                  <div className="absolute inset-0 bg-[#07241d]">
                    <img
                      src={activeFlora.image}
                      alt={activeFlora.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

                    {/* Habitat Callout Banner at Bottom */}
                    <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between">
                      <div className="bg-black/60 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-white/15 text-left">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#ffc880] block">{activeFlora.habitat}</span>
                        <span className="text-xs sm:text-sm font-black text-white">{activeFlora.name} <span className="text-[10px] text-amber-200">({activeFlora.latin})</span></span>
                      </div>

                      <button
                        onClick={() => speakText(`${activeFlora.name}! ${activeFlora.benefit}`)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f5a623] hover:bg-[#ffb955] text-[#644000] flex items-center justify-center font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
                        title="Dengarkan Suara Flora"
                      >
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* VIEW 2: INLINE AUDIO STORY PLAYER */}
                {heroMode === 'audio' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1c130b] via-[#241305] to-[#120a03] flex flex-col justify-between p-3 pt-13 text-left z-20">
                    {/* Story Mini Thumbnail & Title */}
                    <div className="flex items-center gap-2.5 bg-black/45 p-2 rounded-2xl border border-white/10 shrink-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-[#f5a623]/40 shadow-sm relative">
                        <img src={activeFlora.image} alt={activeFlora.name} className="w-full h-full object-cover" />
                        {isSpeechPlaying && (
                          <div className="absolute inset-0 bg-amber-500/25 animate-pulse flex items-center justify-center">
                            <Volume2 className="w-4 h-4 text-amber-300 animate-bounce" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-wider text-[#ffc880]">
                          Dongeng Audio Botani Cilik
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-white truncate">
                          {activeFlora.taleTitle}
                        </h4>
                      </div>
                    </div>

                    {/* Read-Along Synced Text */}
                    <div className="flex-1 my-2 p-3 bg-black/40 rounded-2xl border border-white/10 overflow-y-auto no-scrollbar flex flex-col justify-center">
                      <div className="text-xs sm:text-sm font-bold text-[#fed7aa] leading-relaxed select-none">
                        {storyWords.map((word: string, idx: number) => (
                          <motion.span
                            key={idx}
                            animate={{ 
                              backgroundColor: idx < currentWordIdx ? '#f5a623' : 'transparent',
                              color: idx < currentWordIdx ? '#451a03' : '#fed7aa',
                              scale: idx === currentWordIdx - 1 ? 1.08 : 1
                            }}
                            className="inline-block mr-1.5 px-1.5 py-0.5 rounded-md cursor-pointer hover:text-[#ffedd5] transition-colors"
                            onClick={() => {
                              setCurrentWordIdx(idx);
                              stopStoryNarration();
                            }}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-black/50 p-2 rounded-2xl border border-white/10 flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isSpeechPlaying) {
                              stopStoryNarration();
                            } else {
                              startStoryNarration();
                            }
                          }}
                          className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#f5a623] hover:bg-[#ffb955] text-[#644000] font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                        >
                          {isSpeechPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span>{isSpeechPlaying ? 'Jeda' : 'Putar'}</span>
                        </button>

                        <button
                          onClick={() => {
                            stopStoryNarration();
                            setCurrentWordIdx(0);
                          }}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Ulangi dari Awal"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 text-[9px] font-black">
                        <button
                          onClick={() => setNarrationSpeed(360)}
                          className={`px-2 py-0.5 rounded-full transition-all ${narrationSpeed === 360 ? 'bg-[#f5a623] text-[#644000]' : 'text-neutral-400'}`}
                        >
                          1.0x
                        </button>
                        <button
                          onClick={() => setNarrationSpeed(560)}
                          className={`px-2 py-0.5 rounded-full transition-all ${narrationSpeed === 560 ? 'bg-[#f5a623] text-[#644000]' : 'text-neutral-400'}`}
                        >
                          0.7x 🐢
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 3: INLINE CHILD-FRIENDLY BOTANICAL GEOGRAPHIC MAP */}
                {heroMode === 'map' && (
                  <div className="absolute inset-0 z-20 flex flex-col justify-between overflow-hidden bg-[#07241d] select-none text-left">
                    {/* Map Control Bar */}
                    <div className="relative z-20 flex items-center justify-between p-2.5 sm:p-3 bg-black/55 backdrop-blur-md border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 text-white flex items-center justify-center text-sm shadow-md">
                          🗺️
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-teal-300">
                            Peta Asal & Persebaran Botani
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-white leading-tight flex items-center gap-1.5">
                            <span>{activeFlora.originTitle}</span>
                          </h4>
                        </div>
                      </div>

                      <button
                        onClick={() => setHeroMode('habitat')}
                        className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-black text-[10px] sm:text-xs transition-all border border-white/20 active:scale-95 cursor-pointer shadow-sm"
                        title="Kembali ke Foto Habitat"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Foto</span>
                      </button>
                    </div>

                    {/* Main Interactive Map Canvas */}
                    <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-2 sm:p-3">
                      {/* Cartographic Compass Rose */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-10 h-10 sm:w-11 sm:h-11 pointer-events-none opacity-80 z-20 drop-shadow-md">
                        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                          <circle cx="50" cy="50" r="44" stroke="#5eead4" strokeWidth="2" strokeDasharray="3,3" />
                          <polygon points="50,10 57,47 50,43 43,47" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
                          <polygon points="50,90 57,53 50,57 43,53" fill="#14b8a6" stroke="#0f766e" strokeWidth="1.5" />
                          <polygon points="10,50 47,43 43,50 47,57" fill="#5eead4" stroke="#0d9488" strokeWidth="1" />
                          <polygon points="90,50 53,43 57,50 53,57" fill="#5eead4" stroke="#0d9488" strokeWidth="1" />
                          <circle cx="50" cy="50" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                          <text x="46" y="8" fontSize="9" fontWeight="900" fill="#f87171">U</text>
                        </svg>
                      </div>

                      {/* Vintage Sailing Explorer Boat */}
                      <div className="absolute bottom-3 left-3 text-lg opacity-70 pointer-events-none animate-pulse">
                        ⛵
                      </div>

                      {/* Map SVG Canvas */}
                      <div className="w-full h-full max-w-[420px] max-h-[380px] relative flex items-center justify-center">
                        <svg viewBox="0 0 800 450" className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
                          <defs>
                            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#05241e" />
                              <stop offset="50%" stopColor="#09382f" />
                              <stop offset="100%" stopColor="#041a15" />
                            </linearGradient>
                            <linearGradient id="floraContinentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fed7aa" />
                              <stop offset="50%" stopColor="#fdba74" />
                              <stop offset="100%" stopColor="#ea580c" />
                            </linearGradient>
                          </defs>

                          {/* Ocean background */}
                          <rect width="100%" height="100%" fill="url(#oceanGrad)" />

                          {/* Latitude/Longitude lines */}
                          <path d="M 0 112.5 L 800 112.5 M 0 225 L 800 225 M 0 337.5 L 800 337.5" stroke="rgba(94, 234, 212, 0.15)" strokeWidth="1" strokeDasharray="4,4" />
                          <path d="M 200 0 L 200 450 M 400 0 L 400 450 M 600 0 L 600 450" stroke="rgba(94, 234, 212, 0.15)" strokeWidth="1" strokeDasharray="4,4" />

                          {/* Continents Base Shapes with Clear Outlines */}
                          {/* North America */}
                          <path d="M 80 80 Q 150 50 240 70 Q 280 120 220 180 Q 180 220 160 250 Q 120 230 100 170 Z" fill="url(#floraContinentGrad)" stroke="#7c2d12" strokeWidth="2.5" opacity="0.88" />
                          {/* South America */}
                          <path d="M 180 250 Q 260 260 280 320 Q 260 410 220 440 Q 180 400 170 330 Z" fill="url(#floraContinentGrad)" stroke="#7c2d12" strokeWidth="2.5" opacity="0.88" />
                          {/* Europe */}
                          <path d="M 370 70 Q 450 60 470 110 Q 430 150 380 140 Q 360 110 370 70 Z" fill="url(#floraContinentGrad)" stroke="#7c2d12" strokeWidth="2.5" opacity="0.88" />
                          {/* Africa */}
                          <path d="M 360 140 Q 460 140 480 200 Q 470 280 440 360 Q 400 400 370 360 Q 340 270 340 200 Z" fill="url(#floraContinentGrad)" stroke="#7c2d12" strokeWidth="2.5" opacity="0.88" />
                          {/* Madagascar */}
                          <ellipse cx="490" cy="330" rx="10" ry="20" fill="#fcd34d" stroke="#7c2d12" strokeWidth="1.5" />
                          {/* Asia */}
                          <path d="M 470 60 Q 640 40 720 100 Q 750 180 680 220 Q 580 200 520 160 Q 470 120 470 60 Z" fill="url(#floraContinentGrad)" stroke="#7c2d12" strokeWidth="2.5" opacity="0.88" />
                          {/* Nusantara & Indonesia */}
                          <path d="M 590 270 Q 660 270 700 290 Q 680 310 610 300 Z" fill="#86efac" stroke="#166534" strokeWidth="2" />
                          <ellipse cx="610" cy="285" rx="18" ry="6" fill="#4ade80" stroke="#166534" strokeWidth="1.5" />
                          <ellipse cx="650" cy="275" rx="16" ry="12" fill="#4ade80" stroke="#166534" strokeWidth="1.5" />
                          {/* Australia */}
                          <path d="M 660 320 Q 740 310 760 370 Q 710 420 650 400 Q 640 350 660 320 Z" fill="url(#floraContinentGrad)" stroke="#7c2d12" strokeWidth="2.5" opacity="0.88" />

                          {/* Ocean Labels */}
                          <text x="140" y="320" fontSize="10" fontWeight="900" fill="#2dd4bf" opacity="0.4" letterSpacing="1">SAMUDRA PASIFIK</text>
                          <text x="320" y="270" fontSize="10" fontWeight="900" fill="#2dd4bf" opacity="0.4" letterSpacing="1">SAMUDRA ATLANTIK</text>
                          <text x="510" y="380" fontSize="10" fontWeight="900" fill="#2dd4bf" opacity="0.4" letterSpacing="1">SAMUDRA HINDIA</text>

                          {/* Active Flora Origin Animated Pin */}
                          <g className="cursor-pointer">
                            {/* Pulsing ring */}
                            <circle cx={activeFlora.pinX} cy={activeFlora.pinY} r="18" fill="none" stroke="#22c55e" strokeWidth="2.5" className="animate-ping opacity-75" />
                            {/* Center glow pin */}
                            <circle cx={activeFlora.pinX} cy={activeFlora.pinY} r="12" fill="#15803d" stroke="#ffffff" strokeWidth="2.5" className="filter drop-shadow-lg" />
                            <text x={activeFlora.pinX} y={activeFlora.pinY + 4} fontSize="11" textAnchor="middle">
                              🌿
                            </text>

                            {/* Pin Callout Tooltip */}
                            <rect 
                              x={activeFlora.pinX - 70} 
                              y={activeFlora.pinY - 36} 
                              width="140" 
                              height="24" 
                              rx="8" 
                              fill="#14532d" 
                              stroke="#86efac" 
                              strokeWidth="1.5" 
                              className="filter drop-shadow-xl"
                            />
                            <text 
                              x={activeFlora.pinX} 
                              y={activeFlora.pinY - 20} 
                              fontSize="9.5" 
                              fontWeight="900" 
                              fill="#f0fdf4" 
                              textAnchor="middle" 
                              className="pointer-events-none"
                            >
                              📍 {activeFlora.pinLabel}
                            </text>
                          </g>
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Detail Card for Selected Flora Origin */}
                    <div className="relative z-20 p-2.5 sm:p-3 bg-black/60 backdrop-blur-md border-t border-white/10 shrink-0 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-bold text-teal-200/90">
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 border border-emerald-600 inline-block" />
                            <span>Wilayah Asal Flora</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 border border-white inline-block animate-pulse" />
                            <span>Titik Habitat</span>
                          </span>
                        </div>

                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          {activeFlora.badge}
                        </span>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-950/80 to-stone-900/90 border border-emerald-400/40 rounded-xl p-2 sm:p-2.5 flex items-start gap-2 shadow-lg text-left">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-sm mt-0.5">
                          📍
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs sm:text-sm font-black text-emerald-300 truncate">
                            {activeFlora.originTitle} • {activeFlora.pinLabel}
                          </span>
                          <p className="text-[10px] sm:text-xs text-emerald-100/90 font-medium leading-snug line-clamp-2 mt-0.5">
                            {activeFlora.originFact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column Info Card */}
              <div 
                className="md:col-span-7 tablet:col-span-7 relative overflow-hidden rounded-[1.8rem] tablet:rounded-[2rem] p-3 tablet:p-3.5 lg:p-5 flex flex-col justify-between shadow-2xl border-2 tablet:border-3 border-white/5 h-full min-h-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.94)',
                  border: '2px solid rgba(255, 183, 133, 0.45)',
                  boxShadow: '0 12px 35px rgba(184, 92, 42, 0.1)',
                  color: 'rgb(44, 26, 29)'
                }}
              >
                <div className="relative z-10 flex flex-col gap-1.5 tablet:gap-2">
                  {/* Header Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }}>
                      <span>🌹</span> Bunga Harum di Taman
                    </span>
                    <span className="font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                      <span>🎨</span> Warna-Warni Ceria
                    </span>
                    <span className="font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1" style={{ background: '#fef3c7', color: '#b45309' }}>
                      ⭐ Favorit Cilik
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col gap-0.5 text-left">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl tablet:text-3xl lg:text-4xl font-black tracking-tight font-['Quicksand']" style={{ color: '#991b1b' }}>
                        {activeFlora.name}
                      </h1>
                      <button
                        onClick={() => speakText(`${activeFlora.name}! Sahabat bunga indah di kebun kita.`)}
                        className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black shadow-xs transition-transform cursor-pointer active:scale-95 group/audio"
                        style={{ background: '#ffedd5', color: '#c2410c', border: '2px solid #fdba74' }}
                        title="Dengarkan Pengucapan Nama"
                      >
                        {isSpeechPlaying && (
                          <span className="absolute -inset-1 rounded-full border-2 border-[#fdba74] animate-ping opacity-75 pointer-events-none" />
                        )}
                        <Volume2 className={`w-4 h-4 text-[#c2410c] ${isSpeechPlaying ? 'animate-bounce' : 'group-hover/audio:scale-110 transition-transform'}`} />
                        <span>{isSpeechPlaying ? 'Mendengarkan...' : '🔊 Dengar Nama'}</span>
                      </button>
                    </div>
                    <p className="text-sm sm:text-base font-bold flex items-center gap-1.5" style={{ color: '#065f46' }}>
                      Sahabat Bunga Berkelopak Indah <span className="text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-md" style={{ background: '#e0e7ff', color: '#3730a3' }}>({activeFlora.latin})</span>
                    </p>
                  </div>

                  {/* Quick Facts Section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-[#d97706]" />
                      <span className="text-[11px] tablet:text-xs font-black uppercase tracking-wider text-[#d97706]">Fakta Botani Ramah Anak</span>
                    </div>

                    {/* 3 Specialized Botanical Requirement Cards */}
                    <div className="grid grid-cols-3 gap-2 tablet:gap-3 w-full">
                      {/* Sun Card */}
                      <div className="rounded-xl tablet:rounded-2xl p-2.5 tablet:p-3 flex flex-col items-center text-center gap-1 shadow-xs transition-all hover:bg-[#fff9e6]" style={{ background: '#fffbeb', border: '2px solid #fde68a' }}>
                        <div className="w-9 h-9 tablet:w-10 tablet:h-10 rounded-full flex items-center justify-center text-xl tablet:text-2xl shadow-inner" style={{ background: '#fef08a' }}>☀️</div>
                        <span className="text-[10px] tablet:text-[11px] font-black uppercase tracking-wider" style={{ color: '#b45309' }}>Sinar Hangat</span>
                        <p className="text-xs tablet:text-sm text-[#92400e] font-bold leading-tight line-clamp-2">
                          {activeFlora.sun}
                        </p>
                      </div>

                      {/* Water Card */}
                      <div className="rounded-xl tablet:rounded-2xl p-2.5 tablet:p-3 flex flex-col items-center text-center gap-1 shadow-xs transition-all hover:bg-[#f0faff]" style={{ background: '#f0f9ff', border: '2px solid #bae6fd' }}>
                        <div className="w-9 h-9 tablet:w-10 tablet:h-10 rounded-full flex items-center justify-center text-xl tablet:text-2xl shadow-inner" style={{ background: '#e0f2fe' }}>💧</div>
                        <span className="text-[10px] tablet:text-[11px] font-black uppercase tracking-wider" style={{ color: '#0369a1' }}>Cukup Air</span>
                        <p className="text-xs tablet:text-sm text-[#0c4a6e] font-bold leading-tight line-clamp-2">
                          {activeFlora.water}
                        </p>
                      </div>

                      {/* Bee Companion Card */}
                      <div className="rounded-xl tablet:rounded-2xl p-2.5 tablet:p-3 flex flex-col items-center text-center gap-1 shadow-xs transition-all hover:bg-[#f3fdf6]" style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
                        <div className="w-9 h-9 tablet:w-10 tablet:h-10 rounded-full flex items-center justify-center text-xl tablet:text-2xl shadow-inner" style={{ background: '#dcfce7' }}>🐝</div>
                        <span className="text-[10px] tablet:text-[11px] font-black uppercase tracking-wider" style={{ color: '#15803d' }}>Sahabat Alam</span>
                        <p className="text-xs tablet:text-sm text-[#14532d] font-bold leading-tight line-clamp-2">
                          {activeFlora.benefit}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Plant Tale Summary Banner */}
                  <div 
                    onClick={() => {
                      setHeroMode('audio');
                      startStoryNarration();
                    }}
                    className="rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-xs text-left hover:brightness-95 transition-all cursor-pointer" 
                    style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '2px solid #fed7aa' }}
                  >
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner" style={{ background: '#ffedd5', border: '2px solid #fdba74' }}>
                      🛡️
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-extrabold text-sm sm:text-base flex items-center gap-2" style={{ color: '#9a3412' }}>
                        <span className="truncate">{activeFlora.taleTitle}</span>
                        <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black shadow-xs uppercase tracking-wide shrink-0" style={{ background: '#ea580c', color: '#ffffff' }}>Kisah Ajaib</span>
                      </span>
                      <p className="text-xs sm:text-sm text-[#7c2d12] font-bold leading-relaxed mt-0.5 line-clamp-2">
                        {activeFlora.taleSummary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Callouts - Inline Toggles */}
                <div className="relative z-10 pt-1.5 tablet:pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      const nextMode = heroMode === 'audio' ? 'habitat' : 'audio';
                      setHeroMode(nextMode);
                      if (nextMode === 'audio') {
                        startStoryNarration();
                      } else {
                        stopStoryNarration();
                      }
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 tablet:py-2.5 rounded-full font-black border-2 transition-all cursor-pointer text-xs tablet:text-sm active:scale-95 ${
                      heroMode === 'audio'
                        ? 'bg-[#ffb955] text-[#4d2403] border-white shadow-[0_0_15px_rgba(245,166,35,0.7)] ring-2 ring-amber-300'
                        : 'bg-[#f5a623] text-[#644000] border-[#ffddb4] shadow-[0_3px_0_#644000] hover:bg-[#ffb955]'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#644000]" />
                    <span className="tracking-tight truncate">
                      {heroMode === 'audio' ? 'Tutup Dongeng' : 'Putar Dongeng Suara'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      const nextMode = heroMode === 'map' ? 'habitat' : 'map';
                      setHeroMode(nextMode);
                      if (isSpeechPlaying) stopStoryNarration();
                    }}
                    className={`flex items-center justify-center gap-1.5 px-3.5 py-2 tablet:py-2.5 rounded-full font-black border-2 transition-all cursor-pointer text-xs shrink-0 active:scale-95 ${
                      heroMode === 'map'
                        ? 'bg-[#0f766e] text-white border-white shadow-[0_0_15px_rgba(15,118,110,0.7)] ring-2 ring-teal-300'
                        : 'bg-[#0f766e] text-white border-[#5eead4] shadow-[0_3px_0_#064e3b] hover:bg-[#0d5c56]'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-white" />
                    <span>{heroMode === 'map' ? 'Tutup Peta' : 'Peta Asal'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Carousel Section matching Fauna Modal */}
            <div className="shrink-0 flex flex-col gap-1 tablet:gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 tablet:w-7 tablet:h-7 rounded-full bg-[#f5a623] flex items-center justify-center text-[#644000] text-xs font-bold shadow-xs">
                    🌿
                  </div>
                  <h2 className="text-sm tablet:text-base lg:text-lg font-black text-[#3b2010] font-['Quicksand'] tracking-tight">Koleksi Flora Rumahan & Kebun</h2>
                  <span className="text-[10px] text-[#b45309] font-bold hidden sm:inline">• Ketuk untuk Mengganti</span>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => scrollCarousel('left')}
                    className="w-7 h-7 tablet:w-8 tablet:h-8 rounded-full bg-white text-[#b45309] border border-amber-300 flex items-center justify-center shadow-xs hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Geser Kiri"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 tablet:w-4 tablet:h-4" />
                  </button>
                  <button 
                    onClick={() => scrollCarousel('right')}
                    className="w-7 h-7 tablet:w-8 tablet:h-8 rounded-full bg-white text-[#b45309] border border-amber-300 flex items-center justify-center shadow-xs hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Geser Kanan"
                  >
                    <ChevronRight className="w-3.5 h-3.5 tablet:w-4 tablet:h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Collectible Cards Track */}
              <div 
                ref={carouselTrackRef} 
                className="flex gap-2.5 tablet:gap-3.5 overflow-x-auto no-scrollbar pt-2 pb-3 px-2 -my-1 snap-x scroll-smooth items-center select-none"
              >
                {Object.values(FLORA_REGISTRY).map((item) => {
                  const isSelected = item.key === selectedFloraKey;

                  let badgeBg = '#e11d48';
                  let badgeBorder = 'border-rose-300';
                  let emoji = '🌹';
                  let tagText = 'Taman Rumah';
                  let subText = 'Harum & Berduri';

                  if (item.key === 'matahari') {
                    badgeBg = '#f59e0b';
                    badgeBorder = 'border-amber-300';
                    emoji = '🌻';
                    tagText = 'Taman Kebun';
                    subText = 'Heliotropik Ceria';
                  } else if (item.key === 'aloe') {
                    badgeBg = '#059669';
                    badgeBorder = 'border-emerald-300';
                    emoji = '🪴';
                    tagText = 'Pot Rumah';
                    subText = 'Sukulen Obat Sejuk';
                  } else if (item.key === 'lavender') {
                    badgeBg = '#7c3aed';
                    badgeBorder = 'border-purple-300';
                    emoji = '🪻';
                    tagText = 'Anti-Nyamuk';
                    subText = 'Aromatik Menenangkan';
                  } else if (item.key === 'rafflesia') {
                    badgeBg = '#dc2626';
                    badgeBorder = 'border-red-400';
                    emoji = '🌺';
                    tagText = 'Hutan Hujan';
                    subText = 'Patma Raksasa Langka';
                  } else if (item.key === 'nepenthes') {
                    badgeBg = '#ea580c';
                    badgeBorder = 'border-orange-400';
                    emoji = '🫙';
                    tagText = 'Karnivora Tropis';
                    subText = 'Piala Nektar Alami';
                  } else if (item.key === 'teratai') {
                    badgeBg = '#0d9488';
                    badgeBorder = 'border-teal-300';
                    emoji = '🪷';
                    tagText = 'Air Tenang';
                    subText = 'Piring Air Mengapung';
                  } else if (item.key === 'baobab') {
                    badgeBg = '#b45309';
                    badgeBorder = 'border-amber-500';
                    emoji = '🌳';
                    tagText = 'Savana Eksotis';
                    subText = 'Pohon Botol Kehidupan';
                  } else if (item.key === 'titan') {
                    badgeBg = '#a21caf';
                    badgeBorder = 'border-fuchsia-400';
                    emoji = '🕯️';
                    tagText = 'Flora Langka';
                    subText = 'Bunga Bangkai Tertinggi';
                  } else if (item.key === 'venus') {
                    badgeBg = '#15803d';
                    badgeBorder = 'border-emerald-400';
                    emoji = '🪴';
                    tagText = 'Karnivora Unik';
                    subText = 'Perangkap Rahang Kilat';
                  }

                  return (
                    <motion.div
                      key={item.key}
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedFloraKey(item.key)}
                      className={`snap-start shrink-0 w-22 h-22 sm:w-24 sm:h-24 tablet:w-26 tablet:h-26 lg:w-34 lg:h-34 rounded-xl tablet:rounded-2xl overflow-hidden relative cursor-pointer border-2 tablet:border-3 transition-all duration-300 origin-center flex flex-col justify-between p-1.5 ${
                        isSelected 
                          ? 'border-[#f5a623] shadow-lg shadow-[#f5a623]/30 scale-105 z-20 ring-2 ring-[#ffddb4]' 
                          : 'border-white/20 opacity-80 hover:opacity-100 hover:border-white/50'
                      }`}
                    >
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-[8px] font-bold text-white/90 bg-black/50 px-1.5 py-0.5 rounded-full backdrop-blur-xs border border-white/20 truncate max-w-[65px]">{tagText}</span>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm border ${badgeBorder}`} style={{ backgroundColor: badgeBg, color: '#ffffff' }}>
                          {emoji}
                        </span>
                      </div>
                      <div className="relative z-10">
                        <span className="text-white font-black text-[11px] tablet:text-xs block leading-tight truncate">{item.name}</span>
                        <span className="text-[#ffc880] text-[8px] tablet:text-[9px] font-bold italic line-clamp-1">({subText})</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 left-1 bg-[#f5a623] text-[#644000] px-1.5 py-0.5 rounded-full text-[8px] font-black flex items-center gap-0.5 shadow-md">
                          <Sparkles className="w-2 h-2" /> AKTIF
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </AnimatePresence>
  );
};
