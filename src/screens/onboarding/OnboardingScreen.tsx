import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { OnboardingData } from '../../types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { colors, fontSize, spacing, borderRadius } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const STEPS = [
  { title: 'Datos Personales', icon: 'person' as const, fields: ['name', 'age', 'gender'] },
  { title: 'Medidas Corporales', icon: 'body' as const, fields: ['height', 'weight'] },
  { title: 'Objetivos', icon: 'trophy' as const, fields: ['goal', 'activityLevel'] },
  { title: 'Salud & Dieta', icon: 'heart' as const, fields: ['dietaryRestrictions', 'medicalConditions'] },
  { title: 'Experiencia', icon: 'fitness' as const, fields: ['previousExperience'] },
];

const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro'];
const GOAL_OPTIONS = ['Perder peso', 'Ganar músculo', 'Mantenimiento', 'Mejorar rendimiento', 'Salud general'];
const ACTIVITY_OPTIONS = ['Sedentario', 'Ligeramente activo', 'Moderadamente activo', 'Muy activo', 'Extremadamente activo'];

export function OnboardingScreen() {
  const { completeOnboarding, user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [data, setData] = useState<OnboardingData>({
    name: user?.name || '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: '',
    dietaryRestrictions: '',
    medicalConditions: '',
    previousExperience: '',
  });

  function updateField(field: keyof OnboardingData, value: string) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  function goNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }

  async function handleComplete() {
    setLoading(true);
    await completeOnboarding(data);
    setLoading(false);
  }

  function renderSelectOptions(options: string[], field: keyof OnboardingData) {
    return (
      <View style={styles.optionsGrid}>
        {options.map(option => (
          <Button
            key={option}
            title={option}
            variant={data[field] === option ? 'primary' : 'outline'}
            onPress={() => updateField(field, option)}
            fullWidth={false}
            style={styles.optionButton}
          />
        ))}
      </View>
    );
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
            <Input label="Nombre completo" value={data.name} onChangeText={v => updateField('name', v)} placeholder="Tu nombre completo" />
            <Input label="Edad" value={data.age} onChangeText={v => updateField('age', v)} placeholder="Ej: 30" keyboardType="numeric" />
            <Text style={styles.fieldLabel}>Género</Text>
            {renderSelectOptions(GENDER_OPTIONS, 'gender')}
          </>
        );
      case 1:
        return (
          <>
            <Input label="Altura (cm)" value={data.height} onChangeText={v => updateField('height', v)} placeholder="Ej: 175" keyboardType="numeric" />
            <Input label="Peso (kg)" value={data.weight} onChangeText={v => updateField('weight', v)} placeholder="Ej: 75" keyboardType="numeric" />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.fieldLabel}>Objetivo principal</Text>
            {renderSelectOptions(GOAL_OPTIONS, 'goal')}
            <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Nivel de actividad</Text>
            {renderSelectOptions(ACTIVITY_OPTIONS, 'activityLevel')}
          </>
        );
      case 3:
        return (
          <>
            <Input label="Restricciones alimentarias" value={data.dietaryRestrictions} onChangeText={v => updateField('dietaryRestrictions', v)} placeholder="Ej: Vegetariano, sin gluten..." multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />
            <Input label="Condiciones médicas" value={data.medicalConditions} onChangeText={v => updateField('medicalConditions', v)} placeholder="Ej: Diabetes, hipertensión..." multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />
          </>
        );
      case 4:
        return (
          <>
            <Input label="Experiencia previa con entrenamiento y nutrición" value={data.previousExperience} onChangeText={v => updateField('previousExperience', v)} placeholder="Cuéntanos tu experiencia..." multiline numberOfLines={5} style={{ minHeight: 120, textAlignVertical: 'top' }} />
          </>
        );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bienvenido a APD Sport</Text>
        <Text style={styles.headerSubtitle}>Paso {step + 1} de {STEPS.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.content} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.stepHeader}>
          <Ionicons name={STEPS[step].icon} size={28} color={colors.secondary} />
          <Text style={styles.stepTitle}>{STEPS[step].title}</Text>
        </View>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <Button title="Anterior" onPress={goBack} variant="outline" style={{ flex: 1, marginRight: spacing.sm }} />
        )}
        {step < STEPS.length - 1 ? (
          <Button title="Siguiente" onPress={goNext} style={{ flex: 1 }} />
        ) : (
          <Button title="Completar" onPress={handleComplete} loading={loading} variant="secondary" style={{ flex: 1 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textLight, marginBottom: spacing.xs },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.secondaryLight, marginBottom: spacing.md },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: colors.secondary, borderRadius: 2 },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  stepTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginLeft: spacing.sm },
  fieldLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: '500' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  optionButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 40 },
  footer: { flexDirection: 'row', padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
});
