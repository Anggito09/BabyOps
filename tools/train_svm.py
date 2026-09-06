import json, numpy as np
from sklearn.svm import SVC
path='C:/Users/DESKTOP-10036/Documents/babyops-app/app/assets/cry_knn_model.json'
with open(path) as f:
    m=json.load(f)
X=np.array(m['samples']['features'])  # already scaled Xs
y=np.array(m['samples']['labels'])
labels = ["Eairh","Eh","Heh","Neh","Owh"]
# Train SVM RBF C=5 gamma=scale
clf=SVC(kernel='rbf', C=5, gamma='scale', decision_function_shape='ovr', probability=False)
clf.fit(X, y)
print('classes', clf.classes_)
print('n_support', clf.n_support_, 'total', len(clf.support_))
print('support_vectors', clf.support_vectors_.shape)
# gamma scale = 1 / (n_features * X.var())
# sklearn's scale = 1 / (n_features * X.var()) -> compute
# export
model={
  "meta": {
    "name": "BabyOps Cry SVM RBF",
    "dataset": m['meta']['dataset'],
    "classes": labels,
    "n_train": int(len(X)),
    "n_features": int(X.shape[1]),
    "svm": {"kernel":"rbf","C":5,"gamma":"scale","gamma_value": float(clf.gamma_) if hasattr(clf,'gamma_') else float(1/(X.shape[1]*X.var()))}
  },
  "scaler": m["scaler"],
  "svm": {
    "classes": clf.classes_.tolist(),
    "support_vectors": clf.support_vectors_.tolist(),
    "dual_coef": clf.dual_coef_.tolist(),
    "intercept": clf.intercept_.tolist(),
    "support": clf.support_.tolist(),
    "n_support": clf.n_support_.tolist(),
    "gamma": float(clf._gamma) if hasattr(clf,'_gamma') else float(clf.gamma_),
  }
}
# sklearn stores gamma as _gamma after fit
try:
    g=float(clf._gamma)
except:
    g=float(1/(X.shape[1]*X.var()))
model["svm"]["gamma"]=g
out='C:/Users/DESKTOP-10036/Documents/babyops-app/app/assets/cry_svm_model.json'
with open(out,'w') as f:
    json.dump(model,f)
import os
print(f"exported {out} {os.path.getsize(out)/1024:.1f} KB gamma={g}")

# quick sanity: predict
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import accuracy_score
skf=StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
pred=cross_val_predict(SVC(kernel='rbf', C=5, gamma='scale'), X, y, cv=skf)
print('CV acc', accuracy_score(y,pred))
