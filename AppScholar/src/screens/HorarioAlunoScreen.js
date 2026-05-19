import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../styles/theme';

export default function HorarioAlunoScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Horário de Aulas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.diaDaSemana}>Segunda-feira</Text>
        <View style={styles.card}>
          <Text style={styles.horario}>19:00 - 20:40</Text>
          <Text style={styles.disciplina}>Banco de Dados Relacional</Text>
          <Text style={styles.prof}>Prof. Fernanda Costa</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.horario}>21:00 - 22:40</Text>
          <Text style={styles.disciplina}>Estrutura de Dados</Text>
          <Text style={styles.prof}>Prof. André Olímpio</Text>
        </View>

        <Text style={styles.diaDaSemana}>Terça-feira</Text>
        <View style={styles.card}>
          <Text style={styles.horario}>19:00 - 22:40</Text>
          <Text style={styles.disciplina}>Engenharia de Software</Text>
          <Text style={styles.prof}>Prof. Ricardo Mendes</Text>
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
  diaDaSemana: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginTop: 15, marginBottom: 10 },
  card: { backgroundColor: colors.surface2, padding: 15, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: colors.accent },
  horario: { fontSize: 12, color: colors.muted2, fontWeight: 'bold', marginBottom: 4 },
  disciplina: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  prof: { fontSize: 13, color: colors.muted }
});