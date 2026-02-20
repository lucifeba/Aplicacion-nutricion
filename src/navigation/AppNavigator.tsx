import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import ClientHomeScreen from '../screens/client/ClientHomeScreen';
import ClientChatScreen from '../screens/client/ClientChatScreen';
import TrainingRequestScreen from '../screens/client/TrainingRequestScreen';
import WeeklyFeedbackScreen from '../screens/client/WeeklyFeedbackScreen';
import ExportPDFScreen from '../screens/client/ExportPDFScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AdminClientChatScreen from '../screens/admin/AdminClientChatScreen';
import AdminBroadcastScreen from '../screens/admin/AdminBroadcastScreen';
import AdminRequestsScreen from '../screens/admin/AdminRequestsScreen';
import AdminFeedbacksScreen from '../screens/admin/AdminFeedbacksScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.textLight,
  headerTitleStyle: { fontWeight: '600' as const },
  contentStyle: { backgroundColor: colors.background },
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

function ClientStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={ClientHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={ClientChatScreen} options={{ title: 'Mi Entrenador' }} />
      <Stack.Screen name="TrainingRequest" component={TrainingRequestScreen} options={{ title: 'Modificar Entrenamiento' }} />
      <Stack.Screen name="WeeklyFeedback" component={WeeklyFeedbackScreen} options={{ title: 'Feedback Semanal' }} />
      <Stack.Screen name="ExportPDF" component={ExportPDFScreen} options={{ title: 'Exportar Historial' }} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClientChat" component={AdminClientChatScreen} options={{ title: 'Chat con Cliente' }} />
      <Stack.Screen name="Broadcast" component={AdminBroadcastScreen} options={{ title: 'Difusión' }} />
      <Stack.Screen name="Requests" component={AdminRequestsScreen} options={{ title: 'Solicitudes' }} />
      <Stack.Screen name="Feedbacks" component={AdminFeedbacksScreen} options={{ title: 'Feedbacks' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'admin' ? (
        <AdminStack />
      ) : !user.onboardingCompleted ? (
        <OnboardingStack />
      ) : (
        <ClientStack />
      )}
    </NavigationContainer>
  );
}
