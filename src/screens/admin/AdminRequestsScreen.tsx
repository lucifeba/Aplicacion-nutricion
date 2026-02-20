import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Card from '../../components/Card';
import Button from '../../components/Button';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: colors.warning },
  reviewed: { label: 'Revisada', color: colors.info },
  approved: { label: 'Aprobada', color: colors.success },
  rejected: { label: 'Rechazada', color: colors.error },
};

export default function AdminRequestsScreen() {
  const { trainingRequests, updateRequestStatus } = useData();
  const sorted = [...trainingRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sorted.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={60} color={colors.disabled} />
        <Text style={styles.emptyText}>No hay solicitudes</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {sorted.map(req => {
        const status = STATUS_CONFIG[req.status];
        return (
          <Card key={req.id} style={styles.card}>
            <View style={styles.headerRow}>
              <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{req.clientName.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.clientName}>{req.clientName}</Text>
                  <Text style={styles.date}>{new Date(req.createdAt).toLocaleDateString('es-ES')}</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: status.color + '20' }]}>
                <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Rutina actual</Text>
              <Text style={styles.sectionText}>{req.currentRoutine}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Cambios solicitados</Text>
              <Text style={styles.sectionText}>{req.requestedChanges}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Motivo</Text>
              <Text style={styles.sectionText}>{req.reason}</Text>
            </View>

            {req.injuryOrPain && (
              <View style={styles.injuryBanner}>
                <Ionicons name="warning" size={18} color={colors.error} />
                <Text style={styles.injuryText}>Lesión/Dolor: {req.injuryDetails || 'Sin detalles'}</Text>
              </View>
            )}

            {req.status === 'pending' && (
              <View style={styles.actions}>
                <Button title="Aprobar" onPress={() => updateRequestStatus(req.id, 'approved')} variant="primary" style={styles.actionBtn} />
                <Button title="Rechazar" onPress={() => updateRequestStatus(req.id, 'rejected')} variant="outline" style={styles.actionBtn} />
              </View>
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  emptyText: { fontSize: fontSize.lg, color: colors.disabled, marginTop: spacing.md },
  card: { marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.textLight, fontWeight: fontWeight.bold, fontSize: fontSize.sm },
  clientName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  date: { fontSize: fontSize.xs, color: colors.textSecondary },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  badgeText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  section: { marginBottom: spacing.sm },
  sectionLabel: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: fontWeight.medium, marginBottom: 2 },
  sectionText: { fontSize: fontSize.sm, color: colors.text },
  injuryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FDEDEE',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  injuryText: { fontSize: fontSize.sm, color: colors.error, flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1 },
});
