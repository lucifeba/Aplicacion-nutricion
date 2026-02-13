import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, fontSize, spacing, borderRadius } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: colors.warning, icon: 'time' },
  reviewed: { label: 'Revisada', color: colors.info, icon: 'eye' },
  approved: { label: 'Aprobada', color: colors.success, icon: 'checkmark-circle' },
  rejected: { label: 'Rechazada', color: colors.error, icon: 'close-circle' },
} as const;

export function AdminRequestsScreen() {
  const { trainingRequests, updateRequestStatus } = useData();

  const sortedRequests = [...trainingRequests].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Solicitudes de Modificación</Text>
      <Text style={styles.subtitle}>{trainingRequests.length} solicitud{trainingRequests.length !== 1 ? 'es' : ''}</Text>

      {sortedRequests.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={48} color={colors.disabled} />
          <Text style={styles.emptyText}>No hay solicitudes</Text>
        </Card>
      ) : (
        sortedRequests.map(request => {
          const statusCfg = STATUS_CONFIG[request.status];
          return (
            <Card key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.clientRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{request.clientName.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.clientName}>{request.clientName}</Text>
                    <Text style={styles.date}>{new Date(request.createdAt).toLocaleDateString('es-ES')}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusCfg.color }]}>
                  <Text style={styles.statusText}>{statusCfg.label}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Rutina actual</Text>
                <Text style={styles.sectionValue}>{request.currentRoutine}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Cambios solicitados</Text>
                <Text style={styles.sectionValue}>{request.requestedChanges}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Motivo</Text>
                <Text style={styles.sectionValue}>{request.reason}</Text>
              </View>

              {request.injuryOrPain && (
                <View style={styles.injuryBanner}>
                  <Ionicons name="warning" size={18} color={colors.error} />
                  <Text style={styles.injuryText}>Lesión/dolor: {request.injuryDetails || 'Sí'}</Text>
                </View>
              )}

              {request.status === 'pending' && (
                <View style={styles.actionsRow}>
                  <Button title="Aprobar" onPress={() => updateRequestStatus(request.id, 'approved')} variant="primary" style={{ flex: 1, marginRight: spacing.sm }} />
                  <Button title="Rechazar" onPress={() => updateRequestStatus(request.id, 'rejected')} variant="outline" style={{ flex: 1 }} />
                </View>
              )}
            </Card>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.lg },
  emptyCard: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { color: colors.textSecondary, marginTop: spacing.sm },
  requestCard: { marginBottom: spacing.md },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  clientRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  avatarText: { color: colors.textLight, fontWeight: '700' },
  clientName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  date: { fontSize: fontSize.xs, color: colors.textSecondary },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  statusText: { color: colors.textLight, fontSize: 10, fontWeight: '700' },
  section: { marginBottom: spacing.sm },
  sectionLabel: { fontSize: fontSize.xs, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 2 },
  sectionValue: { fontSize: fontSize.sm, color: colors.text },
  injuryBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', borderRadius: borderRadius.sm, padding: spacing.sm, marginVertical: spacing.sm },
  injuryText: { color: colors.error, fontSize: fontSize.sm, marginLeft: spacing.sm, flex: 1 },
  actionsRow: { flexDirection: 'row', marginTop: spacing.md },
});
