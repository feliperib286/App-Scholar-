import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors, spacing, radius } from '../styles/theme';

export default function ListaAvisosScreen({ navigation }) {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avisosVistos, setAvisosVistos] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Carrega os vistos primeiro
      const vistos = await AsyncStorage.getItem('avisosVistos');
      if (vistos) setAvisosVistos(JSON.parse(vistos));

      // Carrega os avisos da API
      const response = await api.get('/avisos');
      setAvisos(response.data);
      
      // Marca a última leitura geral para a notificação do Dashboard
      if (response.data.length > 0) {
        await AsyncStorage.setItem('ultimaLeituraAviso', response.data[0].data_publicacao);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os avisos.');
    } finally {
      setLoading(false);
    }
  };

  const marcarComoVisto = async (id) => {
    if (avisosVistos.includes(id)) return;
    
    const novosVistos = [...avisosVistos, id];
    setAvisosVistos(novosVistos);
    await AsyncStorage.setItem('avisosVistos', JSON.stringify(novosVistos));
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.accent} />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'white' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Avisos Acadêmicos</Text>
      </View>

      <FlatList
        data={avisos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const jaVisto = avisosVistos.includes(item.id);
          return (
            <TouchableOpacity 
              style={[styles.card, { opacity: jaVisto ? 0.6 : 1 }]} 
              onPress={() => marcarComoVisto(item.id)}
            >
              <Text style={styles.cardTitle}>
                {jaVisto ? '👁️ ' : ''}{item.titulo}
              </Text>
              <Text style={styles.cardDate}>{new Date(item.data_publicacao).toLocaleDateString()}</Text>
              <Text style={styles.cardContent}>{item.conteudo}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum aviso no momento.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: colors.text },
  list: { padding: 20 },
  card: { backgroundColor: colors.surface2, padding: 15, borderRadius: radius.md, marginBottom: 15, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardDate: { fontSize: 10, color: colors.muted, marginBottom: 10 },
  cardContent: { fontSize: 14, color: colors.text },
  empty: { textAlign: 'center', marginTop: 50, color: colors.muted }
});