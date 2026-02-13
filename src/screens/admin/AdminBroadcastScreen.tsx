import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { SuccessModal } from '../../components/SuccessModal';
import { Card } from '../../components/Card';
import { colors, fontSize, spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export function AdminBroadcastScreen() {
  const { user, allUsers } = useAuth();
  const { sendBroadcast } = useData();
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const clientCount = allUsers.filter(u => u.role === 'client').length;

  function handleSend() {
    if (!message.trim() || !user) return;
    sendBroadcast(message.trim(), { id: user.id, name: user.name });
    setShowSuccess(true);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Ionicons name="megaphone" size={40} color={colors.secondary} />
        <Text style={styles.title}>Mensaje de Difusión</Text>
        <Text style={styles.subtitle}>Envía un mensaje a todos tus clientes</Text>
      </View>

      <Card style={styles.infoCard}>
        <Ionicons name="people" size={20} color={colors.accent} />
        <Text style={styles.infoText}>Se enviará a {clientCount} cliente{clientCount !== 1 ? 's' : ''}</Text>
      </Card>

      <Input
        label="Mensaje"
        value={message}
        onChangeText={setMessage}
        placeholder="Escribe tu mensaje de difusión..."
        multiline
        numberOfLines={6}
        style={{ minHeight: 150, textAlignVertical: 'top' }}
      />

      <Button title="Enviar a todos" onPress={handleSend} disabled={!message.trim()} variant="secondary" />

      <SuccessModal
        visible={showSuccess}
        title="¡Mensaje Enviado!"
        message={`Tu mensaje de difusión ha sido enviado a ${clientCount} cliente${clientCount !== 1 ? 's' : ''}.`}
        onClose={() => { setShowSuccess(false); setMessage(''); }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' },
  infoCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  infoText: { fontSize: fontSize.sm, color: colors.textSecondary, marginLeft: spacing.sm },
});
