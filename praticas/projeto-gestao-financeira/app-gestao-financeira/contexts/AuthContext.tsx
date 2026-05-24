// app-gestao-financeira/contexts/AuthContext.tsx
import React, { createContext, useState } from 'react';

interface AuthContextData {
  user: { name: string } | null;
  login: (name: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const login = (name: string, password: string) => {
    // Validação simples de acesso exigida (você pode mudar a senha depois)
    if (name.trim() !== '' && password === '1234') {
      setUser({ name });
      return true; // Sucesso
    }
    return false; // Falha
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}