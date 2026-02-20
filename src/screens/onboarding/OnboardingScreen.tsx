import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { OnboardingData } from '../../types';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Input from '../../components/Input';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

const STEPS = [
  { title: 'Datos Personales', icon: 'person' as const, subtitle: 'Cuéntanos sobre ti' },
  { title: 'Medidas Corporales', icon: 'body' as const, subtitle: 'Tu estado actual' },
  { title: 'Objetivos', icon: 'trophy' as const, subtitle: '¿Qué quieres lograr?' },
  { title: 'Salud y Dieta', icon: 'heart' as const, subtitle: 'Información importante' },
  { title: 'Experiencia', icon: 'fitness' as const, subtitle: 'Tu historial deportivo' },
];

const GOALS = ['Perder peso', 'Ganar músculo', 'Mantenimiento', 'Mejorar rendimiento', 'Salud general'];
const ACTIVITY_LEVELS = ['Sedentario', 'Ligeramente activo', 'Moderadamente activo', 'Muy activo', 'Extremadamente activo'];
const GENDERS = ['Masculino', 'Femenino', 'Otro'];

export default function OnboardingScreen() {
  const { completeOnboarding, user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const update = (key: keyof OnboardingData, value: string) => setData(prev => ({ ...prev, [key]: value }));

  const goTo = (s: number) => {
    setStep(s);
    scrollRef.current?.scrollTo({ x: s * width, animated: true });
  };

  const handleComplete = async () => {
    setLoading(true);
    await completeOnboarding(data);
    setLoading(false);
  };

  const renderSelector = (options: string[], selected: string, onSelect: (v: string) => void) => (
    <View style={styles.selectorContainer}>
      {options.map(opt => (
        <Button
          key={opt}
          title={opt}
          variant={selected === opt ? 'primary' : 'outline'}
          onPress={() => onSelect(opt)}
          style={styles.selectorButton}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{STEPS[step].title}</Text>
        <Text style={styles.headerSubtitle}>{STEPS[step].subtitle}</Text>
        <View style={styles.progress}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Step 1: Personal Data */}
        <View style={styles.stepContainer}>
          <ScrollView style={styles.stepScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.iconRow}>
              <Ionicons name="person" size={40} color={colors.secondary} />
            </View>
            <Input label="Nombre completo *" value={data.name} onChangeText={v => update('name', v)} placeholder="Tu nombre" />
            <Input label="Edad *" value={data.age} onChangeText={v => update('age', v)} keyboardType="numeric" placeholder="Ej: 28" />
            <Text style={styles.selectorLabel}>Género *</Text>
            {renderSelector(GENDERS, data.gender, v => update('gender', v))}
          </ScrollView>
        </View>

        {/* Step 2: Body Measurements */}
        <View style={styles.stepContainer}>
          <ScrollView style={styles.stepScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.iconRow}>
              <Ionicons name="body" size={40} color={colors.secondary} />
            </View>
            <Input label="Altura (cm) *" value={data.height} onChangeText={v => update('height', v)} keyboardType="numeric" placeholder="Ej: 175" />
            <Input label="Peso (kg) *" value={data.weight} onChangeText={v => update('weight', v)} keyboardType="numeric" placeholder="Ej: 75" />
          </ScrollView>
        </View>

        {/* Step 3: Goals */}
        <View style={styles.stepContainer}>
          <ScrollView style={styles.stepScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.iconRow}>
              <Ionicons name="trophy" size={40} color={colors.secondary} />
            </View>
            <Text style={styles.selectorLabel}>Objetivo principal *</Text>
            {renderSelector(GOALS, data.goal, v => update('goal', v))}
            <Text style={styles.selectorLabel}>Nivel de actividad *</Text>
            {renderSelector(ACTIVITY_LEVELS, data.activityLevel, v => update('activityLevel', v))}
          </ScrollView>
        </View>

        {/* Step 4: Health & Diet */}
        <View style={styles.stepContainer}>
          <ScrollView style={styles.stepScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.iconRow}>
              <Ionicons name="heart" size={40} color={colors.secondary} />
            </View>
            <Input label="Restricciones alimentarias" value={data.dietaryRestrictions || ''} onChangeText={v => update('dietaryRestrictions', v)} placeholder="Ej: Sin gluten, vegetariano..." multiline />
            <Input label="Condiciones médicas" value={data.medicalConditions || ''} onChangeText={v => update('medicalConditions', v)} placeholder="Ej: Diabetes, hipertensión..." multiline />
          </ScrollView>
        </View>

        {/* Step 5: Experience */}
        <View style={styles.stepContainer}>
          <ScrollView style={styles.stepScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.iconRow}>
              <Ionicons name="fitness" size={40} color={colors.secondary} />
            </View>
            <Input label="Experiencia previa en entrenamiento y nutrición" value={data.previousExperience || ''} onChangeText={v => update('previousExperience', v)} placeholder="Cuéntanos tu experiencia..." multiline numberOfLines={5} />
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && <Button title="Anterior" onPress={() => goTo(step - 1)} variant="outline" style={styles.footerButton} />}
        {step < STEPS.length - 1 ? (
          <Button title="Siguiente" onPress={() => goTo(step + 1)} style={styles.footerButton} />
        ) : (
          <Button title="Completar" onPress={handleComplete} loading={loading} variant="secondary" style={styles.footerButton} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingTop: 60, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg, alignItems: 'center' },
  headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textLight },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.secondaryLight, marginTop: spacing.xs },
  progress: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.3)' },
  progressDotActive: { backgroundColor: colors.secondary },
  stepContainer: { width, paddingHorizontal: spacing.lg },
  stepScroll: { flex: 1, paddingTop: spacing.lg },
  iconRow: { alignItems: 'center', marginBottom: spacing.lg },
  selectorLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500', marginBottom: spacing.sm, marginTop: spacing.sm },
  selectorContainer: { gap: spacing.xs, marginBottom: spacing.md },
  selectorButton: { minHeight: 42, paddingVertical: spacing.sm },
  footer: { flexDirection: 'row', padding: spacing.lg, gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  footerButton: { flex: 1 },
});
