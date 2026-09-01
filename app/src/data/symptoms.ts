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
  severity: 'ringan' | 'sedang' | 'perlu perhatian';
  description: string;
  guidance: string[];
  doctorWhen: string;
}

export interface Rule {
  when: string[];
  then: string;
}

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
    name: 'Konjungtivitis (Irisasi Mata)',
    emoji: '👁️',
    severity: 'ringan',
    description:
      'Peradangan pada selaput mata yang membuat mata memerah, berair, dan mengeluarkan keputihan. Umum pada bayi dan biasanya tidak berbahaya bila ditangani dengan benar.',
    guidance: [
      'Bersihkan mata dengan kapas bersih dan air hangat, dari sudut luar ke dalam',
      'Gunakan kapas berbeda untuk setiap mata',
      'Cuci tangan sebelum dan sesudah membersihkan mata',
    ],
    doctorWhen: 'Bila keputihan membandel lebih dari 2 hari atau kelopak membengkak.',
  },
  'Flu & Batuk Pilek': {
    name: 'Flu & Batuk Pilek',
    emoji: '🤧',
    severity: 'ringan',
    description:
      'Infeksi ringan pada saluran napas atas. Hidung tersumbat membuat bayi rewel dan susah menyusu.',
    guidance: [
      'Bersihkan hidung dengan saline drop sebelum menyusu',
      'Gunakan humidifier atau uap air hangat di kamar',
      'Pastikan asupan cairan bayi tetap cukup',
    ],
    doctorWhen: 'Bila bayi menolak menyusu total atau demam di atas 38°C.',
  },
  Bronkiolitis: {
    name: 'Bronkiolitis',
    emoji: '🫁',
    severity: 'perlu perhatian',
    description:
      'Peradangan pada saluran napas kecil yang umum disebabkan virus RSV. Ditandai batuk, napas cepat, dan bunyi mengi. Perlu pemantauan ketat pada bayi di bawah 6 bulan.',
    guidance: [
      'Berikan posisi tidur dengan kepala sedikit terangkat',
      'Bersihkan hidung sebelum tidur dan menyusu',
      'Pantau laju napas bayi secara berkala',
    ],
    doctorWhen: 'Segera ke dokter bila dada tertarik dalam, napas sangat cepat, atau bibir kebiruan.',
  },
  'Gangguan Pencernaan': {
    name: 'Gangguan Pencernaan',
    emoji: '🍽️',
    severity: 'sedang',
    description:
      'Ketidaknyamanan saluran cerna yang bisa disebabkan kembung, alergi susu, atau infeksi. Ditandai muntah, feces cair, atau menolak menyusu.',
    guidance: [
      'Tetap berikan ASI dalam porsi kecil tapi sering',
      'Pijat perut lembut searah jarum jam',
      'Catat pola muntah/feces untuk diceritakan ke dokter',
    ],
    doctorWhen: 'Bila muntah terus-menerus, feces berdarah, atau tanda dehidrasi muncul.',
  },
  'Iritasi Kulit': {
    name: 'Iritasi Kulit',
    emoji: '🧴',
    severity: 'ringan',
    description:
      'Reaksi kulit seperti ruam pop kenas, eksim ringan, atau alergi produk. Umumnya membaik dengan perawatan sederhana.',
    guidance: [
      'Ganti pop segera setelah kenas dan keringkan area lipatan',
      'Gunakan pelembap bebas pewangi',
      'Hindari produk dengan alkohol atau parfum kuat',
    ],
    doctorWhen: 'Bila ruam melebar, bernanah, atau disertai demam.',
  },
  Demam: {
    name: 'Demam',
    emoji: '🌡️',
    severity: 'perlu perhatian',
    description:
      'Suhu tubuh di atas normal yang biasanya menandakan tubuh sedang melawan infeksi. Pada bayi di bawah 3 bulan, demam perlu segera dievaluasi dokter.',
    guidance: [
      'Ukur suhu dengan termometer yang akurat',
      'Kenakan pakaian tipis dan jaga hidrasi',
      'Jangan memberikan obat tanpa anjuran dokter',
    ],
    doctorWhen: 'Segera ke fasilitas kesehatan bila bayi di bawah 3 bulan dengan suhu di atas 38°C.',
  },
  'Kondisi Umum Ringan': {
    name: 'Kondisi Umum Ringan',
    emoji: '🤲',
    severity: 'ringan',
    description:
      'Gejala yang terpilih belum menunjukkan pola kondisi tertentu. Bisa jadi bayi hanya tidak nyaman, lelah, atau sedang tumbuh kembang.',
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
