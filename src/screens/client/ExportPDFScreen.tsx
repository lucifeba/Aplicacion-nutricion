import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function ExportPDFScreen() {
  const { user } = useAuth();
  const { getClientFeedbacks } = useData();
  const feedbacks = getClientFeedbacks(user?.id || '');
  const [loading, setLoading] = useState(false);

  const generateHTML = () => {
    const rows = feedbacks.map(f => `
      <tr>
        <td>Sem. ${f.weekNumber}</td>
        <td>${new Date(f.createdAt).toLocaleDateString('es-ES')}</td>
        <td>${f.trainingAdherence}</td>
        <td>${f.nutritionAdherence}</td>
        <td>${f.energyLevel}</td>
        <td>${f.sleepQuality}</td>
        <td>${f.weight || '-'}</td>
      </tr>`).join('');

    const details = feedbacks.map(f => `
      <div class="detail">
        <h3>Semana ${f.weekNumber} - ${new Date(f.createdAt).toLocaleDateString('es-ES')}</h3>
        <p><strong>Dificultades:</strong> ${f.difficulties}</p>
        ${f.achievements ? `<p><strong>Logros:</strong> ${f.achievements}</p>` : ''}
        <p><strong>Sensación general:</strong> ${f.overallFeeling}</p>
        ${f.questionsForCoach ? `<p><strong>Preguntas:</strong> ${f.questionsForCoach}</p>` : ''}
      </div>`).join('');

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:Arial,sans-serif;margin:40px;color:#1B2A4A}
      .header{background:#1B2A4A;color:white;padding:30px;text-align:center;border-radius:12px}
      .header h1{margin:0;color:#E8A838}
      .header p{margin:5px 0 0;color:#F0C060}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#1B2A4A;color:white;padding:10px;text-align:left}
      td{padding:8px 10px;border-bottom:1px solid #E1E8ED}
      tr:nth-child(even){background:#F5F7FA}
      .detail{background:#F5F7FA;padding:15px;border-radius:8px;margin:10px 0;border-left:4px solid #E8A838}
      h2{color:#1B2A4A;border-bottom:2px solid #E8A838;padding-bottom:8px}
      h3{color:#1B2A4A;margin:0 0 10px}
    </style></head><body>
      <div class="header"><h1>APD SPORT</h1><p>Historial de Progreso - ${user?.name}</p></div>
      <h2>Resumen</h2>
      <table><tr><th>Semana</th><th>Fecha</th><th>Entreno</th><th>Nutrición</th><th>Energía</th><th>Sueño</th><th>Peso</th></tr>${rows}</table>
      <h2>Detalles por Semana</h2>${details}
      <p style="text-align:center;color:#6B7B8D;margin-top:40px">Generado por APD Sport - ${new Date().toLocaleDateString('es-ES')}</p>
    </body></html>`;
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const { uri } = await Print.printToFileAsync({ html: generateHTML() });
      await Sharing.shareAsync(uri);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <Ionicons name="document-text" size={32} color={colors.secondary} />
          <View>
            <Text style={styles.statsNumber}>{feedbacks.length}</Text>
            <Text style={styles.statsLabel}>semanas de feedback registradas</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>El PDF incluye:</Text>
      {['Tabla resumen de todas las semanas', 'Puntuaciones de adherencia y bienestar', 'Registro de peso', 'Dificultades y logros semanales', 'Preguntas realizadas al entrenador'].map((item, i) => (
        <View key={i} style={styles.checkRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.checkText}>{item}</Text>
        </View>
      ))}

      <Button
        title={feedbacks.length === 0 ? 'Sin datos para exportar' : 'Generar y Compartir PDF'}
        onPress={handleExport}
        loading={loading}
        disabled={feedbacks.length === 0}
        fullWidth
        variant="secondary"
        style={styles.exportButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  statsCard: { marginBottom: spacing.lg, backgroundColor: colors.primary },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  statsNumber: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textLight },
  statsLabel: { fontSize: fontSize.sm, color: colors.secondaryLight },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  checkText: { fontSize: fontSize.md, color: colors.text },
  exportButton: { marginTop: spacing.lg },
});
