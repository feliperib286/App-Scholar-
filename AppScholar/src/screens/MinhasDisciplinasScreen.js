import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { colors, radius, spacing } from '../styles/theme';

export default function MinhasDisciplinasScreen({ navigation }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDisciplinas();
  }, []);

const carregarDisciplinas = async () => {
    try {
      // Vamos tentar buscar de uma rota genérica ou forçar a lista
      const response = await api.get('/disciplinas');
      
      console.log("DADOS RECEBIDOS:", response.data); 
      
      // Se o backend estiver filtrando, aqui vai chegar vazio []
      // Se não houver filtro, vai chegar a lista completa
      setDisciplinas(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* SEU CABEÇALHO MANTIDO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'white', marginRight: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Minhas Disciplinas</Text>
      </View>

      {/* LISTAGEM DINÂMICA */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nomeDisc}>{item.nome}</Text>
              <Text style={styles.info}>Carga Horária: {item.carga_horaria}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 20 }}>
              Nenhuma disciplina vinculada encontrada.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  card: { backgroundColor: colors.surface2, padding: 15, borderRadius: radius.md, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  nomeDisc: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  info: { fontSize: 13, color: colors.muted, marginTop: 5 }
});