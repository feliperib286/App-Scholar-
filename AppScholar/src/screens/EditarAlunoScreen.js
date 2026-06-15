import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { apiAtualizarAluno } from '../services/api';
import { AppInput, AppButton } from '../components';
import { colors } from '../styles/theme';

export default function EditarAlunoScreen({ route, navigation }) {
  const { alunoId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: '', matricula: '', email: '', curso: '', 
    telefone: '', cep: '', endereco: '', cidade: '', estado: ''
  });

  useEffect(() => {
    if (alunoId) {
      carregarDadosAluno();
    } else {
      Alert.alert('Erro', 'Nenhum aluno selecionado.');
      navigation.goBack();
    }
  }, [alunoId]);

  const carregarDadosAluno = async () => {
    try {
      const response = await api.get(`/alunos/${alunoId}`);
      const aluno = response.data;
      
      // AGORA BUSCAMOS TODOS OS CAMPOS DO BANCO
      setForm({
        nome: aluno.nome || '',
        matricula: aluno.matricula || '',
        email: aluno.email || '',
        curso: aluno.curso || '',
        telefone: aluno.telefone || '',
        cep: aluno.cep || '',
        endereco: aluno.endereco || '',
        cidade: aluno.cidade || '',
        estado: aluno.estado || ''
      });
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os dados deste aluno.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!form.nome || !form.matricula) {
      return Alert.alert('Aviso', 'Nome e Matrícula são obrigatórios.');
    }

    setSaving(true);
    try {
      await apiAtualizarAluno(alunoId, form);
      Alert.alert('Sucesso', 'Dados do aluno atualizados!');
      navigation.goBack();
    } catch (err) {
      console.log("=== ERRO AO SALVAR ===", err.response?.data);
      Alert.alert('Erro', 'Falha ao salvar. Verifique o terminal.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: 'white' }}>← Voltar</Text></TouchableOpacity>
          <Text style={styles.title}>Editar Aluno</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <AppInput label="Nome" value={form.nome} onChangeText={t => setForm({...form, nome: t})} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}><AppInput label="RA" value={form.matricula} onChangeText={t => setForm({...form, matricula: t})} /></View>
            <View style={{ flex: 1, marginLeft: 10 }}><AppInput label="Curso" value={form.curso} onChangeText={t => setForm({...form, curso: t})} /></View>
          </View>
          <AppInput label="E-mail" value={form.email} onChangeText={t => setForm({...form, email: t})} autoCapitalize="none" />
          <AppInput label="Telefone" value={form.telefone} onChangeText={t => setForm({...form, telefone: t})} />
          <AppInput label="Endereço" value={form.endereco} onChangeText={t => setForm({...form, endereco: t})} />
          
          <AppButton title={saving ? "Salvando..." : "Salvar"} onPress={handleSalvar} loading={saving} style={{ marginTop: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { color: colors.primary, fontSize: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  container: { padding: 20 },
  row: { flexDirection: 'row' }
});