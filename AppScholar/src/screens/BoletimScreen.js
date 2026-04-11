import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormHeader } from '../components';
import { mockBoletim } from '../services/mockData';
import { colors, spacing, radius } from '../styles/theme';

function getSituacaoStyle(situacao) {
  if (situacao === 'Aprovado')   return { color: colors.green,  bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  icon: '✅' };
  if (situacao === 'Rec. Final') return { color: colors.yellow, bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', icon: '⚠️' };
  return                                { color: colors.red,    bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: '❌' };
}

function getMediaColor(media) {
  if (media >= 5) return colors.green;
  if (media >= 4) return colors.yellow;
  return colors.red;
}

function getCardBorder(situacao) {
  if (situacao === 'Aprovado')   return colors.green;
  if (situacao === 'Rec. Final') return colors.yellow;
  return colors.red;
}

function GradeBox({ label, value, isMedia }) {
  const color = isMedia ? getMediaColor(value) : (value >= 5 ? colors.green : colors.yellow);
  return (
    <View style={gbStyles.box}>
      <Text style={[gbStyles.val, { color }]}>{typeof value === 'number' ? value.toFixed(1) : value}</Text>
      <Text style={gbStyles.lbl}>{label}</Text>
    </View>
  );
}
const gbStyles = StyleSheet.create({
  box: { flex: 1, backgroundColor: colors.surface, borderRadius: 8, padding: 8, alignItems: 'center' },
  val: { fontSize: 15, fontWeight: '800' },
  lbl: { fontSize: 10, color: colors.muted, marginTop: 2 },
});

export default function BoletimScreen({ navigation }) {
  const [boletim, setBoletim] = useState([]);

  useEffect(() => {
    // Carrega dados simulados
    setBoletim(mockBoletim);
  }, []);

  const aprovadas = boletim.filter(d => d.situacao === 'Aprovado').length;
  const recFinal  = boletim.filter(d => d.situacao === 'Rec. Final').length;
  const reprovadas= boletim.filter(d => d.situacao === 'Reprovado').length;
  const mediaGeral = boletim.length
    ? (boletim.reduce((acc, d) => acc + d.media, 0) / boletim.length).toFixed(1)
    : '—';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FormHeader
        title="📊 Boletim Acadêmico"
        subtitle="Maria Aparecida · DSM2024042 · 3º Sem."
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.body}>

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
        {boletim.map(disc => {
          const sit = getSituacaoStyle(disc.situacao);
          return (
            <View
              key={disc.id}
              style={[styles.discCard, { borderLeftColor: getCardBorder(disc.situacao) }]}
            >
              <Text style={styles.discName}>{disc.disciplina}</Text>

              <View style={styles.gradesRow}>
                <GradeBox label="Nota 1" value={disc.nota1} />
                <GradeBox label="Nota 2" value={disc.nota2} />
                <GradeBox label="Média"  value={disc.media} isMedia />
                <GradeBox label="Freq."  value={`${disc.frequencia}%`} />
              </View>

              <View style={[styles.situacaoBadge, { backgroundColor: sit.bg, borderColor: sit.border }]}>
                <Text style={[styles.situacaoText, { color: sit.color }]}>
                  {sit.icon}  {disc.situacao}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.md, gap: spacing.md },

  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 10,
    alignItems: 'center',
  },
  summaryVal: { fontSize: 18, fontWeight: '800' },
  summaryLbl: { fontSize: 9, color: colors.muted, marginTop: 2, textAlign: 'center' },

  discCard: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    gap: 10,
  },
  discName: { fontSize: 14, fontWeight: '700', color: colors.text },
  gradesRow: { flexDirection: 'row', gap: 6 },

  situacaoBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  situacaoText: { fontSize: 11, fontWeight: '700' },
});
