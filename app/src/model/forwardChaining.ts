import { conditions, rules, symptomCategories } from '../data/symptoms';

export interface DiagnosisOutcome {
  condition: string;
  matchedRules: number;
  matchedSymptoms: string[];
}

export function runForwardChaining(selected: string[]): DiagnosisOutcome {
  const fired = rules.filter((rule) => rule.when.every((s) => selected.includes(s)));
  if (fired.length === 0) {
    return { condition: 'Kondisi Umum Ringan', matchedRules: 0, matchedSymptoms: selected };
  }

  const counts = new Map<string, number>();
  for (const rule of fired) {
    counts.set(rule.then, (counts.get(rule.then) ?? 0) + 1);
  }

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
    matchedSymptoms: selected,
  };
}

export function totalSymptomCount(): number {
  return symptomCategories.reduce((sum, cat) => sum + cat.symptoms.length, 0);
}
