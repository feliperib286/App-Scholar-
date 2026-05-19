import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { AppInput, AppButton } from '../components';
import { colors, spacing, radius } from '../styles/theme';

export default function NovaSenhaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Pega o ID do usuário que enviamos lá da tela de Login
  const idUsuario = route.params?.idUsuario;

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrocarSenha = async () => {
    setError('');

    // Validação de quantidade de caracteres (Mínimo 4)
    if (!novaSenha || novaSenha.length < 4) {
      return setError('A nova senha deve ter pelo menos 4 caracteres.');
    }
    if (novaSenha !== confirmarSenha) {
      return setError('As senhas não coincidem. Digite novamente.');
    }

    setLoading(true);
    try {
      // Chama a rota que criamos no Node.js para o primeiro acesso
      const response = await api.post('/primeiro-acesso', {
        id: idUsuario,
        novaSenha: novaSenha
      });

      // Sucesso! Avisa o usuário com um Pop-up nativo do celular
      Alert.alert('Sucesso!', response.data.mensagem || 'Senha alterada com sucesso!');
      
      // AQUI ESTÁ A CORREÇÃO DA ROTA: Agora vai para 'Login'
      navigation.replace('Login');

    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao alterar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          <View style={styles.header}>
            <Text style={styles.title}>Primeiro Acesso</Text>
            <Text style={styles.subtitle}>Por questões de segurança, você precisa cadastrar uma nova senha para continuar.</Text>
            
            {/* Aviso visual da regra da senha */}
            <View style={styles.dicaCaixa}>
               <Text style={styles.dicaTexto}>💡 A senha deve conter no mínimo 4 caracteres.</Text>
            </View>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Nova Senha"
              value={novaSenha}
              onChangeText={t => { setNovaSenha(t); setError(''); }}
              placeholder="Digite a nova senha (mín. 4 caracteres)"
              secureTextEntry
            />
            <AppInput
              label="Confirmar Nova Senha"
              value={confirmarSenha}
              onChangeText={t => { setConfirmarSenha(t); setError(''); }}
              placeholder="Repita a nova senha"
              secureTextEntry
            />

            {/* Caixa de erro mais chamativa */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorBoxText}>⚠️ {error}</Text>
              </View>
            ) : null}

            <AppButton
              title={loading ? 'Salvando...' : 'Salvar Nova Senha'}
              onPress={handleTrocarSenha}
              loading={loading}
              style={{ marginTop: 10 }}
            />
            
            {/* Botão de Cancelar caso o usuário desista e queira voltar */}
            <AppButton
              title="Voltar para o Login"
              onPress={() => navigation.replace('Login')}
              style={styles.btnVoltar}
              textStyle={{ color: colors.primary }}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 25 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.muted2, lineHeight: 20 },
  
  dicaCaixa: { 
    marginTop: 15, padding: 10, backgroundColor: colors.surface2, 
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border 
  },
  dicaTexto: { fontSize: 12, color: colors.muted, fontWeight: '500' },
  
  form: { width: '100%', gap: 14 },
  
  errorBox: {
    backgroundColor: '#fee2e2', // Fundo vermelho mais forte
    borderWidth: 1,
    borderColor: '#f87171',
    borderRadius: radius.sm, 
    padding: 12,
  },
  errorBoxText: { fontSize: 13, color: '#b91c1c', fontWeight: 'bold' },
  
  btnVoltar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 5,
  }
});