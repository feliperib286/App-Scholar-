import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { apiGetAlunos, apiGetProfessores, apiGetDisciplinas } from '../services/api';
import { colors, spacing, radius } from '../styles/theme';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ alunos: '—', professores: '—', disciplinas: '—' });

  const role = user?.role || 'usuario'; 

  const getModulos = () => {
    switch (role) {
      case 'adm':
        return [
          { key: 'CadastroAluno', label: 'Gerenciar\nAlunos', icon: '🎒', accentTop: colors.accent },
          { key: 'CadastroProfessor', label: 'Gerenciar\nProfessores', icon: '👨‍🏫', accentTop: colors.green },
          { key: 'GerenciarDisciplinasScreen', label: 'Gerenciar\nDisciplinas', icon: '📚', accentTop: '#a78bfa' },
        ];
      case 'professor':
        return [
          { key: 'EditarProfessor', label: 'Meus\nDados', icon: '👤', accentTop: colors.primary },
          { key: 'MinhasDisciplinas', label: 'Minhas\nDisciplinas', icon: '📚', accentTop: colors.green },
          { key: 'LancarNotas', label: 'Lançar\nNotas', icon: '📝', accentTop: '#a78bfa' },
        ];
      case 'usuario':
      default:
        return [
          { key: 'EditarAluno', label: 'Meus\nDados', icon: '👤', accentTop: colors.primary },
          { key: 'Boletim', label: 'Consultar\nMeu Boletim', icon: '📊', accentTop: colors.yellow },
          { key: 'MinhaGrade', label: 'Minha Grade\nHorária', icon: '📅', accentTop: colors.accent },
        ];
    }
  };

  const modulosPermitidos = getModulos();

  useEffect(() => {
    async function carregarStats() {
      if (role !== 'adm') return; 
      try {
        const [alunos, professores, disciplinas] = await Promise.all([
          apiGetAlunos(),
          apiGetProfessores(),
          apiGetDisciplinas(),
        ]);
        setStats({
          alunos: alunos.length,
          professores: professores.length,
          disciplinas: disciplinas.length,
        });
      } catch (err) {
        console.error("Erro ao carregar stats:", err);
      }
    }
    carregarStats();
  }, [role]);

  const getNomeDoPerfil = () => {
    if (role === 'adm') return 'Administração';
    if (role === 'professor') return 'Portal do Professor';
    return 'Portal do Aluno';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getNomeDoPerfil()}</Text>
            <Text style={styles.userName}>{user?.nome || user?.email?.split('@')[0]} 👋</Text>
            <View style={styles.periodBadge}>
              <Text style={styles.periodText}>📅 2026 · 1º Semestre</Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* MÓDULOS */}
        <Text style={styles.sectionTitle}>MÓDULOS DE ACESSO</Text>
        <View style={styles.grid}>
          {modulosPermitidos.map(m => (
            <TouchableOpacity 
              key={m.key} 
              style={styles.card} 
              onPress={() => navigation.navigate(m.key)} 
              activeOpacity={0.75}
            >
              <View style={[styles.cardAccent, { backgroundColor: m.accentTop }]} />
              <Text style={styles.cardIcon}>{m.icon}</Text>
              <Text style={styles.cardLabel}>{m.label}</Text>
              <Text style={styles.cardArrow}>Acessar →</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ESTATÍSTICAS ADMIN */}
        {role === 'adm' && (
          <View>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>RESUMO GERAL</Text>
            <View style={styles.statsRow}>
              {[
                { label: 'Alunos', value: stats.alunos },
                { label: 'Professores', value: stats.professores },
                { label: 'Disciplinas', value: stats.disciplinas },
              ].map(s => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={styles.statNum}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: spacing.md },
  greeting: { fontSize: 13, color: colors.primary, fontWeight: '600', textTransform: 'uppercase' },
  userName: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 2 },
  periodBadge: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: 'rgba(59,130,246,0.12)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  periodText: { fontSize: 11, color: colors.accent2 },
  logoutBtn: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 6 },
  logoutText: { fontSize: 12, color: colors.muted2 },
  sectionTitle: { fontSize: 10, color: colors.muted2, letterSpacing: 1, fontWeight: '700', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, overflow: 'hidden' },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  cardIcon: { fontSize: 28, marginTop: 6, marginBottom: 8 },
  cardLabel: { fontSize: 13, fontWeight: '700', color: colors.text, lineHeight: 18 },
  cardArrow: { fontSize: 11, color: colors.muted, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  statCard: { flex: 1, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: spacing.md, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.accent2 },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
});