import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, radius, spacing } from '../theme/tokens';

interface Props {
  onLogin: (email: string) => void;
  onGoRegister: () => void;
}

export function LoginScreen({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

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
      <View style={styles.top}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.tagline}>Masuk untuk melanjutkan</Text>
        <View style={styles.heroCircle}>
          <Ionicons name="heart" size={28} color={colors.primary} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Masuk</Text>
        <Text style={styles.sub}>Selamat datang kembali, Parents!</Text>

        <View style={styles.field}>
          <Ionicons name="mail-outline" size={18} color={colors.muted} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!show}
            style={styles.input}
          />
          <Pressable onPress={() => setShow(!show)}><Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.muted} /></Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={handle} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Masuk</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </Pressable>

        <Pressable style={styles.ghostBtn} onPress={onGoRegister}>
          <Text style={styles.ghostText}>Belum punya akun? <Text style={styles.link}>Daftar</Text></Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 60 },
  top: { alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.lg, gap: 10 },
  logoImage: { width: 140, height: 36, tintColor: colors.white },
  tagline: { color: '#D5F3FF', fontSize: 11, letterSpacing: 1, marginTop: 2 },
  heroCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    gap: 14,
  },
  title: { fontSize: 24, fontWeight: '900', color: colors.ink },
  sub: { fontSize: 13, color: colors.muted, marginBottom: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#DDE8ED',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F8FBFD',
  },
  input: { flex: 1, color: colors.ink, fontSize: 14 },
  error: { color: colors.danger, fontSize: 12, marginTop: -4 },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  primaryText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  ghostBtn: { alignItems: 'center', paddingVertical: 8 },
  ghostText: { color: colors.muted, fontSize: 13 },
  link: { color: colors.primary, fontWeight: '800' },
});
