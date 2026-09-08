# Checklist Lomba BabyOps

## A. Dokumen (wajib ada sebelum daftar)

- [x] `EVALUASI_MODEL.md` — angka resmi: SVM OvO **92,00%**, KNN 78,42%, FC 19/19
- [ ] **Lembar validasi pakar** — 1 dokter/bidan coba app + tanda tangan + nilai (template: nama, NIP/STR, 5 pernyataan setuju 1–5, saran)
- [ ] **Uji pengguna** — 5–10 ibu (termasuk 1 ibu kembar kalau bisa): kuesioner SUS singkat (10 soal) + 2 testimoni + foto blur
- [ ] **Poster 1 lembar** — masalah → solusi → arsitektur (MFCC→SVM on-device, FC+danger) → hasil (92%) → dampak
- [ ] **Pitch 3 menit** — 0:30 masalah (story Archie & Sylphy), 1:30 demo live, 1:00 angka + penutup
- [ ] **Flowchart forward chaining + diagram arsitektur** (bisa screenshot dari kode + Figma)
- [ ] **Tabel kompetitor** — BabyOps vs Halodoc/PrimaKu: kolom tangisan on-device, danger triage, multi-bayi, offline/privasi

## B. Demo live (anti-gagal)

- [ ] APK terinstal di 2 HP (1 cadangan) + Expo Go QR cadangan
- [ ] **Sampel audio cadangan** 5 kelas (ruangan lomba berisik — jangan andalkan rekam live)
- [ ] **Video demo offline** 60–90 detik (kalau internet/HP mati, pitch tetap jalan)
- [ ] Skenario kembar: 2 bayi, 2 riwayat beda → tunjukkan switcher + tagging
- [ ] Skenario darurat: demam + napas cepat → banner darurat muncul

## C. Jawaban jebakan juri (hafalkan)

1. *"Akurasi berapa?"* → "SVM OvO 92% CV 5-fold, n=862, macro F1 0,908 — detail di EVALUASI_MODEL.md, reproduce 1 perintah."
2. *"Dunstan kan belum terbukti?"* → "Betul, makanya ini alat bantu + ada disclaimer + danger override MTBS/WHO + validasi pakar (tunjukkan lembar)."
3. *"Bedanya dengan aplikasi X?"* → tunjukkan tabel kompetitor + demo kembar (fitur yang mereka tidak punya).
4. *"Dataset dari mana? Etis?"* → sebutkan sumber, n per kelas, audio tidak diunggah, riset opt-in anonim.
5. *"Bisnisnya gimana?"* → freemium + kemitraan posyandu/puskesmas/KIA, bukan jual data (tunjukkan privacy policy).

## D. Bereskan sebelum serahkan source/APK ke juri

- [ ] Rotate EmailJS key (fallback masih hardcode untuk testing)
- [ ] `npx tsc --noEmit` 0 error + `node tools/check_matrix.js` 19/19 (terakhir: lolos ✅ 9 Sep 2026)
- [ ] Hapus `expo.log` / kredensial dari repo
