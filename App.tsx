import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
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
import { colors } from './src/theme/tokens';
import { CryPrediction } from './src/model/cryClassifier';
import * as DB from './src/storage/db';
import { emailService } from './src/services/emailService';

export interface DiagnosisHistoryEntry {
  id: string;
  conditionName: string;
  description: string;
  severity: string;
  emoji: string;
  date: string;
  matchedSymptoms: number;
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
  const [user, setUser] = useState<{ name: string; email: string; babyDob?: string } | null>(null);
  const [history, setHistory] = useState<DiagnosisHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Load dari AsyncStorage — data tidak hilang walau app restart
  useEffect(() => {
    (async () => {
      try {
        const email = await DB.getCurrentEmail();
        if (email) {
          const dbUser = await DB.findUserByEmail(email);
          if (dbUser) {
            setUser({ name: dbUser.name, email: dbUser.email, babyDob: dbUser.babyDob });
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
    const dbUser = await DB.findUserByEmail(email);
    if (!dbUser) {
      setLoginError('Akun tidak ditemukan. Silakan Sign Up terlebih dahulu.');
      setRoute({ name: 'login' });
      return;
    }
    if (dbUser.password && dbUser.password !== password) {
      setLoginError('Password salah. Coba lagi.');
      setRoute({ name: 'login' });
      return;
    }
    await DB.setCurrentEmail(dbUser.email);
    setUser({ name: dbUser.name, email: dbUser.email, babyDob: dbUser.babyDob });
    const h = await DB.loadHistory(dbUser.email);
    setHistory(h);
    goMain('home');
  };

  const handleRegister = async (name: string, email: string, babyDob: string) => {
    const existing = await DB.findUserByEmail(email);
    if (existing) {
      setLoginError('Email sudah terdaftar. Silakan Sign In.');
      setRoute({ name: 'login' });
      return;
    }
    const newUser: import('./src/storage/db').DbUser = {
      id: String(Date.now()),
      name,
      email: email.toLowerCase(),
      babyDob,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };
    await DB.upsertUser(newUser);
    await DB.setCurrentEmail(newUser.email);
    setUser({ name, email: newUser.email, babyDob });
    setHistory([]);
    await emailService.sendWelcome(newUser.email, name, 'email');
    goMain('home');
  };



  const handleLogout = async () => {
    await DB.setCurrentEmail(null);
    setUser(null);
    setHistory([]);
    setRoute({ name: 'login' });
  };

  const addHistory = async (entry: Omit<DiagnosisHistoryEntry, 'id' | 'date'>) => {
    const newEntry: DiagnosisHistoryEntry = {
      ...entry,
      id: String(Date.now()),
      date: new Date().toLocaleDateString('id-ID'),
    };
    const next = [newEntry, ...history].slice(0, 10);
    setHistory(next);
    if (user?.email) await DB.saveHistory(user.email, next);
  };

  if (route.name === 'splash') {
    return (
      <SafeAreaView style={styles.safe}>
        <SplashScreen onFinish={() => setSplashDone(true)} />
        <StatusBar style="light" />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={colors.white} />
            <Text style={styles.loadingText}>Memuat data...</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  if (route.name === 'onboarding') {
    return (
      <SafeAreaView style={styles.safe}>
        <OnboardingScreen onFinish={() => setRoute({ name: 'login' })} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (route.name === 'login') {
    return (
      <SafeAreaView style={styles.safe}>
        <LoginScreen
          onLogin={handleLogin}
          onGoRegister={() => { setLoginError(''); setRoute({ name: 'register' }); }}
          onForgot={() => { setLoginError(''); setRoute({ name: 'forgot' }); }}
          initialError={loginError}
        />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (route.name === 'register') {
    return (
      <SafeAreaView style={styles.safe}>
        <RegisterScreen onRegister={handleRegister} onGoLogin={() => { setLoginError(''); setRoute({ name: 'login' }); }} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (route.name === 'forgot') {
    return (
      <SafeAreaView style={styles.safe}>
        <ForgotPasswordScreen onBack={() => { setLoginError(''); setRoute({ name: 'login' }); }} onResetSuccess={(email) => { setLoginError('Password berhasil direset. Silakan Sign In.'); setRoute({ name: 'login' }); }} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (route.name === 'record') {
    return (
      <SafeAreaView style={styles.safe}>
        <RecordScreen
          onBack={() => goMain('home')}
          onResult={(prediction) => setRoute({ name: 'result', prediction })}
        />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (route.name === 'result') {
    return (
      <SafeAreaView style={styles.safe}>
        <ResultScreen
          prediction={route.prediction}
          onBack={() => setRoute({ name: 'record' })}
          onHome={() => goMain('home')}
        />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  const babyAge = getAgeMonths(user?.babyDob);
  return (
    <SafeAreaView style={styles.safe}>
      {route.tab === 'home' && <HomeScreen userName={user?.name} babyAge={babyAge} history={history} onNavigate={(tab) => goMain(tab)} onRecord={() => setRoute({ name: 'record' })} />}
      {route.tab === 'diagnosis' && <DiagnosisScreen onSaveHistory={addHistory} />}
      {route.tab === 'education' && <EducationScreen />}
      {route.tab === 'profile' && <ProfileScreen user={user} babyAge={babyAge} historyCount={history.length} onLogout={handleLogout} onLogin={() => setRoute({ name: 'login' })} />}
      <BottomNav
        active={route.tab}
        onChange={(tab) => goMain(tab)}
        onRecord={() => setRoute({ name: 'record' })}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primaryDarker,
  },
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
