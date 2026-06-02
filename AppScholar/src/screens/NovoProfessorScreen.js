import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { apiGetDisciplinas, apiVincularDisciplinas } from '../services/api';
import { AppInput, AppButton } from '../components';
import { colors, spacing, radius } from '../styles/theme';

export default function NovoProfessorScreen({ navigation }) {
  const [saving, setSaving] = useState(false);
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(true);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState([]);

 const [form, setForm] = useState({
    nome: '', titulacao: '', area: '', tempo_docencia: '', email: '', senha: '' // <-- Adicionei a senha aqui
  });
  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const dados = await apiGetDisciplinas();
      setListaDisciplinas(dados);
    } catch (err) {
      console.log('Erro ao buscar disciplinas');
    } finally {
      setLoadingDisciplinas(false);
    }
  };

  const toggleDisciplina = (id) => {
    if (disciplinasSelecionadas.includes(id)) {
      setDisciplinasSelecionadas(disciplinasSelecionadas.filter(item => item !== id));
    } else {
      setDisciplinasSelecionadas([...disciplinasSelecionadas, id]);
    }
  };

 const handleSalvar = async () => {
    // Agora bloqueia se a senha estiver vazia
    if (!form.nome || !form.email || !form.senha) { 
      return Alert.alert('Aviso', 'Nome, E-mail e Senha são obrigatórios.');
    }
  

    setSaving(true);
    try {
      // 1. Cadastra o professor no banco
      const response = await api.post('/professores', form);
      const professorCriadoId = response.data.professor.id;

      // 2. Se o Admin marcou disciplinas, faz a atribuição
      if (disciplinasSelecionadas.length > 0) {
        await apiVincularDisciplinas(professorCriadoId, disciplinasSelecionadas);
      }

      Alert.alert('Sucesso', 'Professor cadastrado e aulas atribuídas!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.erro || 'Erro ao realizar o cadastro.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Cadastrar Professor</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          <Text style={styles.sectionTitle}>DADOS PROFISSIONAIS</Text>
          <AppInput label="Nome Completo" value={form.nome} onChangeText={t => setForm({...form, nome: t})} placeholder="Ex: João da Silva" />
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <AppInput label="Titulação" value={form.titulacao} onChangeText={t => setForm({...form, titulacao: t})} placeholder="Ex: Mestre" />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput label="Área" value={form.area} onChangeText={t => setForm({...form, area: t})} placeholder="Ex: Exatas" />
            </View>
          </View>
          
          <AppInput label="Tempo de Docência" value={form.tempo_docencia} onChangeText={t => setForm({...form, tempo_docencia: t})} placeholder="Ex: 5 anos" />
          <AppInput label="E-mail de Acesso (Login)" value={form.email} onChangeText={t => setForm({...form, email: t})} placeholder="joao@escola.com.br" />

          <AppInput 
            label="Senha de Acesso" 
            value={form.senha} 
            onChangeText={t => setForm({...form, senha: t})} 
            placeholder="Defina uma senha para o professor" 
            secureTextEntry={true} 
          />
          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>ATRIBUIÇÃO DE DISCIPLINAS</Text>
          <Text style={styles.subtitle}>Selecione as matérias que este professor irá lecionar:</Text>

          {loadingDisciplinas ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <View style={styles.tagsContainer}>
              {listaDisciplinas.map((disc) => {
                const isSelected = disciplinasSelecionadas.includes(disc.id);
                return (
                  <TouchableOpacity 
                    key={disc.id} 
                    style={[styles.tag, isSelected && styles.tagSelected]}
                    onPress={() => toggleDisciplina(disc.id)}
                  >
                    <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                      {isSelected ? '✓ ' : '+ '} {disc.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <AppButton 
            title={saving ? "Salvando e Atribuindo..." : "Finalizar Cadastro"} 
            onPress={handleSalvar} 
            loading={saving}
            style={{ marginTop: 40, marginBottom: 20 }}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { color: colors.primary, marginRight: 15, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  container: { padding: 20 },
  sectionTitle: { fontSize: 12, color: colors.muted, fontWeight: 'bold', marginBottom: 15, letterSpacing: 1 },
  subtitle: { fontSize: 13, color: colors.muted2, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 15, paddingVertical: 10, borderRadius: radius.full },
  tagSelected: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: colors.primary },
  tagText: { color: colors.muted2, fontSize: 14, fontWeight: '500' },
  tagTextSelected: { color: colors.primary, fontWeight: 'bold' }
});