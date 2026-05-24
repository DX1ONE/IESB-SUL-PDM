import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

interface Category {
  id: string;
  displayName: string;
  icon?: string; // 💡 Adicionado caso sua API traga os emojis das categorias
}

// 🎨 CORE DA PALETA TECH DARK MODE
const TECH_THEME = {
  bg: '#0B0C10',
  cardBg: '#1F2833',
  neon: '#66FCF1',
  crimson: '#FF4A5A',
  gray: '#C5C6C7',
  text: '#FFF',
};

export default function NewTransactionScreen() {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const hoje = new Date().toLocaleDateString('pt-BR');
  const [date, setDate] = useState(hoje);

  const applyDateMask = (val: string) => {
    const cleanValue = val.replace(/\D/g, "");
    
    if (cleanValue.length <= 2) {
      return cleanValue;
    }
    if (cleanValue.length <= 4) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
    }
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}/${cleanValue.slice(4, 8)}`;
  };

  useEffect(() => {
    api.get('/categories')
      .then((res: { data: Category[] }) => setCategories(res.data))
      .catch((err: unknown) => console.error("Erro ao carregar categorias no app:", err));
  }, []);

  const handleSave = async () => {
    if (!description || !value || !selectedCategory || !date) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos!');
      return;
    }

    if (date.length < 10) {
      Alert.alert("Data Incompleta", "Por favor, preencha a data completa (DD/MM/AAAA).");
      return;
    }

    const [dia, mes, ano] = date.split('/').map(Number);
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 2000) {
      Alert.alert("Data Inválida", "Verifique se o dia, o mês e o ano estão corretos.");
      return;
    }

    try {
      setLoading(true);
      
      const dataFormatada = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

      await api.post('/transactions', {
        description,
        value: parseFloat(value),
        date: dataFormatada,
        categoryId: selectedCategory
      });

      Alert.alert('Sucesso', 'Movimentação registrada com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="Descrição (Ex: Salário, Almoço, Luz...)"
        placeholderTextColor={TECH_THEME.gray}
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor R$ (Use negativo para despesas)"
        placeholderTextColor={TECH_THEME.gray}
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />

      <Text style={styles.label}>Data (DD/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 25/12/2026"
        placeholderTextColor={TECH_THEME.gray}
        value={date}
        onChangeText={(text) => setDate(applyDateMask(text))}
        keyboardType="numeric"
        maxLength={10} 
      />

      <Text style={styles.label}>Selecione a Categoria:</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryBtn, selectedCategory === cat.id && styles.categoryBtnSelected]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={[styles.categoryBtnText, selectedCategory === cat.id && styles.categoryBtnTextSelected]}>
              {cat.icon ? `${cat.icon} ` : ''}{cat.displayName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={TECH_THEME.bg} />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Registro</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TECH_THEME.bg, padding: 20, paddingTop: 40 }, // Fundo Escuro Puro
  input: { backgroundColor: TECH_THEME.cardBg, padding: 14, borderRadius: 8, fontSize: 16, marginBottom: 16, color: TECH_THEME.text, borderWidth: 1, borderColor: '#45A29E22' },
  label: { fontSize: 16, fontWeight: '600', color: TECH_THEME.gray, marginBottom: 10 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 30, gap: 4 },
  categoryBtn: { backgroundColor: TECH_THEME.cardBg, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 4, marginBottom: 8, borderWidth: 1, borderColor: '#24303F' },
  categoryBtnSelected: { backgroundColor: '#45A29E33', borderColor: TECH_THEME.neon },
  categoryBtnText: { color: TECH_THEME.gray, fontSize: 14, fontWeight: '500' },
  categoryBtnTextSelected: { color: TECH_THEME.neon, fontWeight: '700' },
  saveButton: { backgroundColor: TECH_THEME.neon, padding: 16, borderRadius: 8, alignItems: 'center' }, // Botão principal em Ciano Neon
  saveButtonText: { color: TECH_THEME.bg, fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }
});