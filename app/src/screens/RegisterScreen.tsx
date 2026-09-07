import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CalendarPicker } from '../components/CalendarPicker';
import { colors, gradients } from '../theme/tokens';

export const PRIVACY_TEXT = `KEBIJAKAN PRIVASI & PERSETUJUAN DATA — BabyOps

1. Data tersimpan lokal di HP Anda (AsyncStorage), tidak dikirim ke server BabyOps.
2. BabyOps TIDAK memperjualbelikan, menyewakan, atau membagikan data pribadi Anda (nama, email, data bayi) ke pihak ketiga mana pun.
3. Data riset (opsional, default MATI): hanya vektor fitur MFCC anonim + gejala + hasil diagnosa + umur bayi (bulan). TANPA nama, email, tanggal lahir, dan TANPA audio mentah. Sampel tersimpan di HP Anda dan hanya terkirim jika Anda menekan Export JSON lalu mengirimkannya sendiri.
4. Anda bisa menarik persetujuan kapan saja via Profil → Riset & data anonim, serta menghapus sampel via tombol Hapus sampel.
5. Hasil screening/prediksi adalah panduan awal, BUKAN diagnosis medis. Selalu konsultasikan ke tenaga kesehatan.`;

interface Props {
  onRegister: (parentName: string, babyName: string, email: string, babyDob: string, password: string, researchConsent: boolean) => void;
  onGoLogin: () => void;
}

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function RegisterScreen({ onRegister, onGoLogin }: Props) {
  const [parentName, setParentName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [email, setEmail] = useState('');
  const [babyDate, setBabyDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const babyDob = babyDate ? formatDate(babyDate) : '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeResearch, setAgreeResearch] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const handle = () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!parentName.trim() || !babyName.trim() || !cleanEmail.includes('@') || !babyDate || password.length < 6) {
      setError('Lengkapi nama orang tua, nama bayi, email valid, tanggal lahir bayi & password ≥6 karakter.');
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
    if (!agreePrivacy) {
      setError('Centang persetujuan Kebijakan Privasi & Aturan Pakai dulu.');
      return;
    }
    setError('');
    onRegister(parentName.trim(), babyName.trim(), cleanEmail, formatDate(babyDate), password, agreeResearch);
  };

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <Image source={require('../../assets/auth-mother-signup.png')} style={styles.hero} resizeMode="contain" />

        <Text style={styles.title}>SIGN UP</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nama Orang Tua</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="person" size={14} color="#7A8CA8" /></View>
            <TextInput placeholder="masukkan nama orang tua" placeholderTextColor="#8FA0B8" value={parentName} onChangeText={setParentName} style={styles.input} />
          </View>

          <Text style={styles.label}>Nama Bayi</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="happy" size={14} color="#7A8CA8" /></View>
            <TextInput placeholder="masukkan nama bayi" placeholderTextColor="#8FA0B8" value={babyName} onChangeText={setBabyName} style={styles.input} />
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
            <TextInput placeholder="masukkan password" placeholderTextColor="#8FA0B8" value={password} onChangeText={setPassword} secureTextEntry={!showPass} style={styles.input} />
            <Pressable onPress={() => setShowPass(!showPass)} hitSlop={8}><Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#7A8CA8" /></Pressable>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="lock-closed" size={14} color="#7A8CA8" /></View>
            <TextInput placeholder="masukkan confirm password" placeholderTextColor="#8FA0B8" value={confirm} onChangeText={setConfirm} secureTextEntry={!showConfirm} style={styles.input} />
            <Pressable onPress={() => setShowConfirm(!showConfirm)} hitSlop={8}><Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color="#7A8CA8" /></Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable onPress={() => setAgreePrivacy(!agreePrivacy)} style={styles.checkRow}>
            <View style={[styles.checkbox, agreePrivacy && styles.checkboxOn]}>
              {agreePrivacy && <Ionicons name="checkmark" size={14} color={colors.white} />}
            </View>
            <Text style={styles.checkText}>
              Saya membaca & menyetujui <Text style={styles.checkLink} onPress={() => setShowPolicy(true)}>Kebijakan Privasi & Aturan Pakai</Text>. BabyOps TIDAK memperjualbelikan data saya.
            </Text>
          </Pressable>

          <Pressable onPress={() => setAgreeResearch(!agreeResearch)} style={styles.checkRow}>
            <View style={[styles.checkbox, agreeResearch && styles.checkboxOn]}>
              {agreeResearch && <Ionicons name="checkmark" size={14} color={colors.white} />}
            </View>
            <Text style={styles.checkText}>
              Saya setuju data ANONIM (fitur suara + gejala, tanpa nama/audio) dipakai untuk melatih model lebih baik. (Opsional)
            </Text>
          </Pressable>

          <Pressable onPress={handle} style={styles.primaryWrap}>
            <LinearGradient colors={['#2FA0E5', '#0A5A8C']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.primary}>
              <Text style={styles.primaryText}>Sign Up</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account? </Text>
            <Pressable onPress={onGoLogin}><Text style={styles.bottomLink}>Sign In</Text></Pressable>
          </View>
        </View>
      </ScrollView>

      {showPolicy && (
        <View style={styles.policyBackdrop}>
          <View style={styles.policyCard}>
            <View style={styles.policyHead}>
              <Text style={styles.policyTitle}>Kebijakan Privasi & Aturan Pakai</Text>
              <Pressable onPress={() => setShowPolicy(false)} hitSlop={10}>
                <Ionicons name="close" size={20} color="#7A8CA8" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.policyScroll}>
              <Text style={styles.policyText}>{PRIVACY_TEXT}</Text>
            </ScrollView>
            <Pressable onPress={() => { setShowPolicy(false); setAgreePrivacy(true); }} style={styles.primaryWrap}>
              <LinearGradient colors={['#2FA0E5', '#0A5A8C']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.primary}>
                <Text style={styles.primaryText}>Saya Setuju</Text>
              </LinearGradient>
            </Pressable>
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
  input: { flex: 1, color: colors.ink, fontSize: 13, borderWidth: 0, outlineWidth: 0, outlineStyle: 'none', boxShadow: 'none' } as any,
  error: { color: colors.danger, fontSize: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 6 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: '#B9C9D8', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxOn: { backgroundColor: '#2FA0E5', borderColor: '#2FA0E5' },
  checkText: { flex: 1, fontSize: 11, lineHeight: 16, color: '#40566E' },
  checkLink: { color: '#2FA0E5', fontWeight: '800' },
  policyBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(5,73,123,0.5)', justifyContent: 'flex-end' },
  policyCard: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  policyHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  policyTitle: { fontSize: 15, fontWeight: '900', color: '#1A2B4A' },
  policyScroll: { maxHeight: 320, marginBottom: 12 },
  policyText: { fontSize: 12, lineHeight: 19, color: '#40566E' },
  primaryWrap: { borderRadius: 24, overflow: 'hidden', marginTop: 8, shadowColor: '#0A5A8C', shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  primary: { height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  bottomText: { color: '#1A2B4A', fontSize: 12 },
  bottomLink: { color: '#2FA0E5', fontSize: 12, fontWeight: '800' },
});
