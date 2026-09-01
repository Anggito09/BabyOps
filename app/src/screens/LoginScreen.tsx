import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { colors, gradients, spacing } from '../theme/tokens';

WebBrowser.maybeCompleteAuthSession();

interface Props {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: (email: string) => void;
  onGoRegister: () => void;
  onForgot?: () => void;
  initialError?: string;
}

export function LoginScreen({ onLogin, onGoogleLogin, onGoRegister, onForgot, initialError = '' }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(initialError);
  const [showGoogleSheet, setShowGoogleSheet] = useState(false);
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
  // Jika masih placeholder, tombol akan langsung mock tanpa panggil Google (hindari Error 401 invalid_client)
  const GOOGLE_CLIENT_ID = '1080000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com';
  const isPlaceholder = GOOGLE_CLIENT_ID.includes('xxxxxxxx') || GOOGLE_CLIENT_ID.includes('1080000000000');
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.idToken) {
      onGoogleLogin('google.user@gmail.com');
    }
  }, [response]);

  const handleGoogle = async () => {
    // Simulasi alur Google: tampilkan picker akun Google dulu, baru auth
    if (isPlaceholder) {
      setShowGoogleSheet(true);
      return;
    }
    try {
      if (request) {
        const res = await promptAsync();
        if (res?.type === 'success') return;
      }
    } catch {}
    setShowGoogleSheet(true);
  };

  const pickGoogleAccount = (googleEmail: string) => {
    setShowGoogleSheet(false);
    onGoogleLogin(googleEmail);
  };

  const handle = () => {
    if (!email.includes('@') || password.length < 6) {
      setError('Email harus valid & password minimal 6 karakter.');
      return;
    }
    setError('');
    onLogin(email.trim().toLowerCase(), password);
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
            <Pressable onPress={() => (onForgot ? onForgot() : setError('Fitur reset password segera hadir.'))}><Text style={styles.forgot}>Forgot password?</Text></Pressable>
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

          <Pressable style={[styles.googleBtn, !request && { opacity: 0.95 }]} onPress={handleGoogle}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>Sign In with Google</Text>
          </Pressable>
          <Text style={styles.googleHint}>Pilih akun Google kamu — akan diminta lengkapi profil bayi jika baru</Text>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Don&apos;t have an account? </Text>
            <Pressable onPress={onGoRegister}><Text style={styles.bottomLink}>Sign Up</Text></Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {showGoogleSheet && (
        <View style={styles.sheetOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowGoogleSheet(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Pilih akun Google</Text>
              <Text style={styles.sheetSub}>Menghubungkan ke Google — pilih akun untuk melanjutkan</Text>
            </View>
            {[
              { email: 'google@babyops.id', name: 'Akun Google Saya' },
              { email: 'demo@babyops.id', name: 'Demo BabyOps' },
            ].map((acc) => (
              <Pressable key={acc.email} style={styles.accountRow} onPress={() => pickGoogleAccount(acc.email)}>
                <View style={styles.accountAvatar}><Text style={styles.accountInitial}>{acc.name[0].toUpperCase()}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountName}>{acc.name}</Text>
                  <Text style={styles.accountEmail}>{acc.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8AA0B8" />
              </Pressable>
            ))}
            <Text style={styles.sheetHint}>Mode demo: akun Google asli akan muncul otomatis setelah kamu setup Client ID di Google Cloud. Sementara ini pilih demo di atas.</Text>
            <Pressable style={styles.sheetCancel} onPress={() => setShowGoogleSheet(false)}><Text style={styles.sheetCancelText}>Batal</Text></Pressable>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingTop: 48, paddingBottom: 32, alignItems: 'center' },
  logo: { width: 160, height: 42, tintColor: colors.white },
  hero: { width: 180, height: 150, marginTop: 8 },
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
  sheetOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 28 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D6E6FF', alignSelf: 'center', marginBottom: 14 },
  sheetHeader: { marginBottom: 14 },
  sheetTitle: { fontSize: 16, fontWeight: '900', color: colors.ink },
  sheetSub: { fontSize: 12, color: colors.muted, marginTop: 4 },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EDF2F4' },
  accountAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EAF0F7', alignItems: 'center', justifyContent: 'center' },
  accountInitial: { color: colors.primary, fontWeight: '900' },
  accountName: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  accountEmail: { color: colors.muted, fontSize: 11 },
  sheetCancel: { marginTop: 14, height: 44, borderRadius: 12, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  sheetCancelText: { color: colors.ink, fontWeight: '700' },
  sheetHint: { color: colors.muted, fontSize: 10, textAlign: 'center', marginTop: 8, lineHeight: 14 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  bottomText: { color: '#1A2B4A', fontSize: 12 },
  bottomLink: { color: '#2FA0E5', fontSize: 12, fontWeight: '800' },
});
