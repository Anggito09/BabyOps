import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, spacing } from '../theme/tokens';

export type TabKey = 'home' | 'diagnosis' | 'education' | 'profile';

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  onRecord: () => void;
}

const leftItems: Array<{ key: TabKey; icon: keyof typeof Ionicons.glyphMap; label: string }> = [
  { key: 'home', icon: 'home', label: 'Home' },
  { key: 'education', icon: 'book', label: 'Edukasi' },
];
const rightItems: Array<{ key: TabKey; icon: keyof typeof Ionicons.glyphMap; label: string }> = [
  { key: 'diagnosis', icon: 'clipboard', label: 'Diagnosis' },
  { key: 'profile', icon: 'person', label: 'Profil' },
];

export function BottomNav({ active, onChange, onRecord }: Props) {
  const renderItem = (item: { key: TabKey; icon: any; label: string }) => {
    const isActive = active === item.key;
    return (
      <TouchableOpacity key={item.key} style={styles.tab} onPress={() => onChange(item.key)} activeOpacity={0.7}>
        <Ionicons
          name={isActive ? item.icon : (`${String(item.icon)}-outline` as any)}
          size={21}
          color={isActive ? colors.primary : '#87A7B4'}
        />
        <Text style={[styles.label, isActive && { color: colors.primary }]}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {leftItems.map(renderItem)}
        <View style={styles.fabSlot} />
        {rightItems.map(renderItem)}
      </View>
      <TouchableOpacity style={styles.fab} onPress={onRecord} activeOpacity={0.85}>
        <LinearGradient
          colors={[colors.primaryLight, colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="mic" size={26} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 10,
    ...shadow.card,
  },
  tab: {
    width: 58,
    alignItems: 'center',
    gap: 3,
  },
  label: { fontSize: 9, color: '#87A7B4' },
  fabSlot: { width: 72 },
  fab: {
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    borderWidth: 5,
    borderColor: '#D7F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
  fabGradient: {
    flex: 1,
    width: '100%',
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
