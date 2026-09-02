export interface Article {
  id: string;
  title: string;
  category: string;
  readMinutes: number;
  emoji: string;
  excerpt: string;
  body: string[];
  sources: string[];
}

export const articles: Article[] = [
  {
    id: 'a1',
    title: 'ASI Eksklusif 6 Bulan: Fondasi Tumbuh Kembang Optimal',
    category: 'ASI & Nutrisi',
    readMinutes: 4,
    emoji: '🤱',
    excerpt: 'WHO, Kemenkes & IDAI sepakat: ASI saja cukup untuk 6 bulan pertama tanpa tambahan apapun.',
    body: [
      'WHO Global Strategy for Infant and Young Child Feeding (2003) merekomendasikan ASI eksklusif selama 6 bulan: berikan ASI sesegera mungkin setelah lahir (<1 jam) dan tanpa makanan/minuman lain.',
      'Kemenkes RI menekankan ASI mengandung zat fungsional (imunoglobulin, hormon, oligosakarida, enzim) yang tidak ada pada susu formula. ASI saja sudah mencukupi energi dan nutrisi hingga usia 6 bulan jika pertumbuhan dipantau dengan kurva WHO.',
      'Telaah sistematik WHO 2002 menunjukkan tidak ada defisit berat/panjang badan pada bayi ASI eksklusif 6 bulan vs 4 bulan. Karena itu MPASI dini (<4 bulan) dan terlambat (>6 bulan) sama-sama tidak dianjurkan.',
      'Setelah 6 bulan, lanjutkan ASI hingga 24 bulan sambil mulai MPASI yang adekuat, aman, dan diberikan dengan cara yang benar (responsive feeding).',
    ],
    sources: [
      'IDAI Rekomendasi Pemberian Makanan Pendamping ASI (UKK Nutrisi & Metabolik 2011-2014)',
      'Kemenkes ayosehat.kemkes.go.id - kategori Bayi & Balita',
    ],
  },
  {
    id: 'a2',
    title: 'MPASI Tepat Waktu & 4 Syarat Emas (Kemenkes 2024 & WHO 2023)',
    category: 'MPASI',
    readMinutes: 5,
    emoji: '🥣',
    excerpt: 'MPASI mulai 6 bulan, harus tepat waktu, adekuat, aman, dan diberikan dengan benar.',
    body: [
      'Kemenkes RI (Petunjuk Teknis Pemantauan Praktik MP-ASI 6-23 Bulan, 2024) dan WHO Guideline 2023 menegaskan MPASI dimulai pada usia 6 bulan (168 hari). Pada usia ini ASI saja tidak lagi cukup untuk energi, protein, zat besi, seng, dan vitamin A/D.',
      'Syarat 1 - Tepat waktu: jangan <4 bulan (risiko alergi & infeksi) dan jangan >6 bulan (risiko defisiensi & failure to thrive). IDAI: MPASI dini = <4 bulan, terlambat = >6 bulan.',
      'Syarat 2 - Adekuat: energi & protein sesuai usia, frekuensi 2-3x makan utama +1-2x selingan (6-8 bulan: 3 sendok hingga ½ mangkok 250ml; 9-11 bulan: ½ mangkok; 12-23 bulan: ¾–1 mangkok), tekstur lumat kental → cincang halus/kasar → finger foods.',
      'Syarat 3 & 4 - Aman & benar: siapkan higienis (tangan & alat bersih), beragam minimal 5 dari 8 kelompok pangan, wajib ada telur/ikan/daging untuk cegah stunting, plus lemak/minyak sebagai sumber energi padat, garam & gula dibatasi sesuai Codex STAN 074-1981.',
    ],
    sources: [
      'kemkes.go.id - Pemberian MPASI Harus Penuhi 4 Syarat (9 Des 2024)',
      'idai.or.id - Pemberian Makanan Pendamping ASI (MPASI)',
      'WHO Guideline for Complementary Feeding 6-23 Months (2023)',
    ],
  },
  {
    id: 'a3',
    title: 'Imunisasi Rutin Lengkap Jadwal IDAI 2024 — Lindungi Bayi <24 Bulan',
    category: 'Imunisasi',
    readMinutes: 5,
    emoji: '💉',
    excerpt: 'Hepatitis B 0 jam hingga Campak/MR 9 bulan, plus lanjutan 18 bulan — sesuai Pedoman Imunisasi Edisi 7.',
    body: [
      'Kemenkes mengubah istilah imunisasi dasar lengkap menjadi imunisasi rutin lengkap (dasar + lanjutan) untuk kekebalan optimal.',
      'Jadwal dasar: <24 jam Hepatitis B (HB-0); 1 bulan BCG + Polio tetes 1; 2 bulan DPT-HB-Hib 1 + Polio 2; 3 bulan DPT-HB-Hib 2 + Polio 3; 4 bulan DPT-HB-Hib 3 + Polio 4 + IPV suntik; 9 bulan Campak/MR.',
      'Jadwal lanjutan: 18 bulan (Baduta) DPT-HB-Hib + Campak/MR; kelas 1 SD DT + Campak/MR; kelas 2 & 5 SD Td. Juga ada vaksin baru sesuai ketersediaan: PCV, Rotavirus, Varisela, Dengue, HPV.',
      'Manfaat: HB cegah pengerasan hati/kanker hati; BCG cegah TB berat; Polio cegah lumpuh layu; DPT-HB-Hib cegah Difteri, Pertusis, Tetanus, Hepatitis B, Pneumonia & Meningitis Hib; Campak/MR cegah pneumonia, diare, radang otak & rubella.',
    ],
    sources: [
      'kemkes.go.id - Berikan Anak Imunisasi Rutin Lengkap',
      'IDAI Pedoman Imunisasi di Indonesia Edisi 7 Tahun 2024 & Sari Pediatri 2024',
    ],
  },
  {
    id: 'a4',
    title: 'Stimulasi Dini 0-3 Tahun: Masa Emas Jangan Terlewat (SDIDTK & Buku KIA)',
    category: 'Tumbuh Kembang',
    readMinutes: 5,
    emoji: '🌱',
    excerpt: 'Otak balita seperti kertas putih — stimulasi setiap hari lewat indra, gerak, dan interaksi.',
    body: [
      'Kemenkes: 0-3 tahun adalah usia emas sekaligus fase kritis otak. Bayi menyerap semua yang dilihat/didengar. Kekurangan stimulasi bisa ganggu perkembangan meski gizi & imunisasi sudah baik.',
      'Stimulasi = rangsang harian sejak lahir (bahkan sejak kandungan) untuk pendengaran, penglihatan, peraba, pembau, pengecap, gerak kasar/halus kaki-tangan-jari, komunikasi dua arah, dan perasaan menyenangkan.',
      'Contoh usia: 0-1 bulan dipeluk, benda bergerak di atas bayi, tengkurap, ajak tersenyum; 1-4 bulan tengkurap lebih lama, main cilukba; 4-6 bulan tengkurap & duduk; 2-3 tahun latih berdiri satu kaki, susun balok, kenal bentuk/warna, toilet training, ajak keluar ke taman/kebun binatang.',
      'Gunakan Buku KIA: ceklis perkembangan per usia + panduan stimulasi. Jika ada jawaban “Tidak” pada ceklis, segera lapor kader Posyandu → Puskesmas. Semakin dini terdeteksi, semakin cepat catch-up.',
    ],
    sources: [
      'ayosehat.kemkes.go.id - Rahasia Anak Sehat & Cerdas, Lakukan Stimulasi dengan Buku KIA (1 Agu 2025)',
      'keslan.kemkes.go.id - Tugas Perkembangan Anak & Stimulasinya (31 Jul 2022) & Pedoman SDIDTK 2021',
    ],
  },
  {
    id: 'a5',
    title: 'Tanda Bahaya Bayi Baru Lahir: Kapan Harus ke Faskes Segera',
    category: 'Kesehatan',
    readMinutes: 4,
    emoji: '🚨',
    excerpt: 'Demam >38°C, napas >60x/menit, biru, lemas, menolak menyusu — jangan tunda.',
    body: [
      'Kemenkes & IDAI: bayi 0-28 hari sangat rentan. Segera ke faskes bila: suhu >38°C atau <36°C (hipotermia), napas cepat >60x/menit, dada tertarik, merintih, atau bibir/kuku kebiruan.',
      'Tanda lain: lemas tidak bergerak, tidak mau menyusu sama sekali, muntah menyembur, diare berdarah, kejang, kuning (jaundice) dalam 24 jam pertama, atau tali pusat bernanah/bau.',
      'Pantauan di rumah: ukur suhu dengan termometer, hitung napas 1 menit saat bayi tenang, periksa warna kulit, perhatikan frekuensi pipis/pup (bayi baru lahir pipis 6-8x/hari).',
      'Pencegahan: ASI eksklusif, imunisasi tepat waktu, cuci tangan sebelum pegang bayi, jaga kebersihan tali pusat kering-terbuka, dan kunjungan neonatal sesuai Buku KIA.',
    ],
    sources: [
      'ayosehat.kemkes.go.id - kategori Bayi & Balita & Pelayanan Neonatal Esensial',
      'IDAI - Pedoman Pelayanan Neonatal',
    ],
  },
  {
    id: 'a6',
    title: 'Perawatan Sehari-hari Bayi: Kulit, Tali Pusat & Pencegahan Infeksi',
    category: 'Perawatan',
    readMinutes: 4,
    emoji: '🧷',
    excerpt: 'Kebersihan, ASI, dan lingkungan sehat — tiga pilar pencegahan infeksi pada bayi.',
    body: [
      'Kulit bayi tipis & sensitif: mandi dengan air hangat, sabun bayi lembut, jangan terlalu sering; keringkan dengan menepuk, bukan menggosok; ganti popok segera setelah basah (10x/hari pada BBL).',
      'Tali pusat: jaga kering dan bersih, cuci tangan sebelum merawat, tidak perlu alkohol/betadin rutin, biarkan lepas sendiri 5-15 hari; waspada tanda infeksi (merah meluas, bengkak, bernanah).',
      'Lingkungan sehat: rumah berventilasi, hindari asap rokok (risiko bronkiolitis & pneumonia), cuci tangan pakai sabun sebelum menyusui, pastikan alat makan bayi steril, dan berikan ASI sebagai antibodi alami.',
      'Rujukan: jadwal kunjungan neonatal, skrining hipotiroid & pemeriksaan kuning, serta pemantauan pertumbuhan (berat, panjang, lingkar kepala) tiap bulan di Posyandu dengan Buku KIA.',
    ],
    sources: [
      'ayosehat.kemkes.go.id - Bayi & Balita <5 Tahun & Upaya Kesehatan Bayi',
      'Kemenkes - Buku KIA & Pedoman SDIDTK 2021',
    ],
  },
];
