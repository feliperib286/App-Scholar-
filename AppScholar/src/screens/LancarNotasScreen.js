import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { apiGetAlunos, apiGetDisciplinas, apiLancarNota } from '../services/api';
import { AppInput, AppButton } from '../components';
import { colors, radius, spacing } from '../styles/theme';

export default function LancarNotasScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [form, setForm] = useState({
    aluno_id: '',
    disciplina_id: '',
    nota1: '', 
    nota2: '', 
    faltas: '',
    tipo_falta: 'Comum'
  }); 

  const tiposFalta = ['Comum', 'Justificada', 'Falta Médica Parcial (Até 2h)'];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [dadosAlunos, dadosDisciplinas] = await Promise.all([
        apiGetAlunos(),
        apiGetDisciplinas()
      ]);
      setAlunos(dadosAlunos);
      setDisciplinas(dadosDisciplinas);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os dados para lançamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!form.aluno_id || !form.disciplina_id) {
      return Alert.alert('Aviso', 'Selecione um aluno e uma disciplina.');
    }
    // Ajustado para exigir pelo menos alguma nota ou a falta
    if (form.nota1 === '' && form.nota2 === '' && form.faltas === '') {
      return Alert.alert('Aviso', 'Preencha alguma nota ou a quantidade de faltas.');
    }

    setSaving(true);
    try {
      await apiLancarNota(form);
      Alert.alert('Sucesso', 'Notas e Faltas registradas com sucesso!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.erro || 'Erro ao lançar dados.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.muted, marginTop: 10 }}>Carregando painel...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Lançar Notas e Faltas</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          {/* SELEÇÃO DE ALUNO */}
          <Text style={styles.sectionTitle}>1. SELECIONE O ALUNO</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {alunos.map(aluno => (
              <TouchableOpacity 
                key={aluno.id} 
                style={[styles.chip, form.aluno_id === aluno.id && styles.chipSelected]}
                onPress={() => setForm({ ...form, aluno_id: aluno.id })}
              >
                <Text style={[styles.chipText, form.aluno_id === aluno.id && styles.chipTextSelected]}>
                  {aluno.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* SELEÇÃO DE DISCIPLINA */}
          <Text style={styles.sectionTitle}>2. SELECIONE A DISCIPLINA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {disciplinas.map(disc => (
              <TouchableOpacity 
                key={disc.id} 
                style={[styles.chip, form.disciplina_id === disc.id && styles.chipSelected]}
                onPress={() => setForm({ ...form, disciplina_id: disc.id })}
              >
                <Text style={[styles.chipText, form.disciplina_id === disc.id && styles.chipTextSelected]}>
                  {disc.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* NOTAS E FALTAS (CORRIGIDO E NO LUGAR CERTO) */}
          <Text style={styles.sectionTitle}>3. REGISTRO ACADÊMICO</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <AppInput 
                label="Nota 1º Bim" 
                value={form.nota1} 
                onChangeText={t => setForm({...form, nota1: t.replace(/[^0-9.]/g, '')})} 
                placeholder="0 a 10" 
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginRight: 10 }}>
              <AppInput 
                label="Nota 2º Bim" 
                value={form.nota2} 
                onChangeText={t => setForm({...form, nota2: t.replace(/[^0-9.]/g, '')})} 
                placeholder="0 a 10" 
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput 
                label="Faltas" 
                value={form.faltas} 
                onChangeText={t => setForm({...form, faltas: t.replace(/[^0-9]/g, '')})} 
                placeholder="Ex: 4" 
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* TIPO DE FALTA */}
          <Text style={styles.sectionTitle}>TIPO DE REGISTRO DE FALTA</Text>
          <View style={styles.tagsContainer}>
            {tiposFalta.map((tipo, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.tag, form.tipo_falta === tipo && styles.tagSelected]}
                onPress={() => setForm({ ...form, tipo_falta: tipo })}
              >
                <Text style={[styles.tagText, form.tipo_falta === tipo && styles.tagTextSelected]}>{tipo}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <AppButton 
            title={saving ? "Salvando..." : "Gravar no Boletim"} 
            onPress={handleSalvar} 
            loading={saving}
            style={{ marginTop: 40, marginBottom: 30 }}
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
  sectionTitle: { fontSize: 12, color: colors.muted, fontWeight: 'bold', marginBottom: 10, marginTop: 20, letterSpacing: 1 },
  
  horizontalScroll: { flexDirection: 'row', marginBottom: 10 },
  chip: { backgroundColor: colors.surface2, paddingHorizontal: 15, paddingVertical: 10, borderRadius: radius.md, marginRight: 10, borderWidth: 1, borderColor: colors.border },
  chipSelected: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: colors.primary },
  chipText: { color: colors.muted2, fontSize: 14 },
  chipTextSelected: { color: colors.primary, fontWeight: 'bold' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 15, paddingVertical: 10, borderRadius: radius.full },
  tagSelected: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: colors.danger },
  tagText: { color: colors.muted2, fontSize: 13, fontWeight: '500' },
  tagTextSelected: { color: colors.danger, fontWeight: 'bold' }
});