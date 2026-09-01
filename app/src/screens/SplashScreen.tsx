import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font, gradients, radius, spacing } from '../theme/tokens';

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const dots = useRef([new Animated.Value(0.3), new Animated.Value(0.3), new Animated.Value(0.3)]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -10, duration: 900, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

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
      <Animated.View style={[styles.logoWrap, { transform: [{ scale }, { translateY: float }], opacity: fade }]}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <Animated.Text style={[styles.tagline, { opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }]}>Your baby voice assistant</Animated.Text>
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
  logoWrap: { alignItems: 'center', gap: spacing.md },
  logoImage: { width: 200, height: 62, tintColor: colors.white },
  tagline: {
    color: '#D5F3FF',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    fontWeight: '700',
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
