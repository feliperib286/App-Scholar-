import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { colors, spacing, radius } from '../styles/theme';

export default function CadastroAlunoScreen({ navigation }) {
  const [alunosAgrupados, setAlunosAgrupados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alunos'); // Ajuste a rota se necessário
      const alunos = response.data;

      // Agrupa os alunos por curso para o SectionList
      const grupos = alunos.reduce((acc, aluno) => {
        const cursoNome = aluno.curso || 'Sem Curso Definido';
        if (!acc[cursoNome]) acc[cursoNome] = [];
        acc[cursoNome].push(aluno);
        return acc;
      }, {});

      // Formata no padrão que o SectionList do React Native exige: [{ title: 'Curso', data: [alunos] }]
      const secoes = Object.keys(grupos).map(curso => ({
        title: curso,
        data: grupos[curso]
      }));

      setAlunosAgrupados(secoes);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de alunos.');
    } finally {
      setLoading(false);
    }
  };

  const renderAluno = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.nome.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.matricula}>Matrícula: {item.matricula}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>

      {/* Botões de Ação do Aluno */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.yellow }]} onPress={() => Alert.alert('Faltas', `Visualizando faltas de ${item.nome}`)}>
          <Text style={[styles.actionText, { color: colors.yellow }]}>⚠️ Faltas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.accent }]} onPress={() => Alert.alert('Horário', `Horário de ${item.nome}`)}>
          <Text style={[styles.actionText, { color: colors.accent }]}>📅 Horário</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.muted }]} onPress={() => Alert.alert('Editar', 'Abrir form de edição')}>
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
        <Text style={styles.title}>Gerenciar Alunos</Text>
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 50 }} />
        ) : (
          <SectionList
            sections={alunosAgrupados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAluno}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎓 {title}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 30 }}
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
  
  sectionHeader: { backgroundColor: colors.bg, paddingVertical: 10, marginTop: 15, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  
  card: { backgroundColor: colors.surface2, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 45, height: 45, borderRadius: 25, backgroundColor: 'rgba(59,130,246,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: colors.accent },
  infoContainer: { flex: 1 },
  nome: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  matricula: { fontSize: 12, color: colors.muted2 },
  email: { fontSize: 12, color: colors.muted },
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, borderWidth: 1, alignItems: 'center' },
  actionText: { fontSize: 12, fontWeight: 'bold' }
});