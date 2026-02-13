import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { SliderInput } from '../../components/SliderInput';
import { SuccessModal } from '../../components/SuccessModal';
import { colors, fontSize, spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export function WeeklyFeedbackScreen() {
  const { user } = useAuth();
  const { submitFeedback, getClientFeedbacks } = useData();
  const [trainingAdherence, setTrainingAdherence] = useState(5);
  const [nutritionAdherence, setNutritionAdherence] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [weight, setWeight] = useState('');
  const [bodyMeasurements, setBodyMeasurements] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [achievements, setAchievements] = useState('');
  const [questionsForCoach, setQuestionsForCoach] = useState('');
  const [overallFeeling, setOverallFeeling] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const weekNumber = user ? getClientFeedbacks(user.id).length + 1 : 1;

  async function handleSubmit() {
    if (!difficulties.trim() || !overallFeeling.trim()) return;
    setLoading(true);
    submitFeedback({
      clientId: user!.id,
      clientName: user!.name,
      weekNumber,
      trainingAdherence,
      nutritionAdherence,
      energyLevel,
      sleepQuality,
      stressLevel,
      weight: weight ? parseFloat(weight) : undefined,
      bodyMeasurements: bodyMeasurements.trim() || undefined,
      difficulties: difficulties.trim(),
      achievements: achievements.trim(),
      questionsForCoach: questionsForCoach.trim(),
      overallFeeling: overallFeeling.trim(),
    });
    setLoading(false);
    setShowSuccess(true);
  }

  function resetForm() {
    setTrainingAdherence(5);
    setNutritionAdherence(5);
    setEnergyLevel(5);
    setSleepQuality(5);
    setStressLevel(5);
    setWeight('');
    setBodyMeasurements('');
    setDifficulties('');
    setAchievements('');
    setQuestionsForCoach('');
    setOverallFeeling('');
    setShowSuccess(false);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Ionicons name="clipboard" size={32} color={colors.success} />
        <Text style={styles.title}>Feedback Semanal</Text>
        <Text style={styles.subtitle}>Semana {weekNumber} - Cuéntanos cómo ha ido tu semana</Text>
      </View>

      <Text style={styles.sectionTitle}>Valoraciones</Text>

      <SliderInput label="Adherencia al entrenamiento" value={trainingAdherence} onChange={setTrainingAdherence} />
      <SliderInput label="Adherencia a la nutrición" value={nutritionAdherence} onChange={setNutritionAdherence} />
      <SliderInput label="Nivel de energía" value={energyLevel} onChange={setEnergyLevel} />
      <SliderInput label="Calidad de sueño" value={sleepQuality} onChange={setSleepQuality} />
      <SliderInput label="Nivel de estrés" value={stressLevel} onChange={setStressLevel} />

      <Text style={styles.sectionTitle}>Medidas (opcional)</Text>

      <Input label="Peso actual (kg)" value={weight} onChangeText={setWeight} placeholder="Ej: 74.5" keyboardType="decimal-pad" />
      <Input label="Medidas corporales" value={bodyMeasurements} onChangeText={setBodyMeasurements} placeholder="Ej: Cintura: 82cm, Pecho: 100cm..." multiline style={{ minHeight: 60, textAlignVertical: 'top' }} />

      <Text style={styles.sectionTitle}>Reflexión semanal</Text>

      <Input label="Dificultades encontradas *" value={difficulties} onChangeText={setDifficulties} placeholder="¿Qué te ha costado más esta semana?" multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />
      <Input label="Logros de la semana" value={achievements} onChangeText={setAchievements} placeholder="¿Qué has conseguido esta semana?" multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />
      <Input label="Sensación general *" value={overallFeeling} onChangeText={setOverallFeeling} placeholder="¿Cómo te sientes en general?" multiline numberOfLines={2} style={{ minHeight: 60, textAlignVertical: 'top' }} />
      <Input label="Preguntas para tu entrenador" value={questionsForCoach} onChangeText={setQuestionsForCoach} placeholder="¿Tienes alguna duda?" multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />

      <Button
        title="Enviar Feedback"
        onPress={handleSubmit}
        loading={loading}
        disabled={!difficulties.trim() || !overallFeeling.trim()}
        variant="secondary"
      />

      <SuccessModal
        visible={showSuccess}
        title="¡Feedback Enviado!"
        message="Tu feedback semanal ha sido enviado correctamente. Tu entrenador lo revisará pronto."
        onClose={resetForm}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.primary, marginTop: spacing.md, marginBottom: spacing.md },
});
