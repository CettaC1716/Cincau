# Rencana Implementasi: Adaptasi Alur Registrasi & Onboarding Interaktif Bertahap Berbasis Referensi Pawchi untuk Maskot Cincau

Dokumen ini merinci rencana adaptasi alur registrasi bertahap, elemen interaktif (*widgets*), serta estetika visual hangat (*warm tactile paper*) yang terinspirasi dari video referensi **Pawchi**, disesuaikan khusus untuk karakter dan dunia edukasi **Cincau**.

---

## 1. Analisis Alur & Interaksi dari Referensi Video Pawchi

Berdasarkan analisis video Pawchi (aplikasi pendamping peliharaan dengan anjing Corgi Tobu):
1. **Estetika Visual (*Warm Tactile Cream & Paper Craft*)**:
   - Palet warna lembut berbasis *warm cream* (`#FFFDF7`, `#FFF7ED`, `#FFEDD5`) dengan aksen oranye hangat, garis tepi bulat tebal (*soft borders*), dan ornamen stiker kertas tempel.
   - Maskot Cincau hadir secara dinamis di setiap langkah: mengintip dari balik kartu nama, memakai aksesoris lucu, dan memberikan reaksi emosional sesuai pilihan pengguna.
2. **Mekanisme Interaksi Bertahap yang Memikat (*Step-by-Step Delight*)**:
   - **Kartu Nama Bertinta**: Input nama pada kartu paspor bertali/bergaris jahitan dengan *quick-suggestion chips* nama lucu.
   - **Papan Stiker Minat (*Sticker Board*)**: Papan tempel di mana anak/orang tua memilih minat belajar dengan menempelkan stiker warna-warni yang memiliki sudut kemiringan alami (*tilted stickers*) dan efek suara pop.
   - **Slider Durasi & Porsi (*Interactive Ruler/Bowls*)**: Pengaturan durasi layar harian dengan slider mistar sentuh dan respon langsung maskot.
   - **Transisi Animasi Menuju Fajar (*The Sunrise Run Interstitial*)**: Maskot berlari melintasi bukit malam berbintang menuju matahari terbit diiringi kalimat status progres yang hidup sebelum masuk ke aplikasi utama.
   - **Kartu Petualang Cincau (*Flippable Member Card*)**: Kartu identitas petualang dengan barcode lucu, efek kilau holografik, avatar anak, dan kemampuan diputar/dibalik (*3D flip*).

---

## 2. Rencana Arsitektur & Perubahan Komponen

### A. Komponen Registrasi Interaktif (`KidsRegistrationModal.tsx`)
Penyempurnaan alur modal registrasi menjadi 6 tahapan interaktif bertema petualang cilik:

1. **Langkah 1: Kartu Nama & Panggilan Sayang (*Passport Nametag Step*)**:
   - Input nama dalam bingkai kartu kertas bertekstur dengan maskot Cincau mengintip dari sudut kanan bawah.
   - Tombol pilihan instan nama petualang cilik (*suggestion chips*): "Bintang", "Langit", "Pelangi", "Cahaya", "Jagoan".
   - Pilihan avatar Cincau favorit (Si Biru, Si Pink, Si Kuning, Si Hijau).

2. **Langkah 2: Pilihan Fase Usia & Karakter Belajar**:
   - Kartu taktil besar untuk Fase Belajar (PAUD/TK, SD Kelas 1–2, SD Kelas 3–4) dengan tanda centang hijau animasi saat disentuh.

3. **Langkah 3: Papan Stiker Minat & Eksplorasi (*Sticker Board*)**:
   - Grid 12 stiker warna-warni (Membaca Dongeng 📚, Berhitung Cepat 🔢, Menggambar & Warna 🎨, Eksplorasi Sains 🧪, Musik Ceria 🎵, Teka-Teki Logika 🧩, Petualangan Alam 🌿, dll).
   - Saat diketuk, stiker menempel ke papan dengan animasi pegas kenyal (*spring pop*), suara klik ceria, dan badge jumlah stiker yang dipilih.

4. **Langkah 4: Target Waktu Layar Seimbang (*Ruler Slider Step*)**:
   - Slider mistar horizontal interaktif (15 menit s/d 60 menit) dengan penanda target sehat.
   - Reaksi Cincau berubah dinamis: dari jempol bangga di 20–30 menit ("Waktu ideal, mata sehat & bermain ceria! ✨") hingga kacamata santai.

5. **Langkah 5: Akun Pengaman Orang Tua (*Parent Shield Step*)**:
   - Input email dan PIN orang tua yang bersih, aman, dan ramah dengan ikon kunci gembok pastel.

6. **Langkah 6: Animasi Transisi Maskot Menuju Fajar (*Sunrise Run*)**:
   - Animasi Cincau melompat dan berlari di atas bukit berumput melintasi langit malam berbintang yang perlahan berganti menjadi fajar keemasan.
   - Teks progres dinamis:
     - *"Cincau sedang mengemas perlengkapan belajarmu..."*
     - *"Menempelkan stiker minat favorit..."*
     - *"Mencetak kartu petualang resmi..."*
     - *"Hore! Kartu petualangmu sudah jadi!"*

7. **Langkah 7: Kartu Anggota Petualang Cincau (*3D Flippable Member Card*)**:
   - Tampilan kartu anggota VIP Petualang Cincau dengan nomor seri unik (`CINCAU-2026-XXXX`).
   - Fitur geser/tarik untuk memutar kartu 3D (*drag to spin*).
   - Tombol utama: *"Mulai Petualangan Bersama Cincau! 🚀"*.

---

## 3. Desain Visual, Warna & Aset Suara

1. **Palet Warna & Gaya Visual Pawchi**:
   - Latar belakang: `#FFFDF7` (krem kertas), aksen `#FF9800` (oranye hangat), `#0284C7` (biru langit), `#10B981` (hijau daun).
   - Tipografi: Kombinasi font sans-serif bulat tebal (*Nunito / Inter*) dengan aksen tulisan tangan (*Caveat*) untuk nama dan catatan.
2. **Efek Suara & Haptik**:
   - Bunyi *pop* renyah saat stiker ditempel.
   - Bunyi *chime* ceria saat kartu berhasil dicetak.

---

## 4. Rencana Verifikasi & Uji Kualitas

1. **Uji Responsivitas**:
   - Memastikan alur formulir bertahap pas di layar ponsel vertikal, landscape, maupun tablet tanpa *letterboxing* atau elemen terpotong.
2. **Uji Aksesibilitas & Sentuhan**:
   - Memastikan seluruh tombol dan kartu memiliki tinggi sentuh minimal 44px–48px sesuai standar WCAG.
3. **Penyimpanan Profil**:
   - Memastikan data nama, fase, stiker minat, dan avatar tersimpan dengan aman di `localStorage` (`cincau_child_profile`) dan dapat diperbarui sewaktu-waktu.
4. **Verifikasi Build**:
   - `npm run lint` dan `npm run build` sukses 100% tanpa error.
