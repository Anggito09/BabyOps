import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, spacing } from '../theme/tokens';

export function ProfileScreen() {
  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          <View style={styles.avatar}><Text style={styles.avatarEmoji}>👨‍👩‍👦</Text></View>
          <Text style={styles.name}>Anggito Karta Wijaya</Text>
          <Text style={styles.sub}>Orang tua dari bayi usia 3 bulan</Text>
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
  sub: { color: '#D5EFF9', fontSize: 12 },
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
});
