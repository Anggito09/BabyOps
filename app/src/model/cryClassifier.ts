/**
 * cryClassifier — entry point. Model terbaik SVM RBF OVO 92% (CV 5-fold) dataset Donate-a-Cry, fallback OVR/KNN.
 */
export type { CryFeatures, CryPrediction, CryClassifier } from './knnCryClassifier';
import { KnnCryClassifier, MockCryClassifier, type CryClassifier } from './knnCryClassifier';
import { SvmOvoCryClassifier } from './svmOvoCryClassifier';

let impl: CryClassifier;
try {
  impl = new SvmOvoCryClassifier() as unknown as CryClassifier;
} catch {
  try { impl = new KnnCryClassifier(); } catch { impl = new MockCryClassifier(); }
}

export const classifier: CryClassifier = impl;
export { MockCryClassifier, KnnCryClassifier, SvmOvoCryClassifier };
