import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { MoneyContext } from '../../contexts/MoneyContext';

interface Transaction {
  id: string;
  description: string;
  value: number;
  date: string;
  categoryId: string;
  category: {
    displayName: string;
    icon: string;
    background: string;
  };
}

const applyDateMask = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  
  if (cleanValue.length <= 2) {
    return cleanValue;
  }
  if (cleanValue.length <= 4) {
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
  }
  return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}/${cleanValue.slice(4, 8)}`;
};

export default function HomeScreen() {
  const { currentDate, nextMonth, prevMonth, categories, refresh } = useContext(MoneyContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ESTADOS PARA O MODAL DE EDIÇÃO
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');

  const isFocused = useIsFocused();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações do back-end:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const handleOpenEditModal = (transaction: Transaction) => {
    setSelectedTransactionId(transaction.id);
    setEditDescription(transaction.description);
    setEditValue(transaction.value.toString());
    setEditCategoryId(transaction.categoryId);
    
    const dataPura = transaction.date.split('T')[0];
    if (dataPura.includes('-')) {
      setEditDate(dataPura.split('-').reverse().join('/'));
    } else {
      setEditDate(dataPura);
    }
    
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editDescription || !editValue || !editDate || !editCategoryId) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    // 🛡️ Validação de segurança para a data digitada
    if (editDate.length < 10) {
      Alert.alert("Data Incompleta", "Por favor, digite a data completa (DD/MM/AAAA).");
      return;
    }

    const [dia, mes, ano] = editDate.split('/').map(Number);
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 2000) {
      Alert.alert("Data Inválida", "Verifique se o dia, mês e ano estão corretos.");
      return;
    }

    try {
      setLoading(true);

      // Converte a data de volta para YYYY-MM-DD com segurança de dois dígitos
      const dataFormatada = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

      await api.put(`/transactions/${selectedTransactionId}`, {
        description: editDescription,
        value: parseFloat(editValue), // Envia como número decimal para o Prisma/Zod
        date: dataFormatada,
        categoryId: editCategoryId
      });

      Alert.alert("Sucesso", "Transação atualizada com sucesso!");
      setIsEditModalVisible(false);
      loadData();
      if (refresh) refresh(); 
    } catch (error) {
      console.error("Erro ao editar transação:", error);
      Alert.alert("Erro", "Não foi possível atualizar a transação.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = (id: string, description: string) => {
    Alert.alert(
      "Excluir Movimentação",
      `Tem certeza que deseja apagar "${description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete(`/transactions/${id}`);
              Alert.alert("Sucesso", "Transação removida com sucesso!");
              setIsEditModalVisible(false); 
              loadData(); 
              if (refresh) refresh();
            } catch (error) {
              console.error("Erro ao deletar transação:", error);
              Alert.alert("Erro", "Não foi possível remover a transação.");
              setLoading(false);
            }
          } 
        }
      ]
    );
  };
  
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const formattedMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const filteredTransactions = transactions.filter(t => {
    if (!t.date) return false;
    const dataPura = t.date.split('T')[0];
    const [year, month] = dataPura.split('-');
    return parseInt(year) === currentDate.getFullYear() && parseInt(month) === currentDate.getMonth() + 1;
  });

  const balance = filteredTransactions.reduce((acc, item) => {
    const val = typeof item.value === 'number' ? item.value : parseFloat(item.value as any) || 0;
    return acc + val;
  }, 0);

  if (loading && !isEditModalVisible) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Olá, {user?.name || 'Visitante'}!</Text>
      
      <View style={styles.monthFilterContainer}>
        <TouchableOpacity onPress={prevMonth} style={styles.monthArrowBtn}>
          <Text style={styles.monthArrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{formattedMonthYear}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.monthArrowBtn}>
          <Text style={styles.monthArrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Atual ({monthNames[currentDate.getMonth()]})</Text>
        <Text style={[styles.balanceValue, { color: balance >= 0 ? '#66FCF1' : '#FF4A5A' }]}>
          R$ {balance.toFixed(2)}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Últimas Movimentações</Text>
      <Text style={styles.tipText}>💡 Toque rápido para Editar • Toque longo para Deletar</Text>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.transactionItem}
            onPress={() => handleOpenEditModal(item)} 
            onLongPress={() => handleDeleteTransaction(item.id, item.description)} 
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIcon, { backgroundColor: item.category?.background || '#ccc' }]}>
              <Text style={styles.iconText}>{item.category?.icon || '💰'}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.categoryName}>
                {item.category?.displayName} 
                {item.date ? ` • ${(() => {
                  const dataPura = item.date.split('T')[0];
                  if (dataPura.includes('-')) {
                    return dataPura.split('-').reverse().join('/');
                  }
                  return dataPura;
                })()}` : ''}
              </Text>
            </View>
            <Text style={[styles.valueText, { color: (item.value || 0) >= 0 ? '#66FCF1' : '#FF4A5A' }]}>
              {item.value >= 0 ? '+' : ''} R$ {typeof item.value === 'number' ? item.value.toFixed(2) : parseFloat(item.value as any || '0').toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma transação neste mês.</Text>
        }
      />

      {/* ================= MODAL DE EDIÇÃO DE TRANSAÇÃO ================= */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Transação</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={editDescription}
              onChangeText={setEditDescription}
            />

            {/* 🚀 CORRIGIDO: Campo de Valor restaurado no lugar da data duplicada */}
            <TextInput
              style={styles.input}
              placeholder="Valor R$ (Use negativo para despesas)"
              keyboardType="numeric"
              value={editValue}
              onChangeText={setEditValue}
            />

            <TextInput
              style={styles.input}
              placeholder="Data (DD/MM/AAAA)"
              value={editDate}
              onChangeText={(text) => setEditDate(applyDateMask(text))} // MÁSCARA APLICADA
              keyboardType="numeric" 
              maxLength={10}
            />

            <Text style={styles.modalLabel}>Selecione a Categoria:</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.modalCategoryBtn,
                    editCategoryId === cat.id && { backgroundColor: cat.background || '#6200ee' }
                  ]}
                  onPress={() => setEditCategoryId(cat.id)}
                >
                  <Text style={styles.modalCategoryIcon}>{cat.icon || '🏷️'}</Text>
                  <Text style={[
                    styles.modalCategoryText,
                    editCategoryId === cat.id && { color: '#fff', fontWeight: 'bold' }
                  ]}>
                    {cat.displayName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveChangesButton} onPress={handleSaveEdit}>
              <Text style={styles.saveChangesButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteModalButton} 
              onPress={() => selectedTransactionId && handleDeleteTransaction(selectedTransactionId, editDescription)}
            >
              <Text style={styles.deleteModalButtonText}>Excluir Transação</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/nova-transacao')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B0C10', // Dark Fundo
    padding: 16, 
    paddingTop: 40 
  },
  headerText: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#66FCF1', // Nome em Neon
    marginBottom: 16,
    letterSpacing: 0.5
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#0B0C10'
  },
  monthFilterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1F2833',
    padding: 8,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#45A29E22'
  },
  monthArrowBtn: { 
    paddingHorizontal: 20, 
    paddingVertical: 8,
    backgroundColor: '#0B0C10',
    borderRadius: 8
  },
  monthArrow: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#66FCF1' 
  },
  monthText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#FFF', 
    textAlign: 'center' 
  },
  balanceCard: { 
    backgroundColor: '#1F2833', 
    padding: 24, 
    borderRadius: 16, 
    marginBottom: 24, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#45A29E44',
    shadowColor: '#66FCF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4
  },
  balanceLabel: { 
    fontSize: 12, 
    color: '#C5C6C7', 
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  balanceValue: { 
    fontSize: 32, 
    fontWeight: '900',
    letterSpacing: -0.5
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#FFF', 
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  tipText: { 
    fontSize: 11, 
    color: '#C5C6C7', 
    marginBottom: 16 
  },
  transactionItem: { 
    flexDirection: 'row', 
    backgroundColor: '#1F2833', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#24303F'
  },
  categoryIcon: { 
    width: 44, 
    height: 44, 
    borderRadius: 10, // Ícones levemente quadrados (estilo cyber)
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14 
  },
  iconText: { 
    fontSize: 20 
  },
  infoContainer: { 
    flex: 1 
  },
  description: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#FFF' 
  },
  categoryName: { 
    fontSize: 12, 
    color: '#C5C6C7', 
    marginTop: 4 
  },
  valueText: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#C5C6C7', 
    marginTop: 40,
    fontSize: 14
  },
  fab: { 
    position: 'absolute', 
    right: 20, 
    bottom: 20, 
    backgroundColor: '#66FCF1', // Botão flutuante brilhante
    width: 56, 
    height: 56, 
    borderRadius: 16, // FAB Quadrado moderno
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 8,
    shadowColor: '#66FCF1',
    shadowOpacity: 0.4,
    shadowRadius: 6
  },
  fabText: { 
    color: '#0B0C10', 
    fontSize: 32, 
    fontWeight: 'bold' 
  },
  
  // ESTILOS DO MODAL DE EDIÇÃO
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(11, 12, 16, 0.85)', // Overlay escuro premium
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#1F2833', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 24, 
    minHeight: '60%',
    borderTopWidth: 2,
    borderColor: '#45A29E'
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#66FCF1' 
  },
  closeModalText: { 
    fontSize: 20, 
    color: '#C5C6C7', 
    fontWeight: 'bold', 
    padding: 4 
  },
  input: { 
    backgroundColor: '#0B0C10', 
    padding: 16, 
    borderRadius: 10, 
    fontSize: 16, 
    color: '#FFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#45A29E44'
  },
  modalLabel: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#C5C6C7', 
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  categoryGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 24 
  },
  modalCategoryBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0B0C10', 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    borderRadius: 8, 
    marginRight: 8, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#24303F'
  },
  modalCategoryIcon: { 
    fontSize: 16, 
    marginRight: 6 
  },
  modalCategoryText: { 
    fontSize: 13, 
    color: '#C5C6C7' 
  },
  saveChangesButton: { 
    backgroundColor: '#45A29E', 
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 12 
  },
  saveChangesButtonText: { 
    color: '#0B0C10', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  deleteModalButton: { 
    backgroundColor: 'transparent', 
    borderColor: '#FF4A5A', 
    borderWidth: 1, 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  deleteModalButtonText: { 
    color: '#FF4A5A', 
    fontSize: 15, 
    fontWeight: '600' 
  }
});