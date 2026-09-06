/**
 * Manual Forward Chaining Tester — BabyOps
 * Jalankan tanpa buka aplikasi:
 *
 *   node tools/manual_forward_chaining.js                  -> jalankan semua preset (7 kondisi)
 *   node tools/manual_forward_chaining.js --list           -> lihat semua ID gejala
 *   node tools/manual_forward_chaining.js mata-merah keputihan-mata
 *   node tools/manual_forward_chaining.js batuk napas-cepat ditarik-dada
 *
 * Logic sama persis dengan src/model/forwardChaining.ts + src/data/symptoms.ts
 */

const symptomCategories = [
  { id: 'mata', name: 'Mata', symptoms: ['mata-merah', 'keputihan-mata', 'sering-gosok-mata', 'mata-berair'] },
  { id: 'hidung', name: 'Hidung', symptoms: ['hidung-tersumbat', 'ingus-lendir', 'bersin'] },
  { id: 'napas', name: 'Pernapasan', symptoms: ['batuk', 'napas-cepat', 'wheezing', 'ditarik-dada'] },
  { id: 'pencernaan', name: 'Pencernaan', symptoms: ['menolak-susu', 'muntah', 'diare', 'perut-kembung'] },
  { id: 'kulit', name: 'Kulit', symptoms: ['ruam', 'kulit-kering', 'kuning'] },
  { id: 'umum', name: 'Kondisi Umum', symptoms: ['demam', 'lemas', 'rewel-berkepanjangan', 'nafsu-turun'] },
];

const symptomNames = {
  'mata-merah': 'Mata memerah',
  'keputihan-mata': 'Keputihan di mata',
  'sering-gosok-mata': 'Sering menggosok mata',
  'mata-berair': 'Mata berair',
  'hidung-tersumbat': 'Hidung tersumbat',
  'ingus-lendir': 'Ingus kental/lendir',
  bersin: 'Sering bersin',
  batuk: 'Batuk',
  'napas-cepat': 'Napas cepat/terengah',
  wheezing: 'Bunyi mengi (wheezing)',
  'ditarik-dada': 'Dada tertarik saat napas',
  'menolak-susu': 'Menolak menyusu',
  muntah: 'Muntah',
  diare: 'Feces cair berlebih',
  'perut-kembung': 'Perut kembung',
  ruam: 'Ruam/beruntun merah',
  'kulit-kering': 'Kulit kering mengelupas',
  kuning: 'Kulit kekuningan',
  demam: 'Suhu tubuh tinggi',
  lemas: 'Tampak lemas',
  'rewel-berkepanjangan': 'Rewel berkepanjangan',
  'nafsu-turun': 'Nafsu makan turun',
};

const conditions = {
  Konjungtivitis: { name: 'Konjungtivitis (Irisasi Mata)', severity: 'ringan' },
  'Flu & Batuk Pilek': { name: 'Flu & Batuk Pilek', severity: 'ringan' },
  Bronkiolitis: { name: 'Bronkiolitis', severity: 'perlu perhatian' },
  'Gangguan Pencernaan': { name: 'Gangguan Pencernaan', severity: 'sedang' },
  'Iritasi Kulit': { name: 'Iritasi Kulit', severity: 'ringan' },
  Demam: { name: 'Demam', severity: 'perlu perhatian' },
  'Kondisi Umum Ringan': { name: 'Kondisi Umum Ringan', severity: 'ringan' },
};

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

function runForwardChaining(selected) {
  const fired = rules.filter((r) => r.when.every((s) => selected.includes(s)));
  if (fired.length === 0) {
    return { condition: 'Kondisi Umum Ringan', matchedRules: 0, fired: [] };
  }
  const counts = new Map();
  for (const r of fired) counts.set(r.then, (counts.get(r.then) ?? 0) + 1);
  let best = '';
  let bestCount = -1;
  for (const [name, count] of counts) {
    if (count > bestCount) {
      best = name;
      bestCount = count;
    }
  }
  return {
    condition: conditions[best] ? best : 'Kondisi Umum Ringan',
    matchedRules: fired.length,
    fired,
  };
}

// Preset: satu contoh untuk tiap kondisi (beberapa model kasus)
const presets = [
  { label: 'Konjungtivitis', selected: ['mata-merah', 'keputihan-mata'] },
  { label: 'Flu & Batuk Pilek', selected: ['hidung-tersumbat', 'bersin'] },
  { label: 'Bronkiolitis', selected: ['batuk', 'napas-cepat', 'ditarik-dada'] },
  { label: 'Gangguan Pencernaan', selected: ['muntah', 'diare'] },
  { label: 'Iritasi Kulit', selected: ['ruam'] },
  { label: 'Demam', selected: ['demam', 'batuk'] },
  { label: 'Kondisi Umum Ringan', selected: ['rewel-berkepanjangan'] },
  { label: 'Tidak cocok (fallback)', selected: ['kuning'] },
];

function printResult(title, selected) {
  const unknown = selected.filter((s) => !symptomNames[s]);
  const outcome = runForwardChaining(selected);
  const cond = conditions[outcome.condition];
  console.log(`\n=== ${title} ===`);
  console.log(`Gejala (${selected.length}): ${selected.map((s) => symptomNames[s] ?? s).join(', ') || '-'}`);
  if (unknown.length > 0) console.log(`ID tidak dikenal: ${unknown.join(', ')}`);
  console.log(`Hasil: ${cond.name} [${cond.severity}]`);
  console.log(`Aturan cocok: ${outcome.matchedRules}`);
  outcome.fired.forEach((r) => console.log(`  - IF ${r.when.join(' + ')} THEN ${r.then}`));
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--list') || args.includes('-l')) {
    console.log('Daftar ID gejala:');
    symptomCategories.forEach((c) => {
      console.log(`\n[${c.name}]`);
      c.symptoms.forEach((s) => console.log(`  ${s} = ${symptomNames[s]}`));
    });
    return;
  }
  if (args.length > 0) {
    printResult('Manual CLI', args);
    return;
  }
  console.log(`Menjalankan ${presets.length} preset model...`);
  presets.forEach((p) => printResult(p.label, p.selected));
  console.log('\nTips: node tools/manual_forward_chaining.js batuk wheezing');
}

main();
