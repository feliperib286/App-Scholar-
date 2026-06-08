import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { AppInput, AppButton } from '../components';
import { colors, radius, spacing } from '../styles/theme';

export default function EditarDisciplinaScreen({ route, navigation }) {
  const { disciplinaId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [professores, setProfessores] = useState([]);
  
  const [form, setForm] = useState({
    nome: '',
    carga_horaria: '',
    professor_id: '',
    curso: '',
    semestre: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // 1. Buscamos a disciplina
      const res = await api.get(`/disciplinas/${disciplinaId}`); 
      
      // 2. Buscamos os professores
      const profs = await api.get('/professores');

      // 3. Agora usamos as variáveis corretas (res e profs)
      setForm(res.data); 
      setProfessores(profs.data);
    } catch (err) {
      console.error("Erro no carregamento:", err);
      Alert.alert('Erro', 'Falha ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      await api.put(`/disciplinas/${disciplinaId}`, form);
      Alert.alert('Sucesso', 'Disciplina atualizada!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Falha ao atualizar disciplina.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{marginTop: 50}} color={colors.accent} />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backBtn}>← Voltar</Text></TouchableOpacity>
        <Text style={styles.title}>Editar Disciplina</Text>
      </View>

      <ScrollView style={styles.container}>
        <AppInput label="Nome da Disciplina" value={form.nome} onChangeText={t => setForm({...form, nome: t})} />
        <AppInput label="Carga Horária (Ex: 80h)" value={form.carga_horaria} onChangeText={t => setForm({...form, carga_horaria: t})} />
        
        <Text style={styles.label}>Professor Responsável</Text>
        <View style={styles.pickerContainer}>
          {professores.map(p => (
            <TouchableOpacity 
              key={p.id} 
              style={[styles.item, form.professor_id === p.id && styles.itemSelected]}
              onPress={() => setForm({...form, professor_id: p.id})}
            >
              <Text style={form.professor_id === p.id ? {color: 'white'} : {color: colors.text}}>{p.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <AppButton title={saving ? "Salvando..." : "Salvar Alterações"} onPress={handleSalvar} loading={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { color: colors.muted2, marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  container: { padding: 20 },
  label: { fontSize: 14, color: colors.muted, marginBottom: 10, marginTop: 15 },
  pickerContainer: { marginBottom: 20, gap: 10 },
  item: { padding: 15, backgroundColor: colors.surface2, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  itemSelected: { backgroundColor: colors.primary, borderColor: colors.primary }
});