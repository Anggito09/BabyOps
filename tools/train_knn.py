"""
BabyOps — Infant Cry KNN Trainer
Dataset: Donate-a-Cry corpus (gveres/donateacry-corpus, GitHub)
         5 kelas -> map Dunstan Baby Language:
           hungry     -> Neh (lapar)
           tired      -> Owh (mengantuk)
           burping    -> Eh  (butuh sendawa)
           belly_pain -> Eairh (gas perut bawah)
           discomfort -> Heh (tidak nyaman)

Pipeline: librosa MFCC(13)+delta -> augmentasi minoritas -> StandardScaler
          -> KNN (cosine, k=5, weight=distance) -> Stratified 5-Fold CV
          -> export model JSON untuk inferensi on-device (TypeScript)
"""

import json
import os
import sys
import numpy as np
import librosa
import soundfile as sf
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix

DATASET_DIR = sys.argv[1] if len(sys.argv) > 1 else "donateacry_corpus_cleaned_and_updated_data"
OUT_JSON = sys.argv[2] if len(sys.argv) > 2 else "cry_knn_model.json"
SR = 16000
N_MFCC = 13
TARGET_PER_CLASS = 120
SEED = 42

CLASS_MAP = {  # dataset -> dunstan
    "hungry": "Neh",
    "tired": "Owh",
    "burping": "Eh",
    "belly_pain": "Eairh",
    "discomfort": "Heh",
}


def load_wav(path: str):
    y, sr = librosa.load(path, sr=SR, mono=True)
    y, _ = librosa.effects.trim(y, top_db=30)
    if len(y) < SR * 0.3:
        y = np.pad(y, (0, SR * 3 - len(y)))
    return y


def features(y: np.ndarray) -> np.ndarray:
    mfcc = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=N_MFCC, n_fft=1024, hop_length=512)
    delta = librosa.feature.delta(mfcc)
    centroid = librosa.feature.spectral_centroid(y=y, sr=SR).mean()
    zcr = librosa.feature.zero_crossing_rate(y).mean()
    rms = librosa.feature.rms(y=y).mean()
    dur = min(len(y) / SR, 10.0)
    vec = np.concatenate([mfcc.mean(axis=1), mfcc.std(axis=1), delta.mean(axis=1), [centroid, zcr, rms, dur]])
    return vec.astype(np.float32)


def augment(y: np.ndarray) -> list:
    outs = []
    rng = np.random.default_rng(SEED)
    for pitch in (-2, 2):
        outs.append(librosa.effects.pitch_shift(y, sr=SR, n_steps=pitch))
    for rate in (0.9, 1.1):
        outs.append(librosa.effects.time_stretch(y, rate=rate))
    noise = y + 0.003 * rng.standard_normal(len(y))
    outs.append(noise.astype(np.float32))
    return outs


def main():
    rng = np.random.default_rng(SEED)
    X, y = [], []
    counts = {}
    for ds_class, dunstan in CLASS_MAP.items():
        folder = os.path.join(DATASET_DIR, ds_class)
        files = [os.path.join(folder, f) for f in os.listdir(folder) if f.endswith(".wav")]
        counts[dunstan] = len(files)
        feats = []
        for fp in files:
            try:
                audio = load_wav(fp)
                feats.append(features(audio))
            except Exception as e:
                print(f"skip {fp}: {e}")
        X.extend(feats)
        y.extend([dunstan] * len(feats))
        # augmentasi kelas minoritas
        n_aug = TARGET_PER_CLASS - len(feats)
        if n_aug > 0:
            i = 0
            while n_aug > 0:
                fp = files[i % len(files)]
                audio = load_wav(fp)
                for aug in augment(audio):
                    if n_aug <= 0:
                        break
                    X.append(features(aug))
                    y.append(dunstan)
                    n_aug -= 1
                i += 1
        print(f"{ds_class:12s} -> {dunstan:6s}: {len(files)} asli + {max(0, TARGET_PER_CLASS - len(files))} augment")

    X = np.array(X)
    y = np.array(y)
    print(f"\nTotal: {len(X)} sampel, {X.shape[1]} fitur, distribusi: {dict(zip(*np.unique(y, return_counts=True)))}")

    scaler = StandardScaler().fit(X)
    Xs = scaler.transform(X)

    knn = KNeighborsClassifier(n_neighbors=5, metric="cosine", weights="distance")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    pred = cross_val_predict(knn, Xs, y, cv=skf)
    print("\n=== Evaluasi Stratified 5-Fold CV ===")
    print(classification_report(y, pred, digits=3))
    print("Confusion matrix (urut: Eairh Eh Heh Neh Owh):")
    labels = ["Eairh", "Eh", "Heh", "Neh", "Owh"]
    print(confusion_matrix(y, pred, labels=labels))

    # latih final di seluruh data & export
    knn.fit(Xs, y)
    model = {
        "meta": {
            "name": "BabyOps Cry KNN",
            "dataset": "Donate-a-Cry corpus (gveres/donateacry-corpus)",
            "classes": labels,
            "n_train": int(len(X)),
            "n_features": int(X.shape[1]),
            "feature_layout": ["mfcc_mean(13)", "mfcc_std(13)", "delta_mean(13)", "centroid", "zcr", "rms", "duration"],
            "audio": {"sr": SR, "n_mfcc": N_MFCC, "n_fft": 1024, "hop_length": 512},
            "knn": {"k": 5, "metric": "cosine", "weights": "distance"},
            "cv_accuracy_note": "lihat output training",
        },
        "scaler": {"mean": scaler.mean_.tolist(), "scale": scaler.scale_.tolist()},
        "samples": {"labels": y.tolist(), "features": Xs.round(5).tolist()},
    }
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(model, f)
    size_mb = os.path.getsize(OUT_JSON) / 1024 / 1024
    print(f"\nModel exported: {OUT_JSON} ({size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
