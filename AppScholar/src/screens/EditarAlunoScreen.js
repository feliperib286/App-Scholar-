import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AppInput, AppButton } from '../components';
import { colors, spacing, radius } from '../styles/theme';

export default function EditarAlunoScreen({ route, navigation }) {
  const { user } = useAuth();
  
  // Pega o ID passado por parâmetro (se o Admin clicou na lista)
  const { alunoId } = route.params || {}; 
  
  // LÓGICA INTELIGENTE: Se não tiver ID (o aluno clicou em "Meus Dados"), usa a rota "meu-perfil"
  const endpoint = alunoId ? `/alunos/${alunoId}` : `/alunos/meu-perfil`;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: '', matricula: '', curso: '', email: '', telefone: '', cep: '', endereco: '', cidade: '', estado: ''
  });

  // Somente o Admin pode editar o e-mail
  const podeEditarEmail = user?.role === 'adm';

  useEffect(() => {
    carregarDadosAluno();
  }, []);

  const carregarDadosAluno = async () => {
    try {
      // Faz a requisição dinâmica (para um ID ou para o próprio perfil)
      const response = await api.get(endpoint);
      setForm(response.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do aluno.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      // Salva na rota dinâmica (ID ou meu-perfil)
      await api.put(endpoint, form);
      Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');
      navigation.goBack(); 
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.erro || 'Ocorreu um erro ao salvar as alterações.');
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{alunoId ? 'Editar Aluno' : 'Meus Dados'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          <Text style={styles.sectionTitle}>DADOS ACADÊMICOS</Text>
          <AppInput label="Nome Completo" value={form.nome} onChangeText={t => setForm({...form, nome: t})} />
          <AppInput label="Matrícula" value={form.matricula} onChangeText={t => setForm({...form, matricula: t})} />
          <AppInput label="Curso" value={form.curso} onChangeText={t => setForm({...form, curso: t})} />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>CONTATO E ACESSO</Text>
          
          {/* CAMPO DE E-MAIL COM BLOQUEIO */}
          <View>
            <AppInput 
              label="E-mail de Acesso" 
              value={form.email} 
              onChangeText={t => setForm({...form, email: t})}
              editable={podeEditarEmail} 
            />
            {!podeEditarEmail && (
              <Text style={styles.avisoBloqueio}>🔒 O e-mail não pode ser alterado por segurança.</Text>
            )}
          </View>

          <AppInput label="Telefone" value={form.telefone} onChangeText={t => setForm({...form, telefone: t})} />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>ENDEREÇO</Text>
          <AppInput label="CEP" value={form.cep} onChangeText={t => setForm({...form, cep: t})} />
          <AppInput label="Endereço" value={form.endereco} onChangeText={t => setForm({...form, endereco: t})} />
          
          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <AppInput label="Cidade" value={form.cidade} onChangeText={t => setForm({...form, cidade: t})} />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput label="UF" value={form.estado} onChangeText={t => setForm({...form, estado: t})} />
            </View>
          </View>

          <AppButton 
            title={saving ? "Salvando..." : "Salvar Alterações"} 
            onPress={handleSalvar} 
            loading={saving}
            style={{ marginTop: 30, marginBottom: 20 }}
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
  avisoBloqueio: { fontSize: 11, color: colors.yellow, marginTop: -8, marginBottom: 15, marginLeft: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});