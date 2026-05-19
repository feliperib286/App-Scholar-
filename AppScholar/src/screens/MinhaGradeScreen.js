import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiGetMinhaGrade } from '../services/api';
import { colors, spacing, radius } from '../styles/theme';

export default function MinhaGradeScreen({ navigation }) {
  const [grade, setGrade] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await apiGetMinhaGrade();
        setGrade(dados);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'white', marginRight: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Minha Grade Horária</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          grade.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.nome}>{item.disciplina}</Text>
              <Text style={styles.info}>Semestre: {item.semestre}</Text>
              <Text style={styles.info}>Carga Horária: {item.carga_horaria}</Text>
              <Text style={styles.info}>Professor: {item.professor || 'A definir'}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  container: { padding: 20, gap: 15 },
  card: { backgroundColor: colors.surface2, padding: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  nome: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 5 },
  info: { fontSize: 14, color: colors.muted2, marginTop: 2 }
});