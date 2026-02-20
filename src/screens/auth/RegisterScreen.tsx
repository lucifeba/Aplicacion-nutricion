import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) { setError('Completa todos los campos'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    setError('');
    setLoading(true);
    const result = await register(email, password, name);
    setLoading(false);
    if (!result.success) setError(result.error || 'Error al registrar');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a APD Sport</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Input label="Nombre completo" value={name} onChangeText={setName} placeholder="Tu nombre" />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="tu@email.com" />
        <Input label="Contraseña" value={password} onChangeText={setPassword} isPassword placeholder="Mínimo 6 caracteres" />
        <Input label="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} isPassword placeholder="Repite la contraseña" />
        <Button title="Registrarse" onPress={handleRegister} loading={loading} fullWidth />
        <Button title="Ya tengo cuenta" onPress={() => navigation.goBack()} variant="ghost" fullWidth />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  error: { backgroundColor: '#FDEDEE', color: colors.error, padding: spacing.md, borderRadius: 8, textAlign: 'center', fontSize: fontSize.sm, marginBottom: spacing.sm },
});
