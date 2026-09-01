import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { colors, gradients, spacing } from '../theme/tokens';

WebBrowser.maybeCompleteAuthSession();

interface Props {
  onLogin: (email: string) => void;
  onGoRegister: () => void;
}

export function LoginScreen({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  // Animasi eye-catching
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

  // Google OAuth — ganti clientId dengan milikmu di Google Cloud Console
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '1080000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
    // webClientId / iosClientId / androidClientId opsional, isi jika sudah buat di console
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.idToken) {
      // TODO: verifikasi idToken di backend, ambil email dari token
      // Untuk sekarang mock sukses dengan email Google
      onLogin('google.user@gmail.com');
    }
  }, [response]);

  const handleGoogle = async () => {
    try {
      if (request) {
        const res = await promptAsync();
        if (res?.type === 'success') return; // ditangani useEffect
      }
    } catch {}
    // Fallback mock — agar tetap bisa demo tanpa setup Google Cloud
    onLogin('google@babyops.id');
  };

  const handle = () => {
    if (!email.includes('@') || password.length < 6) {
      setError('Email harus valid & password minimal 6 karakter.');
      return;
    }
    setError('');
    onLogin(email);
  };

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <Animated.Image source={require('../../assets/auth-mother-signin.png')} style={[styles.hero, { transform: [{ translateY: float }] }]} resizeMode="contain" />

        <Text style={styles.title}>SIGN IN</Text>

        <Animated.View style={[styles.card, { opacity: cardFade, transform: [{ translateY: cardIn }] }]}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="mail" size={14} color="#7A8CA8" /></View>
            <TextInput
              placeholder="masukkan alamat email"
              placeholderTextColor="#8FA0B8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="lock-closed" size={14} color="#7A8CA8" /></View>
            <TextInput
              placeholder="masukkan password"
              placeholderTextColor="#8FA0B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!show}
              style={styles.input}
            />
            <Pressable onPress={() => setShow(!show)} hitSlop={8}><Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color="#7A8CA8" /></Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.row}>
            <Pressable onPress={() => setRemember(!remember)} style={styles.rememberRow}>
              <View style={[styles.checkbox, remember && styles.checkboxOn]}>{remember && <Ionicons name="checkmark" size={12} color={colors.white} />}</View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>
            <Pressable><Text style={styles.forgot}>Forgot password?</Text></Pressable>
          </View>

          <Pressable onPress={handle} style={styles.primaryWrap}>
            <LinearGradient colors={['#2FA0E5', '#0A5A8C']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.primary}>
              <Text style={styles.primaryText}>Sign In</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Sign In with</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={[styles.googleBtn, !request && { opacity: 0.95 }]} onPress={handleGoogle} disabled={!request && false}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>Sign In with Google</Text>
          </Pressable>
          <Text style={styles.googleHint}>*Tanpa setup Google Cloud, tombol akan mock login sebagai google@babyops.id</Text>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Don&apos;t have an account? </Text>
            <Pressable onPress={onGoRegister}><Text style={styles.bottomLink}>Sign Up</Text></Pressable>
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
  hero: { width: 280, height: 220, marginTop: 12 },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 8,
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
    gap: 10,
    shadowColor: '#0A3A5A',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  label: { color: '#1A2B4A', fontSize: 15, fontWeight: '800', marginTop: 4 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#7A8CA8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  rememberText: { color: '#2FA0E5', fontSize: 12, fontWeight: '600' },
  forgot: { color: '#E94A4A', fontSize: 12, fontWeight: '600' },
  primaryWrap: { borderRadius: 24, overflow: 'hidden', marginTop: 6, shadowColor: '#0A5A8C', shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  primary: { height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#8AA0B8' },
  dividerText: { color: '#6B7C93', fontSize: 11 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 46,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E6EDF3',
    shadowColor: '#0A3A5A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  googleG: { color: '#EA4335', fontSize: 18, fontWeight: '900' },
  googleText: { color: '#6B7C93', fontSize: 13, fontWeight: '600' },
  googleHint: { color: '#8AA0B8', fontSize: 10, textAlign: 'center', marginTop: -2 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  bottomText: { color: '#1A2B4A', fontSize: 12 },
  bottomLink: { color: '#2FA0E5', fontSize: 12, fontWeight: '800' },
});
