import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError('Completa todos los campos'); return; }
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error || 'Error al iniciar sesión');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>APD</Text>
          <Text style={styles.brandAccent}>SPORT</Text>
          <Text style={styles.subtitle}>Nutrición & Entrenamiento</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="tu@email.com" />
          <Input label="Contraseña" value={password} onChangeText={setPassword} isPassword placeholder="••••••••" />
          <Button title="Entrar" onPress={handleLogin} loading={loading} fullWidth />
          <Button title="¿Olvidaste tu contraseña?" onPress={() => navigation.navigate('ForgotPassword')} variant="ghost" fullWidth />
          <Button title="Crear cuenta" onPress={() => navigation.navigate('Register')} variant="outline" fullWidth />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xl, backgroundColor: colors.primary, padding: spacing.xl, borderRadius: borderRadius.xl },
  brand: { fontSize: fontSize.title, fontWeight: fontWeight.bold, color: colors.textLight },
  brandAccent: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.secondary },
  subtitle: { fontSize: fontSize.sm, color: colors.secondaryLight, marginTop: spacing.xs },
  form: { gap: spacing.sm },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
  error: { backgroundColor: '#FDEDEE', color: colors.error, padding: spacing.md, borderRadius: borderRadius.sm, textAlign: 'center', fontSize: fontSize.sm },
});
