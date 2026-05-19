import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/theme';

export default function MinhasDisciplinasScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'white', marginRight: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Minhas Disciplinas</Text>
      </View>
      <View style={{ padding: 20 }}>
        <Text>Em breve: Lista de matérias do professor.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text }
});