import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput, AppButton, FormHeader, SectionLabel } from '../components';
import { colors, spacing, radius } from '../styles/theme';

const TITULACOES = ['Graduado', 'Especialista', 'Mestre (MSc)', 'Doutor (PhD)', 'Pós-Doutor'];
const TEMPOS = ['Menos de 1 ano', '1 a 3 anos', '4 a 7 anos', '8 a 12 anos', 'Mais de 12 anos'];

const INITIAL = {
  nome: '',
  titulacao: '',
  areaAtuacao: '',
  tempoDocencia: '',
  email: '',
};

export default function CadastroProfessorScreen({ navigation }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTitulacao, setShowTitulacao] = useState(false);
  const [showTempo, setShowTempo] = useState(false);

  function set(field) {
    return (value) => {
      setForm(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  function validate() {
    const errs = {};
    ['nome', 'titulacao', 'areaAtuacao', 'tempoDocencia', 'email'].forEach(f => {
      if (!form[f].trim()) errs[f] = 'Campo obrigatório';
    });
    if (form.email && !form.email.includes('@')) errs.email = 'E-mail inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    console.log('Professor cadastrado:', form);
    Alert.alert('Sucesso! ✅', `Professor(a) "${form.nome}" cadastrado(a).`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  function PickerField({ label, value, options, open, setOpen, onSelect, error }) {
    return (
      <View style={{ gap: 5 }}>
        <Text style={pickerStyle.label}>{label}</Text>
        <TouchableOpacity
          style={[pickerStyle.field, error && { borderColor: colors.red }]}
          onPress={() => setOpen(!open)}
          activeOpacity={0.8}
        >
          <Text style={{ color: value ? colors.text : colors.muted, fontSize: 14 }}>
            {value || 'Selecione...'}
          </Text>
          <Text style={{ color: colors.muted }}>{open ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {error ? <Text style={pickerStyle.error}>{error}</Text> : null}
        {open && (
          <View style={pickerStyle.dropdown}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={pickerStyle.option}
                onPress={() => { onSelect(opt); setOpen(false); }}
              >
                <Text style={{ color: value === opt ? colors.accent2 : colors.text, fontSize: 13 }}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FormHeader
        title="Cadastro de Professor"
        subtitle="Dados do docente"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          <SectionLabel>👨‍🏫 Informações Profissionais</SectionLabel>

          <AppInput
            label="Nome Completo *"
            value={form.nome}
            onChangeText={set('nome')}
            placeholder="Ex: André Olímpio"
            error={errors.nome}
          />

          <PickerField
            label="Titulação *"
            value={form.titulacao}
            options={TITULACOES}
            open={showTitulacao}
            setOpen={setShowTitulacao}
            onSelect={set('titulacao')}
            error={errors.titulacao}
          />

          <AppInput
            label="Área de Atuação *"
            value={form.areaAtuacao}
            onChangeText={set('areaAtuacao')}
            placeholder="Ex: Desenvolvimento Mobile"
            error={errors.areaAtuacao}
          />

          <PickerField
            label="Tempo de Docência *"
            value={form.tempoDocencia}
            options={TEMPOS}
            open={showTempo}
            setOpen={setShowTempo}
            onSelect={set('tempoDocencia')}
            error={errors.tempoDocencia}
          />

          <AppInput
            label="E-mail *"
            value={form.email}
            onChangeText={set('email')}
            placeholder="professor@fatec.sp.gov.br"
            keyboardType="email-address"
            error={errors.email}
          />

          <AppButton
            title="💾  Salvar Cadastro"
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: 10 }}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const pickerStyle = StyleSheet.create({
  label: { fontSize: 11, color: colors.muted2, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '600' },
  field: {
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  error: { fontSize: 11, color: colors.red, marginTop: 2 },
  dropdown: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 2,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 14, paddingBottom: 40 },
});
