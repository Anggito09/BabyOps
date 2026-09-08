import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Baby {
  id: string;
  name: string;
  dob?: string; // YYYY-MM-DD
  gender?: 'L' | 'P';
}

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password?: string; // plain mock, jangan pakai di produksi
  babyDob?: string; // LEGACY: single-bayi, dimigrasi otomatis ke babies[0]
  babyName?: string; // LEGACY
  babyGender?: 'L' | 'P'; // LEGACY
  babies?: Baby[]; // multi-bayi (kembar): 1 akun parent bisa punya N bayi
  activeBabyId?: string; // bayi yang sedang dipilih di switcher
  phone?: string;
  address?: string;
  provider: 'email' | 'google';
  createdAt: string;
  researchConsent?: boolean;
  researchConsentAt?: string;
}

/** ID unik bayi — pakai random suffix karena Date.now() saja bisa kembar dalam 1 ms. */
export function newBabyId(): string {
  return `baby_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Migrasi user lama (babyName/babyDob) ke babies[0]. Idempotent. */
export function ensureBabies(user: DbUser): DbUser {
  let babies: Baby[];
  if (user.babies && user.babies.length > 0) {
    babies = [...user.babies];
  } else if (user.babyName || user.babyDob) {
    babies = [{
      id: newBabyId(),
      name: user.babyName ?? 'Si Kecil',
      dob: user.babyDob,
      gender: user.babyGender,
    }];
  } else {
    babies = [];
  }
  // Repair: ID ganda (bug versi awal) bikin switcher/hapus/riwayat rusak.
  // Tiap bayi wajib punya ID unik — yang duplikat diganti baru.
  const seen = new Set<string>();
  babies = babies.map((b) => {
    let id = b.id || newBabyId();
    if (seen.has(id)) id = newBabyId();
    seen.add(id);
    return id === b.id ? b : { ...b, id };
  });
  const activeBabyId =
    user.activeBabyId && seen.has(user.activeBabyId) ? user.activeBabyId : babies[0]?.id;
  return { ...user, babies, activeBabyId };
}

/** True kalau data bayi user butuh repair (ID ganda / activeBabyId hilang). */
export function babiesNeedRepair(user: DbUser): boolean {
  const ids = (user.babies ?? []).map((b) => b.id);
  if (new Set(ids).size !== ids.length) return true;
  if (ids.length > 0 && (!user.activeBabyId || !ids.includes(user.activeBabyId))) return true;
  return false;
}

export function getBabies(user: DbUser | null | undefined): Baby[] {
  if (!user) return [];
  return ensureBabies(user).babies ?? [];
}

export function getActiveBaby(user: DbUser | null | undefined): Baby | null {
  if (!user) return null;
  const u = ensureBabies(user);
  const list = u.babies ?? [];
  if (list.length === 0) return null;
  return list.find((b) => b.id === u.activeBabyId) ?? list[0];
}

export interface ResearchSample {
  id: string;
  type: 'cry' | 'diagnosis';
  at: string;
  appVersion: string;
  // cry: vektor fitur MFCC 43 (anonim, TANPA audio mentah)
  features?: number[];
  predictedLabel?: string;
  confidence?: number;
  // diagnosis: gejala + hasil (anonim, TANPA nama/email)
  symptomIds?: string[];
  condition?: string;
  // konteks minimal untuk training: umur bayi dalam bulan (bukan nama/tgl lahir)
  babyAgeMonths?: number;
}

const norm = (e: string) => e.trim().toLowerCase();

const KEYS = {
  users: 'babyops_users_v1',
  currentEmail: 'babyops_current_v1',
  history: (email: string) => `babyops_history_${norm(email)}_v1`,
  research: 'babyops_research_v1',
};

export async function loadUsers(): Promise<DbUser[]> {
  const raw = await AsyncStorage.getItem(KEYS.users);
  return raw ? JSON.parse(raw) : [];
}

export async function saveUsers(users: DbUser[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.users, JSON.stringify(users));
}

export async function upsertUser(user: DbUser): Promise<void> {
  const users = await loadUsers();
  const nEmail = norm(user.email);
  const idx = users.findIndex((u) => norm(u.email) === nEmail);
  // migrasi + sinkron legacy: babyName/babyDob selalu cerminkan bayi aktif
  // agar kode lama (cloud backup, badge umur) tetap jalan.
  const migrated = ensureBabies(user);
  const active = getActiveBaby(migrated);
  const cleanUser: DbUser = {
    ...migrated,
    email: nEmail,
    babyName: active?.name ?? migrated.babyName,
    babyDob: active?.dob ?? migrated.babyDob,
    babyGender: active?.gender ?? migrated.babyGender,
  };
  if (idx >= 0) users[idx] = { ...users[idx], ...cleanUser };
  else users.push(cleanUser);
  await saveUsers(users);
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const users = await loadUsers();
  const found = users.find((u) => norm(u.email) === norm(email)) ?? null;
  return found ? ensureBabies(found) : null;
}

export async function setCurrentEmail(email: string | null) {
  if (email) await AsyncStorage.setItem(KEYS.currentEmail, norm(email));
  else await AsyncStorage.removeItem(KEYS.currentEmail);
}

export async function getCurrentEmail(): Promise<string | null> {
  const v = await AsyncStorage.getItem(KEYS.currentEmail);
  return v ? norm(v) : null;
}

export async function loadHistory(email: string): Promise<import('../../App').DiagnosisHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.history(norm(email)));
  return raw ? JSON.parse(raw) : [];
}

export async function saveHistory(email: string, history: import('../../App').DiagnosisHistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.history(norm(email)), JSON.stringify(history.slice(0, 20)));
}

export async function loadResearch(): Promise<ResearchSample[]> {
  const raw = await AsyncStorage.getItem(KEYS.research);
  return raw ? JSON.parse(raw) : [];
}

export async function addResearch(sample: Omit<ResearchSample, 'id' | 'at'>): Promise<void> {
  const raw = await AsyncStorage.getItem(KEYS.research);
  const list: ResearchSample[] = raw ? JSON.parse(raw) : [];
  list.unshift({ ...sample, id: String(Date.now()), at: new Date().toISOString() });
  await AsyncStorage.setItem(KEYS.research, JSON.stringify(list.slice(0, 500)));
}

export async function clearResearch(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.research);
}

export async function clearAll(): Promise<void> {
  const users = await loadUsers();
  await AsyncStorage.clear();
  // restore users? tidak, biar benar2 clear untuk testing
}
