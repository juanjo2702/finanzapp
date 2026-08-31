import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Globe, Shield, Smartphone, LogOut } from 'lucide-react-native';

export default function MobileProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JR</Text>
        </View>
        <Text style={styles.name}>Juan José Rodríguez</Text>
        <Text style={styles.email}>juanjose@finanzapp.bo</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Globe color="#60a5fa" size={20} />
          <Text style={styles.menuText}>Moneda Base: BOB (Boliviano)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Smartphone color="#f59e0b" size={20} />
          <Text style={styles.menuText}>Permisos de Lectura SMS Bancaria</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Shield color="#34d399" size={20} />
          <Text style={styles.menuText}>Seguridad & Autenticación Biométrica</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0, marginTop: 20 }]}>
          <LogOut color="#ef4444" size={20} />
          <Text style={[styles.menuText, { color: '#ef4444' }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 18 },
  header: { alignItems: 'center', marginVertical: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  name: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  email: { color: '#64748b', fontSize: 13, marginTop: 2 },
  menu: { backgroundColor: '#0f172a', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#1e293b' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  menuText: { color: '#e2e8f0', fontSize: 14, marginLeft: 14, fontWeight: '500' },
});
