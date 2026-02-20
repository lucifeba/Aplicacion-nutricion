import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import SuccessModal from '../../components/SuccessModal';

export default function AdminBroadcastScreen({ navigation }: any) {
  const { user, allUsers } = useAuth();
  const { sendBroadcast } = useData();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const clients = allUsers.filter(u => u.role === 'client');

  const handleSend = async () => {
    if (!user || !message.trim()) return;
    setLoading(true);
    await sendBroadcast(message.trim(), { _id: user.id, name: user.name });
    setLoading(false);
    setShowSuccess(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="megaphone" size={28} color={colors.secondary} />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Mensaje de Difusión</Text>
            <Text style={styles.infoSubtitle}>Se enviará a {clients.length} cliente{clients.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.label}>Mensaje</Text>
      <TextInput
        style={styles.textInput}
        value={message}
        onChangeText={setMessage}
        placeholder="Escribe tu mensaje para todos los clientes..."
        placeholderTextColor={colors.disabled}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <Button title="Enviar a todos" onPress={handleSend} loading={loading} disabled={!message.trim()} fullWidth variant="secondary" />

      <SuccessModal
        visible={showSuccess}
        title="¡Mensaje Enviado!"
        message={`Tu mensaje de difusión ha sido enviado a ${clients.length} cliente${clients.length !== 1 ? 's' : ''}.`}
        onClose={() => { setShowSuccess(false); setMessage(''); navigation.goBack(); }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  infoCard: { marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  infoText: { flex: 1 },
  infoTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  infoSubtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary, marginBottom: spacing.xs },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    minHeight: 150,
    marginBottom: spacing.lg,
  },
});
