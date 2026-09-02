import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientHeader } from '../components/GradientHeader';
import { articles, Article } from '../data/articles';
import { colors, font, radius, shadow, spacing } from '../theme/tokens';

const thumbColors = ['#7A5CF0', '#2B9BEC', '#E85D5D', '#34C77B', '#F5A623', '#05497B'];

function AnimatedCard({ article, index, color, onPress }: { article: Article; index: number; color: string; onPress: () => void }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, delay: index * 70, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 420, delay: index * 70, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }]}>
        <View style={[styles.thumb, { backgroundColor: color }]}>
          <Text style={styles.thumbEmoji}>{article.emoji}</Text>
          <View style={styles.thumbGloss} />
          <View style={styles.thumbShine} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={[styles.catPill, { backgroundColor: color + '14' }]}>
            <Text style={[styles.category, { color }]}>{article.category}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
          <Text style={styles.excerpt} numberOfLines={2}>{article.excerpt}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={12} color={colors.textSoft} />
            <Text style={styles.meta}>{article.readMinutes} menit baca</Text>
            <View style={styles.dotSep} />
            <Text style={styles.metaLink}>Baca →</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
      </Pressable>
    </Animated.View>
  );
}

export function EducationScreen() {
  const [open, setOpen] = useState<Article | null>(null);
  const detailFade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (open) {
      detailFade.setValue(0);
      Animated.timing(detailFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [open]);

  if (open) {
    return (
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <GradientHeader title="Artikel" subtitle={open.category} onBack={() => setOpen(null)} />
          <Animated.View style={[styles.body, { opacity: detailFade }]}>
            <View style={styles.detailHead}>
              <View style={styles.detailEmojiWrap}>
                <Text style={styles.detailEmoji}>{open.emoji}</Text>
              </View>
              <Text style={styles.detailTitle}>{open.title}</Text>
              <View style={styles.detailMetaRow}>
                <Ionicons name="time-outline" size={13} color={colors.textSoft} />
                <Text style={styles.detailMeta}>{open.readMinutes} menit baca</Text>
                <View style={styles.dotSepLarge} />
                <Text style={styles.detailCategory}>{open.category}</Text>
              </View>
            </View>
            {open.body.map((paragraph, i) => (
              <Text key={i} style={styles.detailBody}>{paragraph}</Text>
            ))}
            {open.sources && open.sources.length > 0 && (
              <View style={styles.sourcesBox}>
                <View style={styles.sourcesHead}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                  <Text style={styles.sourcesTitle}>Sumber Real & Fakta</Text>
                </View>
                {open.sources.map((s, idx) => (
                  <View key={idx} style={styles.sourceRow}>
                    <Text style={styles.sourceDot}>•</Text>
                    <Text style={styles.sourceText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GradientHeader title="Edukasi" subtitle="Artikel kesehatan & pengasuhan bayi — real Kemenkes/IDAI/WHO" />
        <View style={styles.body}>
          <View style={styles.search}>
            <View style={styles.searchIconWrap}>
              <Ionicons name="search" size={18} color={colors.white} />
            </View>
            <Text style={styles.searchText}>Cari artikel kesehatan bayi</Text>
            <Ionicons name="options-outline" size={18} color={colors.muted} />
          </View>
          <View style={styles.filterRow}>
            {['Semua', 'ASI & MPASI', 'Imunisasi', 'Tumbuh Kembang'].map((f, idx) => (
              <View key={f} style={[styles.filterPill, idx === 0 && styles.filterPillActive]}>
                <Text style={[styles.filterText, idx === 0 && styles.filterTextActive]}>{f}</Text>
              </View>
            ))}
          </View>
          {articles.map((a, i) => (
            <AnimatedCard key={a.id} article={a} index={i} color={thumbColors[i % thumbColors.length]} onPress={() => setOpen(a)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.skySoft },
  scroll: { paddingBottom: 120 },
  body: { paddingHorizontal: spacing.lg, marginTop: -spacing.xl },
  search: {
    backgroundColor: colors.white,
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: spacing.sm,
    ...shadow.card,
    borderWidth: 1,
    borderColor: '#E6EDF3',
  },
  searchIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: { flex: 1, color: colors.muted, fontSize: 12, fontWeight: '500' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md, marginTop: 4 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E6EDF3',
  },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 11, fontWeight: '700', color: colors.muted },
  filterTextActive: { color: colors.white },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: spacing.md,
    ...shadow.card,
    borderWidth: 1,
    borderColor: '#EDF2F4',
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0A3A5A',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbGloss: {
    position: 'absolute',
    top: -14,
    right: -14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  thumbShine: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  thumbEmoji: { fontSize: 30, color: colors.white, textShadowColor: 'rgba(0,0,0,0.12)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  catPill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 4 },
  category: { fontSize: 10, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase' },
  title: { color: colors.textDark, fontSize: 14, fontWeight: '900', lineHeight: 19, letterSpacing: -0.2 },
  excerpt: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  meta: { color: colors.textSoft, fontSize: 11, fontWeight: '600' },
  dotSep: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD8E8', marginHorizontal: 2 },
  metaLink: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  detailHead: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.card,
    borderWidth: 1,
    borderColor: '#E6EDF3',
  },
  detailEmojiWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailEmoji: { fontSize: 42 },
  detailTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  detailMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  detailMeta: { color: colors.textSoft, fontSize: 12, fontWeight: '600' },
  detailCategory: { color: colors.primary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  dotSepLarge: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD8E8' },
  detailBody: {
    color: colors.textMuted,
    fontSize: font.body,
    lineHeight: 25,
    marginTop: spacing.lg,
    textAlign: 'justify',
  },
  sourcesBox: {
    backgroundColor: '#F0F7FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: '#D6E6FF',
  },
  sourcesHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  sourcesTitle: { color: colors.ink, fontSize: font.small, fontWeight: '900' },
  sourceRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  sourceDot: { color: colors.primary, fontSize: font.small, fontWeight: '900' },
  sourceText: { flex: 1, color: colors.muted, fontSize: font.tiny, lineHeight: 17 },
});
