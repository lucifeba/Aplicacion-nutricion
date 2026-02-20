import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Card from '../../components/Card';

const MENU_ITEMS = [
  { key: 'Chat', title: 'Mensajería', subtitle: 'Chatea con tu entrenador', icon: 'chatbubbles' as const, color: colors.accent },
  { key: 'TrainingRequest', title: 'Modificar Entrenamiento', subtitle: 'Solicita cambios en tu rutina', icon: 'barbell' as const, color: colors.secondary },
  { key: 'WeeklyFeedback', title: 'Feedback Semanal', subtitle: 'Envía tu progreso semanal', icon: 'stats-chart' as const, color: colors.success },
  { key: 'ExportPDF', title: 'Exportar Historial', subtitle: 'Descarga tu progreso en PDF', icon: 'document-text' as const, color: colors.info },
];

export default function ClientHomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { unreadCount } = useData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0]}</Text>
          <Text style={styles.headerSubtitle}>Bienvenido a APD Sport</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {unreadCount > 0 && (
          <Card style={styles.alertCard}>
            <View style={styles.alertRow}>
              <Ionicons name="notifications" size={20} color={colors.secondary} />
              <Text style={styles.alertText}>Tienes {unreadCount} notificación{unreadCount > 1 ? 'es' : ''} sin leer</Text>
            </View>
          </Card>
        )}

        {MENU_ITEMS.map(item => (
          <TouchableOpacity key={item.key} onPress={() => navigation.navigate(item.key)} activeOpacity={0.7}>
            <Card style={styles.menuCard}>
              <View style={styles.menuRow}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={colors.disabled} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
  greeting: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textLight },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.secondaryLight, marginTop: 2 },
  logoutButton: { padding: spacing.sm },
  content: { flex: 1, padding: spacing.lg },
  alertCard: { marginBottom: spacing.md, backgroundColor: '#FFF8E8', borderLeftWidth: 4, borderLeftColor: colors.secondary },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  alertText: { fontSize: fontSize.sm, color: colors.text, fontWeight: fontWeight.medium, flex: 1 },
  menuCard: { marginBottom: spacing.md },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconContainer: { width: 52, height: 52, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1 },
  menuTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  menuSubtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
});
