import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientHeader } from '../components/GradientHeader';
import { articles, Article } from '../data/articles';
import { colors, font, radius, shadow, spacing } from '../theme/tokens';

const thumbColors = ['#7A5CF0', '#2B9BEC', '#E85D5D', '#34C77B', '#F5A623', '#05497B'];

export function EducationScreen() {
  const [open, setOpen] = useState<Article | null>(null);

  if (open) {
    return (
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <GradientHeader title="Artikel" subtitle={open.category} onBack={() => setOpen(null)} />
          <View style={styles.body}>
            <View style={styles.detailHead}>
              <Text style={styles.detailEmoji}>{open.emoji}</Text>
              <Text style={styles.detailTitle}>{open.title}</Text>
              <View style={styles.detailMetaRow}>
                <Ionicons name="time-outline" size={13} color={colors.textSoft} />
                <Text style={styles.detailMeta}>{open.readMinutes} menit baca</Text>
              </View>
            </View>
            {open.body.map((paragraph, i) => (
              <Text key={i} style={styles.detailBody}>{paragraph}</Text>
            ))}
            {open.sources && open.sources.length > 0 && (
              <View style={styles.sourcesBox}>
                <Text style={styles.sourcesTitle}>Sumber Real & Fakta</Text>
                {open.sources.map((s, idx) => (
                  <View key={idx} style={styles.sourceRow}>
                    <Text style={styles.sourceDot}>•</Text>
                    <Text style={styles.sourceText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GradientHeader title="Edukasi" subtitle="Artikel kesehatan & pengasuhan bayi" />
        <View style={styles.body}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.muted} />
            <Text style={styles.searchText}>Cari artikel kesehatan bayi</Text>
          </View>
          {articles.map((a, i) => (
            <TouchableOpacity key={a.id} style={styles.card} onPress={() => setOpen(a)} activeOpacity={0.85}>
              <View style={[styles.thumb, { backgroundColor: thumbColors[i % thumbColors.length] }]}>
                <Text style={styles.thumbEmoji}>{a.emoji}</Text>
                <View style={styles.thumbGloss} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.category, { color: thumbColors[i % thumbColors.length] }]}>{a.category}</Text>
                <Text style={styles.title} numberOfLines={2}>{a.title}</Text>
                <Text style={styles.excerpt} numberOfLines={2}>{a.excerpt}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={12} color={colors.textSoft} />
                  <Text style={styles.meta}>{a.readMinutes} menit baca</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
            </TouchableOpacity>
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
    height: 46,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 8,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  searchText: { color: colors.muted, fontSize: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbGloss: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  thumbEmoji: { fontSize: 28, color: colors.white },
  category: { fontSize: font.tiny, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  title: { color: colors.textDark, fontSize: font.body, fontWeight: '800', marginTop: 3, lineHeight: 20 },
  excerpt: { color: colors.textMuted, fontSize: font.tiny, lineHeight: 17, marginTop: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  meta: { color: colors.textSoft, fontSize: font.tiny },
  detailHead: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.card,
  },
  detailEmoji: { fontSize: 48 },
  detailTitle: {
    color: colors.textDark,
    fontSize: font.heading,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  detailMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  detailMeta: { color: colors.textSoft, fontSize: font.tiny },
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
  sourcesTitle: { color: colors.ink, fontSize: font.small, fontWeight: '900', marginBottom: 6 },
  sourceRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  sourceDot: { color: colors.primary, fontSize: font.small, fontWeight: '900' },
  sourceText: { flex: 1, color: colors.muted, fontSize: font.tiny, lineHeight: 17 },
});
