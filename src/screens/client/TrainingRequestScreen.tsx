import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { SuccessModal } from '../../components/SuccessModal';
import { colors, fontSize, spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export function TrainingRequestScreen() {
  const { user } = useAuth();
  const { submitTrainingRequest } = useData();
  const [currentRoutine, setCurrentRoutine] = useState('');
  const [requestedChanges, setRequestedChanges] = useState('');
  const [reason, setReason] = useState('');
  const [injuryOrPain, setInjuryOrPain] = useState(false);
  const [injuryDetails, setInjuryDetails] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!currentRoutine.trim() || !requestedChanges.trim() || !reason.trim()) return;
    setLoading(true);
    submitTrainingRequest({
      clientId: user!.id,
      clientName: user!.name,
      currentRoutine: currentRoutine.trim(),
      requestedChanges: requestedChanges.trim(),
      reason: reason.trim(),
      injuryOrPain,
      injuryDetails: injuryDetails.trim(),
      preferredSchedule: preferredSchedule.trim(),
      additionalNotes: additionalNotes.trim(),
    });
    setLoading(false);
    setShowSuccess(true);
  }

  function resetForm() {
    setCurrentRoutine('');
    setRequestedChanges('');
    setReason('');
    setInjuryOrPain(false);
    setInjuryDetails('');
    setPreferredSchedule('');
    setAdditionalNotes('');
    setShowSuccess(false);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Ionicons name="barbell" size={32} color={colors.secondary} />
        <Text style={styles.title}>Solicitud de Modificación</Text>
        <Text style={styles.subtitle}>Completa el formulario para solicitar cambios en tu rutina de entrenamiento</Text>
      </View>

      <Input
        label="Rutina actual *"
        value={currentRoutine}
        onChangeText={setCurrentRoutine}
        placeholder="Describe tu rutina actual..."
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <Input
        label="Cambios solicitados *"
        value={requestedChanges}
        onChangeText={setRequestedChanges}
        placeholder="¿Qué cambios necesitas?"
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <Input
        label="Motivo del cambio *"
        value={reason}
        onChangeText={setReason}
        placeholder="¿Por qué necesitas este cambio?"
        multiline
        numberOfLines={2}
        style={{ minHeight: 60, textAlignVertical: 'top' }}
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>¿Tienes alguna lesión o dolor?</Text>
        <Switch
          value={injuryOrPain}
          onValueChange={setInjuryOrPain}
          trackColor={{ false: colors.border, true: colors.secondary }}
          thumbColor={colors.surface}
        />
      </View>

      {injuryOrPain && (
        <Input
          label="Detalles de la lesión/dolor"
          value={injuryDetails}
          onChangeText={setInjuryDetails}
          placeholder="Describe tu lesión o dolor..."
          multiline
          numberOfLines={2}
          style={{ minHeight: 60, textAlignVertical: 'top' }}
        />
      )}

      <Input
        label="Horario preferido de entrenamiento"
        value={preferredSchedule}
        onChangeText={setPreferredSchedule}
        placeholder="Ej: Lunes, Miércoles y Viernes por la mañana"
      />

      <Input
        label="Notas adicionales"
        value={additionalNotes}
        onChangeText={setAdditionalNotes}
        placeholder="Cualquier información extra..."
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <Button
        title="Enviar Solicitud"
        onPress={handleSubmit}
        loading={loading}
        disabled={!currentRoutine.trim() || !requestedChanges.trim() || !reason.trim()}
      />

      <SuccessModal
        visible={showSuccess}
        title="¡Solicitud Enviada!"
        message="Tu solicitud de modificación ha sido enviada correctamente. Tu entrenador la revisará pronto."
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
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, paddingVertical: spacing.sm },
  switchLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500', flex: 1 },
});
