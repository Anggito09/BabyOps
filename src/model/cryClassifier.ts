/**
 * cryClassifier — entry point. Model asli KNN (dataset Donate-a-Cry) dengan fallback mock.
 */
export type { CryFeatures, CryPrediction, CryClassifier } from './knnCryClassifier';
import { KnnCryClassifier, MockCryClassifier, type CryClassifier } from './knnCryClassifier';

let impl: CryClassifier;
try {
  impl = new KnnCryClassifier();
} catch {
  impl = new MockCryClassifier();
}

export const classifier: CryClassifier = impl;
export { MockCryClassifier, KnnCryClassifier };
