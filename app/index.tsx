import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Good morning</Text>
            <Text style={styles.title}>How is your baby today?</Text>
          </View>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
          </Pressable>
        </View>

        <View style={styles.babyCard}>
          <View>
            <Text style={styles.cardLabel}>Baby profile</Text>
            <Text style={styles.babyName}>My Baby</Text>
            <Text style={styles.babyAge}>3 months old</Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="happy-outline" size={34} color={Colors.primary} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="mic-outline" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Record Cry</Text>
            <Text style={styles.actionText}>Understand possible baby needs from a cry pattern.</Text>
          </Pressable>

          <Pressable style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="medkit-outline" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Check Symptoms</Text>
            <Text style={styles.actionText}>Review symptoms and get supportive guidance.</Text>
          </Pressable>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View>
              <Text style={styles.cardLabel}>Recent insight</Text>
              <Text style={styles.insightTitle}>No recent alerts</Text>
            </View>
            <Ionicons name="shield-checkmark-outline" size={28} color={Colors.success} />
          </View>
          <Text style={styles.insightText}>
            Keep recording important symptoms and changes so BabyOps can help you organize your baby's health information.
          </Text>
        </View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            BabyOps provides supportive information and does not replace professional medical diagnosis or emergency care.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.lg, paddingBottom: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  eyebrow: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  title: { maxWidth: 270, fontSize: 28, lineHeight: 34, fontWeight: '700', color: Colors.text },
  iconButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  babyCard: { padding: Spacing.lg, borderRadius: Radius.lg, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl },
  cardLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  babyName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  babyAge: { fontSize: 14, color: '#DDE8FF' },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.lg },
  actionCard: { flex: 1, minHeight: 190, padding: 16, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  actionIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  actionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  actionText: { fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  insightCard: { padding: Spacing.lg, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
  insightHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  insightTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  insightText: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
  disclaimer: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: Radius.sm, backgroundColor: '#EEF3F8' },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 18, color: Colors.textSecondary },
});
