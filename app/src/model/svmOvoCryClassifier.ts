import { DunstanLabel } from '../data/dunstan';
import { extractFeatures } from './mfcc';
import RawModel from '../../assets/cry_svm_ovo10_model.json';

export interface CryFeatures { mfcc:number[]; durationSec:number; }
export interface CryPrediction { label:DunstanLabel; confidence:number; distribution:Array<{label:DunstanLabel; score:number}>; source:'svm-rbf'; }

const MEAN = Float64Array.from((RawModel as any).scaler.mean);
const SCALE = Float64Array.from((RawModel as any).scaler.scale);
const PAIRS = (RawModel as any).pairs as Array<{pair:string[]; support_vectors:number[][]; dual_coef:number[][]; intercept:number[]; gamma:number}>;

function standardize(v:Float32Array): Float64Array {
  const out=new Float64Array(v.length);
  for(let i=0;i<v.length;i++) out[i]=(v[i]-MEAN[i])/(SCALE[i]||1);
  return out;
}
function rbf(a:Float64Array,b:number[],gamma:number):number{
  let s=0; for(let i=0;i<a.length;i++){ const d=a[i]-b[i]; s+=d*d; } return Math.exp(-gamma*s);
}

export class SvmOvoCryClassifier {
  async classifyFeatures(samples:Float32Array, sr:number):Promise<CryPrediction>{
    const {vector}=extractFeatures(samples,sr);
    const x=standardize(vector);
    const votes:Record<string,number>={Eairh:0,Eh:0,Heh:0,Neh:0,Owh:0};
    const decSum:Record<string,number>={Eairh:0,Eh:0,Heh:0,Neh:0,Owh:0};
    for(const p of PAIRS){
      const gamma=p.gamma; const svs=p.support_vectors; const coef=p.dual_coef[0]; const b=p.intercept[0];
      let s=b; for(let i=0;i<svs.length;i++) s+= coef[i]* rbf(x, svs[i], gamma);
      const [c1,c2]=p.pair as [DunstanLabel,DunstanLabel];
      // sklearn: decision >0 => vote c2 (kelas kedua), else c1 — dibalik dari implementasi awal
      if(s>0){ votes[c2]++; decSum[c2]+=s; decSum[c1]-=s; } else { votes[c1]++; decSum[c1]-=s; decSum[c2]+=s; }
    }
    // decide by votes then decSum
    const classes: DunstanLabel[] = ['Eairh','Eh','Heh','Neh','Owh'];
    let best=classes[0]; let bestVotes=votes[best];
    for(const c of classes){ if(votes[c]>bestVotes || (votes[c]===bestVotes && decSum[c]>decSum[best])){ best=c; bestVotes=votes[c]; } }
    // distribution from votes+decSum softmax
    const scores=classes.map(c=> votes[c]*2 + decSum[c]*0.1);
    const m=Math.max(...scores);
    const ex=scores.map(v=>Math.exp(v-m));
    const sum=ex.reduce((a,b)=>a+b,0);
    const dist=classes.map((c,i)=>({label:c, score:ex[i]/sum})).sort((a,b)=>b.score-a.score);
    const top=dist.find(d=>d.label===best) ?? dist[0];
    return {label: best, confidence: top.score, distribution: dist, source:'svm-rbf'};
  }
  async classify(_f:CryFeatures):Promise<CryPrediction>{
    const d: DunstanLabel[]=['Neh','Owh','Eh','Eairh','Heh'];
    const dist=d.map((l,i)=>({label:l, score:0.2}));
    return {label:'Neh', confidence:0.2, distribution:dist, source:'svm-rbf'};
  }
}
export const svmOvoClassifier=new SvmOvoCryClassifier();
