import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { colors, fontSize, spacing, borderRadius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function AdminHomeScreen({ navigation }: Props) {
  const { allUsers, logout } = useAuth();
  const { trainingRequests, feedbacks, unreadCount } = useData();

  const clients = allUsers.filter(u => u.role === 'client');
  const pendingRequests = trainingRequests.filter(r => r.status === 'pending').length;
  const recentFeedbacks = feedbacks.filter(f => {
    const date = new Date(f.createdAt);
    const now = new Date();
    return (now.getTime() - date.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const stats = [
    { label: 'Clientes', value: clients.length, icon: 'people', color: colors.accent },
    { label: 'Solicitudes', value: pendingRequests, icon: 'document-text', color: colors.warning },
    { label: 'Feedback', value: recentFeedbacks, icon: 'clipboard', color: colors.success },
    { label: 'Alertas', value: unreadCount, icon: 'notifications', color: colors.error },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Panel Admin</Text>
          <Text style={styles.name}>APD Sport</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {stats.map(stat => (
          <Card key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AdminBroadcast')}>
          <Ionicons name="megaphone" size={28} color={colors.secondary} />
          <Text style={styles.actionText}>Difusión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AdminRequests')}>
          <Ionicons name="git-pull-request" size={28} color={colors.warning} />
          <Text style={styles.actionText}>Solicitudes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AdminFeedbacks')}>
          <Ionicons name="analytics" size={28} color={colors.success} />
          <Text style={styles.actionText}>Feedbacks</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Clientes ({clients.length})</Text>

      {clients.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="people-outline" size={40} color={colors.disabled} />
          <Text style={styles.emptyText}>Aún no tienes clientes registrados</Text>
        </Card>
      ) : (
        clients.map(client => (
          <TouchableOpacity
            key={client.id}
            onPress={() => navigation.navigate('AdminClientChat', { clientId: client.id, clientName: client.name })}
            activeOpacity={0.7}
          >
            <Card style={styles.clientCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{client.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientEmail}>{client.email}</Text>
              </View>
              <Ionicons name="chatbubble-ellipses" size={22} color={colors.accent} />
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  greeting: { fontSize: fontSize.md, color: colors.secondaryLight },
  name: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.textLight },
  logoutBtn: { padding: spacing.sm },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.md, marginTop: -spacing.lg, gap: spacing.sm },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.xs },
  statValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text, marginTop: spacing.xs },
  statLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.md },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.text, marginTop: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md },
  emptyCard: { marginHorizontal: spacing.lg, alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { color: colors.textSecondary, marginTop: spacing.sm },
  clientCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.textLight, fontSize: fontSize.lg, fontWeight: '700' },
  clientInfo: { flex: 1, marginLeft: spacing.md },
  clientName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  clientEmail: { fontSize: fontSize.xs, color: colors.textSecondary },
});
