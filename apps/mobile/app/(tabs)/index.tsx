import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowDownLeft, ArrowUpRight, Smartphone, ShieldCheck } from 'lucide-react-native';

export default function MobileHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, Juan José 👋</Text>
            <Text style={styles.subtitle}>Cochabamba &middot; Moneda Base: BOB</Text>
          </View>
          <View style={styles.badgePro}>
            <Text style={styles.badgeProText}>PRO</Text>
          </View>
        </View>

        {/* Net Worth Card */}
        <View style={styles.netWorthCard}>
          <Text style={styles.cardLabel}>PATRIMONIO NETO CONSOLIDADO</Text>
          <Text style={styles.netWorthAmount}>Bs. 24,170.50</Text>
          <View style={styles.multicurrencyPills}>
            <Text style={styles.pillText}>BOB: 13,670 Bs</Text>
            <Text style={styles.pillText}>USD: $1,500</Text>
            <Text style={styles.pillText}>USDT: 500 ₮</Text>
          </View>
        </View>

        {/* Quick Month Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Ingresos (Mes)</Text>
            <Text style={styles.incomeValue}>+ Bs. 9,500</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Gastos (Mes)</Text>
            <Text style={styles.expenseValue}>- Bs. 3,825</Text>
          </View>
        </View>

        {/* Bank SMS Listener Active Banner */}
        <View style={styles.smsListenerBanner}>
          <Smartphone color="#f59e0b" size={20} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.smsBannerTitle}>Detección de SMS Bancarios Activa</Text>
            <Text style={styles.smsBannerSubtitle}>BCP, BNB, Banco Unión y QR se capturan automáticamente.</Text>
          </View>
        </View>

        {/* Recent Transactions Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Gastos Registrados</Text>
        </View>

        <View style={styles.transactionItem}>
          <View style={styles.txIconExpense}>
            <ArrowDownLeft color="#ef4444" size={18} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.txMerchant}>Hipermaxi El Prado</Text>
            <Text style={styles.txMeta}>Supermercado &middot; SMS BCP</Text>
          </View>
          <Text style={styles.txAmountExpense}>- Bs. 245.50</Text>
        </View>

        <View style={styles.transactionItem}>
          <View style={styles.txIconExpense}>
            <ArrowDownLeft color="#ef4444" size={18} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.txMerchant}>Café Typica</Text>
            <Text style={styles.txMeta}>Restaurantes &middot; Push</Text>
          </View>
          <Text style={styles.txAmountExpense}>- Bs. 110.00</Text>
        </View>
      </ScrollView>

      {/* Floating Fast Add Button */}
      <TouchableOpacity style={styles.fabButton} activeOpacity={0.85}>
        <Plus color="#ffffff" size={26} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  badgePro: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeProText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: 'bold',
  },
  netWorthCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderColor: '#1e293b',
    borderWidth: 1,
    marginBottom: 14,
  },
  cardLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  netWorthAmount: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  multicurrencyPills: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  pillText: {
    color: '#94a3b8',
    fontSize: 11,
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 11,
  },
  incomeValue: {
    color: '#10b981',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 4,
  },
  expenseValue: {
    color: '#ef4444',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 4,
  },
  smsListenerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451a03',
    borderColor: '#78350f',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  smsBannerTitle: {
    color: '#fef3c7',
    fontSize: 12,
    fontWeight: 'bold',
  },
  smsBannerSubtitle: {
    color: '#fde68a',
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderColor: '#1e293b',
    borderWidth: 1,
  },
  txIconExpense: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#450a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txMerchant: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  txMeta: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  txAmountExpense: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
