import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, ArrowLeftRight, PieChart, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Movimientos',
          tabBarIcon: ({ color, size }) => <ArrowLeftRight color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: '50/30/20',
          tabBarIcon: ({ color, size }) => <PieChart color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 22} />,
        }}
      />
    </Tabs>
  );
}
