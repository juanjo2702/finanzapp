import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';

const DEMO_TXS = [
  { id: '1', merchant: 'Hipermaxi El Prado', cat: 'Supermercado', amount: '245.50', isExpense: true, date: '28 Ago' },
  { id: '2', merchant: 'Café Typica', cat: 'Restaurantes', amount: '110.00', isExpense: true, date: '27 Ago' },
  { id: '3', merchant: 'Nómina Tech SRL', cat: 'Sueldo', amount: '9,500.00', isExpense: false, date: '25 Ago' },
  { id: '4', merchant: 'Netflix Premium', cat: 'Suscripciones', amount: '69.90', isExpense: true, date: '22 Ago' },
  { id: '5', merchant: 'Farmacorp Cala Cala', cat: 'Salud', amount: '185.00', isExpense: true, date: '20 Ago' },
];

export default function MobileTransactionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Movimientos</Text>
        <Text style={styles.subtitle}>Historial de gastos e ingresos</Text>
      </View>

      <FlatList
        data={DEMO_TXS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={item.isExpense ? styles.iconExpense : styles.iconIncome}>
              {item.isExpense ? <ArrowDownLeft color="#ef4444" size={18} /> : <ArrowUpRight color="#10b981" size={18} />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.merchant}>{item.merchant}</Text>
              <Text style={styles.category}>{item.cat} &middot; {item.date}</Text>
            </View>
            <Text style={item.isExpense ? styles.amountExpense : styles.amountIncome}>
              {item.isExpense ? '-' : '+'} Bs. {item.amount}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  title: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#64748b', fontSize: 12, marginTop: 2 },
  listContent: { padding: 18 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  iconExpense: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#450a0a', justifyContent: 'center', alignItems: 'center' },
  iconIncome: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#064e3b', justifyContent: 'center', alignItems: 'center' },
  merchant: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  category: { color: '#64748b', fontSize: 11, marginTop: 2 },
  amountExpense: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  amountIncome: { color: '#10b981', fontSize: 14, fontWeight: 'bold' },
});
