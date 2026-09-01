import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
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
import { BottomNav, TabKey } from './src/components/BottomNav';
import { colors } from './src/theme/tokens';
import { CryPrediction } from './src/model/cryClassifier';

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

  const goMain = (tab: TabKey = 'home') => setRoute({ name: 'main', tab });
  const handleLogin = (email: string) => {
    setUser({ name: email.split('@')[0], email });
    goMain('home');
  };
  const handleRegister = (name: string, email: string, babyDob: string) => {
    setUser({ name, email, babyDob });
    goMain('home');
  };
  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    setRoute({ name: 'login' });
  };

  const addHistory = (entry: Omit<DiagnosisHistoryEntry, 'id' | 'date'>) => {
    const newEntry: DiagnosisHistoryEntry = {
      ...entry,
      id: String(Date.now()),
      date: new Date().toLocaleDateString('id-ID'),
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 10));
  };

  if (route.name === 'splash') {
    return (
      <SafeAreaView style={styles.safe}>
        <SplashScreen onFinish={() => setRoute({ name: 'onboarding' })} />
        <StatusBar style="light" />
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
        <LoginScreen onLogin={handleLogin} onGoRegister={() => setRoute({ name: 'register' })} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (route.name === 'register') {
    return (
      <SafeAreaView style={styles.safe}>
        <RegisterScreen onRegister={handleRegister} onGoLogin={() => setRoute({ name: 'login' })} />
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
});
