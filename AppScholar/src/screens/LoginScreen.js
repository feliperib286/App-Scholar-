import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { AppInput, AppButton } from '../components';
import { colors, spacing, radius } from '../styles/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
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
    // Simula delay de rede
    await new Promise(r => setTimeout(r, 800));
    const ok = login(email, senha);
    setLoading(false);
    if (!ok) {
      setErrors({ geral: 'Credenciais inválidas. Tente novamente.' });
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>

          <Text style={styles.title}>App Scholar</Text>
          <Text style={styles.subtitle}>Sistema Acadêmico · Fatec Jacareí</Text>

          {/* Form */}
          <View style={styles.form}>
            <AppInput
              label="Login / E-mail"
              value={email}
              onChangeText={t => { setEmail(t); setErrors({}); }}
              placeholder="usuario@fatec.sp.gov.br"
              keyboardType="email-address"
              error={errors.email}
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

          {/* Dica de acesso rápido (mockado) */}
          <TouchableOpacity
            onPress={() => { setEmail('admin@fatec.sp.gov.br'); setSenha('1234'); }}
            style={styles.quickTip}
          >
            <Text style={styles.quickTipText}>💡 Preencher com dados de teste</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>fatec.sp.gov.br · v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoWrap: {
    width: 80,
    height: 80,
    backgroundColor: colors.accent,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  logoIcon: { fontSize: 38 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted2,
    marginTop: 4,
    marginBottom: 36,
  },
  form: { width: '100%', gap: 14 },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: radius.sm,
    padding: 10,
  },
  errorBoxText: { fontSize: 12, color: '#fca5a5' },
  quickTip: {
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTipText: { fontSize: 12, color: colors.muted2 },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    fontSize: 11,
    color: colors.muted,
  },
});
