import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { colors, fontSize, spacing, borderRadius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const MENU_ITEMS = [
  { id: 'chat', title: 'Mensajería', subtitle: 'Chat con tu entrenador', icon: 'chatbubbles', color: colors.accent, screen: 'ClientChat' },
  { id: 'training', title: 'Modificar Entrenamiento', subtitle: 'Solicita cambios en tu rutina', icon: 'barbell', color: colors.secondary, screen: 'TrainingRequest' },
  { id: 'feedback', title: 'Feedback Semanal', subtitle: 'Envía tu progreso semanal', icon: 'clipboard', color: colors.success, screen: 'WeeklyFeedback' },
];

export function ClientHomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { unreadCount } = useData();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {unreadCount > 0 && (
        <Card style={styles.notificationBanner}>
          <View style={styles.notificationRow}>
            <Ionicons name="notifications" size={22} color={colors.secondary} />
            <Text style={styles.notificationText}>Tienes {unreadCount} notificación{unreadCount > 1 ? 'es' : ''} nueva{unreadCount > 1 ? 's' : ''}</Text>
          </View>
        </Card>
      )}

      <Text style={styles.sectionTitle}>¿Qué quieres hacer?</Text>

      {MENU_ITEMS.map(item => (
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.7}>
          <Card style={styles.menuCard}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={28} color={colors.textLight} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.border} />
          </Card>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={() => navigation.navigate('ExportPDF')} activeOpacity={0.7}>
        <Card style={{ flexDirection: 'row' as const, alignItems: 'center' as const, marginHorizontal: spacing.lg, marginBottom: spacing.md, marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <View style={[styles.iconContainer, { backgroundColor: colors.info }]}>
            <Ionicons name="document-text" size={28} color={colors.textLight} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Exportar Historial</Text>
            <Text style={styles.menuSubtitle}>Descarga tu progreso en PDF</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.border} />
        </Card>
      </TouchableOpacity>
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
  notificationBanner: { marginHorizontal: spacing.lg, marginTop: spacing.md, backgroundColor: colors.primary },
  notificationRow: { flexDirection: 'row', alignItems: 'center' },
  notificationText: { color: colors.textLight, marginLeft: spacing.sm, fontSize: fontSize.sm, fontWeight: '500' },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md },
  menuCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginBottom: spacing.md },
  iconContainer: { width: 52, height: 52, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  menuTextContainer: { flex: 1, marginLeft: spacing.md },
  menuTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  menuSubtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
});
