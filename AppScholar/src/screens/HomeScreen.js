import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [role, setRole] = useState(''); // 'adm' ou 'usuario'/'aluno'
  const navigation = useNavigation();

  useEffect(() => {
    const carregarDados = async () => {
      const nomeSalvo = await AsyncStorage.getItem('usuarioNome');
      const roleSalva = await AsyncStorage.getItem('usuarioRole');
      
      if (nomeSalvo) setNome(nomeSalvo);
      if (roleSalva) setRole(roleSalva);
    };
    carregarDados();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear(); // Limpa os dados
    navigation.replace('LoginScreen'); // Volta para o login
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>Bem-vindo,</Text>
          <Text style={styles.nome}>{nome}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.btnSair}>
          <Text style={styles.txtSair}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Dinâmico com base no Role */}
      <View style={styles.content}>
        
        {/* Visão do Administrador / Secretaria */}
        {role === 'adm' && (
          <View>
            <Text style={styles.sectionTitle}>Painel Administrativo</Text>
            <TouchableOpacity style={styles.card} onPress={() => {/* Navegar para CRUD Alunos */}}>
              <Text style={styles.cardText}>Gerenciar Alunos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => {/* Navegar para CRUD Disciplinas */}}>
              <Text style={styles.cardText}>Gerenciar Disciplinas</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Visão do Aluno / Usuário comum */}
        {role !== 'adm' && (
          <View>
            <Text style={styles.sectionTitle}>Meu Portal</Text>
            <TouchableOpacity style={styles.card} onPress={() => {/* Navegar para Boletim */}}>
              <Text style={styles.cardText}>Consultar Boletim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => {/* Navegar para Grade */}}>
              <Text style={styles.cardText}>Minha Grade Horária</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#0056b3', // Cor principal
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  saudacao: {
    color: '#E0E7FF',
    fontSize: 14,
  },
  nome: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnSair: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  txtSair: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 15,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  }
});