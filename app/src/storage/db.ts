import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password?: string; // plain mock, jangan pakai di produksi
  babyDob?: string; // YYYY-MM-DD
  babyName?: string;
  babyGender?: 'L' | 'P';
  phone?: string;
  address?: string;
  provider: 'email' | 'google';
  createdAt: string;
  researchConsent?: boolean;
  researchConsentAt?: string;
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
  // simpan email selalu dalam bentuk trim+lowercase agar konsisten
  const cleanUser = { ...user, email: nEmail };
  if (idx >= 0) users[idx] = { ...users[idx], ...cleanUser };
  else users.push(cleanUser);
  await saveUsers(users);
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const users = await loadUsers();
  return users.find((u) => norm(u.email) === norm(email)) ?? null;
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
