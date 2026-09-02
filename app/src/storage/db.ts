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
}

const KEYS = {
  users: 'babyops_users_v1',
  currentEmail: 'babyops_current_v1',
  history: (email: string) => `babyops_history_${email}_v1`,
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
  const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) users[idx] = { ...users[idx], ...user };
  else users.push(user);
  await saveUsers(users);
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const users = await loadUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function setCurrentEmail(email: string | null) {
  if (email) await AsyncStorage.setItem(KEYS.currentEmail, email);
  else await AsyncStorage.removeItem(KEYS.currentEmail);
}

export async function getCurrentEmail(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.currentEmail);
}

export async function loadHistory(email: string): Promise<import('../../App').DiagnosisHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.history(email.toLowerCase()));
  return raw ? JSON.parse(raw) : [];
}

export async function saveHistory(email: string, history: import('../../App').DiagnosisHistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.history(email.toLowerCase()), JSON.stringify(history.slice(0, 20)));
}

export async function clearAll(): Promise<void> {
  const users = await loadUsers();
  await AsyncStorage.clear();
  // restore users? tidak, biar benar2 clear untuk testing
}
