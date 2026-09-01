import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CalendarPicker } from '../components/CalendarPicker';
import { colors, gradients } from '../theme/tokens';

interface Props {
  onRegister: (name: string, email: string, babyDob: string) => void;
  onGoLogin: () => void;
}

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function RegisterScreen({ onRegister, onGoLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [babyDate, setBabyDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const babyDob = babyDate ? formatDate(babyDate) : '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const float = React.useRef(new Animated.Value(0)).current;
  const cardIn = React.useRef(new Animated.Value(40)).current;
  const cardFade = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -8, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
    Animated.parallel([
      Animated.timing(cardIn, { toValue: 0, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(cardFade, { toValue: 1, duration: 650, useNativeDriver: true }),
    ]).start();
  }, []);

  const handle = () => {
    if (!name.trim() || !email.includes('@') || !babyDate || password.length < 6) {
      setError('Lengkapi nama, email valid, tanggal lahir bayi & password ≥6 karakter.');
      return;
    }
    if (babyDate > new Date()) {
      setError('Tanggal lahir tidak boleh di masa depan.');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setError('');
    onRegister(name.trim(), email, formatDate(babyDate));
  };

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <Animated.Image source={require('../../assets/auth-mother-signup.png')} style={[styles.hero, { transform: [{ translateY: float }] }]} resizeMode="contain" />

        <Text style={styles.title}>SIGN UP</Text>

        <Animated.View style={[styles.card, { opacity: cardFade, transform: [{ translateY: cardIn }] }]}>
          <Text style={styles.label}>Nama</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="person" size={14} color="#7A8CA8" /></View>
            <TextInput placeholder="masukkan nama" placeholderTextColor="#8FA0B8" value={name} onChangeText={setName} style={styles.input} />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="mail" size={14} color="#7A8CA8" /></View>
            <TextInput placeholder="masukkan alamat email" placeholderTextColor="#8FA0B8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
          </View>

          <Text style={styles.label}>Tanggal Lahir Bayi</Text>
          <Pressable onPress={() => setShowPicker(!showPicker)} style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="calendar" size={14} color="#7A8CA8" /></View>
            <Text style={[styles.input, !babyDate && { color: '#8FA0B8' }]}>{babyDate ? formatDate(babyDate) : 'Pilih tanggal lahir'}</Text>
            <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={16} color="#7A8CA8" />
          </Pressable>
          {showPicker && (
            <CalendarPicker
              value={babyDate}
              maxDate={new Date()}
              minDate={new Date(2020, 0, 1)}
              onChange={(d) => { setBabyDate(d); setShowPicker(false); }}
            />
          )}

          <Text style={styles.label}>Password</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="lock-closed" size={14} color="#7A8CA8" /></View>
            <TextInput placeholder="masukkan password" placeholderTextColor="#8FA0B8" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="lock-closed" size={14} color="#7A8CA8" /></View>
            <TextInput placeholder="masukkan confirm password" placeholderTextColor="#8FA0B8" value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.input} />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable onPress={handle} style={styles.primaryWrap}>
            <LinearGradient colors={['#2FA0E5', '#0A5A8C']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.primary}>
              <Text style={styles.primaryText}>Sign Up</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account? </Text>
            <Pressable onPress={onGoLogin}><Text style={styles.bottomLink}>Sign In</Text></Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingTop: 48, paddingBottom: 32, alignItems: 'center' },
  logo: { width: 160, height: 42, tintColor: colors.white },
  hero: { width: 280, height: 220, marginTop: 8 },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 14,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  card: {
    width: '92%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 22,
    gap: 8,
    shadowColor: '#0A3A5A',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  label: { color: '#1A2B4A', fontSize: 14, fontWeight: '800', marginTop: 2 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E6EDF3',
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#0A3A5A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  pillIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAF0F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: { flex: 1, color: colors.ink, fontSize: 13 },
  error: { color: colors.danger, fontSize: 12 },
  primaryWrap: { borderRadius: 24, overflow: 'hidden', marginTop: 8, shadowColor: '#0A5A8C', shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  primary: { height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  bottomText: { color: '#1A2B4A', fontSize: 12 },
  bottomLink: { color: '#2FA0E5', fontSize: 12, fontWeight: '800' },
});
