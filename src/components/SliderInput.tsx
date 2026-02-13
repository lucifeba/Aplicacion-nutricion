import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, fontSize, spacing } from '../theme';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function SliderInput({ label, value, onChange, min = 1, max = 10 }: SliderInputProps) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}: <Text style={styles.value}>{value}/{max}</Text></Text>
      <View style={styles.buttonsRow}>
        {values.map(v => (
          <TouchableOpacity
            key={v}
            style={[styles.button, v === value && styles.buttonActive]}
            onPress={() => onChange(v)}
          >
            <Text style={[styles.buttonText, v === value && styles.buttonTextActive]}>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  value: {
    color: colors.primary,
    fontWeight: '700',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  buttonTextActive: {
    color: colors.textLight,
    fontWeight: '700',
  },
});
