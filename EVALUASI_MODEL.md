# Evaluasi Model BabyOps (1 Halaman)

> Cara reproduce: `python tools/compare_cry_models.py` · `node tools/check_matrix.js`
> Tanggal evaluasi: 9 September 2026 · sklearn 1.9.0 · seed 42

## 1. Klasifikasi Tangisan Bayi (MFCC + ML, on-device)

- **Fitur:** 43 koefisien MFCC per klip (ekstraksi di HP, audio mentah tidak diunggah).
- **Data:** n=862 sampel, 5 kelas Dunstan — Neh 382, Eairh/Eh/Heh/Owh @120.
- **Metode:** Stratified 5-Fold Cross-Validation ( adil, data & seed sama untuk semua model).

| Model | Akurasi CV | Macro F1 | Status |
| --- | --- | --- | --- |
| KNN cosine k=5 (baseline lama) | 78,42% | 0,774 | digantikan |
| SVM RBF C=5 OneVsRest | 90,26% | 0,889 | arsip |
| **SVM RBF C=5 OneVsOne (dipakai app)** | **92,00%** | **0,908** | ✅ produksi |
| SVM RBF C=5 ovr single | 92,00% | 0,908 | setara (lebih ringan, kandidat) |

Per-kelas model produksi (precision/recall): Eairh 0,93/0,91 · Eh 1,00/1,00 ·
Heh 0,86/0,84 · Neh 0,94/0,95 · Owh 0,82/0,83.
Kelas tersulit: **Owh vs Heh** (pola akustik mirip) — wajar untuk riset lanjutan.

**Keputusan:** OvO 92% dipakai karena stabil di semua kelas; ovr-single setara dan
lebih ringan — kandidat optimasi ukuran APK berikutnya.

## 2. Screening Gejala (Forward Chaining + danger override MTBS/WHO)

- 7 tanda bahaya (menolak susu, lemas, napas cepat, dada tertarik, wheezing,
  kuning, demam) → hasil dikunci **"Perlu Pemeriksaan Segera"**, voting rule diabaikan.
- `node tools/check_matrix.js`: **19/19 kasus lolos** (1–7 gejala, termasuk campuran).

## 3. Batasan (jujur untuk juri)

1. Dataset sedang (n=862) & tak seimbang (Neh dominan) — akurasi lapangan bisa turun,
   terutama di ruangan bising. Perlu uji lapangan + data kembar.
2. Kelas Eh sempurna (1,00) patut dicurigai terlalu mudah — perlu data baru yang lebih variatif.
3. Dunstan Baby Language adalah **alat bantu, BUKAN diagnosis medis** — app menampilkan
   disclaimer ini + validasi tenaga kesehatan tetap wajib (lihat LOMBA_CHECKLIST.md).
