import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Card from '../../components/Card';

export default function AdminHomeScreen({ navigation }: any) {
  const { allUsers, logout } = useAuth();
  const { trainingRequests, feedbacks, unreadCount } = useData();

  const clients = allUsers.filter(u => u.role === 'client');
  const pendingRequests = trainingRequests.filter(r => r.status === 'pending').length;
  const recentFeedback = feedbacks.filter(f => {
    const d = new Date(f.createdAt);
    const week = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - d.getTime() < week;
  }).length;

  const stats = [
    { label: 'Clientes', value: clients.length, icon: 'people' as const, color: colors.accent },
    { label: 'Solicitudes', value: pendingRequests, icon: 'git-pull-request' as const, color: colors.warning },
    { label: 'Feedback', value: recentFeedback, icon: 'stats-chart' as const, color: colors.success },
    { label: 'Alertas', value: unreadCount, icon: 'notifications' as const, color: colors.error },
  ];

  const actions = [
    { key: 'Broadcast', label: 'Difusión', icon: 'megaphone' as const, color: colors.secondary },
    { key: 'Requests', label: 'Solicitudes', icon: 'list' as const, color: colors.warning },
    { key: 'Feedbacks', label: 'Feedbacks', icon: 'analytics' as const, color: colors.success },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel Admin</Text>
          <Text style={styles.headerSubtitle}>APD Sport</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {stats.map(s => (
            <Card key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon} size={24} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.actionsRow}>
          {actions.map(a => (
            <TouchableOpacity key={a.key} onPress={() => navigation.navigate(a.key)} style={[styles.actionButton, { backgroundColor: a.color }]}>
              <Ionicons name={a.icon} size={22} color={colors.textLight} />
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Clientes ({clients.length})</Text>
        {clients.length === 0 ? (
          <Card><Text style={styles.emptyText}>No hay clientes registrados</Text></Card>
        ) : (
          clients.map(client => (
            <TouchableOpacity key={client.id} onPress={() => navigation.navigate('ClientChat', { client })} activeOpacity={0.7}>
              <Card style={styles.clientCard}>
                <View style={styles.clientRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{client.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                  </View>
                  <Ionicons name="chatbubble-outline" size={22} color={colors.accent} />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textLight },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.secondary },
  logoutBtn: { padding: spacing.sm },
  content: { flex: 1, padding: spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, minWidth: '45%', alignItems: 'center', padding: spacing.md },
  statValue: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginTop: spacing.xs },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, padding: spacing.md, borderRadius: borderRadius.md },
  actionLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textLight },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md },
  clientCard: { marginBottom: spacing.sm },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textLight },
  clientInfo: { flex: 1 },
  clientName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  clientEmail: { fontSize: fontSize.sm, color: colors.textSecondary },
  emptyText: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', padding: spacing.lg },
});
