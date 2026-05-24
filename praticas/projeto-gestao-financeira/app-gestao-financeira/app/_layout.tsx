import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { MoneyProvider } from '../contexts/MoneyContext'; 
import { AuthProvider } from '../contexts/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// 🎨 Configuração customizada do Tema Dark para combinar com o seu layout
const CyberDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0B0C10', // Força o Jet Black no fundo de transição de todas as telas
    card: '#1F2833',       // Fundo dos headers das telas Stack
    text: '#FFF',          // Texto geral branco
    border: '#24303F',     // Bordas escuras
  },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <MoneyProvider>
        {/* 🚀 Mudamos aqui: Agora o app assume o tema CyberDark nativamente */}
        <ThemeProvider value={CyberDarkTheme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#0B0C10', // Fundo dos headers das sub-telas
              },
              headerTitleStyle: {
                color: '#FFF',
                fontWeight: 'bold',
              },
              headerShadowVisible: false, // Remove aquela linha feia divisória clara
            }}
          >
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            
            {/* Customização do modal para o visual escuro */}
            <Stack.Screen 
              name="modal" 
              options={{ 
                presentation: 'modal', 
                title: 'Detalhes',
                headerStyle: { backgroundColor: '#1F2833' } 
              }} 
            />
            
            {/* 🛡️ Mudamos o headerTintColor de roxo (#6200ee) para o seu Ciano Neon (#66FCF1) */}
            <Stack.Screen 
              name="nova-transacao" 
              options={{ 
                title: 'Adicionar Transação', 
                headerTintColor: '#66FCF1' 
              }} 
            />
          </Stack>
          
          {/* Força a barra de status do celular (bateria, hora) a ficar branca */}
          <StatusBar style="light" backgroundColor="#0B0C10" />
        </ThemeProvider>
      </MoneyProvider>
    </AuthProvider>
  );
}