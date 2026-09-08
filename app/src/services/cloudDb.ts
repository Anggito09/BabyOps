import { getSupabase, isCloudEnabled } from './supabase';

export interface CloudProfile {
  user_id: string;
  name: string;
  baby_name?: string | null;
  baby_dob?: string | null;
  baby_gender?: string | null;
  phone?: string | null;
  address?: string | null;
  research_consent?: boolean | null;
}

export interface CloudHistoryRow {
  id?: string;
  user_id: string;
  kind: string;
  condition_name: string;
  description?: string | null;
  severity?: string | null;
  emoji?: string | null;
  entry_date: string;
  matched_symptoms?: number | null;
  symptom_ids?: string[] | null;
  symptom_names?: string[] | null;
  guidance?: string[] | null;
  doctor_when?: string | null;
  cry_label?: string | null;
  cry_meaning?: string | null;
  confidence?: number | null;
  baby_id?: string | null; // multi-bayi (kembar)
  baby_name?: string | null;
  created_at?: string;
}

/** True kalau cloud Supabase aktif (native + env terisi). Dipakai UI untuk info/reset. */
export const cloudActive = isCloudEnabled;

async function authed() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  if (!data.session) return null;
  return sb;
}

// ---- Auth ----

export async function cloudSignUp(email: string, password: string) {
  const sb = getSupabase();
  if (!sb) return { ok: false as const, reason: 'cloud-off' as const };
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return { ok: false as const, reason: 'error' as const, message: error.message };
  return { ok: true as const, userId: data.user?.id ?? null };
}

export async function cloudSignIn(email: string, password: string) {
  const sb = getSupabase();
  if (!sb) return { ok: false as const, reason: 'cloud-off' as const };
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { ok: false as const, reason: 'error' as const, message: error.message };
  return { ok: true as const, userId: data.user?.id ?? null };
}

export async function cloudSignOut() {
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.auth.signOut();
    } catch {
      /* abaikan */
    }
  }
}

export async function cloudResetPassword(email: string) {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.auth.resetPasswordForEmail(email);
  return !error;
}

// ---- Profil ----

export async function cloudUpsertProfile(p: CloudProfile): Promise<boolean> {
  const sb = await authed();
  if (!sb) return false;
  const { error } = await sb.from('profiles').upsert(p, { onConflict: 'user_id' });
  return !error;
}

export async function cloudLoadProfile(): Promise<CloudProfile | null> {
  const sb = await authed();
  if (!sb) return null;
  const { data } = await sb.from('profiles').select('*').single();
  return (data as CloudProfile | null) ?? null;
}

// ---- History (backup cloud, max 50 terbaru) ----

export async function cloudPushHistory(row: CloudHistoryRow): Promise<boolean> {
  const sb = await authed();
  if (!sb) return false;
  const { error } = await sb.from('history').insert(row);
  return !error;
}

export async function cloudLoadHistory(): Promise<CloudHistoryRow[]> {
  const sb = await authed();
  if (!sb) return [];
  const { data } = await sb
    .from('history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  return (data as CloudHistoryRow[]) ?? [];
}

// ---- Sesi ----

export async function cloudGetSessionUser(): Promise<{ id: string; email: string } | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  const u = data.user;
  if (!u) return null;
  return { id: u.id, email: (u.email ?? '').toLowerCase() };
}

// ---- Reset password via OTP email Supabase (tanpa link/deep-link) ----

export async function cloudSendOtp(email: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
  return !error;
}

export async function cloudVerifyOtp(email: string, token: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.auth.verifyOtp({ email, token: token.trim(), type: 'email' });
  return !error;
}

export async function cloudUpdatePassword(newPassword: string): Promise<boolean> {
  const sb = await authed();
  if (!sb) return false;
  const { error } = await sb.auth.updateUser({ password: newPassword });
  return !error;
}
