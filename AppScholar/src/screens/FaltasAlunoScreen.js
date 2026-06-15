import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../styles/theme';

export default function FaltasAlunoScreen({ route, navigation }) {
  const { alunoNome } = route.params || {};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'white' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Controle de Faltas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}>Aluno(a): {alunoNome || 'Não identificado'}</Text>
        
        <View style={styles.resumoBox}>
          <Text style={styles.resumoTitle}>Total de Faltas no Semestre</Text>
          <Text style={styles.resumoNum}>4</Text>
          <Text style={styles.resumoText}>Situação: <Text style={{color: colors.green}}>Regular</Text></Text>
        </View>

        <Text style={styles.sectionTitle}>DETALHAMENTO</Text>
        
        <View style={styles.card}>
          <Text style={styles.disciplina}>Engenharia de Software</Text>
          <Text style={styles.data}>Data: 10/05/2026</Text>
          <Text style={styles.justificativa}>Status: <Text style={{color: colors.yellow}}>Falta Médica Parcial (2h)</Text></Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.disciplina}>Banco de Dados Relacional</Text>
          <Text style={styles.data}>Data: 02/05/2026</Text>
          <Text style={styles.justificativa}>Status: <Text style={{color: 'red'}}>Falta Injustificada</Text></Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { color: colors.muted2, marginRight: 15, fontSize: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  container: { padding: 20 },
  subtitle: { fontSize: 16, color: colors.text, marginBottom: 20, fontWeight: '600' },
  resumoBox: { backgroundColor: 'rgba(234, 179, 8, 0.1)', borderColor: colors.yellow, borderWidth: 1, borderRadius: radius.md, padding: 20, alignItems: 'center', marginBottom: 25 },
  resumoTitle: { color: colors.yellow, fontWeight: 'bold', marginBottom: 10 },
  resumoNum: { fontSize: 36, fontWeight: '900', color: colors.text, marginBottom: 5 },
  resumoText: { color: colors.muted, fontSize: 13 },
  sectionTitle: { fontSize: 12, color: colors.muted, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  card: { backgroundColor: colors.surface2, padding: 15, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  disciplina: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 5 },
  data: { fontSize: 13, color: colors.muted2, marginBottom: 3 },
  justificativa: { fontSize: 13, fontWeight: '600' }
});