import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import SliderInput from '../../components/SliderInput';
import SuccessModal from '../../components/SuccessModal';

export default function WeeklyFeedbackScreen({ navigation }: any) {
  const { user } = useAuth();
  const { getClientFeedbacks, submitFeedback } = useData();
  const clientFeedbacks = getClientFeedbacks(user?.id || '');
  const weekNumber = clientFeedbacks.length + 1;

  const [trainingAdherence, setTrainingAdherence] = useState(5);
  const [nutritionAdherence, setNutritionAdherence] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [weight, setWeight] = useState('');
  const [bodyMeasurements, setBodyMeasurements] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [achievements, setAchievements] = useState('');
  const [overallFeeling, setOverallFeeling] = useState('');
  const [questionsForCoach, setQuestionsForCoach] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const canSubmit = difficulties.trim() && overallFeeling.trim();

  const handleSubmit = async () => {
    if (!user || !canSubmit) return;
    setLoading(true);
    await submitFeedback({
      clientId: user.id,
      clientName: user.name,
      weekNumber,
      trainingAdherence,
      nutritionAdherence,
      energyLevel,
      sleepQuality,
      stressLevel,
      weight: weight.trim() || undefined,
      bodyMeasurements: bodyMeasurements.trim() || undefined,
      difficulties: difficulties.trim(),
      achievements: achievements.trim() || undefined,
      overallFeeling: overallFeeling.trim(),
      questionsForCoach: questionsForCoach.trim() || undefined,
    });
    setLoading(false);
    setShowSuccess(true);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.weekCard}>
          <View style={styles.weekRow}>
            <Ionicons name="calendar" size={24} color={colors.secondary} />
            <Text style={styles.weekText}>Semana {weekNumber}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Valoraciones (1-10)</Text>
        <Card>
          <SliderInput label="Adherencia al entrenamiento" value={trainingAdherence} onChange={setTrainingAdherence} />
          <SliderInput label="Adherencia a la nutrición" value={nutritionAdherence} onChange={setNutritionAdherence} />
          <SliderInput label="Nivel de energía" value={energyLevel} onChange={setEnergyLevel} />
          <SliderInput label="Calidad del sueño" value={sleepQuality} onChange={setSleepQuality} />
          <SliderInput label="Nivel de estrés" value={stressLevel} onChange={setStressLevel} />
        </Card>

        <Text style={styles.sectionTitle}>Medidas (opcional)</Text>
        <Input label="Peso (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="Ej: 75.5" />
        <Input label="Medidas corporales" value={bodyMeasurements} onChangeText={setBodyMeasurements} placeholder="Ej: Cintura 80cm, Pecho 100cm..." multiline />

        <Text style={styles.sectionTitle}>Reflexión semanal</Text>
        <Input label="Dificultades encontradas *" value={difficulties} onChangeText={setDifficulties} placeholder="¿Qué te ha costado más esta semana?" multiline numberOfLines={3} />
        <Input label="Logros de la semana" value={achievements} onChangeText={setAchievements} placeholder="¿De qué estás orgulloso/a?" multiline numberOfLines={3} />
        <Input label="Sensación general *" value={overallFeeling} onChangeText={setOverallFeeling} placeholder="¿Cómo te has sentido en general?" multiline numberOfLines={2} />
        <Input label="Preguntas para tu entrenador" value={questionsForCoach} onChangeText={setQuestionsForCoach} placeholder="¿Tienes alguna duda?" multiline numberOfLines={2} />

        <Button title="Enviar Feedback" onPress={handleSubmit} loading={loading} disabled={!canSubmit} fullWidth variant="secondary" />
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        title="¡Feedback Enviado!"
        message={`Tu feedback de la semana ${weekNumber} ha sido enviado correctamente. Tu entrenador lo revisará pronto.`}
        onClose={() => { setShowSuccess(false); navigation.goBack(); }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  weekCard: { marginBottom: spacing.lg, backgroundColor: colors.primary },
  weekRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, justifyContent: 'center' },
  weekText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textLight },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
});
