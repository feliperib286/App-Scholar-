import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput, AppButton, FormHeader, SectionLabel } from '../components';
import { colors, spacing } from '../styles/theme';
import { apiCriarAluno, buscarCep, buscarEstados, buscarCidades } from '../services/api';

const INITIAL = {
  nome: '', matricula: '', curso: '', email: '',
  telefone: '', cep: '', endereco: '', cidade: '', estado: '',
};

export default function CadastroAlunoScreen({ navigation }) {
  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  // Estados e cidades (IBGE)
  const [estados, setEstados]     = useState([]);
  const [cidades, setCidades]     = useState([]);
  const [showEstados, setShowEstados] = useState(false);
  const [showCidades, setShowCidades] = useState(false);

  function set(field) {
    return (value) => {
      setForm(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  // ── ViaCEP ────────────────────────────────────────────────
  async function handleCepBlur() {
    const cep = form.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const dados = await buscarCep(cep);
      setForm(prev => ({
        ...prev,
        endereco: dados.logradouro ? `${dados.logradouro}${dados.bairro ? ', ' + dados.bairro : ''}` : prev.endereco,
        cidade:   dados.localidade || prev.cidade,
        estado:   dados.uf         || prev.estado,
      }));
    } catch {
      Alert.alert('CEP não encontrado', 'Verifique o CEP informado.');
    } finally {
      setCepLoading(false);
    }
  }

  // ── IBGE: carregar estados ─────────────────────────────────
  async function abrirEstados() {
    if (estados.length === 0) {
      try {
        const lista = await buscarEstados();
        setEstados(lista);
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar os estados.');
        return;
      }
    }
    setShowEstados(true);
    setShowCidades(false);
  }

  // ── IBGE: carregar cidades do estado selecionado ───────────
  async function selecionarEstado(uf) {
    set('estado')(uf);
    set('cidade')('');
    setShowEstados(false);
    try {
      const lista = await buscarCidades(uf);
      setCidades(lista);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as cidades.');
    }
  }

  function validate() {
    const required = ['nome', 'matricula', 'curso', 'email', 'telefone', 'cep', 'endereco', 'cidade', 'estado'];
    const errs = {};
    required.forEach(f => { if (!form[f].trim()) errs[f] = 'Campo obrigatório'; });
    if (form.email && !form.email.includes('@')) errs.email = 'E-mail inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    try {
      await apiCriarAluno(form);
      Alert.alert('Sucesso! ✅', `Aluno "${form.nome}" cadastrado com sucesso.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao cadastrar aluno.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FormHeader title="Cadastro de Aluno" subtitle="Preencha todos os campos obrigatórios" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          <SectionLabel>📋 Dados Pessoais</SectionLabel>

          <AppInput label="Nome Completo *" value={form.nome} onChangeText={set('nome')} placeholder="Ex: Maria Aparecida Santos" error={errors.nome} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppInput label="Matrícula *" value={form.matricula} onChangeText={set('matricula')} placeholder="DSM2024001" error={errors.matricula} />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput label="Curso *" value={form.curso} onChangeText={set('curso')} placeholder="DSM" error={errors.curso} />
            </View>
          </View>

          <AppInput label="E-mail *" value={form.email} onChangeText={set('email')} placeholder="usuario@fatec.sp.gov.br" keyboardType="email-address" error={errors.email} />
          <AppInput label="Telefone *" value={form.telefone} onChangeText={set('telefone')} placeholder="(12) 99999-9999" keyboardType="phone-pad" error={errors.telefone} />

          <SectionLabel>📍 Endereço (ViaCEP + IBGE)</SectionLabel>

          {/* CEP com preenchimento automático via ViaCEP */}
          <AppInput
            label={cepLoading ? "CEP * (buscando...)" : "CEP *"}
            value={form.cep}
            onChangeText={set('cep')}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            keyboardType="numeric"
            error={errors.cep}
          />

          {/* Estado via IBGE */}
          <View style={{ gap: 5 }}>
            <Text style={pickerStyle.label}>ESTADO *</Text>
            <TouchableOpacity
              style={[pickerStyle.field, errors.estado && { borderColor: colors.red }]}
              onPress={abrirEstados}
            >
              <Text style={{ color: form.estado ? colors.text : colors.muted, fontSize: 13 }}>
                {form.estado || 'Selecione o estado...'}
              </Text>
              <Text style={{ color: colors.muted }}>{showEstados ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {errors.estado ? <Text style={pickerStyle.error}>{errors.estado}</Text> : null}
            {showEstados && (
              <ScrollView style={pickerStyle.dropdown} nestedScrollEnabled>
                {estados.map(e => (
                  <TouchableOpacity key={e.id} style={pickerStyle.option} onPress={() => selecionarEstado(e.sigla)}>
                    <Text style={{ color: form.estado === e.sigla ? colors.accent2 : colors.text, fontSize: 13 }}>
                      {e.sigla} – {e.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Cidade via IBGE */}
          {cidades.length > 0 && (
            <View style={{ gap: 5 }}>
              <Text style={pickerStyle.label}>CIDADE *</Text>
              <TouchableOpacity
                style={[pickerStyle.field, errors.cidade && { borderColor: colors.red }]}
                onPress={() => { setShowCidades(!showCidades); setShowEstados(false); }}
              >
                <Text style={{ color: form.cidade ? colors.text : colors.muted, fontSize: 13 }}>
                  {form.cidade || 'Selecione a cidade...'}
                </Text>
                <Text style={{ color: colors.muted }}>{showCidades ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {errors.cidade ? <Text style={pickerStyle.error}>{errors.cidade}</Text> : null}
              {showCidades && (
                <ScrollView style={pickerStyle.dropdown} nestedScrollEnabled>
                  {cidades.map(c => (
                    <TouchableOpacity key={c.id} style={pickerStyle.option} onPress={() => { set('cidade')(c.nome); setShowCidades(false); }}>
                      <Text style={{ color: form.cidade === c.nome ? colors.accent2 : colors.text, fontSize: 13 }}>{c.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {cidades.length === 0 && (
            <AppInput label="Cidade *" value={form.cidade} onChangeText={set('cidade')} placeholder="Ex: Jacareí" error={errors.cidade} />
          )}

          <AppInput label="Endereço *" value={form.endereco} onChangeText={set('endereco')} placeholder="Rua, número – Bairro" error={errors.endereco} />

          <AppButton title="💾  Salvar Cadastro" onPress={handleSave} loading={loading} style={{ marginTop: 10 }} />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const pickerStyle = StyleSheet.create({
  label: { fontSize: 11, color: colors.muted2, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '600' },
  field: {
    backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  error: { fontSize: 11, color: colors.red, marginTop: 2 },
  dropdown: {
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, maxHeight: 180, marginTop: 2,
  },
  option: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.lg, gap: spacing.md, paddingBottom: 40 },
  row:  { flexDirection: 'row', gap: 10 },
});
