import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Card from '../../components/Card';

const scoreColor = (v: number) => v >= 8 ? colors.success : v >= 5 ? colors.warning : colors.error;

export default function AdminFeedbacksScreen() {
  const { feedbacks } = useData();
  const sorted = [...feedbacks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sorted.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="analytics-outline" size={60} color={colors.disabled} />
        <Text style={styles.emptyText}>No hay feedbacks</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {sorted.map(fb => (
        <Card key={fb.id} style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{fb.clientName.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.clientName}>{fb.clientName}</Text>
                <Text style={styles.date}>Semana {fb.weekNumber} · {new Date(fb.createdAt).toLocaleDateString('es-ES')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.scoresRow}>
            {[
              { label: 'Entreno', value: fb.trainingAdherence },
              { label: 'Nutrición', value: fb.nutritionAdherence },
              { label: 'Energía', value: fb.energyLevel },
              { label: 'Sueño', value: fb.sleepQuality },
              { label: 'Estrés', value: fb.stressLevel },
            ].map(s => (
              <View key={s.label} style={styles.scoreItem}>
                <Text style={[styles.scoreValue, { color: scoreColor(s.value) }]}>{s.value}</Text>
                <Text style={styles.scoreLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {fb.weight && <Text style={styles.weight}>Peso: {fb.weight} kg</Text>}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Dificultades</Text>
            <Text style={styles.sectionText}>{fb.difficulties}</Text>
          </View>

          {fb.achievements && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Logros</Text>
              <Text style={styles.sectionText}>{fb.achievements}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Sensación general</Text>
            <Text style={styles.sectionText}>{fb.overallFeeling}</Text>
          </View>

          {fb.questionsForCoach && (
            <View style={styles.questionBox}>
              <Ionicons name="help-circle" size={18} color={colors.info} />
              <Text style={styles.questionText}>{fb.questionsForCoach}</Text>
            </View>
          )}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  emptyText: { fontSize: fontSize.lg, color: colors.disabled, marginTop: spacing.md },
  card: { marginBottom: spacing.md },
  headerRow: { marginBottom: spacing.md },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.textLight, fontWeight: fontWeight.bold, fontSize: fontSize.sm },
  clientName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  date: { fontSize: fontSize.xs, color: colors.textSecondary },
  scoresRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md },
  scoreItem: { alignItems: 'center' },
  scoreValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  scoreLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  weight: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  section: { marginBottom: spacing.sm },
  sectionLabel: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: fontWeight.medium, marginBottom: 2 },
  sectionText: { fontSize: fontSize.sm, color: colors.text },
  questionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#EBF5FF',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  questionText: { fontSize: fontSize.sm, color: colors.info, flex: 1 },
});
