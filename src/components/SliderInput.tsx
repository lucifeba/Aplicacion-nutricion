import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../theme';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function SliderInput({ label, value, onChange, min = 1, max = 10 }: SliderInputProps) {
  const dots = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} <Text style={styles.valueText}>{value}/{max}</Text></Text>
      <View style={styles.dotsContainer}>
        {dots.map(dot => (
          <TouchableOpacity
            key={dot}
            onPress={() => onChange(dot)}
            style={[styles.dot, dot === value && styles.dotActive]}
          >
            <Text style={[styles.dotText, dot === value && styles.dotTextActive]}>{dot}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: '500' },
  valueText: { color: colors.primary, fontWeight: '700' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: '600' },
  dotTextActive: { color: colors.textLight },
});
