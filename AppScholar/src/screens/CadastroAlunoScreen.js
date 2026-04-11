import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput, AppButton, FormHeader, SectionLabel } from '../components';
import { colors, spacing } from '../styles/theme';

const INITIAL = {
  nome: '',
  matricula: '',
  curso: '',
  email: '',
  telefone: '',
  cep: '',
  endereco: '',
  cidade: '',
  estado: '',
};

export default function CadastroAlunoScreen({ navigation }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (value) => {
      setForm(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  function validate() {
    const required = ['nome', 'matricula', 'curso', 'email', 'telefone', 'cep', 'endereco', 'cidade', 'estado'];
    const errs = {};
    required.forEach(f => {
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
    // Aqui seria a chamada à API REST (Parte 2)
    console.log('Aluno cadastrado:', form);
    Alert.alert('Sucesso! ✅', `Aluno "${form.nome}" cadastrado com sucesso.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FormHeader
        title="Cadastro de Aluno"
        subtitle="Preencha todos os campos obrigatórios"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          <SectionLabel>📋 Dados Pessoais</SectionLabel>

          <AppInput
            label="Nome Completo *"
            value={form.nome}
            onChangeText={set('nome')}
            placeholder="Ex: Maria Aparecida Santos"
            error={errors.nome}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppInput
                label="Matrícula *"
                value={form.matricula}
                onChangeText={set('matricula')}
                placeholder="DSM2024001"
                error={errors.matricula}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput
                label="Curso *"
                value={form.curso}
                onChangeText={set('curso')}
                placeholder="DSM"
                error={errors.curso}
              />
            </View>
          </View>

          <AppInput
            label="E-mail *"
            value={form.email}
            onChangeText={set('email')}
            placeholder="usuario@fatec.sp.gov.br"
            keyboardType="email-address"
            error={errors.email}
          />

          <AppInput
            label="Telefone *"
            value={form.telefone}
            onChangeText={set('telefone')}
            placeholder="(12) 99999-9999"
            keyboardType="phone-pad"
            error={errors.telefone}
          />

          <SectionLabel>📍 Endereço</SectionLabel>

          <View style={styles.row}>
            <View style={{ flex: 1.4 }}>
              <AppInput
                label="CEP *"
                value={form.cep}
                onChangeText={set('cep')}
                placeholder="00000-000"
                keyboardType="numeric"
                error={errors.cep}
              />
            </View>
            <View style={{ flex: 0.8 }}>
              <AppInput
                label="Estado *"
                value={form.estado}
                onChangeText={set('estado')}
                placeholder="SP"
                error={errors.estado}
              />
            </View>
          </View>

          <AppInput
            label="Cidade *"
            value={form.cidade}
            onChangeText={set('cidade')}
            placeholder="Ex: Jacareí"
            error={errors.cidade}
          />

          <AppInput
            label="Endereço *"
            value={form.endereco}
            onChangeText={set('endereco')}
            placeholder="Rua, número – Bairro"
            error={errors.endereco}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.lg, gap: spacing.md, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 10 },
});
