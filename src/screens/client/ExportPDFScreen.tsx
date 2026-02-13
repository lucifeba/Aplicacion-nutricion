import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors, fontSize, spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export function ExportPDFScreen() {
  const { user } = useAuth();
  const { getClientFeedbacks } = useData();
  const [loading, setLoading] = useState(false);

  const feedbacks = user ? getClientFeedbacks(user.id) : [];

  async function generateAndSharePDF() {
    if (feedbacks.length === 0) {
      Alert.alert('Sin datos', 'No tienes feedback semanal registrado para exportar.');
      return;
    }

    setLoading(true);
    try {
      const feedbackRows = feedbacks.map((f, i) => `
        <tr>
          <td>${f.weekNumber}</td>
          <td>${new Date(f.createdAt).toLocaleDateString('es-ES')}</td>
          <td>${f.trainingAdherence}/10</td>
          <td>${f.nutritionAdherence}/10</td>
          <td>${f.energyLevel}/10</td>
          <td>${f.sleepQuality}/10</td>
          <td>${f.weight ? f.weight + ' kg' : '-'}</td>
        </tr>
      `).join('');

      const feedbackDetails = feedbacks.map(f => `
        <div class="feedback-detail">
          <h3>Semana ${f.weekNumber} - ${new Date(f.createdAt).toLocaleDateString('es-ES')}</h3>
          <p><strong>Dificultades:</strong> ${f.difficulties}</p>
          <p><strong>Logros:</strong> ${f.achievements}</p>
          <p><strong>Sensación general:</strong> ${f.overallFeeling}</p>
          ${f.questionsForCoach ? `<p><strong>Preguntas:</strong> ${f.questionsForCoach}</p>` : ''}
        </div>
      `).join('');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #1B2A4A; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #E8A838; padding-bottom: 20px; }
            .header h1 { color: #1B2A4A; margin: 0; font-size: 28px; }
            .header p { color: #6B7B8D; margin: 5px 0; }
            .brand { color: #E8A838; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #1B2A4A; color: white; padding: 10px; text-align: left; font-size: 12px; }
            td { padding: 8px 10px; border-bottom: 1px solid #E1E8ED; font-size: 12px; }
            tr:nth-child(even) { background-color: #F5F7FA; }
            .feedback-detail { background: #F5F7FA; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #E8A838; }
            .feedback-detail h3 { margin: 0 0 10px 0; color: #1B2A4A; font-size: 14px; }
            .feedback-detail p { margin: 5px 0; font-size: 12px; }
            .footer { text-align: center; margin-top: 40px; color: #6B7B8D; font-size: 10px; border-top: 1px solid #E1E8ED; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>APD <span class="brand">SPORT</span></h1>
            <p>Informe de Progreso</p>
            <p><strong>${user?.name}</strong></p>
            <p>Generado: ${new Date().toLocaleDateString('es-ES')}</p>
          </div>

          <h2>Resumen de Progreso Semanal</h2>
          <table>
            <thead>
              <tr>
                <th>Semana</th>
                <th>Fecha</th>
                <th>Entreno</th>
                <th>Nutrición</th>
                <th>Energía</th>
                <th>Sueño</th>
                <th>Peso</th>
              </tr>
            </thead>
            <tbody>
              ${feedbackRows}
            </tbody>
          </table>

          <h2>Detalle por Semana</h2>
          ${feedbackDetails}

          <div class="footer">
            <p>APD Sport - Nutrición & Entrenamiento Personalizado</p>
            <p>Este informe es confidencial y de uso personal</p>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartir informe de progreso' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el PDF. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={48} color={colors.info} />
        <Text style={styles.title}>Exportar Historial</Text>
        <Text style={styles.subtitle}>Descarga tu progreso y feedback en formato PDF</Text>
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Tu historial incluye:</Text>
        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.infoText}>Tabla resumen de todas las semanas</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.infoText}>Valoraciones (entreno, nutrición, energía, sueño)</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.infoText}>Detalle de dificultades y logros por semana</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.infoText}>Evolución de peso corporal</Text>
        </View>
      </Card>

      <Card style={styles.statsCard}>
        <Text style={styles.statsTitle}>Feedback registrado</Text>
        <Text style={styles.statsNumber}>{feedbacks.length}</Text>
        <Text style={styles.statsLabel}>semanas</Text>
      </Card>

      <Button
        title="Generar y Compartir PDF"
        onPress={generateAndSharePDF}
        loading={loading}
        disabled={feedbacks.length === 0}
      />

      {feedbacks.length === 0 && (
        <Text style={styles.emptyText}>Envía tu primer feedback semanal para poder exportar tu historial.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.lg },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  infoCard: { marginBottom: spacing.lg },
  infoTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  infoText: { fontSize: fontSize.sm, color: colors.textSecondary, marginLeft: spacing.sm },
  statsCard: { alignItems: 'center', marginBottom: spacing.xl },
  statsTitle: { fontSize: fontSize.sm, color: colors.textSecondary },
  statsNumber: { fontSize: 48, fontWeight: '800', color: colors.primary, marginVertical: spacing.xs },
  statsLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  emptyText: { textAlign: 'center', color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.md },
});
