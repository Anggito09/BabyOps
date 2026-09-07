import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientHeader } from '../components/GradientHeader';
import { GradientButton } from '../components/GradientButton';
import { conditions, DANGER_SIGNS, symptomCategories, SymptomCategory, WATCH_OUT_SIGNS } from '../data/symptoms';
import { runForwardChaining } from '../model/forwardChaining';
import { colors, family, font, radius, shadow, spacing } from '../theme/tokens';

function AnimatedCat({ index, children }: { index: number; children: React.ReactNode }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(18)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, delay: index * 60, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 400, delay: index * 60, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }], width: '47.5%', flexGrow: 1 }}>{children}</Animated.View>;
}

interface Props {
  onSaveHistory?: (entry: {
    conditionName: string;
    description: string;
    severity: string;
    emoji: string;
    matchedSymptoms: number;
    symptomIds: string[];
    symptomNames: string[];
    guidance: string[];
    doctorWhen: string;
  }) => void;
}

export function DiagnosisScreen({ onSaveHistory }: Props) {
  const [activeCategory, setActiveCategory] = useState<SymptomCategory | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const outcome = useMemo(() => runForwardChaining(selected), [selected]);
  const condition = conditions[outcome.condition];

  const handleShowResult = () => {
    setShowResult(true);
    const allSymptoms = symptomCategories.flatMap((c) => c.symptoms);
    const symptomNames = selected.map((id) => allSymptoms.find((s) => s.id === id)?.name ?? id);
    onSaveHistory?.({
      conditionName: condition.name,
      description: condition.description,
      severity: condition.severity,
      emoji: condition.emoji,
      matchedSymptoms: selected.length,
      symptomIds: [...selected],
      symptomNames,
      guidance: condition.guidance,
      doctorWhen: condition.doctorWhen,
    });
  };

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const reset = () => {
    setSelected([]);
    setShowResult(false);
    setActiveCategory(null);
  };

  if (showResult) {
    const severityColor =
      condition.severity === 'darurat'
        ? colors.danger
        : condition.severity === 'perlu perhatian'
          ? colors.danger
          : condition.severity === 'sedang'
            ? colors.warning
            : colors.success;
    const dangerLabels = outcome.dangerSigns.map(
      (id) => DANGER_SIGNS.find((d) => d.id === id)?.label ?? id
    );
    return (
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <GradientHeader
            title="Hasil Screening"
            subtitle={`${selected.length} gejala dipilih · ${outcome.matchedRules} aturan cocok${outcome.isEmergency ? ' · TANDA BAHAYA' : ''}`}
            onBack={() => setShowResult(false)}
          />
          <View style={styles.body}>
            {outcome.isEmergency && (
              <View style={styles.emergencyBanner}>
                <Ionicons name="warning" size={22} color={colors.white} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.emergencyTitle}>Segera bawa bayi ke dokter / IGD</Text>
                  <Text style={styles.emergencySub}>
                    Ditemukan {dangerLabels.length} tanda bahaya: {dangerLabels.join(' · ')}
                  </Text>
                </View>
              </View>
            )}

            <View style={[styles.resultCard, outcome.isEmergency && styles.resultCardEmergency]}>
              <Text style={styles.resultEmoji}>{condition.emoji}</Text>
              <Text style={styles.resultName}>{condition.name}</Text>
              <View style={[styles.severityPill, { backgroundColor: severityColor + '1A' }]}>
                <Text style={[styles.severityText, { color: severityColor }]}>Tingkat: {condition.severity}</Text>
              </View>
              <Text style={styles.resultDesc}>{condition.description}</Text>
              {outcome.isMixed && outcome.firedConditions.length > 0 && (
                <Text style={styles.mixedNote}>
                  Pola lain yang ikut terpicu: {outcome.firedConditions.join(', ')} — perlu dinilai tenaga medis.
                </Text>
              )}
            </View>

            <View style={[styles.actionCard, outcome.isEmergency && styles.actionCardEmergency]}>
              <View style={styles.actionHead}>
                <Ionicons
                  name={outcome.isEmergency ? 'warning' : 'medkit'}
                  size={17}
                  color={outcome.isEmergency ? colors.danger : colors.success}
                />
                <Text style={styles.actionTitle}>
                  {outcome.isEmergency ? 'Yang Harus Dilakukan Sekarang' : 'Pertolongan Pertama'}
                </Text>
              </View>
              {condition.guidance.map((g, i) => (
                <View key={i} style={styles.actionRow}>
                  <View style={[styles.actionNum, outcome.isEmergency && styles.actionNumEmergency]}>
                    <Text style={[styles.actionNumText, outcome.isEmergency && { color: colors.danger }]}>{i + 1}</Text>
                  </View>
                  <Text style={styles.actionText}>{g}</Text>
                </View>
              ))}
            </View>

            {outcome.isEmergency && (
              <View style={styles.watchCard}>
                <View style={styles.actionHead}>
                  <Ionicons name="eye" size={17} color={colors.warning} />
                  <Text style={styles.actionTitle}>Tanda Bahaya Lain (segera ke IGD bila muncul)</Text>
                </View>
                {WATCH_OUT_SIGNS.map((w) => (
                  <View key={w} style={styles.watchRow}>
                    <Text style={styles.watchDot}>•</Text>
                    <Text style={styles.watchText}>{w}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.doctorCard}>
              <View style={styles.actionHead}>
                <Ionicons name="alert-circle" size={17} color={colors.danger} />
                <Text style={styles.doctorTitle}>Ke Dokter Bila</Text>
              </View>
              <Text style={styles.doctorText}>{condition.doctorWhen}</Text>
            </View>

            <View style={styles.disclaimerCard}>
              <Ionicons name="information-circle" size={16} color={colors.textMuted} />
              <Text style={styles.disclaimerText}>
                Hasil ini adalah skrining awal berbasis aturan, BUKAN diagnosis medis. Keputusan penanganan tetap oleh tenaga kesehatan.
              </Text>
            </View>

            <View style={styles.ctaRow}>
              <GradientButton label="Ulangi Screening" variant="dark" onPress={reset} style={{ flex: 1 }} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GradientHeader
          title="Diagnosis Gejala"
          subtitle="Sistem pakar · Forward Chaining"
          right={
            selected.length > 0 ? (
              <TouchableOpacity onPress={reset} hitSlop={8}>
                <View style={styles.resetPill}>
                  <Text style={styles.resetText}>Reset</Text>
                </View>
              </TouchableOpacity>
            ) : undefined
          }
        >
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, (selected.length / 8) * 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>{selected.length} gejala</Text>
          </View>
        </GradientHeader>

        <View style={styles.body}>
          <Text style={styles.hint}>Pilih kategori, lalu centang gejala yang terlihat pada bayi Anda.</Text>

          <View style={styles.grid}>
            {symptomCategories.map((cat, i) => {
              const count = cat.symptoms.filter((s) => selected.includes(s.id)).length;
              return (
                <AnimatedCat key={cat.id} index={i}>
                  <TouchableOpacity style={styles.catCard} onPress={() => setActiveCategory(cat)} activeOpacity={0.85}>
                    <View style={[styles.catIcon, { backgroundColor: cat.color + '14' }]}>
                      <Text style={styles.catEmoji}>{cat.emoji}</Text>
                      {count > 0 && (
                        <View style={[styles.catCount, { backgroundColor: cat.color }]}>
                          <Text style={styles.catCountText}>{count}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catCountLabel}>{cat.symptoms.length} gejala</Text>
                  </TouchableOpacity>
                </AnimatedCat>
              );
            })}
          </View>

          {selected.length > 0 && (
            <GradientButton label="Jalankan Screening" onPress={handleShowResult} style={styles.cta} />
          )}
        </View>
      </ScrollView>

      <Modal visible={activeCategory !== null} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            {activeCategory && (
              <>
                <View style={styles.modalHead}>
                  <View style={[styles.modalIcon, { backgroundColor: activeCategory.color + '14' }]}>
                    <Text style={styles.modalEmoji}>{activeCategory.emoji}</Text>
                  </View>
                  <Text style={styles.modalTitle}>Gejala {activeCategory.name}</Text>
                  <TouchableOpacity onPress={() => setActiveCategory(null)} hitSlop={10}>
                    <Ionicons name="close" size={22} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                {activeCategory.symptoms.map((s) => {
                  const checked = selected.includes(s.id);
                  return (
                    <TouchableOpacity key={s.id} style={[styles.symptomRow, checked && styles.symptomRowActive]} onPress={() => toggle(s.id)} activeOpacity={0.7}>
                      <Text style={styles.symptomEmoji}>{s.emoji}</Text>
                      <Text style={styles.symptomName}>{s.name}</Text>
                      <View style={[styles.checkbox, checked && { backgroundColor: activeCategory.color, borderColor: activeCategory.color }]}>
                        {checked && <Ionicons name="checkmark" size={14} color={colors.white} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
                <GradientButton label="Simpan Pilihan" onPress={() => setActiveCategory(null)} style={styles.modalCta} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.skySoft },
  scroll: { paddingBottom: 140 },
  body: { paddingHorizontal: spacing.lg, marginTop: -18 },
  resetPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  resetText: { color: colors.white, fontSize: font.small, fontWeight: '700' },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.white, borderRadius: radius.pill },
  progressText: { color: colors.white, fontSize: font.small, fontWeight: '800', minWidth: 66, textAlign: 'right' },
  hint: {
    color: colors.textMuted,
    fontSize: font.small,
    lineHeight: 20,
    marginTop: spacing.lg,
    fontFamily: family.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  catCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.card,
  },
  catIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: { fontSize: 28 },
  catCount: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: colors.white,
  },
  catCountText: { color: colors.white, fontSize: 10, fontWeight: '900' },
  catName: { color: colors.textDark, fontSize: font.body, fontWeight: '800', marginTop: spacing.md, fontFamily: family.extraBold },
  catCountLabel: { color: colors.textSoft, fontSize: font.tiny, marginTop: 2 },
  cta: { marginTop: spacing.xl },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5,73,123,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: '82%',
  },
  modalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  modalIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEmoji: { fontSize: 22 },
  modalTitle: { flex: 1, color: colors.textDark, fontSize: font.heading, fontWeight: '800' },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.skySoft,
    marginBottom: spacing.sm,
  },
  symptomRowActive: { borderColor: colors.primary, backgroundColor: colors.skySoft },
  symptomEmoji: { fontSize: 20 },
  symptomName: { flex: 1, color: colors.textDark, fontSize: font.body, fontWeight: '600' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.skyAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCta: { marginTop: spacing.md },
  resultCard: {
    backgroundColor: colors.blush,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  resultEmoji: { fontSize: 52 },
  resultName: { color: colors.textDark, fontSize: font.title, fontWeight: '900', textAlign: 'center', marginTop: spacing.sm, letterSpacing: -0.4 },
  severityPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  severityText: { fontSize: font.tiny, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  resultDesc: { color: colors.textMuted, fontSize: font.small, lineHeight: 21, textAlign: 'center', marginTop: spacing.md },
  mixedNote: { color: colors.textMuted, fontSize: font.tiny, lineHeight: 17, textAlign: 'center', marginTop: spacing.sm, fontStyle: 'italic' },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.danger,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  emergencyTitle: { color: colors.white, fontSize: font.body, fontWeight: '900', fontFamily: family.extraBold },
  emergencySub: { color: 'rgba(255,255,255,0.92)', fontSize: font.tiny, lineHeight: 17, marginTop: 2, fontFamily: family.medium },
  resultCardEmergency: { borderWidth: 2, borderColor: colors.danger },
  actionCard: {
    backgroundColor: '#E7FFEB',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  actionCardEmergency: { backgroundColor: '#FFF0F1', borderWidth: 1.5, borderColor: colors.danger + '44' },
  actionNumEmergency: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.danger + '44' },
  watchCard: {
    backgroundColor: '#FFF8E6',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.warning + '55',
  },
  watchRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  watchDot: { color: colors.warning, fontSize: font.small, fontWeight: '900' },
  watchText: { flex: 1, color: colors.textDark, fontSize: font.small, lineHeight: 19, fontWeight: '600' },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: '#E6EDF3',
  },
  disclaimerText: { flex: 1, color: colors.textMuted, fontSize: font.tiny, lineHeight: 17, fontStyle: 'italic' },
  actionHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionTitle: { color: colors.textDark, fontSize: font.body, fontWeight: '800' },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionNum: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumText: { color: colors.success, fontSize: font.tiny, fontWeight: '900' },
  actionText: { flex: 1, color: colors.textDark, fontSize: font.small, lineHeight: 20, fontWeight: '600' },
  doctorCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.danger + '33',
    ...shadow.card,
  },
  doctorTitle: { color: colors.textDark, fontSize: font.body, fontWeight: '800' },
  doctorText: { color: colors.textMuted, fontSize: font.small, lineHeight: 20, marginTop: spacing.sm },
  ctaRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
});
