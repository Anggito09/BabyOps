import json, numpy as np
from sklearn.svm import SVC
from sklearn.multiclass import OneVsRestClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import accuracy_score
path='C:/Users/DESKTOP-10036/Documents/babyops-app/app/assets/cry_knn_model.json'
with open(path) as f:
    m=json.load(f)
X=np.array(m['samples']['features'])
y=np.array(m['samples']['labels'])
labels = ["Eairh","Eh","Heh","Neh","Owh"]
# OneVsRest with RBF
base=SVC(kernel='rbf', C=5, gamma='scale')
ovr=OneVsRestClassifier(base)
ovr.fit(X,y)
# cross val
from sklearn.model_selection import StratifiedKFold, cross_val_predict
skf=StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
pred=cross_val_predict(OneVsRestClassifier(SVC(kernel='rbf', C=5, gamma='scale')), X, y, cv=skf)
print('OVR CV acc', accuracy_score(y,pred))
# export each estimator
estimators=[]
for i, est in enumerate(ovr.estimators_):
    print(f'class {labels[i]} n_support {len(est.support_)}')
    estimators.append({
        "class": labels[i],
        "support_vectors": est.support_vectors_.tolist(),
        "dual_coef": est.dual_coef_.tolist(),  # shape 1 x n_support
        "intercept": est.intercept_.tolist(),
        "gamma": float(est._gamma)
    })
model={
  "meta": {"name":"BabyOps Cry SVM RBF OVR","dataset":m['meta']['dataset'],"classes":labels,"n_train":int(len(X)),"n_features":int(X.shape[1]),"svm":{"kernel":"rbf","C":5,"gamma":"scale"}},
  "scaler": m["scaler"],
  "svm_ovr": estimators
}
out='C:/Users/DESKTOP-10036/Documents/babyops-app/app/assets/cry_svm_ovr_model.json'
with open(out,'w') as f:
    json.dump(model,f)
import os
print(f"exported {out} {os.path.getsize(out)/1024:.1f} KB")
