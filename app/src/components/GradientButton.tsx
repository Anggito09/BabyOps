import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font, radius, shadow, spacing } from '../theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'brand' | 'dark' | 'ghost';
  style?: ViewStyle;
}

export function GradientButton({ label, onPress, disabled, variant = 'brand', style }: Props) {
  if (variant === 'ghost') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.ghost, style]} activeOpacity={0.8}>
        <Text style={styles.ghostText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  const palette: readonly [string, string] =
    variant === 'dark' ? [colors.primaryDark, colors.primaryDarker] : [colors.primaryLight, colors.primary];

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.85} style={style}>
      <LinearGradient
        colors={palette}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, disabled && { opacity: 0.5 }]}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  label: {
    color: colors.white,
    fontSize: font.body,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  ghost: {
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  ghostText: {
    color: colors.white,
    fontSize: font.body,
    fontWeight: '700',
  },
});
