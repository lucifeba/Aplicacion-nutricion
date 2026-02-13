import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { colors, fontSize, spacing, borderRadius } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export function AdminFeedbacksScreen() {
  const { feedbacks } = useData();

  const sorted = [...feedbacks].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function getScoreColor(score: number): string {
    if (score >= 8) return colors.success;
    if (score >= 5) return colors.warning;
    return colors.error;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Feedbacks Semanales</Text>
      <Text style={styles.subtitle}>{feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''} recibido{feedbacks.length !== 1 ? 's' : ''}</Text>

      {sorted.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="clipboard-outline" size={48} color={colors.disabled} />
          <Text style={styles.emptyText}>No hay feedbacks</Text>
        </Card>
      ) : (
        sorted.map(feedback => (
          <Card key={feedback.id} style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <View style={styles.clientRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{feedback.clientName.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.clientName}>{feedback.clientName}</Text>
                  <Text style={styles.date}>Semana {feedback.weekNumber} - {new Date(feedback.createdAt).toLocaleDateString('es-ES')}</Text>
                </View>
              </View>
            </View>

            <View style={styles.scoresRow}>
              {[
                { label: 'Entreno', value: feedback.trainingAdherence },
                { label: 'Nutrición', value: feedback.nutritionAdherence },
                { label: 'Energía', value: feedback.energyLevel },
                { label: 'Sueño', value: feedback.sleepQuality },
                { label: 'Estrés', value: feedback.stressLevel },
              ].map(score => (
                <View key={score.label} style={styles.scoreItem}>
                  <Text style={[styles.scoreValue, { color: getScoreColor(score.value) }]}>{score.value}</Text>
                  <Text style={styles.scoreLabel}>{score.label}</Text>
                </View>
              ))}
            </View>

            {feedback.weight && (
              <Text style={styles.weight}>Peso: {feedback.weight} kg</Text>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Dificultades</Text>
              <Text style={styles.sectionValue}>{feedback.difficulties}</Text>
            </View>

            {feedback.achievements && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Logros</Text>
                <Text style={styles.sectionValue}>{feedback.achievements}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Sensación general</Text>
              <Text style={styles.sectionValue}>{feedback.overallFeeling}</Text>
            </View>

            {feedback.questionsForCoach && (
              <View style={styles.questionBox}>
                <Ionicons name="help-circle" size={18} color={colors.accent} />
                <Text style={styles.questionText}>{feedback.questionsForCoach}</Text>
              </View>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.lg },
  emptyCard: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { color: colors.textSecondary, marginTop: spacing.sm },
  feedbackCard: { marginBottom: spacing.md },
  feedbackHeader: { marginBottom: spacing.md },
  clientRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  avatarText: { color: colors.textLight, fontWeight: '700' },
  clientName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  date: { fontSize: fontSize.xs, color: colors.textSecondary },
  scoresRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md },
  scoreItem: { alignItems: 'center' },
  scoreValue: { fontSize: fontSize.lg, fontWeight: '800' },
  scoreLabel: { fontSize: 9, color: colors.textSecondary, marginTop: 2 },
  weight: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  section: { marginBottom: spacing.sm },
  sectionLabel: { fontSize: fontSize.xs, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 2 },
  sectionValue: { fontSize: fontSize.sm, color: colors.text },
  questionBox: { flexDirection: 'row', backgroundColor: '#EBF5FF', borderRadius: borderRadius.sm, padding: spacing.sm, marginTop: spacing.sm },
  questionText: { fontSize: fontSize.sm, color: colors.accent, marginLeft: spacing.sm, flex: 1 },
});
