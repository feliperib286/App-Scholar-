import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { colors, spacing, radius } from '../styles/theme';

export default function CadastroProfessorScreen({ navigation }) {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/professores'); // Ajuste para a sua rota
      setProfessores(response.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de professores.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfessor = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.titulacao}>{item.titulacao} • {item.area}</Text>
          <Text style={styles.email}>✉️ {item.email}</Text>
        </View>
      </View>

      {/* ÁREA DE DISCIPLINAS CONECTADAS */}
      <View style={styles.disciplinasContainer}>
        <Text style={styles.disciplinasTitle}>Disciplinas Vinculadas:</Text>
        <View style={styles.tagsRow}>
          {/* Aqui idealmente você iteraria sobre item.disciplinas. 
              Como pode não estar vindo do backend ainda, coloquei uma simulação visual caso esteja vazio */}
          {item.disciplinas && item.disciplinas.length > 0 ? (
            item.disciplinas.map((disc, idx) => (
              <View key={idx} style={styles.tag}><Text style={styles.tagText}>{disc.nome}</Text></View>
            ))
          ) : (
            <View style={styles.tag}><Text style={styles.tagText}>Matérias do Semestre (Simulado)</Text></View>
          )}
        </View>
      </View>

      {/* BOTÕES DE AÇÃO DO PROFESSOR */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.accent, borderColor: colors.accent }]} 
          onPress={() => Alert.alert('Lançar Nota', `Abrindo painel de notas para Prof. ${item.nome}`)}
        >
          <Text style={[styles.actionText, { color: 'white' }]}>📝 Lançar Nota (Exemplo)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, { borderColor: colors.muted, flex: 0.4 }]} 
          onPress={() => Alert.alert('Editar', 'Abrir form de edição')}
        >
          <Text style={[styles.actionText, { color: colors.muted }]}>✏️ Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Professores</Text>
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={professores}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProfessor}
            contentContainerStyle={{ paddingBottom: 30, paddingTop: 15 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { color: colors.muted2, marginRight: 15, fontSize: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  container: { flex: 1, paddingHorizontal: spacing.lg },
  
  card: { backgroundColor: colors.surface2, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  infoContainer: { flex: 1 },
  nome: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  titulacao: { fontSize: 13, color: colors.green, fontWeight: '600', marginBottom: 4 },
  email: { fontSize: 12, color: colors.muted2 },
  
  disciplinasContainer: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: radius.sm, marginBottom: 15 },
  disciplinasTitle: { fontSize: 11, color: colors.muted, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: 'rgba(167, 139, 250, 0.15)', borderWidth: 1, borderColor: 'rgba(167, 139, 250, 0.4)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { color: '#a78bfa', fontSize: 11, fontWeight: '600' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 15 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 13, fontWeight: 'bold' }
});