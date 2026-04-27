import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      try {
        const token   = await AsyncStorage.getItem('@appscholar:token');
        const userStr = await AsyncStorage.getItem('@appscholar:user');
        if (token && userStr) setUser(JSON.parse(userStr));
      } catch (e) {
        // sessão inválida
      } finally {
        setLoading(false);
      }
    }
    restaurarSessao();
  }, []);

  async function login(email, senha) {
    try {
      const data = await apiLogin(email, senha);
      await AsyncStorage.setItem('@appscholar:token', data.token);
      await AsyncStorage.setItem('@appscholar:user', JSON.stringify(data.usuario));
      setUser(data.usuario);
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao conectar ao servidor.';
      return { ok: false, erro: msg };
    }
  }

  async function logout() {
    await AsyncStorage.multiRemove(['@appscholar:token', '@appscholar:user']);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
