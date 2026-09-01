import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing } from '../theme/tokens';

interface Props {
  user?: { name: string; email: string; babyDob?: string } | null;
  babyAge?: string;
  historyCount?: number;
  onLogout: () => void;
  onLogin: () => void;
}

export function ProfileScreen({ user, babyAge = '03', historyCount = 0, onLogout, onLogin }: Props) {
  const isNewUser = historyCount === 0;
  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          <View style={styles.avatar}><Text style={styles.avatarEmoji}>👨‍👩‍👦</Text></View>
          <Text style={styles.name}>{user?.name ?? 'Anggito Karta Wijaya'}</Text>
          <Text style={styles.sub}>{user?.email ?? 'Orang tua dari bayi usia ' + babyAge + ' bulan'}{user?.babyDob ? ' • lahir ' + user.babyDob : ''}</Text>
          <View style={[styles.badge, isNewUser ? styles.badgeNew : styles.badgeOld]}>
            <Ionicons name={isNewUser ? 'sparkles' : 'checkmark-circle'} size={14} color={isNewUser ? '#2FA0E5' : '#1B7A3D'} />
            <Text style={[styles.badgeText, { color: isNewUser ? '#2FA0E5' : '#1B7A3D' }]}>{isNewUser ? 'Pengguna Baru • Belum ada riwayat' : `Pengguna Lama • ${historyCount} riwayat`}</Text>
          </View>
          <View style={styles.card}>
            {[
              ['person', 'Data orang tua'],
              ['happy', 'Profil bayi'],
              ['notifications', 'Pengingat'],
              ['shield-checkmark', 'Privasi & keamanan'],
            ].map(([icon, label]) => (
              <View key={label} style={styles.row}>
                <Ionicons name={icon as any} color={colors.primary} size={20} />
                <Text style={styles.rowText}>{label}</Text>
                <Ionicons name="chevron-forward" color="#9BB0BA" size={18} />
              </View>
            ))}
            <Pressable onPress={user ? onLogout : onLogin} style={styles.logout}>
              <Ionicons name={user ? 'log-out-outline' : 'log-in-outline'} size={18} color={user ? colors.danger : colors.primary} />
              <Text style={[styles.logoutText, { color: user ? colors.danger : colors.primary }]}>{user ? 'Keluar' : 'Masuk / Daftar'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 44 },
  scroll: { paddingBottom: 110 },
  center: { alignItems: 'center', padding: spacing.lg, gap: 8 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 48 },
  name: { color: colors.white, fontSize: 20, fontWeight: '900', marginTop: 8 },
  sub: { color: '#D5EFF9', fontSize: 12, textAlign: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
  },
  badgeNew: { backgroundColor: '#EAF4FF' },
  badgeOld: { backgroundColor: '#E6F7ED' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F4',
    gap: 12,
  },
  rowText: { flex: 1, color: colors.ink, fontSize: 13, fontWeight: '700' },
  logout: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  logoutText: { fontSize: 13, fontWeight: '800' },
});
