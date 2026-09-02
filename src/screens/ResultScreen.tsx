import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { dunstanClasses } from '../data/dunstan';
import { colors, gradients, radius, spacing } from '../theme/tokens';
import { CryPrediction } from '../model/cryClassifier';

interface Props {
  prediction: CryPrediction;
  onBack: () => void;
  onHome: () => void;
}

export function ResultScreen({ prediction, onBack, onHome }: Props) {
  const result = dunstanClasses[prediction.label];
  const [showSolution, setShowSolution] = useState(false);

  if (showSolution) {
    return (
      <LinearGradient colors={[...gradients.github]} style={styles.root}>
        <View style={styles.header}>
          <Pressable onPress={() => setShowSolution(false)} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
            <Text style={styles.backText}>Kembali</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
          <View style={styles.whiteCard}>
            <Text style={styles.bigTitleDark}>Solusi yang dapat dicoba</Text>
            {result.actions.map((x, i) => (
              <View style={styles.step} key={x}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                <Text style={styles.stepText}>{x}</Text>
              </View>
            ))}
            {/* distribution as extra insight */}
            <View style={styles.distBox}>
              <Text style={styles.distTitle}>Distribusi kemungkinan</Text>
              {prediction.distribution.slice(0, 3).map((d) => {
                const cls = dunstanClasses[d.label];
                return (
                  <View key={d.label} style={styles.distRow}>
                    <Text style={styles.distLabel}>{cls.emoji} {d.label}</Text>
                    <View style={styles.distTrack}><View style={[styles.distFill, { width: `${Math.round(d.score * 100)}%`, backgroundColor: cls.color }]} /></View>
                    <Text style={styles.distScore}>{Math.round(d.score * 100)}%</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.alert}>
              <Text style={styles.alertTitle}>Segera hubungi tenaga medis</Text>
              <Text style={styles.alertText}>Jika bayi tampak sangat kesakitan, sulit bernapas, muntah berulang, atau keluhan tidak membaik.</Text>
            </View>
            <Pressable onPress={onHome} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Selesai — ke Beranda</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.resultPage} showsVerticalScrollIndicator={false}>
        <View style={styles.resultCard}>
          <Text style={styles.kicker}>HASIL ANALISIS SUARA</Text>
          <View style={[styles.resultIcon, { backgroundColor: result.color + '14' }]}>
            <Text style={styles.resultIconEmoji}>{result.emoji}</Text>
          </View>
          <Text style={styles.sound}>"{result.label}"</Text>
          <View style={styles.confidencePill}>
            <Text style={styles.confidenceText}>Tingkat keyakinan {Math.round(prediction.confidence * 100)}%</Text>
          </View>
          <Text style={styles.meaning}>Bayi Anda {result.meaning.toLowerCase()}</Text>
          <Text style={styles.copy}>{result.description}</Text>
          <View style={styles.notice}>
            <Ionicons name="information-circle" size={18} color={colors.githubDark} />
            <Text style={styles.noticeText}>Hasil ini merupakan panduan awal, bukan diagnosis medis.</Text>
          </View>
          <Pressable onPress={() => setShowSolution(true)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Lihat solusi</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>
          <Pressable onPress={onBack}><Text style={styles.link}>Rekam ulang</Text></Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 44 },
  header: { paddingHorizontal: spacing.lg, height: 44, justifyContent: 'center' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  backText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  resultPage: { padding: spacing.lg, paddingBottom: 40 },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  kicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.4, color: colors.muted },
  resultIcon: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  resultIconEmoji: { fontSize: 42 },
  sound: { fontSize: 34, fontWeight: '900', color: colors.ink, marginTop: 14 },
  confidencePill: { backgroundColor: '#E4F7E7', paddingHorizontal: 13, paddingVertical: 6, borderRadius: 12, marginTop: 6 },
  confidenceText: { color: '#26813B', fontSize: 11, fontWeight: '800' },
  meaning: { color: colors.ink, fontSize: 16, fontWeight: '700', marginTop: 8 },
  copy: { fontSize: 14, color: colors.ink, lineHeight: 22, textAlign: 'center', marginVertical: 16 },
  notice: { flexDirection: 'row', gap: 9, backgroundColor: '#FFF4D9', borderRadius: 13, padding: 13, alignItems: 'center', alignSelf: 'stretch', marginBottom: 16 },
  noticeText: { fontSize: 11, color: '#5B6670', lineHeight: 16, flex: 1 },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  primaryBtnText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  link: { color: colors.primary, fontWeight: '800', marginTop: 14, fontSize: 13 },
  page: { padding: spacing.lg, paddingBottom: 40, gap: 14 },
  whiteCard: { backgroundColor: colors.white, borderRadius: 24, padding: spacing.lg },
  bigTitleDark: { fontSize: 22, fontWeight: '900', color: colors.ink, textAlign: 'center', marginBottom: 6 },
  step: { flexDirection: 'row', gap: 13, marginTop: 18 },
  stepNum: { width: 31, height: 31, borderRadius: 16, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: colors.primary, fontWeight: '900' },
  stepText: { flex: 1, color: colors.ink, lineHeight: 20, fontSize: 13 },
  distBox: { backgroundColor: '#F7FAFD', borderRadius: 16, padding: spacing.md, marginTop: spacing.lg },
  distTitle: { color: colors.ink, fontSize: 13, fontWeight: '800', marginBottom: spacing.sm },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  distLabel: { width: 72, fontSize: 12, fontWeight: '700', color: colors.ink },
  distTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: '#EAF0F6', overflow: 'hidden' },
  distFill: { height: '100%', borderRadius: 999 },
  distScore: { width: 34, textAlign: 'right', fontSize: 11, fontWeight: '800', color: colors.muted },
  alert: { backgroundColor: '#FFF0F1', padding: 14, borderRadius: 15, marginTop: 18 },
  alertTitle: { color: '#C93542', fontWeight: '900', marginBottom: 5, fontSize: 13 },
  alertText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
