import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, View, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useIsFocused } from '@react-navigation/native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { MoneyContext } from '../../contexts/MoneyContext';

// 🎨 PALETA TECH DARK MODE SOLIDIFICADA
const TECH_THEME = {
  bg: '#0B0C10',
  cardBg: '#1F2833',
  neon: '#66FCF1',
  crimson: '#FF4A5A',
  gray: '#C5C6C7',
  text: '#FFF',
};

// 🌌 CORES CYBER COMPATÍVEIS COM ALTO CONTRASTE E TEMA ESCURO
const CYBER_COLORS = [
  '#66FCF1', // Neon Mint / Ciano Principal
  '#45A29E', // Electric Cyan
  '#00D2FF', // Cyber Blue
  '#00FFA3', // Neo Emerald
  '#3A4F7C', // Steel Metallic Blue
  '#1F8A70', // Dark Turquoise
];

export default function TabTwoScreen() {
  const isFocused = useIsFocused();
  const { transactions, categories, loading, refresh, currentDate } = useContext(MoneyContext);

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  useEffect(() => {
    if (isFocused && refresh) {
      refresh();
    }
  }, [isFocused, refresh]);

  useEffect(() => {
    setSelectedCategory(null);
  }, [currentDate]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={TECH_THEME.neon} />
      </View>
    );
  }

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const formattedMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const expenses = transactions.filter(t => {
    if (Number(t.value) >= 0 || !t.date) return false;
    const dataPura = t.date.split('T')[0];
    const [year, month] = dataPura.split('-');
    return parseInt(year) === currentDate.getFullYear() && parseInt(month) === currentDate.getMonth() + 1;
  });

  const chartData = categories
    .map((category, index) => {
      const categoryTransactions = expenses.filter(t => t.categoryId === category.id);
      const totalGastos = categoryTransactions.reduce((sum, t) => sum + Math.abs(Number(t.value)), 0);

      // Aplica uma cor sequencial da nossa paleta tecnológica se não houver background definido
      const themeColor = CYBER_COLORS[index % CYBER_COLORS.length];

      return {
        id: category.id,
        name: category.displayName,
        population: totalGastos,
        color: category.background && category.background !== '#45A29E' ? category.background : themeColor,
        legendFontColor: TECH_THEME.gray, 
        legendFontSize: 13,
        transactions: categoryTransactions, 
        icon: category.icon || '🏷️'
      };
    })
    .filter(data => data.population > 0);

  const totalMonthExpenses = chartData.reduce((sum, c) => sum + c.population, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* CARD PRINCIPAL COM AJUSTE DE MARGEM DO TOPO */}
        <TouchableOpacity 
          style={styles.balanceCard}
          onPress={() => setSelectedCategory(null)}
          disabled={!selectedCategory}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.balanceLabel}>
            {selectedCategory ? `GASTOS EM: ${selectedCategory.name}` : `TOTAL DE DESPESAS (${monthNames[currentDate.getMonth()].toUpperCase()})`}
          </ThemedText>
          <ThemedText style={styles.balanceValue}>
            R$ {(selectedCategory ? selectedCategory.population : totalMonthExpenses).toFixed(2)}
          </ThemedText>
          {selectedCategory && (
            <ThemedText style={styles.resetLabel}>Toque aqui para voltar ao gráfico geral</ThemedText>
          )}
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded, color: TECH_THEME.text }}>
            Análise de Gastos
          </ThemedText>
          <ThemedText style={{ fontWeight: 'bold', color: TECH_THEME.neon, marginTop: 5 }}>
            Período: {formattedMonthYear}
          </ThemedText>
        </View>

        <ThemedText style={styles.subtitle}>
          {selectedCategory 
            ? "Exibindo o detalhamento das transações enviadas para esta categoria."
            : "Veja a distribuição dos seus custos abaixo. Toque em qualquer categoria da lista para abrir o histórico detalhado."}
        </ThemedText>

        {chartData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>📊 Nenhum gasto registrado para {formattedMonthYear}.</ThemedText>
            <ThemedText style={styles.subEmptyText}>
              Insira transações com valores negativos neste mês para alimentar a pizza de despesas.
            </ThemedText>
          </View>
        ) : !selectedCategory ? (
          <View style={styles.chartWrapper}>
            
            {/* 🎯 GRÁFICO EXPANDIDO E LIMPO SEM REPETIÇÃO DE TEXTOS */}
            <PieChart
              data={chartData}
              width={Dimensions.get('window').width}
              height={220}
              chartConfig={{
                color: () => TECH_THEME.neon,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={(Dimensions.get('window').width / 4).toString()} // Centraliza perfeitamente a pizza agora que não há legenda lateral
              hasLegend={false} // 🚀 REMOVE A LEGENDA REDUNDANTE DA DIREITA
              absolute
            />

            <View style={styles.interactiveLegendContainer}>
              {chartData.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.legendRowItem}
                  onPress={() => setSelectedCategory(item)}
                >
                  <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                  <ThemedText style={styles.legendNameText}>{item.icon} {item.name}</ThemedText>
                  <ThemedText style={styles.legendValueText}>R$ {item.population.toFixed(2)} ➔</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.drilldownWrapper}>
            <ThemedText style={styles.drilldownTitle}>Histórico de lançamentos</ThemedText>
            {selectedCategory.transactions.map((t: any) => (
              <View key={t.id} style={styles.txRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.txDescription}>{t.description}</ThemedText>
                  <ThemedText style={styles.txDate}>
                    {t.date ? t.date.split('T')[0].split('-').reverse().join('/') : ''}
                  </ThemedText>
                </View>
                <ThemedText style={styles.txValue}>
                  R$ {Math.abs(Number(t.value)).toFixed(2)}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TECH_THEME.bg },
  contentContainer: { paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: TECH_THEME.bg },
  titleContainer: { marginTop: 24, marginBottom: 10, alignItems: 'center', backgroundColor: 'transparent' },
  subtitle: { paddingHorizontal: 16, marginBottom: 20, fontSize: 13, textAlign: 'center', color: TECH_THEME.gray, lineHeight: 18 },
  emptyContainer: { marginHorizontal: 16, padding: 24, alignItems: 'center', backgroundColor: TECH_THEME.cardBg, borderRadius: 16, borderWidth: 1, borderColor: '#24303F' },
  emptyText: { fontSize: 16, marginBottom: 8, fontWeight: '700', color: TECH_THEME.text },
  subEmptyText: { fontSize: 13, color: TECH_THEME.gray, textAlign: 'center', lineHeight: 18 },
  chartWrapper: { alignItems: 'center', marginBottom: 20, backgroundColor: 'transparent' },
  
  balanceCard: { 
    backgroundColor: TECH_THEME.cardBg, 
    padding: 20, 
    borderRadius: 16, 
    marginTop: 16, 
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#45A29E44',
    elevation: 4
  },
  balanceLabel: { fontSize: 11, color: TECH_THEME.gray, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  balanceValue: { fontSize: 28, fontWeight: '900', color: TECH_THEME.neon, marginTop: 4 },
  resetLabel: { fontSize: 11, color: TECH_THEME.crimson, marginTop: 6, fontWeight: '600' },

  interactiveLegendContainer: { width: '100%', paddingHorizontal: 16, marginTop: 16, backgroundColor: 'transparent' },
  legendRowItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: TECH_THEME.cardBg, padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#24303F' },
  colorIndicator: { width: 14, height: 14, borderRadius: 4, marginRight: 12 },
  legendNameText: { flex: 1, color: TECH_THEME.text, fontWeight: '600', fontSize: 14 },
  legendValueText: { color: TECH_THEME.neon, fontWeight: '700', fontSize: 14 },

  drilldownWrapper: { paddingHorizontal: 16, marginBottom: 30, backgroundColor: 'transparent' },
  drilldownTitle: { fontSize: 15, fontWeight: '700', color: TECH_THEME.text, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: TECH_THEME.cardBg, padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#24303F' },
  txDescription: { fontSize: 15, fontWeight: '600', color: TECH_THEME.text },
  txDate: { fontSize: 12, color: TECH_THEME.gray, marginTop: 4 },
  txValue: { fontSize: 15, fontWeight: '700', color: TECH_THEME.crimson }
});