import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { colors, radius } from '../styles/theme';

export default function GerenciarDisciplinasScreen({ navigation }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarDisciplinas);
    return unsubscribe;
  }, [navigation]);

  const carregarDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/disciplinas');
      console.log("DADOS QUE VIERAM DO BANCO:", response.data); // ISSO VAI APARECER NO TERMINAL DO VS CODE
      setDisciplinas(response.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar disciplinas.');
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/disciplinas/${id}`);
      carregarDisciplinas();
    } catch (err) { Alert.alert('Erro', 'Não foi possível excluir.'); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'white', fontSize: 16, marginRight: 10 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Disciplinas</Text> 
        
        <TouchableOpacity onPress={() => navigation.navigate('CadastroDisciplina')}>
           
          <Text style={styles.novo}>+ Novo</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? <ActivityIndicator size="large" /> : (
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.info}>{item.curso} - {item.semestre}</Text>
              <View style={styles.acoes}>
                <TouchableOpacity onPress={() => navigation.navigate('EditarDisciplinaScreen', { disciplinaId: item.id })}>
                  <Text style={styles.btnEditar}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deletar(item.id)}>
                  <Text style={styles.btnDel}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  novo: { color:  'white', fontWeight: 'bold' },
  card: { backgroundColor: colors.surface2, padding: 15, margin: 10, borderRadius: radius.md },
  nome: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  info: { color: colors.muted, fontSize: 12 },
  acoes: { flexDirection: 'row', gap: 15, marginTop: 10 },
  btnEditar: { color: colors.accent },
  btnDel: { color: colors.red }
});