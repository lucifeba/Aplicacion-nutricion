import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import SuccessModal from '../../components/SuccessModal';

export default function ForgotPasswordScreen({ navigation }: any) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReset = async () => {
    if (!email) { setError('Introduce tu email'); return; }
    setError('');
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.success) {
      setShowSuccess(true);
    } else {
      setError(result.error || 'Error al recuperar contraseña');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>Introduce tu email y te enviaremos una contraseña temporal</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="tu@email.com" />
        <Button title="Recuperar" onPress={handleReset} loading={loading} fullWidth />
        <Button title="Volver al login" onPress={() => navigation.goBack()} variant="ghost" fullWidth />
      </View>
      <SuccessModal
        visible={showSuccess}
        title="Contraseña restablecida"
        message="Tu contraseña temporal es: Reset1234! Cámbiala después de iniciar sesión."
        onClose={() => { setShowSuccess(false); navigation.goBack(); }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  error: { backgroundColor: '#FDEDEE', color: colors.error, padding: spacing.md, borderRadius: 8, textAlign: 'center', fontSize: fontSize.sm, marginBottom: spacing.sm },
});
