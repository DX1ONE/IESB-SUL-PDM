import { Text, StyleSheet } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#66FCF1', 
        tabBarInactiveTintColor: '#C5C6C7',
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle
      }}
    >
      {/* 1. RESUMO */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Finanças',
          tabBarLabel: 'Resumo',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💵</Text>,
        }}
      />
      
      {/* 2. CATEGORIAS (Nome exato da sua pasta: "categories") */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Gerenciar Categorias',
          tabBarLabel: 'Categorias',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏷️</Text>,
        }}
      />

      {/* 3. GRÁFICOS (Nome exato da sua pasta: "explore") */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Análises',
          tabBarLabel: 'Gráficos',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1F2833', 
    borderTopWidth: 1,
    borderTopColor: '#24303F',
    height: 60,
    paddingBottom: 8,
    paddingTop: 4,
  },
  header: {
    backgroundColor: '#0B0C10', 
    borderBottomWidth: 1,
    borderBottomColor: '#24303F',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
});