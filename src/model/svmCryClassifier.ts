import { DunstanLabel } from '../data/dunstan';
import { extractFeatures } from './mfcc';
import RawModel from '../../assets/cry_svm_ovr_model.json';

export interface CryFeatures { mfcc: number[]; durationSec: number; }
export interface CryPrediction { label: DunstanLabel; confidence: number; distribution: Array<{label:DunstanLabel; score:number}>; source: 'svm-rbf'|'knn-dataset'|'mock'; }

const VALID: DunstanLabel[] = ['Neh','Owh','Eh','Eairh','Heh'];
// OVR model keeps classes in order Eairh,Eh,Heh,Neh,Owh
const MODEL_CLASSES: DunstanLabel[] = (RawModel as any).meta.classes as DunstanLabel[];
const MEAN = Float64Array.from((RawModel as any).scaler.mean);
const SCALE = Float64Array.from((RawModel as any).scaler.scale);
const ESTIMATORS = (RawModel as any).svm_ovr as Array<{class:string; support_vectors:number[][]; dual_coef:number[][]; intercept:number[]; gamma:number}>;

function standardize(v: Float32Array): Float64Array {
  const out=new Float64Array(v.length);
  for(let i=0;i<v.length;i++) out[i]=(v[i]-MEAN[i])/(SCALE[i]||1);
  return out;
}
function rbf(a: Float64Array, b: number[], gamma:number): number {
  let s=0;
  for(let i=0;i<a.length;i++){ const d=a[i]-b[i]; s+=d*d; }
  return Math.exp(-gamma*s);
}
function softmax(arr:number[]): number[] {
  const m=Math.max(...arr);
  const ex=arr.map(v=>Math.exp(v-m));
  const sum=ex.reduce((a,b)=>a+b,0);
  return ex.map(v=>v/sum);
}

export class SvmCryClassifier {
  async classifyFeatures(samples: Float32Array, sr:number): Promise<CryPrediction> {
    const {vector} = extractFeatures(samples, sr);
    const x=standardize(vector);
    const decisions: number[] = [];
    for(const est of ESTIMATORS){
      const gamma=est.gamma;
      const svs=est.support_vectors;
      const coef=est.dual_coef[0];
      const b=est.intercept[0];
      let s=b;
      for(let i=0;i<svs.length;i++) s+= coef[i]* rbf(x, svs[i], gamma);
      decisions.push(s);
    }
    // decisions order matches MODEL_CLASSES = Eairh,Eh,Heh,Neh,Owh
    // map to VALID order needs lookup
    const scores=softmax(decisions);
    // build distribution in VALID order? Keep model order for display but ensure valid
    const dist = MODEL_CLASSES.map((lab,i)=>({label: lab as DunstanLabel, score: scores[i]}));
    dist.sort((a,b)=>b.score-a.score);
    // softmax already normalized
    return {label: dist[0].label, confidence: dist[0].score, distribution: dist, source:'svm-rbf'};
  }
  async classify(_features:CryFeatures): Promise<CryPrediction> {
    const dist=VALID.map(l=>({label:l, score:0.2}));
    return {label:'Neh', confidence:0.2, distribution: dist, source:'svm-rbf'};
  }
}
export const svmClassifier = new SvmCryClassifier();
