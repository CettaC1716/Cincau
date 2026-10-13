# Welcome Screen — Koreografi Sinematik Keluarga Cincau

Rencana implementasi revisi untuk **Welcome Screen** berdasarkan analisis video dan arahan pengguna: Menghadirkan pementasan animasi sinematik bertahap (*staggered cinematic sequence*) di mana Ayah Cincau muncul dari bawah memenuhi setengah layar, mengecil lembut ke ukuran proporsional, disusul anak-anak jeli meluncur masuk dari sisi kiri dan kanan mengelilingi Ayah sambil bermain bersama, hingga akhirnya tombol aksi muncul secara elegan.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Revisi Utama & Koreografi Terkonfirmasi**:
> - **1. Sekuens Munculnya Ayah Cincau (0.0s – 1.0s)**:
>   - Ayah Cincau meluncur naik dari luar tepi bawah layar (`y: 120% → 0%`), awalnya berskala besar memenuhi $\approx 50\%$ panggung layar (`scale: 1.25` atau panggung besar).
> - **2. Penyesuaian Ukuran & Anticipation (1.0s – 1.4s)**:
>   - Ayah Cincau mengecil sedikit secara elastis (*squash & stretch bounce*) ke skala normal (`scale: 1.0`), menatap ceria ke kiri dan kanan untuk menyambut anak-anaknya.
> - **3. Masuknya Anak-Anak Jeli dari Kiri & Kanan (1.4s – 2.2s)**:
>   - **Si Biru (kiri)**: Meluncur melayang masuk dari luar layar sisi kiri (`x: -150px → 0px`), berputar riang dan mendarat di sisi kiri Ayah.
>   - **Si Pink (kanan)**: Meluncur melayang masuk dari luar layar sisi kanan (`x: +150px → 0px`), bergoyang ceria dan mendarat di sisi kanan Ayah.
>   - **Si Kuning Ceria (atas kanan)**: Melayang masuk dari atas kanan menuju posisi mengapung di dekat Ayah.
> - **4. Momen Bermain Bersama (2.2s – 2.8s & Berulang Lembut)**:
>   - Ayah Cincau dan anak-anaknya saling bergoyang dan membal (*playful jelly idle*), menunjukkan kehangatan keluarga jeli.
>   - Sentuhan/tap pada panggung maskot tetap mengaktifkan lompatan riang bersama dengan suara *pop*.
> - **5. Tombol Aksi Muncul Setelah Sekuens Selesai (2.6s+)**:
>   - Teks sambutan ("Halo, Petualang Cilik!") dan tombol navigasi ("Mulai Petualangan 🚀" dan "Saya Sudah Punya Akun") muncul dengan transisi *fade-in + slide-up* yang anggun setelah interaksi keluarga jeli terbentuk.

---

### 1. Overview & Core Concept

- **Apa yang Dibangun**: Pengalaman pembuka (*opening entrance animation*) yang memikat perhatian anak seperti menonton cuplikan film animasi pendek atau kartun interaktif, mengenalkan Cincau sebagai sosok pelindung ramah bersama anak-anak jeli kecilnya.
- **Prinsip Animasi**: Memanfaatkan prinsip dasar Disney (*Squash & Stretch*, *Anticipation*, *Staging*, *Follow Through*) yang diwujudkan menggunakan Framer Motion / Motion for React dengan transisi pegas alami (*spring physics*).

---

### 2. User Experience & Visual Design

#### A. Alur Sekuens Waktu Animasi (Timeline Choreography)

```
0.0s ──── Ayah Cincau naik dari bawah layar (skala besar, memenuhi 50% panggung) ────► 1.0s
                                                                                      │
1.0s ──── Ayah Cincau mengecil sedikit secara elastis (scale 1.25 -> 1.0) ────────────► 1.4s
                                                                                      │
1.4s ──── Anak Jeli meluncur masuk dari sisi: ────────────────────────────────────────► 2.2s
          • Si Biru meluncur dari kiri (x: -100%)
          • Si Pink meluncur dari kanan (x: +100%)
          • Si Kuning Ceria melayang dari atas
                                                                                      │
2.2s ──── Ayah & Anak bermain bersama (goyangan riang, mata saling melirik) ──────────► 2.6s
                                                                                      │
2.6s+ ─── Tombol Navigasi & Teks Sapaan Fade-in & Meluncur Halus ke Posisinya ────────► Selesai
```

#### B. Panggung Maskot & Integrasi Visual
- **Fase Panggung Penuh (Entrance)**:
  - Saat Ayah Cincau pertama kali muncul, fokus visual 100% tertuju pada gerak ekspresifnya dari dasar layar.
- **Fase Panggung Bersama (Family Gathering)**:
  - Anak-anak jeli mengelilingi Ayah:
    - **Si Biru (💧)**: Di sebelah kiri bawah dengan sedikit kemiringan menyapa ke arah Ayah.
    - **Si Pink (🌸)**: Di sebelah kanan bawah dengan pantulan gembira.
    - **Si Kuning Ceria (🌟)**: Mengapung di atas kanan dengan rotasi dinamis.
- **Fase Kontrol UI (Controls Reveal)**:
  - Kartu teks sapaan dan tombol aksi muncul tanpa menggeser posisi maskot (*non-layout shifting*), memastikan transisi terasa mulus dan profesional.

---

### 3. Key Product Decisions & Trade-Offs

- **Animasi Sekuensial Berbasis Delay Framer Motion vs State Machine Rumit**:
  - *Pendekatan Terpilih*: Menggunakan `initial`, `animate`, dan `transition={{ delay, duration, type: 'spring' }}` yang terorkestrasi secara deklaratif di Framer Motion.
  - *Alasan*: Performa tinggi (60 FPS langsung di GPU/compositor), ukuran bundle ringan, tidak memerlukan library eksternal berat, dan sangat responsif di perangkat ponsel maupun tablet.
- **Aksesibilitas & Pengalaman Sentuh Segera**:
  - Anak atau orang tua yang ingin langsung masuk dapat mengetuk layar untuk mempercepat / tombol langsung siap ditekan begitu muncul pada detik ke-2.6.

---

### 4. Technical Architecture & Component Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WELCOME SCREEN CINEMATIC ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                            [ WelcomeScreen.tsx ]                            │
│                                      │                                      │
│             ┌────────────────────────┼────────────────────────┐             │
│             ▼                        ▼                        ▼             │
│     [ Stage 1: Ayah Cincau ]  [ Stage 2: Anak Jeli ]   [ Stage 3: UI Deck ] │
│     • y: ['120%', '0%']       • Si Biru (x: -120 -> 0) • initial: opacity 0 │
│     • scale: [1.25, 1.0]      • Si Pink (x: 120 -> 0)  • animate: opacity 1 │
│     • spring damping: 14      • Ceria (y: -80 -> 0)    • delay: 2.6s        │
│     • variant="large-bottom"  • delay: 1.4s            • CTAs: Mulai & Masuk│
│                                                                             │
│                                      │                                      │
│                                      ▼                                      │
│                      [ Interactive Tap Re-trigger ]                         │
│                      Ketukan memicu lompatan bersama keluarga               │
│                      disertai audio pop ceria                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **File yang Dimodifikasi**: `src/components/WelcomeScreen.tsx`.
- **Langkah Verifikasi**:
  1. Memuat ulang aplikasi dan mengamati sekuens: Ayah Cincau naik besar $\rightarrow$ mengecil $\rightarrow$ Si Biru & Si Pink meluncur dari kiri-kanan $\rightarrow$ bermain bersama $\rightarrow$ tombol muncul.
  2. Mengetuk area panggung untuk memastikan seluruh keluarga tetap responsif melompat gembira.
  3. Memastikan responsivitas pada orientasi Portrait dan Landscape.
  4. Kompilasi TypeScript dan linter bersih tanpa error.
