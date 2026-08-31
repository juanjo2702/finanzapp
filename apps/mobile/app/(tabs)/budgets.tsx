import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MobileBudgetsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Regla 50 / 30 / 20</Text>
          <Text style={styles.subtitle}>Distribución de gastos del mes</Text>
        </View>

        {/* Needs (50%) */}
        <View style={[styles.card, { borderColor: '#1e3a8a' }]}>
          <View style={styles.row}>
            <Text style={styles.pillarTitle}>50% Necesidades</Text>
            <Text style={[styles.percentage, { color: '#60a5fa' }]}>56% (Bs. 2,150)</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '56%', backgroundColor: '#3b82f6' }]} />
          </View>
          <Text style={styles.detail}>Supermercado, Luz, Agua, Alquiler, Salud</Text>
        </View>

        {/* Wants (30%) */}
        <View style={[styles.card, { borderColor: '#831843' }]}>
          <View style={styles.row}>
            <Text style={styles.pillarTitle}>30% Deseos & Ocio</Text>
            <Text style={[styles.percentage, { color: '#f472b6' }]}>25% (Bs. 975.40)</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '25%', backgroundColor: '#ec4899' }]} />
          </View>
          <Text style={styles.detail}>Restaurantes, Cafés, Salidas, Streaming</Text>
        </View>

        {/* Savings (20%) */}
        <View style={[styles.card, { borderColor: '#064e3b' }]}>
          <View style={styles.row}>
            <Text style={styles.pillarTitle}>20% Ahorro & Deuda</Text>
            <Text style={[styles.percentage, { color: '#34d399' }]}>18% (Bs. 700)</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '18%', backgroundColor: '#10b981' }]} />
          </View>
          <Text style={styles.detail}>Fondo de emergencia, Tarjeta de crédito</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 18 },
  header: { marginBottom: 18 },
  title: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#64748b', fontSize: 12, marginTop: 2 },
  card: { backgroundColor: '#0f172a', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pillarTitle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  percentage: { fontSize: 12, fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: '#1e293b', borderRadius: 4, marginVertical: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  detail: { color: '#64748b', fontSize: 11 },
});
