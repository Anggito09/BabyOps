// Uji cepat matriks 1-7 gejala terhadap logika baru (danger override + campuran).
// Duplikasi ringan dari src/model/forwardChaining.ts + src/data/symptoms.ts agar bisa jalan via node.
const DANGER = ['menolak-susu', 'lemas', 'napas-cepat', 'ditarik-dada', 'wheezing', 'kuning', 'demam'];
const rules = [
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
function run(selected) {
  const danger = selected.filter((s) => DANGER.includes(s));
  const fired = rules.filter((r) => r.when.every((s) => selected.includes(s)));
  const counts = new Map();
  for (const r of fired) counts.set(r.then, (counts.get(r.then) ?? 0) + 1);
  const firedConds = [...counts.keys()];
  if (danger.length > 0) return { condition: 'Perlu Pemeriksaan Segera', danger, fired: firedConds };
  if (fired.length === 0) return { condition: 'Kondisi Umum Ringan', danger, fired: firedConds };
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  let best = sorted[0][0];
  const mixed = firedConds.length > 1 && sorted.length > 1 && sorted[0][1] < sorted[1][1] * 2;
  return { condition: mixed ? 'Gejala Campuran' : best, danger, fired: firedConds };
}
const cases = [
  // 1 gejala
  [['ruam'], 'Iritasi Kulit'],
  [['kuning'], 'Perlu Pemeriksaan Segera'],
  [['demam'], 'Perlu Pemeriksaan Segera'],
  [['rewel-berkepanjangan'], 'Kondisi Umum Ringan'],
  [['bersin'], 'Kondisi Umum Ringan'],
  // 2 gejala
  [['mata-merah', 'keputihan-mata'], 'Konjungtivitis'],
  [['muntah', 'diare'], 'Gangguan Pencernaan'],
  [['hidung-tersumbat', 'bersin'], 'Flu & Batuk Pilek'],
  [['batuk', 'wheezing'], 'Perlu Pemeriksaan Segera'],
  [['lemas', 'nafsu-turun'], 'Perlu Pemeriksaan Segera'],
  // 3 gejala
  [['batuk', 'napas-cepat', 'ditarik-dada'], 'Perlu Pemeriksaan Segera'],
  [['demam', 'batuk', 'diare'], 'Perlu Pemeriksaan Segera'],
  [['mata-merah', 'mata-berair', 'sering-gosok-mata'], 'Konjungtivitis'],
  // 4 gejala
  [['menolak-susu', 'muntah', 'diare', 'perut-kembung'], 'Perlu Pemeriksaan Segera'],
  [['hidung-tersumbat', 'ingus-lendir', 'bersin', 'rewel-berkepanjangan'], 'Flu & Batuk Pilek'],
  // 5 gejala
  [['mata-merah', 'keputihan-mata', 'hidung-tersumbat', 'bersin', 'rewel-berkepanjangan'], 'Gejala Campuran'],
  [['ruam', 'kulit-kering', 'mata-merah', 'keputihan-mata', 'rewel-berkepanjangan'], 'Iritasi Kulit'],
  // 6 gejala
  [['batuk', 'hidung-tersumbat', 'bersin', 'mata-merah', 'keputihan-mata', 'rewel-berkepanjangan'], 'Gejala Campuran'],
  // 7 gejala (kasus laporan)
  [['menolak-susu', 'muntah', 'bersin', 'rewel-berkepanjangan', 'nafsu-turun', 'lemas', 'napas-cepat'], 'Perlu Pemeriksaan Segera'],
];
let fail = 0;
for (const [sel, expected] of cases) {
  const got = run(sel).condition;
  const ok = got === expected;
  if (!ok) fail++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} [${sel.length}] ${sel.join('+')} => ${got}${ok ? '' : ` (mau: ${expected})`}`);
}
console.log(fail === 0 ? `\nSemua ${cases.length} kasus lolos.` : `\n${fail} kasus GAGAL.`);
process.exit(fail === 0 ? 0 : 1);
