import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CalendarPicker } from '../components/CalendarPicker';
import { colors, gradients } from '../theme/tokens';

interface Props {
  initialEmail: string;
  initialName: string;
  onComplete: (name: string, babyDob: string) => void;
}

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function CompleteProfileScreen({ initialEmail, initialName, onComplete }: Props) {
  const [name, setName] = useState(initialName);
  const [babyDate, setBabyDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');
  const float = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -8, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handle = () => {
    if (!name.trim()) { setError('Nama harus diisi.'); return; }
    if (!babyDate) { setError('Tanggal lahir bayi wajib dipilih.'); return; }
    if (babyDate > new Date()) { setError('Tanggal lahir tidak boleh di masa depan.'); return; }
    setError('');
    onComplete(name.trim(), formatDate(babyDate));
  };

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Animated.Image source={require('../../assets/auth-mother-signup.png')} style={[styles.hero, { transform: [{ translateY: float }] }]} resizeMode="contain" />
        <Text style={styles.title}>LENGKAPI PROFIL</Text>
        <Text style={styles.subtitle}>Akun Google terhubung sebagai {initialEmail}. Lengkapi data agar umur bayi (03 Bulan) akurat.</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <View style={styles.pill}>
            <View style={styles.pillIcon}><Ionicons name="person" size={14} color="#7A8CA8" /></View>
            <TextInput placeholder="Nama" placeholderTextColor="#8FA0B8" value={name} onChangeText={setName} style={styles.input} />
          </View>
          <Text style={styles.label}>Email Google</Text>
          <View style={[styles.pill, { backgroundColor: '#F5F7FA' }]}>
            <View style={styles.pillIcon}><Ionicons name="mail" size={14} color="#7A8CA8" /></View>
            <Text style={styles.inputStatic}>{initialEmail}</Text>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          </View>
          <Text style={styles.label}>Tanggal Lahir Bayi *</Text>
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
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={handle} style={styles.primaryWrap}>
            <LinearGradient colors={['#2FA0E5', '#0A5A8C']} style={styles.primary}><Text style={styles.primaryText}>Simpan & Lanjutkan</Text></LinearGradient>
          </Pressable>
          <Text style={styles.hint}>Data ini dipakai untuk badge “{babyDate ? formatDate(babyDate) : '03'} Bulan” di Home.</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingTop: 48, paddingBottom: 32, alignItems: 'center' },
  logo: { width: 160, height: 42, tintColor: colors.white },
  hero: { width: 260, height: 200, marginTop: 8 },
  title: { color: colors.white, fontSize: 22, fontWeight: '900', marginTop: 8, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  subtitle: { color: '#D5EFF9', fontSize: 12, textAlign: 'center', marginTop: 6, marginBottom: 14, paddingHorizontal: 24, lineHeight: 18 },
  card: { width: '90%', backgroundColor: colors.white, borderRadius: 28, padding: 28, gap: 16, shadowColor: '#0A3A5A', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  label: { color: '#1A2B4A', fontSize: 16, fontWeight: '800', marginTop: 6 },
  pill: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 28, backgroundColor: colors.white, borderWidth: 1.5, borderColor: '#E6EDF3', paddingHorizontal: 18, gap: 12, shadowColor: '#0A3A5A', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  pillIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EAF0F7', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, color: colors.ink, fontSize: 15 },
  inputStatic: { flex: 1, color: colors.muted, fontSize: 15 },
  error: { color: colors.danger, fontSize: 12 },
  primaryWrap: { borderRadius: 28, overflow: 'hidden', marginTop: 10, shadowColor: '#0A5A8C', shadowOpacity: 0.25, shadowRadius: 12, elevation: 5 },
  primary: { height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontSize: 17, fontWeight: '900' },
  hint: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 4 },
});
