import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
        <Image source={require('../../assets/auth-mother-signup.png')} style={styles.hero} resizeMode="contain" />
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
  card: { width: '92%', backgroundColor: colors.white, borderRadius: 24, padding: 22, gap: 8, shadowColor: '#0A3A5A', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  label: { color: '#1A2B4A', fontSize: 14, fontWeight: '800', marginTop: 2 },
  pill: { flexDirection: 'row', alignItems: 'center', height: 46, borderRadius: 24, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E6EDF3', paddingHorizontal: 14, gap: 10, shadowColor: '#0A3A5A', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  pillIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#EAF0F7', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, color: colors.ink, fontSize: 13, borderWidth: 0, outlineWidth: 0, outlineStyle: 'none', boxShadow: 'none' } as any,
  inputStatic: { flex: 1, color: colors.muted, fontSize: 13 },
  error: { color: colors.danger, fontSize: 12 },
  primaryWrap: { borderRadius: 24, overflow: 'hidden', marginTop: 8, shadowColor: '#0A5A8C', shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  primary: { height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontSize: 15, fontWeight: '800' },
  hint: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 4 },
});
