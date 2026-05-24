import axios from 'axios';
import { Platform } from 'react-native';

const LOCAL_IP = '192.168.56.1'; 

const api = axios.create({
  baseURL: Platform.OS === 'android' 
    ? 'http://10.0.2.2:3000' // IP padrão para alcançar o localhost dentro do emulador Android
    : `http://${LOCAL_IP}:3000`, // IP da sua rede para testar no celular físico via Expo Go
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;