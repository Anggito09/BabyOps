import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font, gradients, radius, spacing } from '../theme/tokens';

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const dots = useRef([new Animated.Value(0.3), new Animated.Value(0.3), new Animated.Value(0.3)]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();

    const loops = dots.map((d) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(d, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0.3, duration: 420, useNativeDriver: true }),
        ])
      )
    );
    loops.forEach((l, i) => setTimeout(() => l.start(), i * 180));

    const timer = setTimeout(onFinish, 2400);
    return () => {
      clearTimeout(timer);
      loops.forEach((l) => l.stop());
    };
  }, []);

  return (
    <LinearGradient
      colors={[...gradients.github]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.root}
    >
      <Animated.View style={[styles.logoWrap, { transform: [{ scale }], opacity: fade }]}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Baby</Text>
          <View style={styles.logoBaby}>
            <Text style={styles.logoBabyEmoji}>👶</Text>
          </View>
          <Text style={styles.logoText}>ps</Text>
        </View>
        <Text style={styles.tagline}>Your baby voice assistant</Text>
      </Animated.View>

      <Animated.View style={[styles.dotsRow, { opacity: fade }]}>
        {dots.map((d, i) => (
          <Animated.View key={i} style={[styles.dot, { opacity: d }]} />
        ))}
      </Animated.View>

      <Text style={styles.credit}>by Anggito</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  logoWrap: { alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 32, fontWeight: '900', color: colors.white, letterSpacing: -1.2 },
  logoBaby: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  logoBabyEmoji: { fontSize: 18 },
  tagline: {
    color: '#D5F3FF',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
  credit: {
    position: 'absolute',
    bottom: 28,
    color: 'rgba(255,255,255,0.6)',
    fontSize: font.tiny,
    letterSpacing: 0.6,
  },
  dotsRow: { flexDirection: 'row', gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
});
