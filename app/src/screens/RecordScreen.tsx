import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { classifier, CryPrediction } from '../model/cryClassifier';
import { colors, gradients, spacing } from '../theme/tokens';

interface Props {
  onBack: () => void;
  onResult: (prediction: CryPrediction) => void;
}

export function RecordScreen({ onBack, onResult }: Props) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [processing, setProcessing] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!recording) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [recording]);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const toggle = async () => {
    if (processing) return;
    if (!recording) {
      setSeconds(0);
      setRecording(true);
      return;
    }
    setRecording(false);
    setProcessing(true);
    const prediction = await classifier.classify({ mfcc: [], durationSec: seconds });
    setTimeout(() => onResult(prediction), 400);
  };

  return (
    <LinearGradient colors={[...gradients.github]} style={styles.root}>
      {/* Header — kembali */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Text style={styles.kicker}>{processing ? 'MENGANALISIS SUARA…' : recording ? 'SEDANG MENDENGARKAN…' : 'ANALISIS SUARA BAYI'}</Text>
        <Text style={styles.bigTitle}>{recording ? 'Sedang mendengarkan…' : 'Rekam tangisan bayi'}</Text>
        <Text style={styles.desc}>Dekatkan ponsel sekitar 30–50 cm dari bayi dan pastikan suasana cukup tenang.</Text>

        <Animated.View style={{ transform: [{ scale: recording ? pulse : 1 }] }}>
          <View style={styles.rings}>
            <View style={styles.ring2}>
              <View style={styles.babyCircle}>
                <Image source={require('../../assets/baby-record.png')} style={styles.babyImage} resizeMode="contain" />
              </View>
            </View>
          </View>
        </Animated.View>

        {recording && <Text style={styles.timer}>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</Text>}

        <Pressable
          style={[styles.recordBtn, recording && styles.stopBtn, processing && { opacity: 0.6 }]}
          onPress={toggle}
          disabled={processing}
        >
          <Ionicons name={processing ? 'hourglass' : recording ? 'stop' : 'mic'} color={colors.white} size={20} />
          <Text style={styles.recordBtnText}>{processing ? 'Memproses MFCC + KNN…' : recording ? 'Selesai' : 'Mulai rekam'}</Text>
        </Pressable>
        <Text style={styles.hint}>{processing ? 'Sabar, analisis berjalan…' : recording ? 'Ketuk Selesai untuk analisis' : 'Ketuk untuk mulai • hindari suara bising'}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 44 },
  header: { paddingHorizontal: spacing.lg, height: 44, justifyContent: 'center' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  backText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  kicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.4, color: '#CFF2FF', textAlign: 'center' },
  bigTitle: { fontSize: 26, fontWeight: '900', color: colors.white, textAlign: 'center', marginTop: 8 },
  desc: { color: '#D5EFF9', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 9, maxWidth: 320 },
  rings: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: '#73CFF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 26,
  },
  ring2: {
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1,
    borderColor: '#A6E4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  babyCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  babyImage: { width: 90, height: 90 },
  timer: { color: colors.white, fontSize: 28, fontWeight: '900', letterSpacing: 1, marginBottom: 14 },
  recordBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#12B6E9',
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 3,
    borderColor: '#8FE3FA',
  },
  stopBtn: { backgroundColor: '#F04B55', borderColor: '#FFC0C4' },
  recordBtnText: { color: colors.white, fontWeight: '900', fontSize: 14 },
  hint: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 12, textAlign: 'center' },
});
