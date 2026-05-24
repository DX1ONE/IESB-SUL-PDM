// app-gestao-financeira/contexts/MoneyContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  background: string;
  isIncome: boolean;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  value: number;
  date: string;
  categoryId: string;
  category: Category;
}

interface MoneyContextData {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  currentDate: Date; // <-- Nova propriedade global
  nextMonth: () => void; // <-- Nova função global
  prevMonth: () => void; // <-- Nova função global
  refresh: () => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  addCategory: (data: any) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
}

export const MoneyContext = createContext<MoneyContextData>({} as MoneyContextData);

export function MoneyProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado global do mês/ano selecionado
  const [currentDate, setCurrentDate] = useState(new Date());

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catsRes, txsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/transactions')
      ]);
      setCategories(catsRes.data);
      setTransactions(txsRes.data);
    } catch (e: any) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Funções de navegação de data que alteram o estado global
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const addTransaction = async (data: any) => {
    await api.post('/transactions', data);
    await refresh();
  };

  const addCategory = async (data: any) => {
    const categoryData = {
      ...data,
      icon: data.icon ? data.icon : '🏷️',
      background: data.background ? data.background : '#cccccc',
    };
    await api.post('/categories', categoryData);
    await refresh();
  };

  const removeCategory = async (id: string) => {
    await api.delete(`/categories/${id}`);
    await refresh();
  };

  return (
    <MoneyContext.Provider value={{
      transactions, categories, loading, error, refresh,
      currentDate, nextMonth, prevMonth, // <-- Enviando para o resto do app
      addTransaction, addCategory, removeCategory
    }}>
      {children}
    </MoneyContext.Provider>
  );
}