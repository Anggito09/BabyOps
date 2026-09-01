import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, radius, spacing } from '../theme/tokens';

interface Props {
  onRegister: (name: string, email: string) => void;
  onGoLogin: () => void;
}

export function RegisterScreen({ onRegister, onGoLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handle = () => {
    if (!name.trim() || !email.includes('@') || password.length < 6) {
      setError('Lengkapi nama, email valid & password ≥6 karakter.');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setError('');
    onRegister(name.trim(), email);
  };

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <View style={styles.top}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Baby</Text>
          <View style={styles.logoBaby}><Text>👶</Text></View>
          <Text style={styles.logoText}>ps</Text>
        </View>
        <Text style={styles.tagline}>Buat akun baru</Text>
        <View style={styles.heroCircle}>
          <Ionicons name="person-add" size={26} color={colors.primary} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Daftar</Text>
        <Text style={styles.sub}>Mulai pantau tumbuh kembang si kecil.</Text>

        <View style={styles.field}>
          <Ionicons name="person-outline" size={18} color={colors.muted} />
          <TextInput placeholder="Nama lengkap" placeholderTextColor={colors.muted} value={name} onChangeText={setName} style={styles.input} />
        </View>
        <View style={styles.field}>
          <Ionicons name="mail-outline" size={18} color={colors.muted} />
          <TextInput placeholder="Email" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        </View>
        <View style={styles.field}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
          <TextInput placeholder="Password" placeholderTextColor={colors.muted} value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        </View>
        <View style={styles.field}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
          <TextInput placeholder="Konfirmasi password" placeholderTextColor={colors.muted} value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.input} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={handle} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Daftar</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </Pressable>

        <Pressable style={styles.ghostBtn} onPress={onGoLogin}>
          <Text style={styles.ghostText}>Sudah punya akun? <Text style={styles.link}>Masuk</Text></Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 60 },
  top: { alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.lg, gap: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: colors.white, fontSize: 22, fontWeight: '900', letterSpacing: -1 },
  logoBaby: { width: 28, height: 28, borderRadius: radius.pill, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 },
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
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: '900', color: colors.ink },
  sub: { fontSize: 13, color: colors.muted, marginBottom: 4 },
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
  error: { color: colors.danger, fontSize: 12 },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  primaryText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  ghostBtn: { alignItems: 'center', paddingVertical: 8 },
  ghostText: { color: colors.muted, fontSize: 13 },
  link: { color: colors.primary, fontWeight: '800' },
});
