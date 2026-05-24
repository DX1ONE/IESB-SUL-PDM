// app-gestao-financeira/app/login.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const success = login(name, password);
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Acesso Negado', 'Nome vazio ou senha incorreta. Dica: a senha é 1234');
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 🐙 SILHUETA DO POLVO AMIGÁVEL E CIANO */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/octopus-logo.png')} // Certifique-se de salvar a imagem neste caminho
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.subtitle}>Faça login para gerenciar suas finanças</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu Nome"
        placeholderTextColor="#C5C6C7"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#C5C6C7"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24, 
    backgroundColor: '#0B0C10' 
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: width * 0.45, // Tamanho limpo, minimalista e responsivo
    height: width * 0.45,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#66FCF1', 
    textAlign: 'center', 
    marginBottom: 8,
    letterSpacing: -0.5
  },
  subtitle: { 
    fontSize: 14, 
    color: '#C5C6C7', 
    textAlign: 'center', 
    marginBottom: 32 
  },
  input: { 
    backgroundColor: '#1F2833', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#45A29E33', 
    marginBottom: 16, 
    fontSize: 16,
    color: '#FFF' 
  },
  button: { 
    backgroundColor: '#45A29E', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: { 
    color: '#0B0C10', 
    fontSize: 16, 
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
});