/**
 * MFCC extractor — implementasi TypeScript yang match parameter librosa:
 * sr=16000, n_mfcc=13, n_fft=1024, hop_length=512, mel filterbank Slaney, DCT-II ortho.
 * Output layout identik dengan tools/train_knn.py:
 *   [mfcc_mean(13), mfcc_std(13), delta_mean(13), centroid, zcr, rms, duration] = 43 fitur
 */

const SR = 16000;
const N_MFCC = 13;
const N_FFT = 1024;
const HOP = 512;
const N_MELS = 128; // default librosa

function hann(n: number): Float32Array {
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n);
  return w;
}

/** Iterative radix-2 FFT (in-place, real+imag arrays) */
function fft(re: Float32Array, im: Float32Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wRe = Math.cos(ang);
    const wIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curRe = 1;
      let curIm = 0;
      for (let k = 0; k < len / 2; k++) {
        const uRe = re[i + k];
        const uIm = im[i + k];
        const vRe = re[i + k + len / 2] * curRe - im[i + k + len / 2] * curIm;
        const vIm = re[i + k + len / 2] * curIm + im[i + k + len / 2] * curRe;
        re[i + k] = uRe + vRe;
        im[i + k] = uIm + vIm;
        re[i + k + len / 2] = uRe - vRe;
        im[i + k + len / 2] = uIm - vIm;
        const nextRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = nextRe;
      }
    }
  }
}

/** Slaney mel scale (librosa default htk=false) */
function hzToMel(f: number): number {
  return f < 1000 ? (3 * f) / 200 : 15 + (27 * Math.log(f / 1000)) / Math.log(6.4);
}
function melToHz(m: number): number {
  return m < 15 ? (200 * m) / 3 : 1000 * Math.exp((Math.log(6.4) * (m - 15)) / 27);
}

function melFilterbank(): Float32Array[] {
  const nBins = N_FFT / 2 + 1;
  const melMin = hzToMel(0);
  const melMax = hzToMel(SR / 2);
  const melPts: number[] = [];
  for (let i = 0; i < N_MELS + 2; i++) melPts.push(melToHz(melMin + ((melMax - melMin) * i) / (N_MELS + 1)));
  const bins = melPts.map((hz) => Math.floor(((N_FFT + 1) * hz) / SR));
  const filters: Float32Array[] = [];
  for (let m = 1; m <= N_MELS; m++) {
    const f = new Float32Array(nBins);
    const left = bins[m - 1];
    const center = bins[m];
    const right = bins[m + 1];
    for (let k = left; k < center; k++) if (k >= 0 && k < nBins && center !== left) f[k] = (k - left) / (center - left);
    for (let k = center; k < right; k++) if (k >= 0 && k < nBins && right !== center) f[k] = (right - k) / (right - center);
    // Slaney normalization (librosa norm='slaney')
    const en = melToHz(hzToMel((SR / 2) * ((m + 1) / (N_MELS + 1))) + 200) - melToHz(hzToMel((SR / 2) * ((m - 1) / (N_MELS + 1))) + 200);
    const norm = 2 / (melPts[m + 1] - melPts[m - 1]);
    for (let k = 0; k < nBins; k++) f[k] *= norm;
    filters.push(f);
  }
  return filters;
}

/** DCT-II ortho (scipy.fftpack.dct norm='ortho' setara) */
function dct2(input: number[], K: number): Float32Array {
  const N = input.length;
  const out = new Float32Array(K);
  for (let k = 0; k < K; k++) {
    let sum = 0;
    for (let n = 0; n < N; n++) sum += input[n] * Math.cos((Math.PI * k * (n + 0.5)) / N);
    const norm = k === 0 ? Math.sqrt(1 / (4 * N)) : Math.sqrt(1 / (2 * N));
    out[k] = 2 * sum * norm * Math.SQRT2;
  }
  return out;
}

export interface MfccResult {
  vector: Float32Array; // 43 fitur
  nFrames: number;
}

export function extractFeatures(samples: Float32Array, sr: number): MfccResult {
  if (sr !== SR) {
    // simple linear resample
    const ratio = SR / sr;
    const out = new Float32Array(Math.floor(samples.length * ratio));
    for (let i = 0; i < out.length; i++) {
      const pos = i / ratio;
      const i0 = Math.floor(pos);
      const i1 = Math.min(i0 + 1, samples.length - 1);
      out[i] = samples[i0] + (samples[i1] - samples[i0]) * (pos - i0);
    }
    samples = out;
  }
  // trim silence (top_db=30 setara)
  let start = 0;
  let end = samples.length - 1;
  const peak = Math.max(...Array.from(samples).map(Math.abs)) || 1e-10;
  const thresh = peak * Math.pow(10, -30 / 20);
  while (start < samples.length && Math.abs(samples[start]) < thresh) start++;
  while (end > start && Math.abs(samples[end]) < thresh) end--;
  samples = samples.slice(Math.max(0, start - 256), Math.min(samples.length, end + 256));
  if (samples.length < N_FFT) {
    const padded = new Float32Array(N_FFT);
    padded.set(samples);
    samples = padded;
  }

  const win = hann(N_FFT);
  const filters = melFilterbank();
  const nFrames = Math.max(1, 1 + Math.floor((samples.length - N_FFT) / HOP));
  const nBins = N_FFT / 2 + 1;
  const melDb: number[][] = [];
  const re = new Float32Array(N_FFT);
  const im = new Float32Array(N_FFT);
  let centroidSum = 0;
  let zcrSum = 0;
  let rmsSum = 0;

  for (let t = 0; t < nFrames; t++) {
    const off = t * HOP;
    let energy = 0;
    let zc = 0;
    for (let i = 0; i < N_FFT; i++) {
      const s = samples[off + i] ?? 0;
      re[i] = s * win[i];
      im[i] = 0;
      energy += s * s;
      if (i > 0 && (s >= 0) !== (samples[off + i - 1] >= 0)) zc++;
    }
    const rms = Math.sqrt(energy / N_FFT);
    rmsSum += rms;
    zcrSum += zc / N_FFT;
    fft(re, im);
    const power = new Float64Array(nBins);
    let magSum = 0;
    let freqSum = 0;
    for (let k = 0; k < nBins; k++) {
      const mag = Math.sqrt(re[k] * re[k] + im[k] * im[k]);
      power[k] = mag * mag;
      magSum += mag;
      freqSum += mag * ((k * SR) / N_FFT);
    }
    centroidSum += magSum > 0 ? freqSum / magSum : 0;
    const melE = new Array(N_MELS);
    for (let m = 0; m < N_MELS; m++) {
      let s = 0;
      const f = filters[m];
      for (let k = 0; k < nBins; k++) s += f[k] * power[k];
      melE[m] = Math.log(s + 1e-10);
    }
    melDb.push(Array.from(dct2(melE, N_MFCC)));
  }

  // mean & std per koefisien
  const mean = new Array(N_MFCC).fill(0);
  const std = new Array(N_MFCC).fill(0);
  for (const frame of melDb) for (let k = 0; k < N_MFCC; k++) mean[k] += frame[k] / nFrames;
  for (const frame of melDb) for (let k = 0; k < N_MFCC; k++) std[k] += (frame[k] - mean[k]) ** 2 / nFrames;
  for (let k = 0; k < N_MFCC; k++) std[k] = Math.sqrt(std[k]);

  // delta (first order) mean
  const deltaMean = new Array(N_MFCC).fill(0);
  if (nFrames > 2) {
    for (let t = 1; t < nFrames; t++) for (let k = 0; k < N_MFCC; k++) deltaMean[k] += (melDb[t][k] - melDb[t - 1][k]) / (nFrames - 1);
  }

  const vector = new Float32Array(43);
  for (let k = 0; k < N_MFCC; k++) {
    vector[k] = mean[k];
    vector[13 + k] = std[k];
    vector[26 + k] = deltaMean[k];
  }
  vector[39] = centroidSum / nFrames;
  vector[40] = zcrSum / nFrames;
  vector[41] = rmsSum / nFrames;
  vector[42] = Math.min(samples.length / SR, 10);
  return { vector, nFrames };
}
