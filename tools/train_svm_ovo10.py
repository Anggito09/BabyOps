import json, numpy as np
from sklearn.svm import SVC
from sklearn.multiclass import OneVsOneClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import accuracy_score, classification_report
path='C:/Users/DESKTOP-10036/Documents/babyops-app/app/assets/cry_knn_model.json'
with open(path) as f:
    m=json.load(f)
X=np.array(m['samples']['features'])
y=np.array(m['samples']['labels'])
labels = ["Eairh","Eh","Heh","Neh","Owh"]

ovo=OneVsOneClassifier(SVC(kernel='rbf', C=5, gamma='scale'))
skf=StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
pred=cross_val_predict(ovo, X, y, cv=skf)
print('OVO 10 classifiers CV acc', accuracy_score(y,pred))
print(classification_report(y,pred, digits=3))

ovo.fit(X,y)
# export each of 10 pairwise classifiers (ovo has 10 binary SVCs)
pairs=[]
for idx, est in enumerate(ovo.estimators_):
    c1,c2 = est.classes_.tolist()
    print(f"pair {idx}: {c1} vs {c2} n_sv {len(est.support_)}")
    pairs.append({
        "pair": [c1,c2],
        "support_vectors": est.support_vectors_.tolist(),
        "dual_coef": est.dual_coef_.tolist(),
        "intercept": est.intercept_.tolist(),
        "gamma": float(est._gamma),
        "classes": est.classes_.tolist()
    })

model={
  "meta": {"name":"BabyOps Cry SVM RBF OVO 10", "dataset": m['meta']['dataset'], "classes": labels, "n_train": int(len(X)), "n_features": int(X.shape[1]), "svm":{"kernel":"rbf","C":5,"gamma":"scale"}},
  "scaler": m["scaler"],
  "pairs": pairs
}
out='C:/Users/DESKTOP-10036/Documents/babyops-app/app/assets/cry_svm_ovo10_model.json'
with open(out,'w') as f:
    json.dump(model,f)
import os
print(f"exported {out} {os.path.getsize(out)/1024:.1f} KB")
