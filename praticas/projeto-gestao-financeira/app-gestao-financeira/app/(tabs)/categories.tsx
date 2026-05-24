// app-gestao-financeira/app/(tabs)/categories.tsx
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MoneyContext, Category } from '../../contexts/MoneyContext';

export default function CategoriesScreen() {
  const { categories, addCategory, removeCategory } = useContext(MoneyContext);
  const [displayName, setDisplayName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFB6B6');
  
  const colorsPalette = ['#FFB6B6', '#B6FFB6', '#B6B6FF', '#FFE6B6', '#E6B6FF', '#B6FFE6'];
  const EMOJI_LIST = ['💰', '🍔', '🏠', '🚗', '✈️', '💊', '👕', '📚', '🎉', '🏷️', '⚽', '💍'];

  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_LIST[0]);

  const handleCreate = async () => {
    if (!displayName) {
      Alert.alert('Erro', 'Por favor, digite o nome da categoria.');
      return;
    }

    const technicalName = displayName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');

    try {
      await addCategory({
        name: technicalName,
        displayName: displayName,
        icon: selectedEmoji, 
        background: selectedColor,
        isIncome: false
      });
      setDisplayName('');
      Alert.alert('Sucesso', 'Categoria criada com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', 'Não foi possível criar a categoria. Certifique-se de que o nome é exclusivo.');
    }
  };

  const handleDelete = (item: Category) => {
    if (item.isDefault) {
      Alert.alert('Bloqueado', 'Categorias padrão criadas pelo seed não podem ser excluídas!');
      return;
    }

    Alert.alert('Excluir Categoria', `Tem certeza que quer apagar "${item.displayName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive',
        onPress: async () => {
          try {
            await removeCategory(item.id);
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível excluir. Verifique se há transações vinculadas a ela.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Nova Categoria</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome da categoria (Ex: Saúde, Transporte)"
        placeholderTextColor="#C5C6C7"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <Text style={styles.label}>Escolha um ícone:</Text>
      <View style={styles.emojiGrid}>
        {EMOJI_LIST.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji && styles.emojiButtonSelected
            ]}
            onPress={() => setSelectedEmoji(emoji)}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Escolha uma cor:</Text>
      <View style={styles.palette}>
        {colorsPalette.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.selectedCircle]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.btnCriar} onPress={handleCreate}>
        <Text style={styles.btnText}>Criar Categoria</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Categorias Existentes</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.iconCircle, { backgroundColor: item.background }]}>
              <Text style={styles.iconCircleText}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.catName}>{item.displayName}</Text>
              <Text style={styles.catType}>{item.isDefault ? 'Padrão do Sistema' : 'Personalizada'}</Text>
            </View>
            {!item.isDefault && (
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.btnDelete}>
                <Text style={{ color: '#FF4A5A', fontWeight: 'bold' }}>Excluir</Text>
              </TouchableOpacity>
            )}
          </View>
        )} // 🛡️ Fechamento do renderItem corrigido aqui );} -> )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0C10', padding: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  input: { backgroundColor: '#1F2833', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#45A29E33', marginBottom: 12, color: '#FFF' },
  label: { fontSize: 14, color: '#C5C6C7', marginBottom: 8 },
  
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  emojiButton: { padding: 8, backgroundColor: '#1F2833', borderRadius: 8, borderWidth: 1, borderColor: '#24303F' },
  emojiButtonSelected: { backgroundColor: '#45A29E33', borderColor: '#66FCF1', borderWidth: 2 },
  emojiText: { fontSize: 20 },

  palette: { flexDirection: 'row', marginBottom: 16, justifyContent: 'space-between' },
  colorCircle: { width: 36, height: 36, borderRadius: 18 },
  selectedCircle: { borderWidth: 3, borderColor: '#FFF' },
  btnCriar: { backgroundColor: '#45A29E', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#0B0C10', fontWeight: 'bold', fontSize: 16 },
  item: { flexDirection: 'row', backgroundColor: '#1F2833', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#24303F' },
  
  iconCircle: { width: 36, height: 36, borderRadius: 18, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  iconCircleText: { fontSize: 16 },
  
  catName: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  catType: { fontSize: 12, color: '#C5C6C7' },
  btnDelete: { padding: 6 }
});