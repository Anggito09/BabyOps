# Testing BabyOps

## 1. Tes otomatis (jalan di laptop, tanpa HP)

| Tes | Perintah | Hasil terakhir |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit --skipLibCheck` | 0 error |
| Expo doctor | `npx expo-doctor` | 20/21 (1 warning patch `expo`, harmless) |
| Matrix forward chaining | `node tools/check_matrix.js` | 19/19 kasus lolos |
| Kasus tanda bahaya | `node tools/manual_forward_chaining.js demam napas-cepat` | `Perlu Pemeriksaan Tenaga Medis Segera [darurat]` |
| Audit secret | grep ID/key di repo | bersih — config via env (`.env`, gitignored) |

## 2. Tes manual (di HP fisik, wajib sebelum production)

- [ ] Install dari Internal Testing → register akun baru → email welcome sampai (cek spam)
- [ ] Login password salah → pesan error benar; login benar → masuk home
- [ ] Rekam tangisan 5–10 detik (ruangan tenang) → hasil analisis muncul
- [ ] Rekam di ruangan bising → hasil tetap wajar / pesan jelas
- [ ] Diagnosa demam + napas cepat → keluar peringatan darurat
- [ ] Reset password: kode 6 digit sampai ke inbox, verifikasi, login dengan password baru
- [ ] Simpan riwayat → tutup app → buka lagi → riwayat masih ada
- [ ] **Ganti HP / install ulang → login → profil + riwayat kembali dari cloud**
- [ ] Tolak izin mikrofon → app tidak crash
- [ ] Mode offline (data mati) → app tetap terbuka, error wajar
- [ ] Validasi form: email salah, password < 6, konfirmasi beda, tanggal lahir masa depan, daftar tanpa centang privasi

## 3. Setup env (tanpa ini email/cloud tidak jalan)

- Lokal: salin `.env.example` → `.env`, isi nilainya (`.env` tidak di-commit).
- Vercel: Project Settings > Environment Variables (nama `EXPO_PUBLIC_*`), lalu redeploy.
- EAS (APK): `eas secret:create --scope project --name <NAMA> --value <NILAI>`.
- Supabase: hanya dipakai build native. Web selalu mode lokal.
