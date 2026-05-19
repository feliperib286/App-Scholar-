import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { AppInput, AppButton } from '../components'; // Seus componentes
import { apiGetMeuBoletim } from '../services/api'; // Importando a função nova
import api from '../services/api'; // Caso o admin precise buscar manual
import { colors, spacing, radius } from '../styles/theme';

export default function BoletimScreen({ navigation }) {
  const { user } = useAuth();
  const role = user?.role || 'usuario';

  const [matriculaBusca, setMatriculaBusca] = useState('');
  const [boletim, setBoletim] = useState(null); // Aqui guardamos as notas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Se for aluno, carrega o boletim automaticamente ao abrir a tela
  useEffect(() => {
    if (role !== 'adm') {
      carregarMeuBoletim();
    }
  }, []);

  const carregarMeuBoletim = async () => {
    setLoading(true);
    setError('');
    try {
      const dados = await apiGetMeuBoletim();
      setBoletim(dados); // Salva as notas no state
    } catch (err) {
      setError('Erro ao carregar seu boletim.');
    } finally {
      setLoading(false);
    }
  };

  // Função para o Admin buscar a nota de qualquer aluno
  const buscarBoletimAdmin = async () => {
    if (!matriculaBusca) return setError('Digite uma matrícula.');
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/boletim/${matriculaBusca}`); // Ajuste para a sua rota de admin
      setBoletim(response.data.disciplinas); // Ajuste conforme o retorno da sua API
    } catch (err) {
      setError('Boletim não encontrado.');
      setBoletim(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: 'white' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Boletim Acadêmico</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* SÓ MOSTRA A BARRA DE PESQUISA SE FOR ADMIN */}
        {role === 'adm' && (
          <View style={styles.searchBox}>
            <AppInput
              label="Buscar por Matrícula"
              value={matriculaBusca}
              onChangeText={setMatriculaBusca}
              placeholder="Ex: DSM2024042"
            />
            <AppButton title="Buscar" onPress={buscarBoletimAdmin} style={{ marginTop: 10 }} />
          </View>
        )}

        {/* MENSAGENS DE CARREGAMENTO E ERRO */}
        {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* EXIBIÇÃO DAS NOTAS */}
        {!loading && boletim && boletim.length > 0 && (
          <View style={styles.notasContainer}>
            {boletim.map((item, index) => (
              <View key={index} style={styles.cardNota}>
                <Text style={styles.disciplinaNome}>{item.disciplina}</Text>
                <Text style={styles.profNome}>Prof. {item.professor}</Text>
                <View style={styles.rowNotas}>
                  <Text style={styles.notaTexto}>N1: {item.nota1 || '--'}</Text>
                  <Text style={styles.notaTexto}>N2: {item.nota2 || '--'}</Text>
                  <Text style={styles.mediaTexto}>Média: {item.media || '--'}</Text>
                </View>
                <Text style={[styles.situacao, item.situacao === 'Aprovado' ? styles.aprovado : styles.reprovado]}>
                  {item.situacao || 'Cursando'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {!loading && boletim && boletim.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.muted }}>
            Nenhuma nota lançada ainda.
          </Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  container: { padding: 20 },
  searchBox: { marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
  notasContainer: { gap: 15 },
  cardNota: { backgroundColor: colors.surface2, padding: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  disciplinaNome: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  profNome: { fontSize: 12, color: colors.muted, marginBottom: 10 },
  rowNotas: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  notaTexto: { fontSize: 14, color: colors.text },
  mediaTexto: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
  situacao: { fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
  aprovado: { color: colors.green },
  reprovado: { color: 'red' },
});