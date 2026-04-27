import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';

import LoginScreen             from '../screens/LoginScreen';
import DashboardScreen         from '../screens/DashboardScreen';
import CadastroAlunoScreen     from '../screens/CadastroAlunoScreen';
import CadastroProfessorScreen from '../screens/CadastroProfessorScreen';
import CadastroDisciplinaScreen from '../screens/CadastroDisciplinaScreen';
import BoletimScreen           from '../screens/BoletimScreen';

import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.bg },
  animation: 'slide_from_right',
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Dashboard"          component={DashboardScreen} />
      <Stack.Screen name="CadastroAluno"      component={CadastroAlunoScreen} />
      <Stack.Screen name="CadastroProfessor"  component={CadastroProfessorScreen} />
      <Stack.Screen name="CadastroDisciplina" component={CadastroDisciplinaScreen} />
      <Stack.Screen name="Boletim"            component={BoletimScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Aguarda restauração de sessão do AsyncStorage antes de renderizar
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
