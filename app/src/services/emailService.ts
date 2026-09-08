import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * EmailService — kirim email notifikasi ke pengguna.
 *
 * Konfigurasi via environment (TIDAK ada secret di repo):
 *   EXPO_PUBLIC_EMAILJS_SERVICE_ID / _WELCOME_TEMPLATE_ID / _RESET_TEMPLATE_ID /
 *   _CHANGED_TEMPLATE_ID / _PUBLIC_KEY
 * Lokal: isi file .env (gitignored, lihat .env.example).
 * Vercel: Project Settings > Environment Variables. EAS: eas secret:create.
 *
 * Mode:
 * 1. REAL   — semua env terisi: kirim via EmailJS REST API (gratis, tanpa backend).
 * 2. OUTBOX — env belum diisi: email disimpan ke AsyncStorage (max 30),
 *             alur tetap bisa dites tanpa kirim email sungguhan.
 */

const CONFIG = {
  serviceId: process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID ?? '',
  welcomeTemplateId: process.env.EXPO_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID ?? '',
  resetTemplateId: process.env.EXPO_PUBLIC_EMAILJS_RESET_TEMPLATE_ID ?? '',
  changedTemplateId:
    process.env.EXPO_PUBLIC_EMAILJS_CHANGED_TEMPLATE_ID ??
    process.env.EXPO_PUBLIC_EMAILJS_RESET_TEMPLATE_ID ??
    '',
  publicKey: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
};

const isConfigured = () =>
  CONFIG.serviceId.length > 0 &&
  CONFIG.publicKey.length > 0 &&
  CONFIG.welcomeTemplateId.length > 0 &&
  CONFIG.resetTemplateId.length > 0;

const OUTBOX_KEY = 'babyops_email_outbox_v1';

async function pushOutbox(entry: { to: string; subject: string; body: string }) {
  const raw = await AsyncStorage.getItem(OUTBOX_KEY);
  const box = raw ? JSON.parse(raw) : [];
  box.unshift({ ...entry, at: new Date().toISOString() });
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(box.slice(0, 30)));
  // Catat metadata saja — JANGAN log body (berisi kode reset).
  console.log(`[BabyOps Email outbox → ${entry.to}] ${entry.subject}`);
}

async function sendViaEmailJS(templateId: string, params: Record<string, string>) {
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: CONFIG.serviceId,
        template_id: templateId,
        user_id: CONFIG.publicKey,
        template_params: params,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function deliver(templateId: string, to: string, subject: string, body: string, params: Record<string, string>) {
  if (isConfigured()) {
    const ok = await sendViaEmailJS(templateId, { to_email: to, subject, ...params });
    if (ok) return true;
  }
  await pushOutbox({ to, subject, body });
  return false;
}

export const emailService = {
  isConfigured,

  async sendWelcome(email: string, name: string, provider: 'email' | 'google') {
    return deliver(
      CONFIG.welcomeTemplateId,
      email,
      'Selamat datang di BabyOps 👶',
      `Halo ${name},\n\nAkun BabyOps Anda (${email}) berhasil dibuat via ${provider === 'google' ? 'Google' : 'email'}.\nSelamat menemani tumbuh kembang si kecil!\n\n— Tim BabyOps`,
      { to_name: name, app_name: 'BabyOps', provider }
    );
  },

  async sendResetCode(email: string, name: string, code: string) {
    return deliver(
      CONFIG.resetTemplateId,
      email,
      `Kode reset password BabyOps: ${code}`,
      `Halo ${name},\n\nKode reset password Anda: ${code}\nBerlaku 10 menit. Jangan bagikan kode ini.\n\n— Tim BabyOps`,
      { to_name: name, reset_code: code }
    );
  },

  async sendPasswordChanged(email: string, name: string) {
    return deliver(
      CONFIG.changedTemplateId,
      email,
      'Password BabyOps Anda berhasil diubah',
      `Halo ${name},\n\nPassword akun ${email} baru saja diubah. Jika bukan Anda, segera hubungi kami.\n\n— Tim BabyOps`,
      { to_name: name }
    );
  },

  async readOutbox(): Promise<Array<{ to: string; subject: string; body: string; at: string }>> {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    return raw ? JSON.parse(raw) : [];
  },
};
