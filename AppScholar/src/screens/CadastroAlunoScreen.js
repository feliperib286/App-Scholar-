import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { colors, spacing, radius } from '../styles/theme';

export default function CadastroAlunoScreen({ navigation }) {
  const [alunosAgrupados, setAlunosAgrupados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarAlunos();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarAlunos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alunos'); 
      const alunos = response.data;

      const grupos = alunos.reduce((acc, aluno) => {
        const cursoNome = aluno.curso || 'Sem Curso Definido';
        if (!acc[cursoNome]) acc[cursoNome] = [];
        acc[cursoNome].push(aluno);
        return acc;
      }, {});

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

  // ─────────────────────────────────────────────────────────────
  // FUNÇÕES DE EXCLUSÃO (Agora no lugar certinho!)
  // ─────────────────────────────────────────────────────────────
const confirmarExclusao = (id, nome) => {
    // Se estiver rodando no navegador (Web)
    if (Platform.OS === 'web') {
      const confirmou = window.confirm(`Atenção!\n\nTem certeza que deseja excluir o aluno(a) ${nome}? Todas as notas e faltas serão apagadas.`);
      if (confirmou) {
        excluirAluno(id); // Dispara a exclusão de verdade
      }
    } 
    // Se estiver rodando no Celular (iOS/Android)
    else {
      Alert.alert(
        "Atenção!",
        `Tem certeza que deseja excluir o aluno(a) ${nome}? Todas as notas e faltas serão apagadas.`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: () => excluirAluno(id) }
        ]
      );
    }
  };
const excluirAluno = async (id) => {
    try {
      // Vai mostrar um aviso antes para termos certeza que o ID existe
      console.log("Tentando deletar o ID:", id); 
      
      await api.delete(`/alunos/${id}`);
      Alert.alert("Sucesso", "Aluno excluído do sistema.");
      carregarAlunos(); 
    } catch (err) {
      // 🔴 AGORA ELE VAI MOSTRAR O ERRO REAL!
      const erroReal = err.response ? err.response.data.erro : err.message;
      Alert.alert("Erro Técnico", erroReal);
      console.log("ERRO DETALHADO NO FRONTEND:", err);
    }
  };
  // ─────────────────────────────────────────────────────────────

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
        <TouchableOpacity 
          style={[styles.actionBtn, { borderColor: colors.yellow, flex: 0.8 }]} 
          onPress={() => navigation.navigate('LancarNotas', { alunoIdSelecionado: item.id })}
        >
          <Text style={[styles.actionText, { color: colors.yellow }]}>⚠️ Faltas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, { borderColor: colors.accent }]} 
          onPress={() => navigation.navigate('HorarioAluno', { alunoId: item.id })}
        >
          <Text style={[styles.actionText, { color: colors.accent }]}>📅 Horário</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, { borderColor: colors.muted, flex: 0.8 }]} 
          onPress={() => navigation.navigate('EditarAluno', { alunoId: item.id })}
        >
          <Text style={[styles.actionText, { color: colors.muted }]}>✏️ Editar</Text>
        </TouchableOpacity>

        {/* NOVO BOTÃO DE EXCLUIR */}
        <TouchableOpacity 
          style={[styles.actionBtn, { borderColor: colors.danger, flex: 0.8 }]} 
          onPress={() => confirmarExclusao(item.id, item.nome)}
        >
          <Text style={[styles.actionText, { color: colors.danger }]}>🗑️ Del</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { justifyContent: 'space-between' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gerenciar Alunos</Text>
        </View>
        
        <TouchableOpacity 
          style={{ backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: radius.sm }}
          onPress={() => navigation.navigate('NovoAluno')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>+ Novo</Text>
        </TouchableOpacity>
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
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, borderWidth: 1, alignItems: 'center' },
  actionText: { fontSize: 12, fontWeight: 'bold' }
});