import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { articles } from '../data/articles';
import { colors, font, gradients, radius, shadow, spacing } from '../theme/tokens';
import { TabKey } from '../components/BottomNav';

interface Props {
  userName?: string;
  onNavigate: (tab: TabKey) => void;
  onRecord: () => void;
}

export function HomeScreen({ userName, onNavigate, onRecord }: Props) {
  return (
    <LinearGradient colors={[...gradients.github]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header — sesuai babyops-home-v2.webp */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>Baby</Text>
            <View style={styles.logoBaby}><Text style={styles.logoEmoji}>👶</Text></View>
            <Text style={styles.logoText}>ps</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.ageBadge}>
              <Text style={styles.ageNum}>03</Text>
              <Text style={styles.ageText}>Bulan</Text>
            </View>
          </View>
        </View>

        <View style={styles.greetBlock}>
          <Text style={styles.hello}>Selamat pagi, Parents!</Text>
          <Text style={styles.name}>{userName ? userName : 'Anggito Karta Wijaya'}</Text>
        </View>

        {/* White content card — rounded top seperti di screenshot */}
        <View style={styles.contentCard}>
          {/* Disease History — pink FDE5E4 */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Riwayat Kesehatan</Text>
            <Text style={styles.date}>24/07/2026</Text>
          </View>
          <Pressable style={styles.historyCard} onPress={() => onNavigate('diagnosis')}>
            <Text style={styles.historyTitle}>Bronkiolitis</Text>
            <Text style={styles.historyBody}>Bronkiolitis adalah suatu infeksi virus pada saluran pernapasan kecil yang umumnya terjadi pada bayi.</Text>
            <Text style={styles.more}>Baca selengkapnya →</Text>
          </Pressable>

          {/* Quick actions — ReKam / Cek gejala */}
          <View style={styles.quickRow}>
            <Pressable style={styles.quickCard} onPress={onRecord}>
              <View style={[styles.quickIcon, { backgroundColor: colors.pale }]}>
                <Ionicons name="mic" size={22} color={colors.primary} />
              </View>
              <Text style={styles.quickText}>Rekam tangisan</Text>
            </Pressable>
            <Pressable style={styles.quickCard} onPress={() => onNavigate('diagnosis')}>
              <View style={[styles.quickIcon, { backgroundColor: colors.pale }]}>
                <Ionicons name="medkit" size={22} color={colors.primary} />
              </View>
              <Text style={styles.quickText}>Cek gejala</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Edukasi Pilihan</Text>
          <View style={styles.educGrid}>
            {[
              { color: '#7A42B7', icon: 'medical' as const, title: 'Menyusui perkuat imunitas bayi' },
              { color: '#2778D2', icon: 'heart' as const, title: 'Hal penting setelah bayi lahir' },
              { color: '#EC637D', icon: 'moon' as const, title: 'Panduan tidur aman untuk bayi' },
              { color: '#2B9BEC', icon: 'chatbubble-ellipses' as const, title: articles[0]?.title ?? 'Mengenal 5 Bahasa Tangisan Bayi' },
            ].slice(0, 4).map((c) => (
              <Pressable key={c.title} onPress={() => onNavigate('education')} style={[styles.educCard, { backgroundColor: c.color }]}>
                <View style={styles.educTopRow}>
                  <View style={styles.miniPill}><Text style={styles.miniPillText}>Education</Text></View>
                  <View style={styles.educIconWrap}><Ionicons name={c.icon} size={16} color="rgba(255,255,255,0.9)" /></View>
                </View>
                <Text style={styles.educTitle} numberOfLines={2}>{c.title}</Text>
                <View style={styles.educReadRow}>
                  <Ionicons name="time-outline" size={10} color="#E9F4FF" />
                  <Text style={styles.educRead}>4 menit</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 54,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '900', color: colors.white, letterSpacing: -1 },
  logoBaby: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  logoEmoji: { fontSize: 14 },
  headerRight: { alignItems: 'center' },
  ageBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  ageNum: { color: colors.primary, fontSize: 26, fontWeight: '900', lineHeight: 28 },
  ageText: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  greetBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.lg },
  hello: { color: '#CBEFFF', fontSize: 12 },
  name: { color: colors.white, fontSize: 20, fontWeight: '900', marginTop: 4 },
  contentCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    marginTop: spacing.sm,
    gap: 14,
  },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  date: { fontSize: 11, color: '#C46A80' },
  historyCard: {
    backgroundColor: '#FFF0F3',
    borderRadius: 20,
    padding: 17,
    shadowColor: '#003C5B',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  historyTitle: { fontSize: 17, fontWeight: '900', color: colors.ink, marginBottom: 5 },
  historyBody: { fontSize: 12, color: colors.muted, lineHeight: 18 },
  more: { alignSelf: 'flex-end', fontSize: 11, color: colors.githubDark, fontWeight: '800', marginTop: 8 },
  quickRow: { flexDirection: 'row', gap: 12 },
  quickCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: '#EDF2F4',
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: { color: colors.ink, fontSize: 12, fontWeight: '800', flex: 1 },
  educGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  educCard: {
    width: '47%',
    flexGrow: 1,
    borderRadius: 18,
    padding: 16,
    minHeight: 122,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  educTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
  },
  miniPillText: { color: colors.white, fontSize: 9, fontWeight: '800' },
  educIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  educTitle: { color: colors.white, fontSize: 14, fontWeight: '900', lineHeight: 19, marginVertical: 10 },
  educReadRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  educRead: { color: '#E9F4FF', fontSize: 9 },
});
