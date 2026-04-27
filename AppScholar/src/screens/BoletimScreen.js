import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormHeader } from '../components';
import { colors, spacing, radius } from '../styles/theme';
import { apiGetBoletim } from '../services/api';
import { useAuth } from '../hooks/useAuth';

function getSituacaoStyle(s) {
  if (s === 'Aprovado')   return { color: colors.green,  bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  icon: '✅' };
  if (s === 'Rec. Final') return { color: colors.yellow, bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', icon: '⚠️' };
  return                         { color: colors.red,    bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: '❌' };
}

function GradeBox({ label, value, isMedia }) {
  const color = isMedia
    ? (value >= 6 ? colors.green : value >= 4 ? colors.yellow : colors.red)
    : (value >= 5 ? colors.green : colors.yellow);
  return (
    <View style={gb.box}>
      <Text style={[gb.val, { color }]}>{typeof value === 'number' ? value.toFixed(1) : value}</Text>
      <Text style={gb.lbl}>{label}</Text>
    </View>
  );
}
const gb = StyleSheet.create({
  box: { flex: 1, backgroundColor: colors.surface, borderRadius: 8, padding: 8, alignItems: 'center' },
  val: { fontSize: 15, fontWeight: '800' },
  lbl: { fontSize: 10, color: colors.muted, marginTop: 2 },
});

export default function BoletimScreen({ navigation }) {
  const { user } = useAuth();
  const [boletim, setBoletim]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [erro, setErro]           = useState('');
  const [matricula, setMatricula] = useState(user?.matricula || '');

  async function buscar(mat) {
    const m = mat || matricula;
    if (!m.trim()) return;
    setLoading(true);
    setErro('');
    try {
      const data = await apiGetBoletim(m.trim());
      setBoletim(data);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao buscar boletim.';
      setErro(msg);
      setBoletim(null);
    } finally {
      setLoading(false);
    }
  }

  // Carrega automaticamente se tiver matrícula no contexto
  useEffect(() => {
    if (user?.matricula) buscar(user.matricula);
  }, []);

  const disciplinas = boletim?.disciplinas || [];
  const aprovadas   = disciplinas.filter(d => d.situacao === 'Aprovado').length;
  const recFinal    = disciplinas.filter(d => d.situacao === 'Rec. Final').length;
  const reprovadas  = disciplinas.filter(d => d.situacao === 'Reprovado').length;
  const mediaGeral  = disciplinas.length
    ? (disciplinas.reduce((a, d) => a + parseFloat(d.media), 0) / disciplinas.length).toFixed(1)
    : '—';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FormHeader
        title="📊 Boletim Acadêmico"
        subtitle={boletim ? `${boletim.aluno} · ${boletim.matricula}` : 'Consulte pelo número de matrícula'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.body}>

        {/* Barra de busca por matrícula */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={matricula}
            onChangeText={setMatricula}
            placeholder="Digite a matrícula..."
            placeholderTextColor={colors.muted}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => buscar()}>
            <Text style={styles.searchBtnText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />}

        {erro ? (
          <View style={styles.errorBox}>
            <Text style={{ color: colors.red, fontSize: 13 }}>⚠️ {erro}</Text>
          </View>
        ) : null}

        {boletim && (
          <>
            {/* Resumo */}
            <View style={styles.summaryRow}>
              {[
                { label: 'Média Geral', value: mediaGeral, color: colors.green },
                { label: 'Aprovadas',   value: aprovadas,  color: colors.green },
                { label: 'Rec. Final',  value: recFinal,   color: colors.yellow },
                { label: 'Reprovadas',  value: reprovadas, color: colors.red },
              ].map(s => (
                <View key={s.label} style={styles.summaryCard}>
                  <Text style={[styles.summaryVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.summaryLbl}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Disciplinas */}
            {disciplinas.map((disc, i) => {
              const sit = getSituacaoStyle(disc.situacao);
              return (
                <View key={i} style={[styles.discCard, { borderLeftColor: sit.color }]}>
                  <Text style={styles.discName}>{disc.disciplina}</Text>
                  {disc.professor ? <Text style={styles.profName}>👨‍🏫 {disc.professor}</Text> : null}
                  <View style={styles.gradesRow}>
                    <GradeBox label="Nota 1" value={parseFloat(disc.nota1)} />
                    <GradeBox label="Nota 2" value={parseFloat(disc.nota2)} />
                    <GradeBox label="Média"  value={parseFloat(disc.media)} isMedia />
                  </View>
                  <View style={[styles.situacaoBadge, { backgroundColor: sit.bg, borderColor: sit.border }]}>
                    <Text style={[styles.situacaoText, { color: sit.color }]}>{sit.icon}  {disc.situacao}</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.md, gap: spacing.md },

  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: {
    flex: 1, backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    color: colors.text, fontSize: 13,
  },
  searchBtn: {
    backgroundColor: colors.accent, borderRadius: 10,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)', borderRadius: radius.sm, padding: 12,
  },

  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: {
    flex: 1, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, padding: 10, alignItems: 'center',
  },
  summaryVal: { fontSize: 18, fontWeight: '800' },
  summaryLbl: { fontSize: 9, color: colors.muted, marginTop: 2, textAlign: 'center' },

  discCard: {
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md, borderLeftWidth: 4, gap: 8,
  },
  discName:  { fontSize: 14, fontWeight: '700', color: colors.text },
  profName:  { fontSize: 11, color: colors.muted2 },
  gradesRow: { flexDirection: 'row', gap: 6 },

  situacaoBadge: {
    alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  situacaoText: { fontSize: 11, fontWeight: '700' },
});
