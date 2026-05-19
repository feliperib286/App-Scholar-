import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';

// Importação de Telas de Autenticação
import LoginScreen              from '../screens/LoginScreen';
import NovaSenhaScreen          from '../screens/NovaSenhaScreen';

// Importação de Telas Principais
import DashboardScreen          from '../screens/DashboardScreen';

// Importação de Telas de Admin (Gerenciamento)
import CadastroAlunoScreen      from '../screens/CadastroAlunoScreen';
import CadastroProfessorScreen  from '../screens/CadastroProfessorScreen';
import CadastroDisciplinaScreen from '../screens/CadastroDisciplinaScreen';

// Importação de Telas Extras de Admin
import FaltasAlunoScreen        from '../screens/FaltasAlunoScreen';
import HorarioAlunoScreen       from '../screens/HorarioAlunoScreen';
import EditarAlunoScreen        from '../screens/EditarAlunoScreen';
import EditarProfessorScreen    from '../screens/EditarProfessorScreen';

// Importação de Telas de Aluno e Genéricas
import BoletimScreen            from '../screens/BoletimScreen';
import MinhaGradeScreen         from '../screens/MinhaGradeScreen';

// Importação de Telas do Professor
import MinhasDisciplinasScreen  from '../screens/MinhasDisciplinasScreen';
import LancarNotasScreen        from '../screens/LancarNotasScreen';

import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.bg },
  animation: 'slide_from_right',
};

// Telas para quem NÃO ESTÁ logado
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="NovaSenhaScreen" component={NovaSenhaScreen} />
    </Stack.Navigator>
  );
}

// Telas para quem ESTÁ logado
function AppStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* Tela Principal */}
      <Stack.Screen name="Dashboard"          component={DashboardScreen} />
      
      {/* Telas Principais do Admin */}
      <Stack.Screen name="CadastroAluno"      component={CadastroAlunoScreen} />
      <Stack.Screen name="CadastroProfessor"  component={CadastroProfessorScreen} />
      <Stack.Screen name="CadastroDisciplina" component={CadastroDisciplinaScreen} />
      
      {/* Telas de Ação (Acessadas pelos botões de Gerenciar) */}
      <Stack.Screen name="FaltasAluno"        component={FaltasAlunoScreen} />
      <Stack.Screen name="HorarioAluno"       component={HorarioAlunoScreen} />
      <Stack.Screen name="EditarAluno"        component={EditarAlunoScreen} />
      <Stack.Screen name="EditarProfessor"    component={EditarProfessorScreen} />

      {/* Telas do Aluno */}
      <Stack.Screen name="Boletim"            component={BoletimScreen} />
      <Stack.Screen name="MinhaGrade"         component={MinhaGradeScreen} />

      {/* Telas do Professor */}
      <Stack.Screen name="MinhasDisciplinas"  component={MinhasDisciplinasScreen} />
      <Stack.Screen name="LancarNotas"        component={LancarNotasScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

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