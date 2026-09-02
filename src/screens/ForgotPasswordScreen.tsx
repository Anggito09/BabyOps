import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '../theme/tokens';
import { emailService } from '../services/emailService';
import * as DB from '../storage/db';

interface Props {
  onBack: () => void;
  onResetSuccess: (email: string) => void;
}

export function ForgotPasswordScreen({ onBack, onResetSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [expectedCode, setExpectedCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  const requestCode = async () => {
    const user = await DB.findUserByEmail(email.trim());
    if (!user) {
      setError('Email tidak terdaftar di BabyOps.');
      return;
    }
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    setExpectedCode(generated);
    await emailService.sendResetCode(user.email, user.name, generated);
    setInfo(`Kode reset dikirim ke ${user.email}. (Mode demo: kode tercatat di outbox console)`);
    setError('');
    setStep(2);
  };

  const verifyCode = () => {
    if (code.trim() !== expectedCode) {
      setError('Kode salah. Periksa kembali email Anda.');
      return;
    }
    setError('');
    setStep(3);
  };

  const resetPassword = async () => {
    if (newPass.length < 6) { setError('Password minimal 6 karakter.'); return; }
    if (newPass !== confirm) { setError('Konfirmasi password tidak cocok.'); return; }
    const user = await DB.findUserByEmail(email.trim());
    if (user) {
      await DB.upsertUser({ ...user, password: newPass });
      await emailService.sendPasswordChanged(user.email, user.name);
    }
    setError('');
    onResetSuccess(email.trim().toLowerCase());
  };

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>RESET PASSWORD</Text>
        <View style={styles.card}>
          <View style={styles.stepRow}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={[styles.stepDot, step >= s && styles.stepDotOn]} />
            ))}
          </View>

          {step === 1 && (
            <>
              <Text style={styles.label}>Email terdaftar</Text>
              <View style={styles.pill}>
                <View style={styles.pillIcon}><Ionicons name="mail" size={14} color="#7A8CA8" /></View>
                <TextInput placeholder="email@anda.com" placeholderTextColor="#8FA0B8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
              </View>
              <Text style={styles.hint}>Kode 6 digit akan dikirim ke email ini.</Text>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>Kode dari email</Text>
              <View style={styles.pill}>
                <View style={styles.pillIcon}><Ionicons name="key" size={14} color="#7A8CA8" /></View>
                <TextInput placeholder="6 digit" placeholderTextColor="#8FA0B8" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} style={styles.input} />
              </View>
              {info ? <Text style={styles.info}>{info}</Text> : null}
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.label}>Password baru</Text>
              <View style={styles.pill}>
                <View style={styles.pillIcon}><Ionicons name="lock-closed" size={14} color="#7A8CA8" /></View>
                <TextInput placeholder="min. 6 karakter" placeholderTextColor="#8FA0B8" value={newPass} onChangeText={setNewPass} secureTextEntry={!showNew} style={styles.input} />
                <Pressable onPress={() => setShowNew(!showNew)} hitSlop={8}><Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={18} color="#7A8CA8" /></Pressable>
              </View>
              <Text style={styles.label}>Konfirmasi password</Text>
              <View style={styles.pill}>
                <View style={styles.pillIcon}><Ionicons name="lock-closed" size={14} color="#7A8CA8" /></View>
                <TextInput placeholder="ulangi password" placeholderTextColor="#8FA0B8" value={confirm} onChangeText={setConfirm} secureTextEntry={!showConfirm} style={styles.input} />
                <Pressable onPress={() => setShowConfirm(!showConfirm)} hitSlop={8}><Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color="#7A8CA8" /></Pressable>
              </View>
              <Text style={styles.hint}>Setelah berhasil, notifikasi perubahan password dikirim ke email Anda.</Text>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={() => (step === 1 ? requestCode() : step === 2 ? verifyCode() : resetPassword())}
            style={styles.primaryWrap}
          >
            <LinearGradient colors={['#2FA0E5', '#0A5A8C']} style={styles.primary}>
              <Text style={styles.primaryText}>{step === 1 ? 'Kirim Kode' : step === 2 ? 'Verifikasi Kode' : 'Simpan Password Baru'}</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={onBack} style={styles.backBtn}><Text style={styles.backText}>← Kembali ke Sign In</Text></Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingTop: 56, paddingBottom: 32, alignItems: 'center' },
  logo: { width: 150, height: 40, tintColor: colors.white, marginBottom: 10 },
  title: { color: colors.white, fontSize: 24, fontWeight: '900', marginBottom: 16, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  card: { width: '92%', backgroundColor: colors.white, borderRadius: 24, padding: 22, gap: 10, shadowColor: '#0A3A5A', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  stepRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 6 },
  stepDot: { width: 28, height: 6, borderRadius: 3, backgroundColor: '#E2E9F0' },
  stepDotOn: { backgroundColor: colors.primary },
  label: { color: '#1A2B4A', fontSize: 14, fontWeight: '800', marginTop: 2 },
  pill: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#E6EDF3', paddingHorizontal: 14, gap: 10, shadowColor: '#0A3A5A', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  pillIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#EAF0F7', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, color: colors.ink, fontSize: 13, borderWidth: 0, outlineWidth: 0, outlineStyle: 'none', boxShadow: 'none' } as any,
  hint: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  info: { color: colors.primary, fontSize: 11, lineHeight: 16 },
  error: { color: colors.danger, fontSize: 12 },
  primaryWrap: { borderRadius: 24, overflow: 'hidden', marginTop: 6, shadowColor: '#0A5A8C', shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  primary: { height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontSize: 15, fontWeight: '800' },
  backBtn: { alignItems: 'center', paddingVertical: 8 },
  backText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
});
