import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { articles } from '../data/articles';
import { colors, gradients, radius, shadow, spacing } from '../theme/tokens';
import { TabKey } from '../components/BottomNav';
import { DiagnosisHistoryEntry } from '../../App';

interface Props {
  userName?: string;
  babyAge?: string;
  history?: DiagnosisHistoryEntry[];
  onNavigate: (tab: TabKey) => void;
  onRecord: () => void;
}

export function HomeScreen({ userName, babyAge = '03', history = [], onNavigate, onRecord }: Props) {
  const displayName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'Anggito Karta Wijaya';
  return (
    <LinearGradient colors={[...gradients.github]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header — sesuai babyops-home-v2.webp */}
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.headerRight}>
            <View style={styles.ageBadge}>
              <Text style={styles.ageNum}>{babyAge}</Text>
              <Text style={styles.ageText}>Bulan</Text>
            </View>
          </View>
        </View>

        <View style={styles.greetBlock}>
          <Text style={styles.hello}>Selamat pagi, Parents!</Text>
          <Text style={styles.name}>{displayName}</Text>
        </View>

        {/* White content card — rounded top seperti di screenshot */}
        <View style={styles.contentCard}>
          {/* Disease History — pink FDE5E4 */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Riwayat Kesehatan</Text>
            <Text style={styles.date}>{history.length > 0 ? history[0].date : '—'}</Text>
          </View>
          {history.length === 0 ? (
            <View style={styles.emptyHistoryCard}>
              <View style={styles.emptyIcon}><Ionicons name="document-text-outline" size={28} color={colors.muted} /></View>
              <Text style={styles.emptyTitle}>Belum ada riwayat Diagnosa</Text>
              <Text style={styles.emptyBody}>Pengguna baru belum memiliki riwayat. Coba fitur Diagnosis untuk cek gejala bayi — hasilnya akan tampil di sini.</Text>
              <Pressable style={styles.emptyCta} onPress={() => onNavigate('diagnosis')}>
                <Text style={styles.emptyCtaText}>Mulai Cek Gejala</Text><Ionicons name="arrow-forward" size={14} color={colors.white} />
              </Pressable>
            </View>
          ) : (
            history.slice(0, 2).map((h) => (
              <Pressable key={h.id} style={styles.historyCard} onPress={() => onNavigate('diagnosis')}>
                <View style={styles.historyTopRow}>
                  <Text style={styles.historyEmoji}>{h.emoji}</Text>
                  <View style={[styles.severityMini, { backgroundColor: h.severity === 'perlu perhatian' ? '#FFD9D5' : h.severity === 'sedang' ? '#FFF0D1' : '#E0F5E4' }]}>
                    <Text style={[styles.severityMiniText, { color: h.severity === 'perlu perhatian' ? '#C33932' : h.severity === 'sedang' ? '#8A6A00' : '#1B7A3D' }]}>{h.severity}</Text>
                  </View>
                </View>
                <Text style={styles.historyTitle}>{h.conditionName}</Text>
                <Text style={styles.historyBody} numberOfLines={2}>{h.description}</Text>
                <Text style={styles.more}>{h.date} • {h.matchedSymptoms} gejala →</Text>
              </Pressable>
            ))
          )}

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
  headerLogo: { width: 130, height: 32, tintColor: colors.white },
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
  emptyHistoryCard: { backgroundColor: '#F0F7FF', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 1.5, borderColor: '#D6E6FF', borderStyle: 'dashed', gap: 8 },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '900', color: colors.ink, textAlign: 'center' },
  emptyBody: { fontSize: 12, color: colors.muted, lineHeight: 18, textAlign: 'center' },
  emptyCta: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, marginTop: 4 },
  emptyCtaText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  historyTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyEmoji: { fontSize: 22 },
  severityMini: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  severityMiniText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
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
