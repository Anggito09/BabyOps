import { DunstanLabel } from '../data/dunstan';

export interface CryFeatures {
  mfcc: number[];
  durationSec: number;
}

export interface CryPrediction {
  label: DunstanLabel;
  confidence: number;
  distribution: Array<{ label: DunstanLabel; score: number }>;
  source: 'knn-dataset' | 'mock';
}

export interface CryClassifier {
  classify(features: CryFeatures): Promise<CryPrediction>;
}

const LABELS: DunstanLabel[] = ['Neh', 'Owh', 'Eh', 'Eairh', 'Heh'];

const MOCK_TEMPLATES: Record<DunstanLabel, number[]> = {
  Neh: [0.82, 0.06, 0.04, 0.03, 0.05],
  Owh: [0.05, 0.79, 0.05, 0.04, 0.07],
  Eh: [0.06, 0.05, 0.8, 0.04, 0.05],
  Eairh: [0.04, 0.05, 0.04, 0.81, 0.06],
  Heh: [0.06, 0.07, 0.05, 0.05, 0.77],
};

export class MockCryClassifier implements CryClassifier {
  async classify(features: CryFeatures): Promise<CryPrediction> {
    const jitter = () => (Math.random() - 0.5) * 0.12;
    const raw = LABELS.map((label, i) => ({
      label,
      score: Math.max(0.01, MOCK_TEMPLATES[label][i] + jitter()),
    })).sort((a, b) => b.score - a.score);

    const total = raw.reduce((s, r) => s + r.score, 0);
    const distribution = raw.map((r) => ({ label: r.label, score: r.score / total }));
    return {
      label: distribution[0].label,
      confidence: distribution[0].score,
      distribution,
      source: 'mock',
    };
  }
}

export const classifier: CryClassifier = new MockCryClassifier();
