import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { apiGetAlunos, apiGetProfessores, apiGetDisciplinas } from '../services/api';
import { colors, spacing, radius } from '../styles/theme';

const MODULES = [
  { key: 'CadastroAluno',      label: 'Cadastro de\nAlunos',      icon: '🎒', accentTop: colors.accent },
  { key: 'CadastroProfessor',  label: 'Cadastro de\nProfessores', icon: '👨‍🏫', accentTop: colors.green },
  { key: 'CadastroDisciplina', label: 'Cadastro de\nDisciplinas', icon: '📚', accentTop: '#a78bfa' },
  { key: 'Boletim',            label: 'Consultar\nBoletim',       icon: '📊', accentTop: colors.yellow },
];

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ alunos: '—', professores: '—', disciplinas: '—' });

  useEffect(() => {
    async function carregarStats() {
      try {
        const [alunos, professores, disciplinas] = await Promise.all([
          apiGetAlunos(),
          apiGetProfessores(),
          apiGetDisciplinas(),
        ]);
        setStats({
          alunos:      alunos.length,
          professores: professores.length,
          disciplinas: disciplinas.length,
        });
      } catch {
        // backend offline – mantém '—'
      }
    }
    carregarStats();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bem-vindo de volta,</Text>
            <Text style={styles.userName}>{user?.nome || user?.email} 👋</Text>
            <View style={styles.periodBadge}>
              <Text style={styles.periodText}>📅 2025 · 1º Semestre</Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>MÓDULOS</Text>
        <View style={styles.grid}>
          {MODULES.map(m => (
            <TouchableOpacity key={m.key} style={styles.card} onPress={() => navigation.navigate(m.key)} activeOpacity={0.75}>
              <View style={[styles.cardAccent, { backgroundColor: m.accentTop }]} />
              <Text style={styles.cardIcon}>{m.icon}</Text>
              <Text style={styles.cardLabel}>{m.label}</Text>
              <Text style={styles.cardArrow}>Acessar →</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>RESUMO SEMESTRAL</Text>
        <View style={styles.statsRow}>
          {[
            { label: 'Alunos',      value: stats.alunos },
            { label: 'Professores', value: stats.professores },
            { label: 'Disciplinas', value: stats.disciplinas },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statNum}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: spacing.md },
  greeting: { fontSize: 12, color: colors.muted2 },
  userName: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 2 },
  periodBadge: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: 'rgba(59,130,246,0.12)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  periodText: { fontSize: 11, color: colors.accent2 },
  logoutBtn: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 6 },
  logoutText: { fontSize: 12, color: colors.muted2 },
  sectionTitle: { fontSize: 10, color: colors.muted2, letterSpacing: 1, fontWeight: '700', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '48%', backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, overflow: 'hidden', position: 'relative' },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  cardIcon: { fontSize: 28, marginTop: 6, marginBottom: 8 },
  cardLabel: { fontSize: 13, fontWeight: '700', color: colors.text, lineHeight: 18 },
  cardArrow: { fontSize: 11, color: colors.muted, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 8, paddingBottom: 24 },
  statCard: { flex: 1, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: spacing.md, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.accent2 },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
});
