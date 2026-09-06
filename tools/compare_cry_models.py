"""
BabyOps — perbandingan akurasi model tangisan bayi (fair, data sama).
Sumber fitur: assets/cry_knn_model.json (sudah scaled Xs + labels).
Evaluasi: Stratified 5-Fold CV, seed 42 — sama seperti train_knn.py.

  python tools/compare_cry_models.py
"""
import json
import os
import numpy as np

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANDIDATES = [
    os.path.join(BASE, "assets", "cry_knn_model.json"),
    os.path.join(BASE, "..", "assets", "cry_knn_model.json"),
    os.path.join("assets", "cry_knn_model.json"),
]
PATH = next((p for p in CANDIDATES if os.path.exists(p)), CANDIDATES[0])

with open(PATH, encoding="utf-8") as f:
    m = json.load(f)

X = np.array(m["samples"]["features"])
y = np.array(m["samples"]["labels"])
labels = ["Eairh", "Eh", "Heh", "Neh", "Owh"]
print(f"Data: {PATH}")
print(f"n={len(X)}, fitur={X.shape[1]}, distribusi={dict(zip(*np.unique(y, return_counts=True)))}")

from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import accuracy_score, classification_report
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.multiclass import OneVsRestClassifier, OneVsOneClassifier

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

models = {
    "KNN cosine k=5 (baseline app lama)": KNeighborsClassifier(n_neighbors=5, metric="cosine", weights="distance"),
    "SVM RBF C=5 ovr (single)": SVC(kernel="rbf", C=5, gamma="scale", decision_function_shape="ovr"),
    "SVM RBF C=5 OneVsRest": OneVsRestClassifier(SVC(kernel="rbf", C=5, gamma="scale")),
    "SVM RBF C=5 OneVsOne (dipakai app)": OneVsOneClassifier(SVC(kernel="rbf", C=5, gamma="scale")),
}

results = {}
for name, clf in models.items():
    pred = cross_val_predict(clf, X, y, cv=skf)
    acc = accuracy_score(y, pred)
    results[name] = (acc, pred)
    print(f"\n=== {name} ===")
    print(f"CV accuracy: {acc:.4f}")
    print(classification_report(y, pred, labels=labels, digits=3, zero_division=0))

print("\n=== RINGKASAN ===")
for name, (acc, _) in sorted(results.items(), key=lambda kv: kv[1][0], reverse=True):
    print(f"{acc:.4f}  {name}")
best = max(results.items(), key=lambda kv: kv[1][0])
print(f"\nTerbaik: {best[0]} ({best[1][0]:.4f})")
