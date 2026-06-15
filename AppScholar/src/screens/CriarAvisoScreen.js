import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { AppInput, AppButton } from '../components';
import api from '../services/api';

export default function CriarAvisoScreen({ navigation }) {
  const [form, setForm] = useState({ titulo: '', conteudo: '' });
  const [loading, setLoading] = useState(false);

  const handlePublicar = async () => {
    if (!form.titulo || !form.conteudo) return Alert.alert('Erro', 'Preencha tudo.');
    setLoading(true);
    try {
      await api.post('/avisos', form);
      Alert.alert('Sucesso', 'Aviso publicado!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Falha ao publicar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppInput label="Título" value={form.titulo} onChangeText={t => setForm({...form, titulo: t})} />
      <AppInput label="Conteúdo" value={form.conteudo} onChangeText={t => setForm({...form, conteudo: t})} multiline />
      <AppButton title="Publicar Aviso" onPress={handlePublicar} loading={loading} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { padding: 20 } });