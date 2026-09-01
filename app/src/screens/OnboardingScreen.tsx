import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, gradients, radius, spacing } from '../theme/tokens';

const slideImages = [
  require('../../assets/onboarding-baby-cry.png'),
  require('../../assets/onboarding-baby-bottle.png'),
  require('../../assets/onboarding-mother.png'),
];

interface Props {
  onFinish: () => void;
}

const slides = [
  {
    emoji: '👶',
    bubble: 'Ouh Neh!',
    title: 'Kenali Keinginan Bayi',
    desc: 'BabyOps membantu orang tua memahami arti tangisan bayi dengan pengalaman yang sederhana dan menenangkan.',
  },
  {
    emoji: '🍼',
    bubble: 'Neh Ouh?',
    title: 'Buat Si Kecil Bahagia',
    desc: 'Rekam suara bayi, dapatkan kemungkinan kebutuhan, lalu lihat langkah yang bisa dilakukan.',
  },
  {
    emoji: '🤱',
    bubble: 'For Mom',
    title: 'Edukasi untuk Ibu',
    desc: 'Temukan artikel singkat dan praktis mengenai kesehatan, menyusui, dan perkembangan bayi.',
  },
];

export function OnboardingScreen({ onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const fade = useRef(new Animated.Value(1)).current;
  const slideX = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(1)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -6, duration: 1300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    fade.setValue(0);
    slideX.setValue(18);
    bubbleScale.setValue(0.85);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slideX, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(bubbleScale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [index]);

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else onFinish();
  };

  return (
    <LinearGradient colors={[...gradients.github]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.root}>
      <View style={styles.topRow}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <TouchableOpacity onPress={onFinish} hitSlop={10}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.hero, { opacity: fade, transform: [{ translateX: slideX }] }]}>
        <Animated.View style={[styles.bubble, { transform: [{ scale: bubbleScale }] }]}>
          <Text style={styles.bubbleText}>{slide.bubble}</Text>
        </Animated.View>
        <Animated.View style={[styles.heroCircleWrap, { transform: [{ translateY: float }] }]}>
          <View style={styles.heroCircleBg} />
          <View style={styles.heroCircle}>
            <Image source={slideImages[index]} style={styles.heroImage} resizeMode="contain" />
          </View>
          <Ionicons name="leaf" size={18} color="rgba(255,255,255,0.55)" style={styles.leafLeft} />
          <Ionicons name="leaf" size={14} color="rgba(255,255,255,0.4)" style={styles.leafRight} />
        </Animated.View>
      </Animated.View>

      <View style={styles.card}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
        <TouchableOpacity
          onPress={next}
          activeOpacity={0.85}
          style={styles.cta}
        >
          <LinearGradient colors={[colors.primary, colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGradient}>
            <Text style={styles.ctaText}>{index === slides.length - 1 ? 'Mulai sekarang' : 'Selanjutnya'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 54 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  logoImage: { width: 110, height: 28, tintColor: colors.white },
  skipText: { color: colors.white, fontSize: font.small, fontWeight: '700' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: spacing.lg, gap: 8 },
  bubble: {
    backgroundColor: colors.white,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 25,
    marginBottom: 4,
    shadowColor: '#064B70',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  bubbleText: { fontSize: 22, fontWeight: '900', color: colors.ink },
  heroCircleWrap: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  heroCircleBg: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064B70',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  heroImage: { width: 130, height: 130 },
  leafLeft: { position: 'absolute', left: 6, top: 34, transform: [{ rotate: '-18deg' }] },
  leafRight: { position: 'absolute', right: 10, bottom: 42, transform: [{ rotate: '22deg' }] },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    padding: spacing.xl,
    paddingBottom: 36,
  },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginBottom: spacing.md },
  dot: { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: '#CFE0E7' },
  dotActive: { width: 22, backgroundColor: colors.primary },
  title: { fontSize: 25, fontWeight: '900', color: colors.ink, textAlign: 'center' },
  desc: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontSize: font.body,
  },
  cta: { borderRadius: radius.md, overflow: 'hidden' },
  ctaGradient: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: colors.white, fontWeight: '800', fontSize: font.body },
});
