export interface Symptom {
  id: string;
  name: string;
  emoji: string;
}

export interface SymptomCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  symptoms: Symptom[];
}

export interface ConditionResult {
  name: string;
  emoji: string;
  severity: 'ringan' | 'sedang' | 'perlu perhatian' | 'darurat';
  description: string;
  guidance: string[];
  doctorWhen: string;
}

export interface Rule {
  when: string[];
  then: string;
}

/**
 * Tanda bahaya (mengacu pada pedoman MTBS/IMCI WHO untuk bayi):
 * bila SATU saja muncul, hasil screening dikunci ke status darurat
 * dan voting rule biasa diabaikan.
 */
export const DANGER_SIGNS: Array<{ id: string; label: string }> = [
  { id: 'menolak-susu', label: 'Menolak menyusu / tidak mampu menelan' },
  { id: 'lemas', label: 'Tampak lemas / sulit dibangunkan' },
  { id: 'napas-cepat', label: 'Napas cepat / terengah' },
  { id: 'ditarik-dada', label: 'Dada tertarik saat bernapas' },
  { id: 'wheezing', label: 'Bunyi mengi (wheezing)' },
  { id: 'kuning', label: 'Kulit kekuningan (ikterus)' },
  { id: 'demam', label: 'Suhu tubuh tinggi (risiko kejang/infeksi)' },
];

/** Tanda bahaya tambahan untuk diedukasikan ke orang tua (observasi di rumah). */
export const WATCH_OUT_SIGNS: string[] = [
  'Bibir atau wajah kebiruan',
  'Dada tertarik dalam saat bernapas',
  'Sulit dibangunkan / tidak responsif',
  'Kejang',
  'Muntah hijau, berdarah, atau terus-menerus',
  'BAB berdarah atau berlendir',
  'Popok jauh lebih jarang basah (tanda dehidrasi)',
];

/** Panduan darurat — menggantikan saran rumahan bila ada tanda bahaya. */
export const EMERGENCY_GUIDANCE: string[] = [
  'Jangan menunda — segera bawa bayi ke dokter, puskesmas, atau IGD terdekat',
  'Jangan paksa menyusu bila bayi tidak sadar, tidak mampu menelan, atau muntah terus-menerus',
  'Bila masih sadar dan bisa menelan, beri ASI sedikit tapi sering sambil jalan ke faskes',
  'Jangan pijat perut atau beri obat/ramuan saat ada muntah, lemas, atau sesak',
  'Catat gejala yang terlihat (kapan mulai, frekuensi muntah/napas) untuk diceritakan ke tenaga medis',
];

export const symptomCategories: SymptomCategory[] = [
  {
    id: 'mata',
    name: 'Mata',
    emoji: '👁️',
    color: '#2B9BEC',
    symptoms: [
      { id: 'mata-merah', name: 'Mata memerah', emoji: '🔴' },
      { id: 'keputihan-mata', name: 'Keputihan di mata', emoji: '💧' },
      { id: 'sering-gosok-mata', name: 'Sering menggosok mata', emoji: '🤲' },
      { id: 'mata-berair', name: 'Mata berair', emoji: '😢' },
    ],
  },
  {
    id: 'hidung',
    name: 'Hidung',
    emoji: '👃',
    color: '#7A5CF0',
    symptoms: [
      { id: 'hidung-tersumbat', name: 'Hidung tersumbat', emoji: '🧱' },
      { id: 'ingus-lendir', name: 'Ingus kental/lendir', emoji: '💧' },
      { id: 'bersin', name: 'Sering bersin', emoji: '🤧' },
    ],
  },
  {
    id: 'napas',
    name: 'Pernapasan',
    emoji: '🫁',
    color: '#34C77B',
    symptoms: [
      { id: 'batuk', name: 'Batuk', emoji: '😷' },
      { id: 'napas-cepat', name: 'Napas cepat/terengah', emoji: '💨' },
      { id: 'wheezing', name: 'Bunyi mengi (wheezing)', emoji: '🎵' },
      { id: 'ditarik-dada', name: 'Dada tertarik saat napas', emoji: '⚠️' },
    ],
  },
  {
    id: 'pencernaan',
    name: 'Pencernaan',
    emoji: '🍽️',
    color: '#F5A623',
    symptoms: [
      { id: 'menolak-susu', name: 'Menolak menyusu', emoji: '🍼' },
      { id: 'muntah', name: 'Muntah', emoji: '🤮' },
      { id: 'diare', name: 'Feces cair berlebih', emoji: '💧' },
      { id: 'perut-kembung', name: 'Perut kembung', emoji: '🎈' },
    ],
  },
  {
    id: 'kulit',
    name: 'Kulit',
    emoji: '🧴',
    color: '#E85D5D',
    symptoms: [
      { id: 'ruam', name: 'Ruam/beruntun merah', emoji: '🔴' },
      { id: 'kulit-kering', name: 'Kulit kering mengelupas', emoji: '🍂' },
      { id: 'kuning', name: 'Kulit kekuningan', emoji: '🟡' },
    ],
  },
  {
    id: 'umum',
    name: 'Kondisi Umum',
    emoji: '🌡️',
    color: '#05497B',
    symptoms: [
      { id: 'demam', name: 'Suhu tubuh tinggi', emoji: '🌡️' },
      { id: 'lemas', name: 'Tampak lemas', emoji: '😴' },
      { id: 'rewel-berkepanjangan', name: 'Rewel berkepanjangan', emoji: '😢' },
      { id: 'nafsu-turun', name: 'Nafsu makan turun', emoji: '📉' },
    ],
  },
];

export const conditions: Record<string, ConditionResult> = {
  Konjungtivitis: {
    name: 'Kemungkinan Konjungtivitis (Iradasi Mata)',
    emoji: '👁️',
    severity: 'ringan',
    description:
      'Hasil skrining awal mengarah ke peradangan selaput mata (mata memerah, berair, berkeputihan). Umum pada bayi dan biasanya tidak berbahaya bila ditangani benar. Ini BUKAN diagnosis pasti.',
    guidance: [
      'Bersihkan mata dengan kapas bersih dan air hangat, dari sudut luar ke dalam',
      'Gunakan kapas berbeda untuk setiap mata',
      'Cuci tangan sebelum dan sesudah membersihkan mata',
    ],
    doctorWhen: 'Bila keputihan membandel lebih dari 2 hari atau kelopak membengkak.',
  },
  'Flu & Batuk Pilek': {
    name: 'Kemungkinan Flu & Batuk Pilek',
    emoji: '🤧',
    severity: 'ringan',
    description:
      'Hasil skrining awal mengarah ke infeksi ringan saluran napas atas. Hidung tersumbat membuat bayi rewel dan susah menyusu. Ini BUKAN diagnosis pasti.',
    guidance: [
      'Bersihkan hidung dengan saline drop sebelum menyusu',
      'Gunakan humidifier atau uap air hangat di kamar',
      'Pastikan asupan cairan bayi tetap cukup',
    ],
    doctorWhen: 'Bila bayi menolak menyusu total atau demam di atas 38°C.',
  },
  Bronkiolitis: {
    name: 'Kemungkinan Bronkiolitis',
    emoji: '🫁',
    severity: 'perlu perhatian',
    description:
      'Hasil skrining awal mengarah ke peradangan saluran napas kecil (misalnya virus RSV): batuk, napas cepat, bunyi mengi. Perlu pemantauan ketat pada bayi di bawah 6 bulan. Ini BUKAN diagnosis pasti.',
    guidance: [
      'Berikan posisi tidur dengan kepala sedikit terangkat',
      'Bersihkan hidung sebelum tidur dan menyusu',
      'Pantau laju napas bayi secara berkala',
    ],
    doctorWhen: 'Segera ke dokter bila dada tertarik dalam, napas sangat cepat, atau bibir kebiruan.',
  },
  'Gangguan Pencernaan': {
    name: 'Kemungkinan Gangguan Pencernaan',
    emoji: '🍽️',
    severity: 'sedang',
    description:
      'Hasil skrining awal menunjukkan pola yang mengarah ke ketidaknyamanan saluran cerna (misalnya kembung, alergi susu, atau infeksi). Ini BUKAN diagnosis pasti — perlu dikonfirmasi tenaga medis.',
    guidance: [
      'Bila bayi sadar dan mampu menelan, beri ASI dalam porsi kecil tapi sering — jangan dipaksa bila muntah terus',
      'Pijat perut lembut searah jarum jam hanya bila bayi sadar, tidak lemas, dan tidak sesak',
      'Catat pola muntah/feces untuk diceritakan ke dokter',
    ],
    doctorWhen: 'Bila muntah terus-menerus, feces berdarah, atau tanda dehidrasi muncul.',
  },
  'Perlu Pemeriksaan Segera': {
    name: 'Perlu Pemeriksaan Tenaga Medis Segera',
    emoji: '🚨',
    severity: 'darurat',
    description:
      'Hasil skrining awal menemukan TANDA BAHAYA pada bayi. Kombinasi gejala ini tidak bisa disimpulkan sebagai satu kondisi ringan dan memerlukan pemeriksaan tenaga medis segera. Ini BUKAN diagnosis — ini peringatan untuk segera ke dokter/IGD.',
    guidance: EMERGENCY_GUIDANCE,
    doctorWhen:
      'SEGERA ke dokter, puskesmas, atau IGD — jangan menunggu gejala tambahan seperti diare atau dehidrasi.',
  },
  'Gejala Campuran': {
    name: 'Kemungkinan Gangguan Kesehatan (Gejala Campuran)',
    emoji: '🔍',
    severity: 'sedang',
    description:
      'Hasil skrining awal menunjukkan gejala dari beberapa area tubuh sekaligus sehingga belum mengarah ke satu kondisi tertentu. Ini BUKAN diagnosis pasti — perlu dikonfirmasi tenaga medis.',
    guidance: [
      'Amati gejala yang paling menonjol dan catat kapan masing-masing mulai muncul',
      'Pastikan kebutuhan dasar terpenuhi (cairan, suhu tubuh, popok, gendongan)',
      'Bawa catatan gejala ini saat konsultasi agar dokter mudah menilai',
    ],
    doctorWhen: 'Bila gejala bertambah, menetap lebih dari 1–2 hari, atau muncul tanda bahaya.',
  },
  'Iritasi Kulit': {
    name: 'Kemungkinan Iritasi Kulit',
    emoji: '🧴',
    severity: 'ringan',
    description:
      'Hasil skrining awal mengarah ke reaksi kulit seperti ruam popok, eksim ringan, atau alergi produk. Umumnya membaik dengan perawatan sederhana. Ini BUKAN diagnosis pasti.',
    guidance: [
      'Ganti pop segera setelah kenas dan keringkan area lipatan',
      'Gunakan pelembap bebas pewangi',
      'Hindari produk dengan alkohol atau parfum kuat',
    ],
    doctorWhen: 'Bila ruam melebar, bernanah, atau disertai demam.',
  },
  Demam: {
    name: 'Kemungkinan Demam / Infeksi',
    emoji: '🌡️',
    severity: 'perlu perhatian',
    description:
      'Hasil skrining awal menunjukkan suhu tubuh di atas normal — biasanya tanda tubuh melawan infeksi. Pada bayi di bawah 3 bulan, demam perlu segera dievaluasi dokter. Ini BUKAN diagnosis pasti.',
    guidance: [
      'Ukur suhu dengan termometer yang akurat',
      'Kenakan pakaian tipis dan jaga hidrasi',
      'Jangan memberikan obat tanpa anjuran dokter',
    ],
    doctorWhen: 'Segera ke fasilitas kesehatan bila bayi di bawah 3 bulan dengan suhu di atas 38°C.',
  },
  'Kondisi Umum Ringan': {
    name: 'Belum Ada Pola Khusus (Ringan)',
    emoji: '🤲',
    severity: 'ringan',
    description:
      'Gejala yang terpilih belum menunjukkan pola kondisi tertentu. Bisa jadi bayi hanya tidak nyaman, lelah, atau sedang tumbuh kembang. Tetap pantau 24 jam ke depan.',
    guidance: [
      'Amati pola tidur, menyusu, dan perilaku bayi 24 jam ke depan',
      'Pastikan kebutuhan dasar terpenuhi (pop, susu, suhu, gendongan)',
      'Catat gejala yang muncul agar mudah dilaporkan',
    ],
    doctorWhen: 'Bila gejala memburuk atau berlangsung lebih dari 2-3 hari.',
  },
};

export const rules: Rule[] = [
  { when: ['mata-merah', 'keputihan-mata'], then: 'Konjungtivitis' },
  { when: ['mata-merah', 'mata-berair', 'sering-gosok-mata'], then: 'Konjungtivitis' },
  { when: ['hidung-tersumbat', 'ingus-lendir'], then: 'Flu & Batuk Pilek' },
  { when: ['hidung-tersumbat', 'bersin'], then: 'Flu & Batuk Pilek' },
  { when: ['batuk', 'napas-cepat'], then: 'Bronkiolitis' },
  { when: ['batuk', 'wheezing'], then: 'Bronkiolitis' },
  { when: ['batuk', 'napas-cepat', 'ditarik-dada'], then: 'Bronkiolitis' },
  { when: ['muntah', 'diare'], then: 'Gangguan Pencernaan' },
  { when: ['menolak-susu', 'perut-kembung'], then: 'Gangguan Pencernaan' },
  { when: ['menolak-susu', 'muntah'], then: 'Gangguan Pencernaan' },
  { when: ['ruam'], then: 'Iritasi Kulit' },
  { when: ['kulit-kering', 'ruam'], then: 'Iritasi Kulit' },
  { when: ['demam'], then: 'Demam' },
  { when: ['demam', 'batuk'], then: 'Demam' },
  { when: ['demam', 'diare'], then: 'Demam' },
  { when: ['lemas', 'nafsu-turun'], then: 'Demam' },
  { when: ['rewel-berkepanjangan'], then: 'Kondisi Umum Ringan' },
];
