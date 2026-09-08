import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
// Web: SafeAreaView sering collapse jadi 0 di RNW — pakai View biasa untuk web
const ScreenView: React.ComponentType<any> = Platform.OS === 'web' ? View : SafeAreaView;
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { RecordScreen } from './src/screens/RecordScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { DiagnosisScreen } from './src/screens/DiagnosisScreen';
import { EducationScreen } from './src/screens/EducationScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { BottomNav, TabKey } from './src/components/BottomNav';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { colors } from './src/theme/tokens';
import { CryPrediction } from './src/model/cryClassifier';
import * as DB from './src/storage/db';
import { emailService } from './src/services/emailService';
// Cloud (Supabase): aktif hanya di APK native + env terisi. Web/Vercel -> lokal saja.
import {
  cloudActive,
  cloudGetSessionUser,
  cloudLoadHistory,
  cloudLoadProfile,
  cloudPushHistory,
  cloudSignIn,
  cloudSignOut,
  cloudSignUp,
  cloudUpsertProfile,
} from './src/services/cloudDb';

function formatDateTime(d: Date): string {
  const date = d.toLocaleDateString('id-ID');
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${date} • ${time}`;
}

export type HistoryKind = 'diagnosis' | 'cry';

export interface DiagnosisHistoryEntry {
  id: string;
  kind: HistoryKind;
  conditionName: string;
  description: string;
  severity: string;
  emoji: string;
  date: string;
  matchedSymptoms: number;
  symptomIds?: string[];
  symptomNames?: string[];
  guidance?: string[];
  doctorWhen?: string;
  cryLabel?: string;
  cryMeaning?: string;
  confidence?: number;
  babyId?: string; // multi-bayi: riwayat milik bayi mana
  babyName?: string; // denormalisasi agar history lama tetap tampil
}

export interface AppBaby {
  id: string;
  name: string;
  dob?: string;
  gender?: string;
}

export interface AppUser {
  name: string;
  email: string;
  babyDob?: string;
  babyName?: string;
  babyGender?: string;
  babies?: AppBaby[];
  activeBabyId?: string;
  phone?: string;
  address?: string;
}

function toAppUser(dbUser: DB.DbUser): AppUser {
  const migrated = DB.ensureBabies(dbUser);
  const babies: AppBaby[] = (migrated.babies ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    dob: b.dob,
    gender: b.gender,
  }));
  const active = DB.getActiveBaby(migrated);
  return {
    name: migrated.name,
    email: migrated.email,
    babyDob: active?.dob ?? migrated.babyDob,
    babyName: active?.name ?? migrated.babyName,
    babyGender: active?.gender ?? migrated.babyGender,
    babies,
    activeBabyId: active?.id ?? migrated.activeBabyId,
    phone: migrated.phone,
    address: migrated.address,
  };
}

function getActiveBabyOf(user: AppUser | null): AppBaby | null {
  if (!user) return null;
  const list = user.babies ?? [];
  if (list.length === 0) {
    if (!user.babyName && !user.babyDob) return null;
    return { id: 'legacy', name: user.babyName ?? 'Si Kecil', dob: user.babyDob, gender: user.babyGender };
  }
  return list.find((b) => b.id === user.activeBabyId) ?? list[0];
}

type Route =
  | { name: 'splash' }
  | { name: 'onboarding' }
  | { name: 'login' }
  | { name: 'register' }
  | { name: 'forgot' }
  | { name: 'main'; tab: TabKey }
  | { name: 'record' }
  | { name: 'result'; prediction: CryPrediction };

function getAgeMonths(dobStr?: string): string {
  if (!dobStr) return '03';
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return '03';
  const now = new Date();
  let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  if (now.getDate() < dob.getDate()) months -= 1;
  months = Math.max(0, Math.min(24, months));
  return String(months).padStart(2, '0');
}

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'splash' });
  const [user, setUser] = useState<AppUser | null>(null);
  const [history, setHistory] = useState<DiagnosisHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Web: hilangkan kotak outline/focus hitam-biru saat klik (Pressable/Touchable)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const doc = (globalThis as any).document;
    if (!doc || doc.getElementById('no-focus-box')) return;
    const el = doc.createElement('style');
    el.id = 'no-focus-box';
    el.textContent = `*{ -webkit-tap-highlight-color: transparent !important; } *:focus, *:focus-visible, *:active { outline: none !important; box-shadow: none !important; } div[tabindex], [role="button"], a, button { outline: none !important; } input:focus, textarea:focus { outline: none !important; box-shadow: none !important; }`;
    doc.head.appendChild(el);
  }, []);

  // Load sesi: cloud dulu (APK), fallback AsyncStorage lokal (web/offline)
  useEffect(() => {
    (async () => {
      try {
        if (cloudActive) {
          const session = await cloudGetSessionUser();
          if (session) {
            const [profile, cloudHist] = await Promise.all([
              cloudLoadProfile(),
              cloudLoadHistory(),
            ]);
            const name = profile?.name || session.email.split('@')[0] || 'Orang Tua';
            const cloudBaby: AppBaby | null = profile?.baby_name || profile?.baby_dob
              ? { id: 'baby_cloud_primary', name: profile.baby_name ?? 'Si Kecil', dob: profile.baby_dob ?? undefined, gender: profile.baby_gender ?? undefined }
              : null;
            setUser({
              name,
              email: session.email,
              babyDob: profile?.baby_dob ?? undefined,
              babyName: profile?.baby_name ?? undefined,
              babyGender: profile?.baby_gender ?? undefined,
              babies: cloudBaby ? [cloudBaby] : [],
              activeBabyId: cloudBaby?.id,
              phone: profile?.phone ?? undefined,
              address: profile?.address ?? undefined,
            });
            if (cloudHist.length > 0) {
              setHistory(
                cloudHist.map((r) => ({
                  id: r.id ?? String(Date.now()),
                  kind: (r.kind === 'cry' ? 'cry' : 'diagnosis') as HistoryKind,
                  conditionName: r.condition_name,
                  description: r.description ?? '',
                  severity: r.severity ?? 'ringan',
                  emoji: r.emoji ?? '📝',
                  date: r.entry_date,
                  matchedSymptoms: r.matched_symptoms ?? 0,
                  symptomIds: r.symptom_ids ?? undefined,
                  symptomNames: r.symptom_names ?? undefined,
                  guidance: r.guidance ?? undefined,
                  doctorWhen: r.doctor_when ?? undefined,
                  cryLabel: r.cry_label ?? undefined,
                  cryMeaning: r.cry_meaning ?? undefined,
                  confidence: r.confidence ?? undefined,
                  babyId: (r as any).baby_id ?? undefined,
                  babyName: (r as any).baby_name ?? undefined,
                }))
              );
            } else {
              const h = await DB.loadHistory(session.email);
              setHistory(h);
            }
            setRoute({ name: 'main', tab: 'home' });
            return;
          }
        }
        const email = await DB.getCurrentEmail();
        if (email) {
          const dbUser = await DB.findUserByEmail(email);
          if (dbUser) {
            setUser(toAppUser(dbUser));
            const h = await DB.loadHistory(email);
            setHistory(h);
            setRoute({ name: 'main', tab: 'home' });
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // splash 2.4 detik, lalu cek loading
  const [splashDone, setSplashDone] = useState(false);
  useEffect(() => {
    if (!loading && splashDone && route.name === 'splash') setRoute({ name: 'onboarding' });
  }, [loading, splashDone]);

  const goMain = (tab: TabKey = 'home') => setRoute({ name: 'main', tab });

  const handleLogin = async (email: string, password: string) => {
    const clean = email.trim().toLowerCase();
    // 1) Cloud dulu (APK + env terisi)
    if (cloudActive) {
      const res = await cloudSignIn(clean, password);
      if (res.ok && res.userId) {
        const profile = await cloudLoadProfile();
        const name = profile?.name || clean.split('@')[0] || 'Orang Tua';
        const loginDbUser: DB.DbUser = {
          id: res.userId,
          name,
          email: clean,
          babyDob: profile?.baby_dob ?? undefined,
          babyName: profile?.baby_name ?? undefined,
          babyGender: (profile?.baby_gender as 'L' | 'P' | undefined) ?? undefined,
          phone: profile?.phone ?? undefined,
          address: profile?.address ?? undefined,
          provider: 'email',
          createdAt: new Date().toISOString(),
          researchConsent: profile?.research_consent ?? false,
        };
        await DB.upsertUser(loginDbUser);
        await DB.setCurrentEmail(clean);
        setUser(toAppUser(DB.ensureBabies(loginDbUser)));
        const cloudHist = await cloudLoadHistory();
        if (cloudHist.length > 0) {
          setHistory(
            cloudHist.map((r) => ({
              id: r.id ?? String(Date.now()),
              kind: (r.kind === 'cry' ? 'cry' : 'diagnosis') as HistoryKind,
              conditionName: r.condition_name,
              description: r.description ?? '',
              severity: r.severity ?? 'ringan',
              emoji: r.emoji ?? '📝',
              date: r.entry_date,
              matchedSymptoms: r.matched_symptoms ?? 0,
              symptomIds: r.symptom_ids ?? undefined,
              symptomNames: r.symptom_names ?? undefined,
              guidance: r.guidance ?? undefined,
              doctorWhen: r.doctor_when ?? undefined,
              cryLabel: r.cry_label ?? undefined,
              cryMeaning: r.cry_meaning ?? undefined,
              confidence: r.confidence ?? undefined,
              babyId: (r as any).baby_id ?? undefined,
              babyName: (r as any).baby_name ?? undefined,
            }))
          );
        } else {
          const h = await DB.loadHistory(clean);
          setHistory(h);
        }
        goMain('home');
        return;
      }
      // cloud aktif tapi gagal (password salah / belum daftar) -> tampilkan pesan, jangan fallback lokal
      if (res.reason === 'error') {
        setLoginError(res.message ?? 'Login gagal. Coba lagi.');
        setRoute({ name: 'login' });
        return;
      }
    }
    // 2) Fallback lokal (web/Vercel, atau cloud mati)
    const dbUser = await DB.findUserByEmail(clean);
    if (!dbUser) {
      setLoginError('Akun tidak ditemukan. Silakan Sign Up terlebih dahulu.');
      setRoute({ name: 'login' });
      return;
    }
    // migrasi: akun lama yang belum punya password -> simpan password pertama sebagai password
    if (!dbUser.password) {
      await DB.upsertUser({ ...dbUser, password });
      dbUser.password = password;
    }
    if (dbUser.password !== password) {
      setLoginError('Password salah. Coba lagi.');
      setRoute({ name: 'login' });
      return;
    }
    await DB.setCurrentEmail(dbUser.email);
    setUser(toAppUser(dbUser));
    const h = await DB.loadHistory(dbUser.email);
    setHistory(h);
    goMain('home');
  };

  const handleSaveProfile = async (data: Partial<{ name: string; babyName: string; babyDob: string; babyGender: string; phone: string; address: string }>) => {
    if (!user?.email) return;
    const dbUser = await DB.findUserByEmail(user.email);
    if (!dbUser) return;
    const migrated = DB.ensureBabies(dbUser);
    // edit profil bayi = edit bayi aktif (agar kembar tidak ketuker)
    let babies = migrated.babies ?? [];
    const activeId = migrated.activeBabyId ?? babies[0]?.id;
    if ((data.babyName !== undefined || data.babyDob !== undefined || data.babyGender !== undefined) && activeId) {
      babies = babies.map((b) =>
        b.id === activeId
          ? {
              ...b,
              name: data.babyName ?? b.name,
              dob: data.babyDob ?? b.dob,
              gender: (data.babyGender as 'L' | 'P' | undefined) ?? b.gender,
            }
          : b
      );
    }
    const updated: DB.DbUser = { ...migrated, ...data, babies, activeBabyId: activeId } as DB.DbUser;
    await DB.upsertUser(updated);
    // dual-write ke cloud (APK): password TIDAK pernah dikirim, hanya profil bayi aktif
    if (cloudActive) {
      const session = await cloudGetSessionUser();
      if (session) {
        const active = DB.getActiveBaby(updated);
        await cloudUpsertProfile({
          user_id: session.id,
          name: updated.name,
          baby_name: active?.name ?? (updated as any).babyName ?? null,
          baby_dob: active?.dob ?? updated.babyDob ?? null,
          baby_gender: active?.gender ?? (updated as any).babyGender ?? null,
          phone: (updated as any).phone ?? null,
          address: (updated as any).address ?? null,
        });
      }
    }
    setUser(toAppUser(updated));
  };

  const handleSelectBaby = async (babyId: string) => {
    if (!user?.email) return;
    const dbUser = await DB.findUserByEmail(user.email);
    if (!dbUser) return;
    const migrated = DB.ensureBabies(dbUser);
    if (!migrated.babies?.some((b) => b.id === babyId)) return;
    const updated: DB.DbUser = { ...migrated, activeBabyId: babyId };
    await DB.upsertUser(updated);
    setUser(toAppUser(updated));
  };

  const handleAddBaby = async (name: string, dob?: string, gender?: 'L' | 'P') => {
    if (!user?.email) return null;
    const dbUser = await DB.findUserByEmail(user.email);
    if (!dbUser) return null;
    const migrated = DB.ensureBabies(dbUser);
    const baby: DB.Baby = { id: `baby_${Date.now()}`, name: name.trim() || `Bayi ${(migrated.babies ?? []).length + 1}`, dob, gender };
    const updated: DB.DbUser = {
      ...migrated,
      babies: [...(migrated.babies ?? []), baby],
      activeBabyId: baby.id,
    };
    await DB.upsertUser(updated);
    setUser(toAppUser(updated));
    return baby.id;
  };

  const handleDeleteBaby = async (babyId: string) => {
    if (!user?.email) return;
    const dbUser = await DB.findUserByEmail(user.email);
    if (!dbUser) return;
    const migrated = DB.ensureBabies(dbUser);
    const babies = (migrated.babies ?? []).filter((b) => b.id !== babyId);
    if (babies.length === 0) return; // minimal 1 bayi
    const updated: DB.DbUser = {
      ...migrated,
      babies,
      activeBabyId: migrated.activeBabyId === babyId ? babies[0].id : migrated.activeBabyId,
    };
    await DB.upsertUser(updated);
    setUser(toAppUser(updated));
  };

  const handleRegister = async (parentName: string, babyName: string, email: string, babyDob: string, password: string, researchConsent: boolean) => {
    const clean = email.trim().toLowerCase();
    // 1) Cloud dulu (APK + env terisi): Supabase Auth jadi sumber kebenaran password
    if (cloudActive) {
      const res = await cloudSignUp(clean, password);
      if (!res.ok) {
        setLoginError(res.reason === 'error' ? (res.message ?? 'Registrasi gagal. Coba lagi.') : 'Registrasi gagal. Coba lagi.');
        setRoute({ name: 'register' });
        return;
      }
      const userId = res.userId ?? clean;
      if (res.userId) {
        await cloudUpsertProfile({
          user_id: res.userId,
          name: parentName,
          baby_name: babyName,
          baby_dob: babyDob || null,
          research_consent: researchConsent,
        });
      }
      const firstBaby: DB.Baby = { id: `baby_${Date.now()}`, name: babyName, dob: babyDob || undefined };
      const cloudDbUser: DB.DbUser = {
        id: userId,
        name: parentName,
        email: clean,
        babyDob,
        babyName,
        babies: [firstBaby],
        activeBabyId: firstBaby.id,
        provider: 'email',
        createdAt: new Date().toISOString(),
        researchConsent,
        researchConsentAt: researchConsent ? new Date().toISOString() : undefined,
      };
      await DB.upsertUser(cloudDbUser);
      await DB.setCurrentEmail(clean);
      setUser(toAppUser(cloudDbUser));
      setHistory([]);
      await emailService.sendWelcome(clean, parentName, 'email');
      goMain('home');
      return;
    }
    // 2) Fallback lokal (web/Vercel, atau cloud mati)
    const existing = await DB.findUserByEmail(clean);
    if (existing) {
      setLoginError('Email sudah terdaftar. Silakan Sign In.');
      setRoute({ name: 'login' });
      return;
    }
    const firstBabyLocal: DB.Baby = { id: `baby_${Date.now()}`, name: babyName, dob: babyDob || undefined };
    const newUser: import('./src/storage/db').DbUser = {
      id: String(Date.now()),
      name: parentName,
      email: clean,
      babyDob,
      babyName,
      babies: [firstBabyLocal],
      activeBabyId: firstBabyLocal.id,
      password,
      provider: 'email',
      createdAt: new Date().toISOString(),
      researchConsent,
      researchConsentAt: researchConsent ? new Date().toISOString() : undefined,
    };
    await DB.upsertUser(newUser);
    await DB.setCurrentEmail(clean);
    setUser(toAppUser(newUser));
    setHistory([]);
    await emailService.sendWelcome(clean, parentName, 'email');
    goMain('home');
  };



  const handleLogout = async () => {
    if (cloudActive) await cloudSignOut();
    await DB.setCurrentEmail(null);
    setUser(null);
    setHistory([]);
    setRoute({ name: 'login' });
  };

  const addHistory = async (entry: Omit<DiagnosisHistoryEntry, 'id' | 'date' | 'kind'> & { kind?: HistoryKind }) => {
    const active = getActiveBabyOf(user);
    const newEntry: DiagnosisHistoryEntry = {
      kind: 'diagnosis',
      ...entry,
      babyId: entry.babyId ?? active?.id,
      babyName: entry.babyName ?? active?.name,
      id: String(Date.now()),
      date: formatDateTime(new Date()),
    };
    const next = [newEntry, ...history].slice(0, 20);
    setHistory(next);
    if (user?.email) await DB.saveHistory(user.email, next);
    // Backup cloud (APK): riwayat ikut tersimpan di Supabase agar tidak hilang ganti HP
    if (cloudActive) {
      try {
        const session = await cloudGetSessionUser();
        if (session) {
          await cloudPushHistory({
            user_id: session.id,
            kind: newEntry.kind,
            condition_name: newEntry.conditionName,
            description: newEntry.description,
            severity: newEntry.severity,
            emoji: newEntry.emoji,
            entry_date: newEntry.date,
            matched_symptoms: newEntry.matchedSymptoms,
            symptom_ids: newEntry.symptomIds ?? null,
            symptom_names: newEntry.symptomNames ?? null,
            guidance: newEntry.guidance ?? null,
            doctor_when: newEntry.doctorWhen ?? null,
            cry_label: newEntry.cryLabel ?? null,
            cry_meaning: newEntry.cryMeaning ?? null,
            confidence: newEntry.confidence ?? null,
            baby_id: newEntry.babyId ?? null,
            baby_name: newEntry.babyName ?? null,
          } as any);
        }
      } catch (e) {
        console.warn('[BabyOps] Gagal backup history ke cloud:', e);
      }
    }
    // Riset opt-in: simpan gejala + hasil diagnosa anonim (TANPA nama/email)
    try {
      const dbUser = user?.email ? await DB.findUserByEmail(user.email) : null;
      if (dbUser?.researchConsent) {
        const activeBaby = DB.getActiveBaby(dbUser);
        await DB.addResearch({
          type: 'diagnosis',
          appVersion: '1.0.0',
          symptomIds: entry.symptomIds ?? [],
          condition: entry.conditionName,
          babyAgeMonths: parseInt(getAgeMonths(activeBaby?.dob ?? dbUser.babyDob), 10) || 0,
        });
      }
    } catch (e) {
      console.warn('[BabyOps] Gagal simpan sampel riset diagnosa:', e);
    }
  };

  const wrapWeb = (content: React.ReactNode) => {
    if (Platform.OS !== 'web') return content;
    return <View style={styles.webOuter}><View style={styles.webPhone}><View style={styles.webPhoneInner}>{content}</View></View></View>;
  };

  if (route.name === 'splash' || !fontsLoaded) {
    return wrapWeb(
      <ScreenView style={styles.safe}>
        <SplashScreen onFinish={() => setSplashDone(true)} />
        <StatusBar style="light" />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={colors.white} />
            <Text style={styles.loadingText}>Memuat data...</Text>
          </View>
        )}
      </ScreenView>
    );
  }

  if (route.name === 'onboarding') {
    return wrapWeb(
      <ScreenView style={styles.safe}>
        <OnboardingScreen onFinish={() => setRoute({ name: 'login' })} />
        <StatusBar style="light" />
      </ScreenView>
    );
  }

  if (route.name === 'login') {
    return wrapWeb(
      <ScreenView style={styles.safe}>
        <LoginScreen
          onLogin={handleLogin}
          onGoRegister={() => { setLoginError(''); setRoute({ name: 'register' }); }}
          onForgot={() => { setLoginError(''); setRoute({ name: 'forgot' }); }}
          initialError={loginError}
        />
        <StatusBar style="light" />
      </ScreenView>
    );
  }

  if (route.name === 'register') {
    return wrapWeb(
      <ScreenView style={styles.safe}>
        <RegisterScreen onRegister={handleRegister} onGoLogin={() => { setLoginError(''); setRoute({ name: 'login' }); }} />
        <StatusBar style="light" />
      </ScreenView>
    );
  }

  if (route.name === 'forgot') {
    return wrapWeb(
      <ScreenView style={styles.safe}>
        <ForgotPasswordScreen onBack={() => { setLoginError(''); setRoute({ name: 'login' }); }} onResetSuccess={(email) => { setLoginError('Password berhasil direset. Silakan Sign In.'); setRoute({ name: 'login' }); }} />
        <StatusBar style="light" />
      </ScreenView>
    );
  }

  if (route.name === 'record') {
    return wrapWeb(
      <ScreenView style={styles.safe}>
        <RecordScreen
          onBack={() => goMain('home')}
          onResult={(prediction) => setRoute({ name: 'result', prediction })}
        />
        <StatusBar style="light" />
      </ScreenView>
    );
  }

  const addCryHistory = async (prediction: CryPrediction) => {
    const { dunstanClasses } = await import('./src/data/dunstan');
    const result = dunstanClasses[prediction.label];
    await addHistory({
      kind: 'cry',
      conditionName: `"${prediction.label}" — ${result.meaning}`,
      description: result.description,
      severity: 'ringan',
      emoji: result.emoji,
      matchedSymptoms: 0,
      guidance: result.actions,
      doctorWhen: 'Jika bayi tampak sangat kesakitan, sulit bernapas, muntah berulang, atau keluhan tidak membaik.',
      cryLabel: prediction.label,
      cryMeaning: result.meaning,
      confidence: Math.round(prediction.confidence * 100),
    });
    goMain('home');
  };

  if (route.name === 'result') {
    return wrapWeb(
      <ScreenView style={styles.safe}>
        <ResultScreen
          prediction={route.prediction}
          onBack={() => setRoute({ name: 'record' })}
          onHome={() => addCryHistory(route.prediction)}
        />
        <StatusBar style="light" />
      </ScreenView>
    );
  }

  const activeBaby = getActiveBabyOf(user);
  const babyAge = getAgeMonths(activeBaby?.dob ?? user?.babyDob);
  const visibleHistory = activeBaby
    ? history.filter((h) => !h.babyId || h.babyId === activeBaby.id)
    : history;
  return wrapWeb(
    <ScreenView style={styles.safe}>
      {route.tab === 'home' && (
        <HomeScreen
          userName={user?.name}
          babyName={activeBaby?.name ?? user?.babyName}
          babyAge={babyAge}
          history={visibleHistory}
          babies={user?.babies ?? []}
          activeBabyId={activeBaby?.id}
          onSelectBaby={handleSelectBaby}
          onNavigate={(tab) => goMain(tab)}
          onRecord={() => setRoute({ name: 'record' })}
        />
      )}
      {route.tab === 'diagnosis' && <DiagnosisScreen onSaveHistory={addHistory} />}
      {route.tab === 'education' && <EducationScreen />}
      {route.tab === 'profile' && (
        <ProfileScreen
          user={user}
          babyAge={babyAge}
          historyCount={visibleHistory.length}
          onLogout={handleLogout}
          onLogin={() => setRoute({ name: 'login' })}
          onSave={handleSaveProfile}
          onSelectBaby={handleSelectBaby}
          onAddBaby={handleAddBaby}
          onDeleteBaby={handleDeleteBaby}
        />
      )}
      <BottomNav
        active={route.tab}
        onChange={(tab) => goMain(tab)}
        onRecord={() => setRoute({ name: 'record' })}
      />
      <StatusBar style="dark" />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    width: '100%' as any,
    height: '100%' as any,
    minHeight: 0 as any,
    display: 'flex' as any,
    flexDirection: 'column' as any,
    backgroundColor: colors.primaryDarker,
  } as any,
  // Web: pakai dvh biar tidak kepotong toolbar browser HP, center di desktop tapi fullscreen di HP
  webOuter: {
    flex: 1,
    backgroundColor: colors.primaryDarker,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    minHeight: '100dvh' as any,
    height: '100dvh' as any,
    width: '100%' as any,
  } as any,
  webPhone: {
    width: '100%',
    maxWidth: 390 as any,
    height: '100dvh' as any,
    maxHeight: '100dvh' as any,
    minHeight: '100dvh' as any,
    backgroundColor: colors.primaryDarker,
    overflow: 'hidden',
    display: 'flex' as any,
    flexDirection: 'column' as any,
    borderWidth: 0,
    borderRadius: 0,
    boxShadow: 'none' as any,
    elevation: 0,
  } as any,
  webPhoneInner: {
    flex: 1,
    display: 'flex' as any,
    flexDirection: 'column' as any,
    minHeight: 0 as any,
    backgroundColor: colors.primaryDarker,
  } as any,
  loadingOverlay: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  loadingText: { color: colors.white, fontSize: 12, fontWeight: '600' },
});
