import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { SuccessModal } from '../../components/SuccessModal';
import { colors, fontSize, spacing } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function ForgotPasswordScreen({ navigation }: Props) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  async function handleReset() {
    if (!email.trim()) {
      setError('Por favor introduce tu email');
      return;
    }
    setError('');
    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);
    if (result.success) {
      setSuccessMessage(result.message);
      setShowSuccess(true);
    } else {
      setError(result.message);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>Introduce tu email para restablecer tu contraseña</Text>

        <Input label="Email" value={email} onChangeText={setEmail} placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title="Restablecer contraseña" onPress={handleReset} loading={loading} />
        <Button title="Volver al login" onPress={() => navigation.goBack()} variant="ghost" style={{ marginTop: spacing.sm }} />

        <SuccessModal
          visible={showSuccess}
          title="Email enviado"
          message={successMessage}
          onClose={() => { setShowSuccess(false); navigation.goBack(); }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  error: { color: colors.error, fontSize: fontSize.sm, textAlign: 'center', marginBottom: spacing.md },
});
