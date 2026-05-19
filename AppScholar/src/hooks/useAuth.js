import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Garantindo que o Axios está sendo importado

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
      // 1. Faz a chamada para a nossa rota do Node.js
      const response = await api.post('/login', { email, senha });
      const data = response.data; // Pega a resposta do backend

      // 2. REGRA DO PRIMEIRO ACESSO
      if (data.precisaTrocarSenha) {
        // Retorna avisando a tela de Login, SEM salvar o usuário ainda
        // pois ele precisa trocar a senha antes de ganhar acesso.
        return { ok: true, dados: data };
      }

      // 3. LOGIN NORMAL (Se passou do if acima, não é o primeiro acesso)
      // Salva os dados no AsyncStorage com o seu padrão
      await AsyncStorage.setItem('@appscholar:token', data.token);
      await AsyncStorage.setItem('@appscholar:user', JSON.stringify(data.usuario));
      
      // Salva as chaves simples que configuramos na HomeScreen também
      await AsyncStorage.setItem('usuarioNome', data.usuario.nome);
      await AsyncStorage.setItem('usuarioRole', data.usuario.role);

      // Atualiza o estado global da aplicação
      setUser(data.usuario);

      // Retorna sucesso para a tela de Login avançar
      return { ok: true, dados: data };

    } catch (err) {
      // Captura o erro (ex: senha incorreta, usuário não encontrado)
      const msg = err.response?.data?.erro || 'Erro ao conectar ao servidor.';
      return { ok: false, erro: msg };
    }
  }

  async function logout() {
    // Limpa todas as chaves ao sair do app
    await AsyncStorage.multiRemove([
      '@appscholar:token', 
      '@appscholar:user',
      'usuarioNome',
      'usuarioRole'
    ]);
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