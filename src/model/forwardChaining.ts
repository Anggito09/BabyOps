import { conditions, DANGER_SIGNS, rules, symptomCategories } from '../data/symptoms';

export interface DiagnosisOutcome {
  condition: string;
  matchedRules: number;
  matchedSymptoms: string[];
  /** ID tanda bahaya yang terdeteksi (mengacu pedoman MTBS/IMCI WHO). */
  dangerSigns: string[];
  /** Kondisi-kondisi berbeda yang ikut terpicu (untuk deteksi gejala campuran). */
  firedConditions: string[];
  isEmergency: boolean;
  isMixed: boolean;
}

function detectDanger(selected: string[]): string[] {
  return DANGER_SIGNS.filter((d) => selected.includes(d.id)).map((d) => d.id);
}

export function runForwardChaining(selected: string[]): DiagnosisOutcome {
  const dangerSigns = detectDanger(selected);
  const fired = rules.filter((rule) => rule.when.every((s) => selected.includes(s)));

  const counts = new Map<string, number>();
  for (const rule of fired) {
    counts.set(rule.then, (counts.get(rule.then) ?? 0) + 1);
  }
  const firedConditions = [...counts.keys()].filter((c) => conditions[c]);

  // Lapisan 1 — DARURAT: satu tanda bahaya saja mengalahkan semua voting.
  if (dangerSigns.length > 0) {
    return {
      condition: 'Perlu Pemeriksaan Segera',
      matchedRules: fired.length,
      matchedSymptoms: selected,
      dangerSigns,
      firedConditions,
      isEmergency: true,
      isMixed: firedConditions.length > 1,
    };
  }

  if (fired.length === 0) {
    return {
      condition: 'Kondisi Umum Ringan',
      matchedRules: 0,
      matchedSymptoms: selected,
      dangerSigns,
      firedConditions: [],
      isEmergency: false,
      isMixed: false,
    };
  }

  let best = '';
  let bestCount = -1;
  for (const [name, count] of counts) {
    if (count > bestCount) {
      best = name;
      bestCount = count;
    }
  }
  const winner = conditions[best] ? best : 'Kondisi Umum Ringan';

  // Lapisan 2 — CAMPURAN: beberapa kondisi berbeda ikut terpicu dan
  // pemenang tidak dominan (suara < 2x runner-up) → jangan klaim satu diagnosis pasti.
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const isMixed =
    firedConditions.length > 1 && sorted.length > 1 && sorted[0][1] < sorted[1][1] * 2;

  return {
    condition: isMixed ? 'Gejala Campuran' : winner,
    matchedRules: fired.length,
    matchedSymptoms: selected,
    dangerSigns,
    firedConditions,
    isEmergency: false,
    isMixed,
  };
}

export function totalSymptomCount(): number {
  return symptomCategories.reduce((sum, cat) => sum + cat.symptoms.length, 0);
}
