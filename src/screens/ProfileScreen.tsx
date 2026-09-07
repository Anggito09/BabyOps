import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing } from '../theme/tokens';
import { CalendarPicker } from '../components/CalendarPicker';

interface Props {
  user?: { name: string; email: string; babyDob?: string; babyName?: string; babyGender?: string; phone?: string; address?: string } | null;
  babyAge?: string;
  historyCount?: number;
  onLogout: () => void;
  onLogin: () => void;
  onSave?: (data: Partial<{ name: string; babyName: string; babyDob: string; babyGender: string; phone: string; address: string }>) => void;
}

type Mode = null | 'parent' | 'baby' | 'reminder' | 'privacy';

export function ProfileScreen({ user, babyAge = '03', historyCount = 0, onLogout, onLogin, onSave }: Props) {
  const isNewUser = historyCount === 0;
  const [mode, setMode] = useState<Mode>(null);
  const [form, setForm] = useState({ name: user?.name ?? '', babyName: user?.babyName ?? '', babyDob: user?.babyDob ?? '', phone: user?.phone ?? '', address: user?.address ?? '', babyGender: (user?.babyGender as string) ?? 'L' });
  const [showCal, setShowCal] = useState(false);
  const [savedToast, setSavedToast] = useState('');

  // animation
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const avatarPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setForm({ name: user?.name ?? '', babyName: user?.babyName ?? '', babyDob: user?.babyDob ?? '', phone: user?.phone ?? '', address: user?.address ?? '', babyGender: (user?.babyGender as string) ?? 'L' });
  }, [user?.email, user?.name, user?.babyName, user?.babyDob, user?.phone, user?.address, user?.babyGender]);

  useEffect(() => {
    Animated.loop(Animated.sequence([Animated.timing(avatarPulse, { toValue: 1, duration: 1800, useNativeDriver: true }), Animated.timing(avatarPulse, { toValue: 0, duration: 1800, useNativeDriver: true })])).start();
  }, []);

  useEffect(() => {
    if (mode) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 180 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180 }),
      ]).start();
    } else {
      fade.setValue(0);
      slide.setValue(30);
      scale.setValue(0.96);
    }
  }, [mode]);

  const open = (m: Mode) => {
    setForm({ name: user?.name ?? '', babyName: user?.babyName ?? '', babyDob: user?.babyDob ?? '', phone: user?.phone ?? '', address: user?.address ?? '', babyGender: (user?.babyGender as string) ?? 'L' });
    setShowCal(false);
    setMode(m);
  };

  const save = () => {
    onSave?.(form);
    setMode(null);
    setSavedToast('Tersimpan ✓');
    setTimeout(() => setSavedToast(''), 1800);
  };

  const pulseScale = avatarPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          {/* Avatar dengan gambar BabyOps */}
          <Animated.View style={[styles.avatarWrap, { transform: [{ scale: pulseScale }] }]}>
            <LinearGradient colors={['#FFFFFF', '#EAF6FF']} style={styles.avatarRing}>
              <View style={styles.avatarInner}>
                <Image source={require('../../assets/auth-mother-signin.png')} style={styles.avatarImg} resizeMode="contain" />
              </View>
            </LinearGradient>
            <View style={styles.avatarBadge}>
              <Ionicons name={isNewUser ? 'sparkles' : 'checkmark-done'} size={12} color={colors.white} />
            </View>
          </Animated.View>

          <Text style={styles.name}>{user?.name ?? 'Anggito Karta Wijaya'}</Text>
          <Text style={styles.sub} numberOfLines={2}>
            {user?.email ?? 'Orang tua dari bayi usia ' + babyAge + ' bulan'}
            {user?.babyDob ? ' • ' + user.babyDob : ''}
            {user?.babyName ? ' • ' + user.babyName : ''}
          </Text>

          <View style={[styles.badge, isNewUser ? styles.badgeNew : styles.badgeOld]}>
            <Ionicons name={isNewUser ? 'sparkles' : 'checkmark-circle'} size={14} color={isNewUser ? '#2FA0E5' : '#1B7A3D'} />
            <Text style={[styles.badgeText, { color: isNewUser ? '#2FA0E5' : '#1B7A3D' }]}>{isNewUser ? 'Pengguna Baru • Belum ada riwayat' : `Pengguna Lama • ${historyCount} riwayat`}</Text>
          </View>

          {/* Stats mini */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{babyAge}</Text>
              <Text style={styles.statLabel}>Bulan usia</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{historyCount}</Text>
              <Text style={styles.statLabel}>Riwayat</Text>
            </View>
            <View style={styles.statCard}>
              <Image source={require('../../assets/baby-record.png')} style={styles.statIcon} resizeMode="contain" />
              <Text style={styles.statLabel}>BabyOps</Text>
            </View>
          </View>

          <View style={styles.card}>
            {[
              { icon: 'person', label: 'Data orang tua', hint: user?.phone ? user.phone : 'Lengkapi', mode: 'parent' as Mode, img: require('../../assets/auth-mother-signup.png') },
              { icon: 'happy', label: 'Profil bayi', hint: user?.babyName ? user.babyName + ' • ' + babyAge + ' bln' : 'Atur nama & TTL', mode: 'baby' as Mode, img: require('../../assets/onboarding-baby-bottle.png') },
              { icon: 'notifications', label: 'Pengingat', hint: 'Imunisasi', mode: 'reminder' as Mode, img: require('../../assets/onboarding-baby-cry.png') },
              { icon: 'shield-checkmark', label: 'Privasi & keamanan', hint: 'Lokal', mode: 'privacy' as Mode, img: require('../../assets/onboarding-mother.png') },
            ].map((it) => (
              <Pressable key={it.label} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6, transform: [{ scale: 0.98 }] }]} onPress={() => open(it.mode)}>
                <View style={styles.rowIconWrap}>
                  <Image source={it.img} style={styles.rowImg} resizeMode="contain" />
                </View>
                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowText}>{it.label}</Text>
                  <Text style={styles.rowHint}>{it.hint}</Text>
                </View>
                <Ionicons name="chevron-forward" color="#9BB0BA" size={18} />
              </Pressable>
            ))}
            <Pressable onPress={user ? onLogout : onLogin} style={({ pressed }) => [styles.logout, pressed && { opacity: 0.7 }]}>
              <LinearGradient colors={user ? ['#FFE8E8', '#FFD1D1'] : ['#EAF4FF', '#D6ECFF']} style={styles.logoutGrad}>
                <Ionicons name={user ? 'log-out-outline' : 'log-in-outline'} size={18} color={user ? colors.danger : colors.primary} />
                <Text style={[styles.logoutText, { color: user ? colors.danger : colors.primary }]}>{user ? 'Keluar' : 'Masuk / Daftar'}</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {savedToast ? (
            <View style={styles.toast}>
              <Ionicons name="checkmark-circle" size={16} color={colors.white} />
              <Text style={styles.toastText}>{savedToast}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Modal dengan animasi */}
      <Modal visible={!!mode} transparent statusBarTranslucent animationType="none" onRequestClose={() => setMode(null)}>
        <Animated.View style={[styles.modalBg, { opacity: fade }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMode(null)} />
          <Animated.View style={[styles.modalCard, { transform: [{ translateY: slide }, { scale }] }]}>
            {/* Header dengan gambar */}
            <View style={styles.modalHead}>
              <View style={styles.modalHeadLeft}>
                <View style={styles.modalIconWrap}>
                  {mode === 'parent' && <Image source={require('../../assets/auth-mother-signup.png')} style={styles.modalHeadImg} resizeMode="contain" />}
                  {mode === 'baby' && <Image source={require('../../assets/baby-record.png')} style={styles.modalHeadImg} resizeMode="contain" />}
                  {mode === 'reminder' && <Ionicons name="notifications" size={28} color={colors.primary} />}
                  {mode === 'privacy' && <Ionicons name="shield-checkmark" size={28} color={colors.primary} />}
                </View>
                <Text style={styles.modalTitle}>{mode === 'parent' ? 'Data Orang Tua' : mode === 'baby' ? 'Profil Bayi' : mode === 'reminder' ? 'Pengingat' : 'Privasi & Keamanan'}</Text>
              </View>
              <Pressable onPress={() => setMode(null)} hitSlop={8} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={colors.muted} />
              </Pressable>
            </View>

            {mode === 'parent' && (
              <View style={styles.form}>
                <Text style={styles.label}>Nama lengkap</Text>
                <View style={styles.pill}>
                  <Ionicons name="person" size={14} color="#7A8CA8" />
                  <TextInput value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="Nama orang tua" placeholderTextColor="#8FA0B8" style={styles.input} />
                </View>
                <Text style={styles.label}>No. HP</Text>
                <View style={styles.pill}>
                  <Ionicons name="call" size={14} color="#7A8CA8" />
                  <TextInput value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="08xx xxxx xxxx" keyboardType="phone-pad" placeholderTextColor="#8FA0B8" style={styles.input} />
                </View>
                <Text style={styles.label}>Alamat</Text>
                <View style={[styles.pill, styles.pillMulti]}>
                  <Ionicons name="location" size={14} color="#7A8CA8" />
                  <TextInput value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} placeholder="Alamat domisili" placeholderTextColor="#8FA0B8" style={[styles.input, { height: 40 }]} multiline />
                </View>
                <View style={styles.illustWrap}>
                  <Image source={require('../../assets/auth-mother-signin.png')} style={styles.illust} resizeMode="contain" />
                  <Text style={styles.illustCaption}>Data disimpan lokal, aman di HP kamu</Text>
                </View>
              </View>
            )}

            {mode === 'baby' && (
              <View style={styles.form}>
                <Text style={styles.label}>Nama bayi</Text>
                <View style={styles.pill}>
                  <Ionicons name="happy" size={14} color="#7A8CA8" />
                  <TextInput value={form.babyName} onChangeText={(v) => setForm({ ...form, babyName: v })} placeholder="Masukkan nama bayi" placeholderTextColor="#8FA0B8" style={styles.input} />
                </View>
                <Text style={styles.label}>Jenis kelamin</Text>
                <View style={styles.genderRow}>
                  {(['L', 'P'] as const).map((g) => (
                    <Pressable key={g} onPress={() => setForm({ ...form, babyGender: g })} style={[styles.genderPill, form.babyGender === g && styles.genderOn]}>
                      <Ionicons name={g === 'L' ? 'man' : 'woman'} size={14} color={form.babyGender === g ? colors.white : colors.primary} />
                      <Text style={[styles.genderText, form.babyGender === g && styles.genderTextOn]}>{g === 'L' ? 'Laki-laki' : 'Perempuan'}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.label}>Tanggal lahir bayi</Text>
                <Pressable onPress={() => setShowCal(!showCal)} style={styles.pill}>
                  <Ionicons name="calendar" size={14} color="#7A8CA8" />
                  <Text style={[styles.input, !form.babyDob && { color: '#8FA0B8' }]}>{form.babyDob || 'Pilih tanggal lahir'}</Text>
                  <Ionicons name={showCal ? 'chevron-up' : 'chevron-down'} size={14} color="#7A8CA8" />
                </Pressable>
                {showCal && <CalendarPicker value={form.babyDob ? new Date(form.babyDob) : null} maxDate={new Date()} minDate={new Date(2020, 0, 1)} onChange={(d) => { setForm({ ...form, babyDob: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }); setShowCal(false); }} />}
                <View style={styles.illustWrap}>
                  <Image source={require('../../assets/onboarding-baby-bottle.png')} style={styles.illust} resizeMode="contain" />
                  <Text style={styles.illustCaption}>Umur bayi dipakai untuk badge {babyAge} bulan di Home</Text>
                </View>
              </View>
            )}

            {mode === 'reminder' && (
              <View style={styles.form}>
                <View style={styles.reminderCard}>
                  <Image source={require('../../assets/onboarding-baby-cry.png')} style={styles.reminderImg} resizeMode="contain" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reminderTitle}>Jadwal Imunisasi</Text>
                    <Text style={styles.reminderDesc}>Pengingat otomatis akan hadir. Untuk sekarang, cek di menu Edukasi untuk panduan usia {babyAge} bulan.</Text>
                  </View>
                </View>
                <View style={styles.reminderList}>
                  {[
                    ['Hari ini', 'Cek tangisan bayi', '09:00'],
                    ['Minggu ini', 'Kontrol posyandu', 'Segera'],
                  ].map(([a, b, c]) => (
                    <View key={b} style={styles.reminderRow}>
                      <View style={styles.reminderDot} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reminderRowTitle}>{b}</Text>
                        <Text style={styles.reminderRowSub}>{a}</Text>
                      </View>
                      <Text style={styles.reminderTime}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {mode === 'privacy' && (
              <View style={styles.form}>
                <View style={styles.privacyHead}>
                  <Image source={require('../../assets/onboarding-mother.png')} style={styles.privacyImg} resizeMode="contain" />
                  <Text style={styles.privacyTitle}>Aman & Lokal</Text>
                </View>
                <Text style={styles.hint}>• Data disimpan di <Text style={{ fontWeight: '800' }}>AsyncStorage</Text> HP, tidak ke server.{'\n'}• Tidak ada tracking. Hapus dengan Keluar + hapus app.{'\n'}• BabyOps tidak mengirim data bayi ke internet.</Text>
                <View style={styles.privacyBadge}>
                  <Ionicons name="lock-closed" size={14} color={colors.success} />
                  <Text style={styles.privacyBadgeText}>Terenkripsi lokal</Text>
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <Pressable onPress={() => setMode(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Batal</Text>
              </Pressable>
              {(mode === 'parent' || mode === 'baby') ? (
                <Pressable onPress={save} style={styles.saveWrap}>
                  <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.saveBtn}>
                    <Text style={styles.saveText}>Simpan</Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <Pressable onPress={() => setMode(null)} style={styles.saveWrap}>
                  <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.saveBtn}>
                    <Text style={styles.saveText}>Mengerti</Text>
                  </LinearGradient>
                </Pressable>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 44 },
  scroll: { paddingBottom: 110 },
  center: { alignItems: 'center', padding: spacing.lg, gap: 10 },
  avatarWrap: { marginTop: 6 },
  avatarRing: { width: 108, height: 108, borderRadius: 54, alignItems: 'center', justifyContent: 'center', padding: 3 },
  avatarInner: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: 90, height: 90 },
  avatarBadge: { position: 'absolute', right: 2, bottom: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  name: { color: colors.white, fontSize: 20, fontWeight: '900', marginTop: 4, textAlign: 'center' },
  sub: { color: '#D5EFF9', fontSize: 12, textAlign: 'center', paddingHorizontal: 16, lineHeight: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 4 },
  badgeNew: { backgroundColor: '#EAF4FF' },
  badgeOld: { backgroundColor: '#E6F7ED' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 6, width: '100%' },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 16, paddingVertical: 12, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 18, fontWeight: '900', color: colors.primaryDarker },
  statLabel: { fontSize: 10, fontWeight: '700', color: colors.muted },
  statIcon: { width: 24, height: 24 },
  card: { backgroundColor: colors.white, borderRadius: 20, width: '100%', paddingHorizontal: 14, paddingTop: 4, marginTop: 8, shadowColor: '#0A3A5A', shadowOpacity: 0.12, shadowRadius: 12, elevation: 4 },
  row: { height: 64, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EDF2F4', gap: 12 },
  rowIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0F7FF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  rowImg: { width: 36, height: 36 },
  rowTextWrap: { flex: 1, gap: 2 },
  rowText: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  rowHint: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  logout: { marginVertical: 12, borderRadius: 14, overflow: 'hidden' },
  logoutGrad: { height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14 },
  logoutText: { fontSize: 13, fontWeight: '800' },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1B7A3D', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 4 },
  toastText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  // modal
  modalBg: { flex: 1, backgroundColor: 'rgba(6,40,64,0.45)', justifyContent: 'flex-end', padding: 16 },
  modalCard: { backgroundColor: colors.white, borderRadius: 24, padding: 18, maxHeight: '88%', shadowColor: '#0A3A5A', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  modalHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  modalIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EAF4FF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  modalHeadImg: { width: 36, height: 36 },
  modalTitle: { fontSize: 16, fontWeight: '900', color: colors.ink, flex: 1 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F3F5', alignItems: 'center', justifyContent: 'center' },
  form: { gap: 8 },
  label: { color: '#1A2B4A', fontSize: 12, fontWeight: '800', marginTop: 2 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, borderRadius: 24, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E6EDF3', paddingHorizontal: 14, shadowColor: '#0A3A5A', shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  pillMulti: { height: 56 },
  input: { flex: 1, color: colors.ink, fontSize: 13 } as any,
  genderRow: { flexDirection: 'row', gap: 10 },
  genderPill: { flex: 1, height: 42, borderRadius: 14, borderWidth: 1, borderColor: '#D6E6F2', backgroundColor: '#F6F9FD', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  genderOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  genderText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  genderTextOn: { color: colors.white },
  illustWrap: { alignItems: 'center', marginTop: 8, gap: 6, backgroundColor: '#F6F9FD', borderRadius: 16, padding: 12 },
  illust: { width: 120, height: 80 },
  illustCaption: { fontSize: 11, color: colors.muted, textAlign: 'center', fontWeight: '600' },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  reminderCard: { flexDirection: 'row', gap: 12, backgroundColor: '#F0F7FF', borderRadius: 16, padding: 14, alignItems: 'center' },
  reminderImg: { width: 56, height: 56, borderRadius: 12 },
  reminderTitle: { fontSize: 13, fontWeight: '900', color: colors.ink },
  reminderDesc: { fontSize: 11, color: colors.muted, lineHeight: 16, marginTop: 2 },
  reminderList: { gap: 10, marginTop: 4 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EDF2F4', borderRadius: 14, padding: 12 },
  reminderDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  reminderRowTitle: { fontSize: 12, fontWeight: '800', color: colors.ink },
  reminderRowSub: { fontSize: 11, color: colors.muted },
  reminderTime: { fontSize: 11, fontWeight: '800', color: colors.primary },
  privacyHead: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#EAF4FF', borderRadius: 14, padding: 12 },
  privacyImg: { width: 44, height: 44 },
  privacyTitle: { fontSize: 14, fontWeight: '900', color: colors.ink },
  privacyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E6F7ED', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginTop: 4 },
  privacyBadgeText: { fontSize: 11, fontWeight: '800', color: '#1B7A3D' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#F0F3F5', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontWeight: '800', color: colors.muted },
  saveWrap: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  saveBtn: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: colors.white, fontWeight: '800' },
});
