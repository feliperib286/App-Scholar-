import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput, AppButton, FormHeader, SectionLabel } from '../components';
import { colors, spacing } from '../styles/theme';
import { apiCriarDisciplina, apiGetProfessores } from '../services/api';

const SEMESTRES = ['1º', '2º', '3º', '4º', '5º', '6º'];
const CURSOS = [
  'Desenvolvimento de Software Multiplataforma',
  'Análise e Desenvolvimento de Sistemas',
  'Gestão da Tecnologia da Informação',
];

const INITIAL = { nome: '', carga_horaria: '', professor_id: '', curso: '', semestre: '' };

export default function CadastroDisciplinaScreen({ navigation }) {
  const [form, setForm]         = useState(INITIAL);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [openField, setOpenField] = useState(null);

  // Professores carregados da API
  const [professores, setProfessores] = useState([]);
  const [profSelecionado, setProfSelecionado] = useState('');

  useEffect(() => {
    apiGetProfessores()
      .then(lista => setProfessores(lista))
      .catch(() => Alert.alert('Aviso', 'Não foi possível carregar professores.'));
  }, []);

  function set(field) {
    return (value) => {
      setForm(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  function toggle(field) {
    setOpenField(prev => (prev === field ? null : field));
  }

  function validate() {
    const errs = {};
    ['nome', 'carga_horaria', 'professor_id', 'curso', 'semestre'].forEach(f => {
      if (!form[f] || !String(form[f]).trim()) errs[f] = 'Campo obrigatório';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    try {
      await apiCriarDisciplina(form);
      Alert.alert('Sucesso! ✅', `Disciplina "${form.nome}" cadastrada.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao cadastrar disciplina.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  function PickerField({ fieldKey, label, value, options, displayValue, error }) {
    const open = openField === fieldKey;
    return (
      <View style={{ gap: 5 }}>
        <Text style={pStyle.label}>{label}</Text>
        <TouchableOpacity
          style={[pStyle.field, error && { borderColor: colors.red }]}
          onPress={() => toggle(fieldKey)} activeOpacity={0.8}
        >
          <Text style={{ color: displayValue || value ? colors.text : colors.muted, fontSize: 13, flex: 1, flexWrap: 'wrap' }}>
            {displayValue || value || 'Selecione...'}
          </Text>
          <Text style={{ color: colors.muted }}>{open ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {error ? <Text style={pStyle.error}>{error}</Text> : null}
        {open && (
          <View style={pStyle.dropdown}>
            {options.map(opt => (
              <TouchableOpacity key={opt.value || opt} style={pStyle.option}
                onPress={() => { opt.onSelect ? opt.onSelect() : null; setOpenField(null); }}
              >
                <Text style={{ color: colors.text, fontSize: 13 }}>{opt.label || opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  const profOpcoes = professores.map(p => ({
    label: p.nome,
    value: p.id,
    onSelect: () => {
      set('professor_id')(p.id);
      setProfSelecionado(p.nome);
    },
  }));

  const semestreOpcoes = SEMESTRES.map(s => ({ label: s, value: s, onSelect: () => set('semestre')(s) }));
  const cursoOpcoes    = CURSOS.map(c => ({ label: c, value: c, onSelect: () => set('curso')(c) }));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FormHeader title="Cadastro de Disciplina" subtitle="Configure a disciplina" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          <SectionLabel>📚 Dados da Disciplina</SectionLabel>

          <AppInput label="Nome da Disciplina *" value={form.nome} onChangeText={set('nome')} placeholder="Ex: Programação Mobile I" error={errors.nome} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <AppInput label="Carga Horária *" value={form.carga_horaria} onChangeText={set('carga_horaria')} placeholder="Ex: 80h" error={errors.carga_horaria} />
            </View>
            <View style={{ flex: 0.9 }}>
              <PickerField fieldKey="semestre" label="Semestre *" value={form.semestre} options={semestreOpcoes} error={errors.semestre} />
            </View>
          </View>

          <PickerField fieldKey="curso" label="Curso *" value={form.curso} options={cursoOpcoes} error={errors.curso} />

          <PickerField
            fieldKey="professor_id"
            label="Professor Responsável *"
            value={form.professor_id}
            displayValue={profSelecionado}
            options={profOpcoes}
            error={errors.professor_id}
          />

          <SectionLabel>⚙️ Avaliação</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><AppInput label="Nota Mínima" value="5,0" editable={false} /></View>
            <View style={{ flex: 1 }}><AppInput label="Freq. Mínima" value="75%" editable={false} /></View>
          </View>

          <AppButton title="💾  Salvar Disciplina" onPress={handleSave} loading={loading} style={{ marginTop: 10 }} />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const pStyle = StyleSheet.create({
  label:    { fontSize: 11, color: colors.muted2, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '600' },
  field:    { backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 },
  error:    { fontSize: 11, color: colors.red, marginTop: 2 },
  dropdown: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: 'hidden', marginTop: 2 },
  option:   { paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 14, paddingBottom: 40 },
});
