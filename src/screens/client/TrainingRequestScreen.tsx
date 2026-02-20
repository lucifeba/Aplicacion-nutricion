import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import SuccessModal from '../../components/SuccessModal';

export default function TrainingRequestScreen({ navigation }: any) {
  const { user } = useAuth();
  const { submitTrainingRequest } = useData();
  const [currentRoutine, setCurrentRoutine] = useState('');
  const [requestedChanges, setRequestedChanges] = useState('');
  const [reason, setReason] = useState('');
  const [injuryOrPain, setInjuryOrPain] = useState(false);
  const [injuryDetails, setInjuryDetails] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const canSubmit = currentRoutine.trim() && requestedChanges.trim() && reason.trim();

  const handleSubmit = async () => {
    if (!user || !canSubmit) return;
    setLoading(true);
    await submitTrainingRequest({
      clientId: user.id,
      clientName: user.name,
      currentRoutine: currentRoutine.trim(),
      requestedChanges: requestedChanges.trim(),
      reason: reason.trim(),
      injuryOrPain,
      injuryDetails: injuryOrPain ? injuryDetails.trim() : undefined,
      preferredSchedule: preferredSchedule.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    });
    setLoading(false);
    setShowSuccess(true);
  };

  const resetForm = () => {
    setCurrentRoutine(''); setRequestedChanges(''); setReason('');
    setInjuryOrPain(false); setInjuryDetails(''); setPreferredSchedule(''); setAdditionalNotes('');
    setShowSuccess(false);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={styles.infoText}>Los campos marcados con * son obligatorios</Text>
          </View>
        </Card>

        <Input label="Rutina actual *" value={currentRoutine} onChangeText={setCurrentRoutine} placeholder="Describe tu rutina actual..." multiline numberOfLines={3} />
        <Input label="Cambios solicitados *" value={requestedChanges} onChangeText={setRequestedChanges} placeholder="¿Qué cambios necesitas?" multiline numberOfLines={3} />
        <Input label="Motivo del cambio *" value={reason} onChangeText={setReason} placeholder="¿Por qué necesitas este cambio?" multiline numberOfLines={2} />

        <Card style={styles.injuryCard}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Ionicons name="warning" size={20} color={colors.warning} />
              <Text style={styles.switchText}>¿Tienes alguna lesión o dolor?</Text>
            </View>
            <Switch value={injuryOrPain} onValueChange={setInjuryOrPain} trackColor={{ true: colors.warning }} thumbColor={colors.surface} />
          </View>
          {injuryOrPain && (
            <Input label="Detalles de la lesión" value={injuryDetails} onChangeText={setInjuryDetails} placeholder="Describe la lesión o dolor..." multiline />
          )}
        </Card>

        <Input label="Horario preferido" value={preferredSchedule} onChangeText={setPreferredSchedule} placeholder="Ej: Lunes, miércoles y viernes por la mañana" />
        <Input label="Notas adicionales" value={additionalNotes} onChangeText={setAdditionalNotes} placeholder="Algo más que quieras comentar..." multiline numberOfLines={3} />

        <Button title="Enviar Solicitud" onPress={handleSubmit} loading={loading} disabled={!canSubmit} fullWidth variant="secondary" />
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        title="¡Solicitud Enviada!"
        message="Tu solicitud de modificación ha sido enviada correctamente. Tu entrenador la revisará pronto."
        onClose={resetForm}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  infoCard: { marginBottom: spacing.lg, backgroundColor: '#EBF5FF', borderLeftWidth: 4, borderLeftColor: colors.info },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoText: { fontSize: fontSize.sm, color: colors.info, flex: 1 },
  injuryCard: { marginBottom: spacing.md },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  switchText: { fontSize: fontSize.md, color: colors.text, fontWeight: fontWeight.medium },
});
