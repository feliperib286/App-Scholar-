import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../hooks/useAuth';
import { AppInput, AppButton } from '../components';
import { colors, spacing, radius } from '../styles/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();
  
  const [email, setEmail]   = useState('');
  const [senha, setSenha]   = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = 'Campo obrigatório';
    if (!senha.trim()) errs.senha = 'Campo obrigatório';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    
    setLoading(true);
    setErrors({});
    
    const result = await login(email.trim(), senha);
    
    setLoading(false);

    if (!result.ok) {
      setErrors({ geral: result.erro || 'Erro ao conectar. Tente novamente.' });
      return;
    }

    if (result.dados?.precisaTrocarSenha) {
      navigation.navigate('NovaSenhaScreen', { idUsuario: result.dados.id });
    } else {
      await AsyncStorage.setItem('token', result.dados.token);
      await AsyncStorage.setItem('usuarioNome', result.dados.usuario.nome);
      await AsyncStorage.setItem('usuarioRole', result.dados.usuario.role);
      
    }
  }

  // Função para preencher os dados automaticamente para os testes
  const preencherDadosTeste = (emailTeste) => {
    setEmail(emailTeste);
    setSenha('password'); // A senha padrão definida no banco para os testes
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <Text style={styles.title}>App Scholar</Text>
          <Text style={styles.subtitle}>Sistema Acadêmico · Fatec Jacareí</Text>

          <View style={styles.form}>
            <AppInput
              label="Login / E-mail"
              value={email}
              onChangeText={t => { setEmail(t); setErrors({}); }}
              placeholder="usuario@fatec.sp.gov.br"
              keyboardType="email-address"
              error={errors.email}
              autoCapitalize="none"
            />
            <AppInput
              label="Senha"
              value={senha}
              onChangeText={t => { setSenha(t); setErrors({}); }}
              placeholder="Digite sua senha"
              secureTextEntry
              error={errors.senha}
            />

            {errors.geral ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorBoxText}>⚠️  {errors.geral}</Text>
              </View>
            ) : null}

            <AppButton
              title={loading ? 'Entrando...' : 'Entrar no Sistema'}
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: 8 }}
            />
          </View>

          {/* ========================================== */}
          {/* BOTÕES DE TESTE RÁPIDO (Apenas para Desenvolvimento) */}
          {/* ========================================== */}
          <View style={styles.testButtonsContainer}>
            <Text style={styles.testButtonsTitle}>Acesso Rápido para Testes:</Text>
            <View style={styles.testButtonsRow}>
              
              <TouchableOpacity 
                style={styles.testBtn} 
                onPress={() => preencherDadosTeste('admin@fatec.sp.gov.br')}
              >
                <Text style={styles.testBtnText}>👑 Admin</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.testBtn} 
                onPress={() => preencherDadosTeste('andre.olimpio@fatec.sp.gov.br')}
              >
                <Text style={styles.testBtnText}>👨‍🏫 Prof</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.testBtn} 
                onPress={() => preencherDadosTeste('maria.santos@fatec.sp.gov.br')}
              >
                <Text style={styles.testBtnText}>👩‍🎓 Aluno</Text>
              </TouchableOpacity>

            </View>
          </View>
          {/* ========================================== */}

          <Text style={styles.footer}>fatec.sp.gov.br · v2.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: 40, paddingBottom: 32 },
  logoWrap: {
    width: 80, height: 80, backgroundColor: colors.accent, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: colors.accent, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45, shadowRadius: 20, elevation: 12,
  },
  logoIcon: { fontSize: 38 },
  title:    { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: colors.muted2, marginTop: 4, marginBottom: 36 },
  form:     { width: '100%', gap: 14 },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)', borderRadius: radius.sm, padding: 10,
  },
  errorBoxText: { fontSize: 12, color: '#fca5a5' },
  
  // Estilos dos botões de teste
  testButtonsContainer: { marginTop: 30, alignItems: 'center', width: '100%' },
  testButtonsTitle: { fontSize: 12, color: colors.muted, marginBottom: 12, fontWeight: '600' },
  testButtonsRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  testBtn: {
    paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: colors.surface2, borderRadius: radius.md, 
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center',
  },
  testBtnText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  
  footer: { marginTop: 'auto', paddingTop: 32, fontSize: 11, color: colors.muted },
});