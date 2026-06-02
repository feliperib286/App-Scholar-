import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { AppInput, AppButton } from '../components';
import { colors, radius, spacing } from '../styles/theme';

export default function NovoAlunoScreen({ navigation }) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    matricula: '',
    email: '',
    senha: '',
    curso: ''
  });

  const handleSalvar = async () => {
    if (!form.nome || !form.matricula || !form.email || !form.senha) {
      return Alert.alert('Aviso', 'Nome, Matrícula, E-mail e Senha são obrigatórios.');
    }

    setSaving(true);
    try {
      // Envia os dados para criar o aluno no backend
      await api.post('/alunos', form);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      navigation.goBack(); // Volta para a lista e recarrega
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
          <Text style={styles.title}>Cadastrar Aluno</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          <Text style={styles.sectionTitle}>DADOS PESSOAIS</Text>
          <AppInput 
            label="Nome Completo" 
            value={form.nome} 
            onChangeText={t => setForm({...form, nome: t})} 
            placeholder="Ex: Maria da Silva" 
          />
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <AppInput 
                label="Matrícula (RA)" 
                value={form.matricula} 
                onChangeText={t => setForm({...form, matricula: t})} 
                placeholder="Ex: 20241001" 
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput 
                label="Curso / Turma" 
                value={form.curso} 
                onChangeText={t => setForm({...form, curso: t})} 
                placeholder="Ex: 1º Ano Informática" 
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>ACESSO AO APLICATIVO</Text>
          <AppInput 
            label="E-mail" 
            value={form.email} 
            onChangeText={t => setForm({...form, email: t})} 
            placeholder="maria@escola.com" 
            autoCapitalize="none"
          />

          <AppInput 
            label="Senha de Acesso" 
            value={form.senha} 
            onChangeText={t => setForm({...form, senha: t})} 
            placeholder="Defina uma senha" 
            secureTextEntry={true} 
          />

          <AppButton 
            title={saving ? "Cadastrando..." : "Finalizar Cadastro"} 
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
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});