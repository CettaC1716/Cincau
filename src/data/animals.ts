export interface AnimalTag {
  label: string;
  icon: string;
  class: string;
  fact: string;
}

export interface QuickFact {
  icon: string;
  title: string;
  text: string;
  border: string;
  bg: string;
}

export interface AnimalStory {
  title: string;
  caption: string;
  text: string;
}

export interface AnimalData {
  id: string;
  name: string;
  latin: string;
  breadcrumb: string;
  emoji: string;
  img: string;
  soundBtnText: string;
  storyBtnText: string;
  toastMsg: string;
  bannerFact: string;
  isLocked?: boolean;
  habitat?: string;
  tags: AnimalTag[];
  quickFacts: QuickFact[];
  story: AnimalStory;
}

export interface MapPoint {
  x: number;
  y: number;
  label: string;
  desc: string;
}

export interface MapRegion {
  regionName: string;
  ocean: string;
  biome: string;
  pathD: string;
  points: MapPoint[];
}

export const ANIMAL_DATA: Record<string, AnimalData> = {
  singa: {
    id: 'singa',
    name: "Singa Afrika",
    latin: "Panthera leo",
    breadcrumb: "Singa",
    emoji: "🦁",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1VRZG4NVHwAeKz6zze3PxGTkXRE_GhqXiWXOnZ_lcAkJR1nRiOKVpPZ_l-LTNJApViEo0JK0maayCb2xkLUxGRMs_7EP3M8B6i8wVZu_x77e7WRiTVeieiMusjOhkavVsyeLVTU9ukQQgcJyA673hMLLzuH6zt3ZFK5RdPs3ZwlRqhNl4OlrC4g6JNOqymgjLt0RrP7Zf8plF3yGGTsOOD6EJ6cMLnEC95edM2l9OcoVa44aPwfEPcx",
    soundBtnText: "Dengar Auman Asli 🦁",
    storyBtnText: "Putar Dongeng Suara Rimba 📖",
    toastMsg: "🦁 Singa Afrika terpilih! Sang Raja Savana yang gagah perkasa.",
    bannerFact: "🦁 Auman singa jantan bisa terdengar menggelegar hingga sejauh 8 kilometer!",
    tags: [
      { label: "Raja Savana Afrika", icon: "sparkles", class: "bg-amber-100/20 text-amber-500 border-amber-300/30", fact: "Raja Savana = Pemimpin gagah dan pelindung kawanan di sabana rumput Afrika! 👑" },
      { label: "Mamalia Savana", icon: "book", class: "bg-stone-800/40 text-stone-200 border-white/10", fact: "Mamalia = Hewan berdarah panas yang menyusui anak-anaknya yang lucu! 🐾" },
      { label: "Karnivora", icon: "sound", class: "bg-orange-900/30 text-orange-200 border-orange-500/30", fact: "Karnivora = Hewan hebat pemakan daging segar bernutrisi tinggi! 🥩" },
      { label: "Edisi Penjelajah Satwa", icon: "stars", class: "bg-sky-900/30 text-sky-200 border-sky-500/30", fact: "Edisi Penjelajah = Seri panduan edukasi interaktif khusus adik-adik pintar! 🧭" }
    ],
    quickFacts: [
      { icon: "🥩", title: "Makanan", text: 'Daging segar bersama kawanan (<strong class="text-[#ffc880] font-bold">Pride</strong>).', border: "border-amber-500/25", bg: "bg-amber-500/20" },
      { icon: "💤", title: "Kebiasaan", text: 'Tidur santai hingga <strong class="text-[#ffc880] font-bold">20 jam</strong> setiap hari!', border: "border-orange-500/25", bg: "bg-orange-500/20" },
      { icon: "🌍", title: "Habitat Asli", text: 'Padang savana & padang rumput terbuka <strong class="text-[#69bdff] font-bold">Afrika</strong>.', border: "border-sky-500/25", bg: "bg-sky-500/20" }
    ],
    story: {
      title: "Kisah Leo Si Singa Pemberani",
      caption: "Leo & Matahari Savana 🌅",
      text: "Di sebuah padang savana yang sangat luas di benua Afrika, hiduplah seekor anak singa pemberani bernama Leo. Setiap pagi, Leo belajar mengaum dengan gagah bersama ayahnya sang Raja Rimba untuk menjaga kedamaian padang rumput."
    }
  },
  gajah: {
    id: 'gajah',
    name: "Gajah Afrika",
    latin: "Loxodonta",
    breadcrumb: "Gajah",
    emoji: "🐘",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1Ux5gPmnVbW1_YPVAHMuUCxo2yegSND65yb-GmmLiiLCY2-JeC2Kzi2XqEaI6jqg_uOhCTKphog9uWtRl6W5bU0TizuGTCtwnhKujlfIRxNEIOcXOjoRSrF2750jwZTfsRtBzCw3q6riZxcJMOYU4aTVBUo6WmHxIJXLrRU63E91TSJxVemtkJuAWlHh8nsMGDF3U6LuasIHLNXKmJU7sUQh0QAkMGH2D70WhHixqnZzKkpRtncr0t0",
    soundBtnText: "Dengar Lengking Belalai 🐘",
    storyBtnText: "Putar Kisah Si Belalai Panjang 📖",
    toastMsg: "🐘 Gajah Afrika terpilih! Raksasa ramah berhati lembut dengan daya ingat luar biasa.",
    bannerFact: "🐘 Gajah menyapa kawanannya dengan lengkingan terompet belalai dan getaran tanah!",
    tags: [
      { label: "Raksasa Ramah", icon: "stars", class: "bg-sky-100/20 text-sky-500 border-sky-300/30", fact: "Raksasa Ramah = Hewan darat terbesar di bumi yang memiliki hati penuh kasih! 🐘" },
      { label: "Mamalia Savana", icon: "book", class: "bg-stone-800/40 text-stone-200 border-white/10", fact: "Gajah menyayangi bayinya dan hidup berkeluarga rukun dipimpin gajah tertua! 🐾" },
      { label: "Herbivora", icon: "leaf", class: "bg-emerald-900/30 text-emerald-200 border-emerald-500/30", fact: "Herbivora = Pemakan tumbuhan, daun rindang, dan buah lezat dari pohon! 🌿" },
      { label: "Pintar & Penyayang", icon: "check", class: "bg-amber-900/30 text-amber-200 border-amber-500/30", fact: "Gajah memiliki ingatan super tajam dan tak pernah melupakan jalur sumber air! 🧠" }
    ],
    quickFacts: [
      { icon: "🌿", title: "Makanan", text: 'Rumput, dahan pohon manis & <strong class="text-[#ffc880] font-bold">buah segar</strong>.', border: "border-emerald-500/25", bg: "bg-emerald-500/20" },
      { icon: "💧", title: "Kebiasaan", text: 'Suka <strong class="text-[#69bdff] font-bold">mandi semprot air</strong> bersama kawanan sejuk!', border: "border-sky-500/25", bg: "bg-sky-500/20" },
      { icon: "🌍", title: "Habitat Asli", text: 'Savana terbuka & hutan rimba hijau <strong class="text-[#ffc880] font-bold">Afrika</strong>.', border: "border-amber-500/25", bg: "bg-amber-500/20" }
    ],
    story: {
      title: "Kisah Tembo & Air Terjun Pelangi",
      caption: "Tembo & Percikan Air Segar 💦",
      text: "Tembo adalah anak gajah Afrika yang ceria dengan belalai yang sangat lincah. Suatu hari, Tembo memimpin seluruh kawanannya menemukan mata air jernih dan menyemprotkan air sejuk membuat pelangi indah di langit savana."
    }
  },
  panda: {
    id: 'panda',
    name: "Panda Raksasa",
    latin: "Ailuropoda melanoleuca",
    breadcrumb: "Panda",
    emoji: "🐼",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1VmoM5N-5j3JYWS2UAKJBjn23_6Yr1uhdkmFnvhLvQJOmEvPzWzC2V8FITq6lO6lAgnTygTirHM3LMH23chYgmZOcLr9khnODuI7Wib6_z7TEAu-byvUEuHBk5itpSrwkwog_iJ7U1P-HOEx0pnw2jmgQQ1KJWGIAYYBXy0nJ1jznRLiZTmUgARpwrvnI86_TR_HA3bhayrwtu0LCElrtFaSuaGQtJgl286CDS1duKKRK7_iR_hgXCt",
    soundBtnText: "Dengar Kunyah Bambu 🐼",
    storyBtnText: "Putar Dongeng Petualangan Panda 📖",
    toastMsg: "🐼 Panda Raksasa terpilih! Si beruang lucu pecinta rebung dan pelukan hangat.",
    bannerFact: "🐼 Panda bisa mengunyah bambu renyah selama 12 jam sehari tanpa rasa bosan!",
    tags: [
      { label: "Beruang Bambu Damai", icon: "check", class: "bg-emerald-100/20 text-emerald-500 border-emerald-300/30", fact: "Beruang Bambu = Sahabat pecinta kedamaian yang berbulu tebal hitam putih! 🎋" },
      { label: "Mamalia Pegunungan", icon: "book", class: "bg-stone-800/40 text-stone-200 border-white/10", fact: "Hidup di pegunungan berkabut yang sejuk dan tenang di Asia timur! 🏔️" },
      { label: "Herbivora", icon: "leaf", class: "bg-emerald-900/30 text-emerald-200 border-emerald-500/30", fact: "Makanan utamanya hampir seluruhnya adalah batang dan daun bambu renyah! 🎍" },
      { label: "Suka Bermain", icon: "stars", class: "bg-sky-900/30 text-sky-200 border-sky-500/30", fact: "Panda suka berguling di rumput lereng bukit seperti bola berbulu lucu! ⚽" }
    ],
    quickFacts: [
      { icon: "🎋", title: "Makanan", text: 'Batang & daun bambu segar <strong class="text-[#ffc880] font-bold">12 kg per hari</strong>.', border: "border-emerald-500/25", bg: "bg-emerald-500/20" },
      { icon: "💤", title: "Kebiasaan", text: 'Suka <strong class="text-[#ffc880] font-bold">memanjat pohon</strong> & tidur di dahan rindang.', border: "border-amber-500/25", bg: "bg-amber-500/20" },
      { icon: "🌍", title: "Habitat Asli", text: 'Hutan bambu pegunungan berkabut <strong class="text-[#69bdff] font-bold">Sichuan</strong>.', border: "border-sky-500/25", bg: "bg-sky-500/20" }
    ],
    story: {
      title: "Bao Bao Si Panda Pemanjat Bambu",
      caption: "Bao Bao & Hutan Bambu Hijau 🎋",
      text: "Di tengah kabut sejuk pegunungan hijau, Bao Bao anak panda mungil senang melompat ke dahan bambu tinggi. Bersama ibunya, ia menikmati rebung renyah terlezat sambil bersenandung riang di bawah pohon cemara."
    }
  },
  jerapah: {
    id: 'jerapah',
    name: "Jerapah Savana",
    latin: "Giraffa camelopardalis",
    breadcrumb: "Jerapah",
    emoji: "🦒",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1V_gNrrHI7lI-kLL6hkfU9pru3aoGwyevAu8IHCAaGp56VZ58a2rUIiTnh2mEzokZxbZxGAvmbU4RT_NcmUfz7Dt4ATb2YDCYTjCWkDzz8ienttgWsihQz3biAN25VeqsIB55WLpZ7chWnNIaDIDAfRKnonMmXQoESq9jxP-kYVe4pAocHEX2ilgjSHacvbvIuOBg1o0DAgcyVa5oEp_FdVeAceibsbZb61UvaYTVyRcBLdf--xZhUk",
    soundBtnText: "Dengar Dengung Lembut 🦒",
    storyBtnText: "Putar Kisah Menatap Bintang 📖",
    toastMsg: "🦒 Jerapah Savana terpilih! Penjaga langit rimba yang tinggi semampai dan anggun.",
    bannerFact: "🦒 Leher jerapah bisa mencapai 2 meter panjangnya untuk menjangkau pucuk daun akasia!",
    tags: [
      { label: "Penjaga Langit Rimba", icon: "stars", class: "bg-amber-100/20 text-amber-500 border-amber-300/30", fact: "Dengan lehernya yang tinggi, jerapah bisa melihat pemandangan savana dari kejauhan! 🦒" },
      { label: "Mamalia Tertinggi", icon: "book", class: "bg-stone-800/40 text-stone-200 border-white/10", fact: "Hewan darat paling menjulang di seluruh dunia dengan corak totol indah! 🌟" },
      { label: "Herbivora", icon: "leaf", class: "bg-emerald-900/30 text-emerald-200 border-emerald-500/30", fact: "Lidah ungunya yang panjang bisa mengambil daun berduri tanpa terluka! 🍃" },
      { label: "Leher Panjang", icon: "check", class: "bg-sky-900/30 text-sky-200 border-sky-500/30", fact: "Meskipun lehernya sangat panjang, jumlah ruas tulangnya sama dengan leher manusia! 🦴" }
    ],
    quickFacts: [
      { icon: "🍃", title: "Makanan", text: 'Pucuk manis <strong class="text-[#ffc880] font-bold">daun akasia</strong> di dahan teratas.', border: "border-emerald-500/25", bg: "bg-emerald-500/20" },
      { icon: "👁️", title: "Kebiasaan", text: 'Tidur sambil <strong class="text-[#ffc880] font-bold">berdiri tegak</strong> hanya sebentar saja!', border: "border-amber-500/25", bg: "bg-amber-500/20" },
      { icon: "🌍", title: "Habitat Asli", text: 'Padang savana terbuka luas di <strong class="text-[#69bdff] font-bold">Afrika</strong>.', border: "border-sky-500/25", bg: "bg-sky-500/20" }
    ],
    story: {
      title: "Gigi Jerapah yang Menatap Bintang",
      caption: "Gigi Menatap Langit Malam 🌟",
      text: "Gigi si jerapah cilik memiliki leher yang anggun. Setiap senja tiba, Gigi suka mengangkat kepalanya tinggi ke atas awan emas untuk menyapa bintang pertama yang bersinar terang di cakrawala Afrika."
    }
  },
  harimau: {
    id: 'harimau',
    name: "Harimau Belang",
    latin: "Panthera tigris",
    breadcrumb: "Harimau",
    emoji: "🐅",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1W3isRkd00OmndeyZp8jLR_4AriZtk1x-0Nzyhageph7vS8c_GFeho-HZp4YWM4XFYsKD3ncuwVvcIrpGZ4Z6ArZnLZqRmnQO2h-M0rhOFWGDLsB2Cd_1jMMJiyx5NZtF6x7kokOMSWnYbOMfKRGcCbJYcN-N_KWFxteVP2IgaDlNy0WffmokY4w8JuUzfpBmkhBgkf8PP2Lki1DGZxYaTQfdUuLSfnzi_1gFePZu7Oug6NOW6CLBBu",
    soundBtnText: "Dengar Geraman Rimba 🐅",
    storyBtnText: "Putar Kisah Jejak Emas di Hutan 📖",
    toastMsg: "🐅 Harimau Belang terpilih! Kucing terbesar rimba dengan loreng emas mempesona.",
    bannerFact: "🐅 Pola garis loreng harimau unik seperti sidik jari manusia, tidak ada yang kembar!",
    tags: [
      { label: "Pemburu Belang Hebat", icon: "stars", class: "bg-orange-100/20 text-orange-500 border-orange-300/30", fact: "Loreng harimau membantunya berkamuflase sempurna di antara bayang dedaunan! 🌿" },
      { label: "Kucing Terbesar", icon: "book", class: "bg-stone-800/40 text-stone-200 border-white/10", fact: "Spesies kucing terkuat dan paling gagah di hutan belantara dunia! 🐾" },
      { label: "Karnivora", icon: "sound", class: "bg-orange-900/30 text-orange-200 border-orange-500/30", fact: "Memiliki cakar yang kokoh dan langkah kaki yang sangat senyap saat melangkah! 🥩" },
      { label: "Pemberani", icon: "shield", class: "bg-sky-900/30 text-sky-200 border-sky-500/30", fact: "Berani dan sangat suka berenang di sungai yang jernih saat siang hari! 🏊" }
    ],
    quickFacts: [
      { icon: "🥩", title: "Makanan", text: 'Berburu di <strong class="text-[#ffc880] font-bold">malam hari</strong> yang sejuk dan sunyi.', border: "border-orange-500/25", bg: "bg-orange-500/20" },
      { icon: "🏊", title: "Kebiasaan", text: 'Senang <strong class="text-[#69bdff] font-bold">berenang & bermain air</strong> di sungai dingin!', border: "border-sky-500/25", bg: "bg-sky-500/20" },
      { icon: "🌍", title: "Habitat Asli", text: 'Hutan hujan tropis & sabana lebat <strong class="text-[#ffc880] font-bold">Asia</strong>.', border: "border-emerald-500/25", bg: "bg-emerald-500/20" }
    ],
    story: {
      title: "Raja Harimau dan Sungai Berkilau",
      caption: "Raja Harimau di Sungai Hutan 🌊",
      text: "Di tengah rimbunnya pohon hutan hujan yang rimbun, Raja si anak harimau berlari gesit. Berbeda dengan kucing biasa, Raja sangat suka melompat ke danau air tawar dan bermain cipratan air bersama sahabat burung enggang."
    }
  },
  kanguru: {
    id: 'kanguru',
    name: "Kanguru Australia",
    latin: "Macropodidae",
    breadcrumb: "Kanguru",
    emoji: "🦘",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1XUXdb4VCtDENqvnIvHDgKu5LpnHZjed7ftfb7TNY_iftLSesTQy9QWGCunwGNc7G2zHl-nyTMZVb3xKltAKeCmdbO18g6E7-nUgwlcwdFbyY9Xf4z8ZW3kepfu_m8tq62zGnzKwbctsfLJlbtz_h8eO7_S40IFvA6qxXu9chANwzsi5q6KxDD19zlxRx1TqntPozmzbbovZLCHIDE_5WtSLv50OkYG64XuLmXXKSYdI39s1BZdnU3F",
    soundBtnText: "Dengar Jejak Melompat 🦘",
    storyBtnText: "Putar Kisah Kantung Ibu Joey 📖",
    toastMsg: "🦘 Kanguru Australia terpilih! Pelompat hebat dengan kantung ajaib yang hangat.",
    bannerFact: "🦘 Sekali melompat, kanguru dewasa bisa menempuh jarak sejauh 8 meter!",
    tags: [
      { label: "Pelompat Sejati Outback", icon: "stars", class: "bg-amber-100/20 text-amber-500 border-amber-300/30", fact: "Melompat lincah melintasi padang semak outback Australia dengan kaki kuatnya! 🦘" },
      { label: "Hewan Berkantung", icon: "book", class: "bg-stone-800/40 text-stone-200 border-white/10", fact: "Marsupialia = Hewan istimewa yang membesarkan bayinya di kantung perut! 👶" },
      { label: "Herbivora", icon: "leaf", class: "bg-emerald-900/30 text-emerald-200 border-emerald-500/30", fact: "Menyukai rumput padang rumput segar dan embun pagi di daun semak! 🌾" },
      { label: "Kantung Hangat", icon: "home", class: "bg-sky-900/30 text-sky-200 border-sky-500/30", fact: "Kantung ibu kanguru sangat nyaman dan hangat seperti tempat tidur selimut! 🛋️" }
    ],
    quickFacts: [
      { icon: "🌾", title: "Makanan", text: 'Rumput segar & <strong class="text-[#ffc880] font-bold">tumbuhan semak</strong> gurun.', border: "border-emerald-500/25", bg: "bg-emerald-500/20" },
      { icon: "🦘", title: "Kebiasaan", text: 'Melompat jauh hingga <strong class="text-[#ffc880] font-bold">8 meter</strong> sekali loncat!', border: "border-orange-500/25", bg: "bg-orange-500/20" },
      { icon: "🌍", title: "Habitat Asli", text: 'Semak belukar & outback luas <strong class="text-[#69bdff] font-bold">Australia</strong>.', border: "border-amber-500/25", bg: "bg-amber-500/20" }
    ],
    story: {
      title: "Petualangan Joey dan Kantung Hangat",
      caption: "Joey & Padang Gurun Outback 🌾",
      text: "Joey adalah anak kanguru kecil yang mengintip ceria dari kantung bundanya. Saat matahari pagi terbit di padang outback Australia, Joey melompat keluar dengan riang untuk belajar loncat tinggi bersama teman-temannya."
    }
  },
  lumbalumba: {
    id: 'lumbalumba',
    name: "Lumba-lumba Samudra",
    latin: "Delphinidae",
    breadcrumb: "Lumba-lumba",
    emoji: "🐬",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1Uko3-hssk0Mpmw7R_36rIf6UQMtygYZlRCqlQrSZRC05CF-RtM0yrIAcSjob7EodYRpSpjqShAkcF8ehzeT0p759TJyKmA8XiQrDMKx9Pd3tqS-1-Z8hMrBBflk0c2OeP1EbL3rStVp3PmdzYLEskJ-L7W9EZJvjIXoFM4dwB7B8qFAFFWVodm_X-WG57q4o-mndvGMIRGAbO9_VJWGMgB7_SXHIY-TpCXxJiD2tkXaVa9AE1i0-o",
    soundBtnText: "Dengar Siulan Ceria 🐬",
    storyBtnText: "Putar Kisah Menari di Ombak 📖",
    toastMsg: "🐬 Lumba-lumba Samudra terpilih! Sahabat cerdas laut yang gemar melompat gembira.",
    bannerFact: "🐬 Lumba-lumba saling memanggil dengan siulan khas seperti nama panggilan unik!",
    tags: [
      { label: "Sahabat Cerdas Laut", icon: "stars", class: "bg-sky-100/20 text-sky-500 border-sky-300/30", fact: "Memiliki kepintaran tinggi dan rasa ingin tahu yang besar terhadap petualangan! 🐬" },
      { label: "Mamalia Laut", icon: "book", class: "bg-stone-800/40 text-stone-200 border-white/10", fact: "Bernapas memakai lubang sembur di atas kepalanya saat naik ke permukaan! 💨" },
      { label: "Karnivora Ikan", icon: "sound", class: "bg-sky-900/30 text-sky-200 border-sky-500/30", fact: "Suka berburu ikan kecil bersama kawanannya dengan formasi kompak! 🐟" },
      { label: "Lincah & Ramah", icon: "stars", class: "bg-amber-900/30 text-amber-200 border-amber-500/30", fact: "Sering melompat salto gembira di sebelah kapal pelaut yang melintas! ⛵" }
    ],
    quickFacts: [
      { icon: "🐟", title: "Makanan", text: 'Ikan-ikan kecil lincah & <strong class="text-[#69bdff] font-bold">cumi-cumi segar</strong>.', border: "border-sky-500/25", bg: "bg-sky-500/20" },
      { icon: "🌊", title: "Kebiasaan", text: 'Suka <strong class="text-[#ffc880] font-bold">melompat salto</strong> di permukaan ombak laut!', border: "border-amber-500/25", bg: "bg-amber-500/20" },
      { icon: "🌍", title: "Habitat Asli", text: 'Samudra biru hangat & <strong class="text-[#ffc880] font-bold">terumbu karang</strong> tropis.', border: "border-sky-700/25", bg: "bg-sky-700/20" }
    ],
    story: {
      title: "Lili Lumba-lumba Menari di Ombak",
      caption: "Lili & Ombak Samudra Biru 🌊",
      text: "Di birunya samudra tropis yang jernih, Lili si lumba-lumba mungil berenang cepat bersama keluarganya. Setiap kali ombak besar bergulung, Lili meluncur tinggi ke udara berputar anggun menyapa burung camar."
    }
  },
  beruangkutub: {
    id: 'beruangkutub',
    name: "Beruang Kutub",
    latin: "Ursus maritimus",
    breadcrumb: "Beruang Kutub",
    emoji: "🐻‍❄️",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1UM4h37dgUZZKJZVTQJoFXuKOX_ey73Z8myLd7Y4b5NyjK3YLcWWwXmmDk6PxTj4esKYE8QcghF3LtJLsSGNItcdwORpHgzb20uXWr3zVlYfvuUTlVRgp4ChQR8LN4TU6JLI6BMRI6XaAlpSRo63gnwFVeWiJvpvj2qg12Dx2Bvt0RrnIIKmwNS10B5z4y6L33dcoUtXuw-nGQZHGYAzN_helMWwi6Jlp83fNj_ilvdM0eK70X65x4R",
    soundBtnText: "Dengar Langkah Es 🐻‍❄️",
    storyBtnText: "Putar Kisah Raja Es Arktik 📖",
    toastMsg: "🐻‍❄️ Beruang Kutub terkunci! Butuh VIP Ranger untuk membuka.",
    bannerFact: "🐻‍❄️ Beruang kutub bisa berenang tanpa henti sejauh ratusan mil di lautan Arktik!",
    isLocked: true,
    habitat: "Kutub Arktik",
    tags: [],
    quickFacts: [],
    story: { title: "", caption: "", text: "" }
  },
  pandamerah: {
    id: 'pandamerah',
    name: "Panda Merah",
    latin: "Ailurus fulgens",
    breadcrumb: "Panda Merah",
    emoji: "🦊",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1U8j3xdMFXiJCn8HSsno0ctHb9Z-NJXQDqi6aLBgpA4grU1oye3FvGQwT-KT1_W4CwHr1saFPgc6XfCSO-QfDpEc5JNhYQjl9BlHYmkCg0ZVaH_a5rXKJ43LvhXHiPdXG_O9wriI4FmhkLhM8n4iYvRHCu1isMzgg_6BmalIo5hExiTRp1bW8_jPDcEc8fGVhaO-H7MCVbJ8xUMqWicMbs6HL-EVOM17cetTwdpXQQ2Lw1CSjYqsI3y",
    soundBtnText: "Dengar Suara Gunung 🦊",
    storyBtnText: "Putar Kisah Si Bulu Jingga 📖",
    toastMsg: "🦊 Panda Merah terkunci! Butuh VIP Ranger untuk membuka.",
    bannerFact: "🦊 Panda merah menggunakan ekor tebalnya sebagai selimut hangat saat tidur di salju!",
    isLocked: true,
    habitat: "Pegunungan Himalaya",
    tags: [],
    quickFacts: [],
    story: { title: "", caption: "", text: "" }
  },
  komodo: {
    id: 'komodo',
    name: "Naga Komodo",
    latin: "Varanus komodoensis",
    breadcrumb: "Komodo",
    emoji: "🦎",
    img: "https://lh3.googleusercontent.com/aida/AEtjO1WJlV3ohoZ-2iXNEf3FVzKlumJ7tdusUsNwJ__cQXdHrunP9jr2LrrezZrB8DREUXjo85FrpmYVVwFBwNCoy03eddzXh9f4nyPwJN-ZNSHTEWNwa-7YjTTmECS3j84hgBw7uckKgI9F-X-H1xWF_BbVECjP7XYFoYgITLHvW4KgzSnIwWK_5i00agMQMjmOBayxlDkgda6BCPdJqu1R4TbWX0hRbd2CFCNG2smKEF3nxcNjyNDaaXLv",
    soundBtnText: "Dengar Desis Naga 🦎",
    storyBtnText: "Putar Kisah Kadal Raksasa Purba 📖",
    toastMsg: "🦎 Naga Komodo terkunci! Butuh VIP Ranger untuk membuka.",
    bannerFact: "🦎 Komodo adalah kadal terbesar di dunia yang hanya ada di Indonesia!",
    isLocked: true,
    habitat: "Pulau Flores NTT",
    tags: [],
    quickFacts: [],
    story: { title: "", caption: "", text: "" }
  }
};

export const MAP_REGISTRY: Record<string, MapRegion> = {
  singa: {
    regionName: 'AFRIKA',
    ocean: 'Samudra Atlantik & Hindia',
    biome: 'Savana Terbuka & Rerumputan Afrika',
    pathD: 'M 180 70 C 220 50, 310 60, 340 90 C 370 120, 390 140, 380 180 C 370 200, 395 210, 420 230 C 400 250, 380 260, 350 260 C 340 280, 350 310, 330 350 C 310 390, 270 430, 250 450 C 240 440, 230 400, 210 370 C 190 340, 180 300, 180 260 C 160 250, 140 230, 120 220 C 110 200, 100 170, 130 140 C 150 120, 170 110, 180 70 Z',
    points: [
      { x: 320, y: 220, label: 'Serengeti (Tanzania)', desc: 'Padang sabana luas tempat kawanan singa berburu zebra dan wildebeest!' },
      { x: 345, y: 195, label: 'Masai Mara (Kenya)', desc: 'Habitat savana legendaris tempat singa merajai padang rumput!' },
      { x: 290, y: 380, label: 'TN Kruger (Afsel)', desc: 'Kawasan konservasi alam megah dengan populasi singa terbesar!' },
      { x: 260, y: 340, label: 'Delta Okavango (Botswana)', desc: 'Oase perairan rawa savana tempat singa berenang dan berburu!' }
    ]
  },
  gajah: {
    regionName: 'AFRIKA TIMUR & SELATAN',
    ocean: 'Pesisir Samudra Hindia Afrika',
    biome: 'Sabana Rindang & Hutan Belantara Akasia',
    pathD: 'M 180 70 C 220 50, 310 60, 340 90 C 370 120, 390 140, 380 180 C 370 200, 395 210, 420 230 C 400 250, 380 260, 350 260 C 340 280, 350 310, 330 350 C 310 390, 270 430, 250 450 C 240 440, 230 400, 210 370 C 190 340, 180 300, 180 260 C 160 250, 140 230, 120 220 C 110 200, 100 170, 130 140 C 150 120, 170 110, 180 70 Z',
    points: [
      { x: 330, y: 240, label: 'TN Amboseli (Kenya)', desc: 'Pemandangan spektakuler kawanan gajah di bawah Gunung Kilimanjaro!' },
      { x: 270, y: 320, label: 'TN Chobe (Botswana)', desc: 'Konsentrasi kawanan gajah Afrika terpadat di dunia!' },
      { x: 300, y: 370, label: 'TN Addo Elephant', desc: 'Cagar alam perlindungan satwa gajah tertua di Afrika Selatan.' }
    ]
  },
  panda: {
    regionName: 'TIONGKOK / ASIA',
    ocean: 'Lautan Pasifik Timur Asia',
    biome: 'Hutan Bambu Lembap Pegunungan Sichuan',
    pathD: 'M 120 180 C 160 120, 260 110, 350 120 C 420 130, 440 180, 430 240 C 410 300, 380 350, 320 380 C 250 400, 190 360, 140 320 C 100 280, 90 220, 120 180 Z',
    points: [
      { x: 270, y: 240, label: 'Pegunungan Qinling (Shaanxi)', desc: 'Habitat alami panda liar di lembah hutan bambu pegunungan dingin!' },
      { x: 230, y: 270, label: 'Cagar Wolong (Sichuan)', desc: 'Pusat suaka bambu terbesar tempat panda makan rebung manis!' },
      { x: 290, y: 290, label: 'Pegunungan Minshan', desc: 'Koridor hijau alami tempat tinggal keluarga panda raksasa.' }
    ]
  },
  jerapah: {
    regionName: 'AFRIKA TIMUR',
    ocean: 'Teluk Aden & Lembah Rift',
    biome: 'Savana Pohon Akasia & Belukar Tinggi Afrika',
    pathD: 'M 180 70 C 220 50, 310 60, 340 90 C 370 120, 390 140, 380 180 C 370 200, 395 210, 420 230 C 400 250, 380 260, 350 260 C 340 280, 350 310, 330 350 C 310 390, 270 430, 250 450 C 240 440, 230 400, 210 370 C 190 340, 180 300, 180 260 C 160 250, 140 230, 120 220 C 110 200, 100 170, 130 140 C 150 120, 170 110, 180 70 Z',
    points: [
      { x: 330, y: 210, label: 'Samburu Reserve (Kenya)', desc: 'Rumah bagi jerapah reticulata berleher tinggi dan bercorak jala unik!' },
      { x: 325, y: 260, label: 'Kawah Ngorongoro', desc: 'Kaldera savana hijau tempat jerapah merumput di pucuk akasia.' },
      { x: 280, y: 350, label: 'Gurun Kalahari', desc: 'Jerapah kuat melintasi oasis padang pasir kering.' }
    ]
  },
  harimau: {
    regionName: 'ASIA TROPIS',
    ocean: 'Selat Malaka & Teluk Benggala',
    biome: 'Hutan Hujan Tropis Rimba Lebat & Rawa Bakau',
    pathD: 'M 110 160 C 170 100, 290 90, 380 140 C 410 170, 420 230, 390 280 C 340 330, 300 390, 240 400 C 180 410, 130 360, 120 300 C 90 250, 80 190, 110 160 Z',
    points: [
      { x: 260, y: 220, label: 'TN Sundarbans (Bengal)', desc: 'Hutan bakau rawa tempat harimau berenang lincah mengintai mangsa!' },
      { x: 210, y: 330, label: 'TN Bukit Barisan (Sumatera)', desc: 'Rimba hujan tropis lebat habitat asli harimau loreng terkuat.' },
      { x: 330, y: 270, label: 'TN Ranthambore (India)', desc: 'Bekas istana kuno rimba tempat harimau berpatroli megah.' }
    ]
  },
  kanguru: {
    regionName: 'BENUA AUSTRALIA',
    ocean: 'Samudra Selatan & Pasifik Barat Daya',
    biome: 'Padang Rumput Outback Kering Semak Belukar',
    pathD: 'M 160 180 C 220 130, 340 140, 390 190 C 420 240, 410 320, 370 360 C 320 400, 220 410, 160 360 C 120 320, 110 240, 160 180 Z',
    points: [
      { x: 270, y: 260, label: 'Gurun Outback Merah (Alice Springs)', desc: 'Padang pasir semak tempat kanguru melompat jauh di bawah terik mentari!' },
      { x: 340, y: 320, label: 'Pulau Kanguru (Adelaide)', desc: 'Suaka pulau alami bebas predator bagi kawanan kanguru abu-abu!' },
      { x: 360, y: 240, label: 'Queensland Savana', desc: 'Padang rumput subur tempat kanguru merah bersantai di pagi hari.' }
    ]
  },
  lumbalumba: {
    regionName: 'SAMUDRA TROPIS DUNIA',
    ocean: 'Samudra Tropis & Perairan Karang Dunia',
    biome: 'Terumbu Karang Laut Hangat & Teluk Tropis',
    pathD: 'M 100 240 C 140 170, 260 160, 360 190 C 420 220, 430 300, 380 350 C 300 390, 180 380, 120 330 C 90 300, 80 270, 100 240 Z',
    points: [
      { x: 240, y: 250, label: 'Teluk Kiluan (Indonesia)', desc: 'Pusat tarian ratusan lumba-lumba hidung botol yang ramah melompat!' },
      { x: 320, y: 290, label: 'Batu Karang Bahama (Karibia)', desc: 'Perairan kristal biru tempat lumba-lumba bersiul dan berkejaran!' },
      { x: 170, y: 270, label: 'Kepulauan Hawaii (Pasifik)', desc: 'Teluk tenang tempat lumba-lumba pemintal berakrobat di udara!' }
    ]
  }
};
