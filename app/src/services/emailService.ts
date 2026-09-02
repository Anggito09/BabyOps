import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * EmailService — kirim email notifikasi ke pengguna.
 *
 * Mode:
 * 1. REAL   — isi EMAILJS_SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY (gratis, tanpa backend).
 *             Lihat https://www.emailjs.com/docs/sdk/send-emails/ (REST API langsung).
 * 2. OUTBOX — fallback demo: email disimpan ke AsyncStorage + console.log,
 *             sehingga alur (welcome / reset kode / password berubah) tetap bisa dites.
 */

const CONFIG = {
  serviceId: 'service_dsvufq9',
  welcomeTemplateId: 'template_59dazod',
  resetTemplateId: 'template_4jbxtab',
  changedTemplateId: 'template_4jbxtab',
  publicKey: '4hVhSvTYRDSSasM3Z',
};

const isConfigured = () =>
  !CONFIG.serviceId.includes('xxxxxxx') && !CONFIG.publicKey.includes('xxxxxxxx');

const OUTBOX_KEY = 'babyops_email_outbox_v1';

async function pushOutbox(entry: { to: string; subject: string; body: string }) {
  const raw = await AsyncStorage.getItem(OUTBOX_KEY);
  const box = raw ? JSON.parse(raw) : [];
  box.unshift({ ...entry, at: new Date().toISOString() });
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(box.slice(0, 30)));
  console.log(`[BabyOps Email → ${entry.to}] ${entry.subject}\n${entry.body}`);
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
