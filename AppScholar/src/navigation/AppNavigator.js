import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../styles/theme';

// Importação de Telas
import LoginScreen from '../screens/LoginScreen';
import NovaSenhaScreen from '../screens/NovaSenhaScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import CadastroProfessorScreen from '../screens/CadastroProfessorScreen';
import CadastroDisciplinaScreen from '../screens/CadastroDisciplinaScreen';
import GerenciarDisciplinasScreen from '../screens/GerenciarDisciplinasScreen';
import EditarDisciplinaScreen from '../screens/EditarDisciplinaScreen'; // Adicionado
import NovoProfessorScreen from '../screens/NovoProfessorScreen';
import NovoAlunoScreen from '../screens/NovoAlunoScreen';
import FaltasAlunoScreen from '../screens/FaltasAlunoScreen';
import HorarioAlunoScreen from '../screens/HorarioAlunoScreen';
import EditarProfessorScreen from '../screens/EditarProfessorScreen';
import EditarAlunoScreen from '../screens/EditarAlunoScreen';
import BoletimScreen from '../screens/BoletimScreen';
import MinhaGradeScreen from '../screens/MinhaGradeScreen';
import MinhasDisciplinasScreen from '../screens/MinhasDisciplinasScreen';
import LancarNotasScreen from '../screens/LancarNotasScreen';

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
      <Stack.Screen name="NovaSenhaScreen" component={NovaSenhaScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      
      {/* Admin */}
      <Stack.Screen name="CadastroAluno" component={CadastroAlunoScreen} />
      <Stack.Screen name="CadastroProfessor" component={CadastroProfessorScreen} />
      <Stack.Screen name="CadastroDisciplina" component={CadastroDisciplinaScreen} />
      <Stack.Screen name="GerenciarDisciplinasScreen" component={GerenciarDisciplinasScreen} />
      <Stack.Screen name="EditarDisciplinaScreen" component={EditarDisciplinaScreen} />
      <Stack.Screen name="NovoProfessor" component={NovoProfessorScreen} />
      <Stack.Screen name="NovoAluno" component={NovoAlunoScreen} />
      
      {/* Edição */}
      <Stack.Screen name="EditarAluno" component={EditarAlunoScreen} />
      <Stack.Screen name="EditarProfessor" component={EditarProfessorScreen} />
      
      {/* Ações */}
      <Stack.Screen name="FaltasAluno" component={FaltasAlunoScreen} />
      <Stack.Screen name="HorarioAluno" component={HorarioAlunoScreen} />
      
      {/* Aluno */}
      <Stack.Screen name="Boletim" component={BoletimScreen} />
      <Stack.Screen name="MinhaGrade" component={MinhaGradeScreen} />

      {/* Professor */}
      <Stack.Screen name="MinhasDisciplinas" component={MinhasDisciplinasScreen} />
      <Stack.Screen name="LancarNotas" component={LancarNotasScreen} />
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