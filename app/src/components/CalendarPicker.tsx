import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

interface Props {
  value: Date | null;
  onChange: (d: Date) => void;
  maxDate?: Date;
  minDate?: Date;
}

const DAY_LABELS = ['S', 'S', 'R', 'K', 'J', 'S', 'M']; // Min Sen Sel Rab Kam Jum Sab
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function CalendarPicker({ value, onChange, maxDate, minDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Min
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSameDay = (a: Date | null, d: number) =>
    a && a.getFullYear() === viewYear && a.getMonth() === viewMonth && a.getDate() === d;

  const isDisabled = (d: number) => {
    const date = new Date(viewYear, viewMonth, d, 23, 59, 59);
    if (maxDate && date > maxDate) return true;
    if (minDate && date < minDate) return true;
    return false;
  };

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Pressable onPress={prev} hitSlop={8} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={18} color={colors.primary} />
        </Pressable>
        <Text style={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</Text>
        <Pressable onPress={next} hitSlop={8} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </Pressable>
      </View>
      <View style={styles.grid}>
        {DAY_LABELS.map((d, i) => (
          <Text key={`h${i}`} style={styles.dayHead}>{d}</Text>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <View key={`e${i}`} style={styles.dayCell} />;
          const selected = isSameDay(value, d);
          const disabled = isDisabled(d);
          return (
            <Pressable
              key={`d${i}`}
              disabled={disabled}
              onPress={() => onChange(new Date(viewYear, viewMonth, d, 12, 0, 0))}
              style={[styles.dayCell, selected && styles.daySelected, disabled && { opacity: 0.25 }]}
            >
              <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{d}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#F8FBFD',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E6EDF3',
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  navBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E6EDF3' },
  monthLabel: { fontSize: 14, fontWeight: '900', color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayHead: { width: '14.28%', textAlign: 'center', fontSize: 10, fontWeight: '800', color: colors.muted, paddingVertical: 4 },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  daySelected: { backgroundColor: colors.primary },
  dayText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  dayTextSelected: { color: colors.white, fontWeight: '900' },
});
