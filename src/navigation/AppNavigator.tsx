import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

// Auth screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Onboarding
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';

// Client screens
import { ClientHomeScreen } from '../screens/client/ClientHomeScreen';
import { ClientChatScreen } from '../screens/client/ClientChatScreen';
import { TrainingRequestScreen } from '../screens/client/TrainingRequestScreen';
import { WeeklyFeedbackScreen } from '../screens/client/WeeklyFeedbackScreen';
import { ExportPDFScreen } from '../screens/client/ExportPDFScreen';

// Admin screens
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { AdminClientChatScreen } from '../screens/admin/AdminClientChatScreen';
import { AdminBroadcastScreen } from '../screens/admin/AdminBroadcastScreen';
import { AdminRequestsScreen } from '../screens/admin/AdminRequestsScreen';
import { AdminFeedbacksScreen } from '../screens/admin/AdminFeedbacksScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function ClientStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textLight,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="ClientHome" component={ClientHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClientChat" component={ClientChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TrainingRequest" component={TrainingRequestScreen} options={{ title: 'Modificar Entrenamiento' }} />
      <Stack.Screen name="WeeklyFeedback" component={WeeklyFeedbackScreen} options={{ title: 'Feedback Semanal' }} />
      <Stack.Screen name="ExportPDF" component={ExportPDFScreen} options={{ title: 'Exportar Historial' }} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textLight,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdminClientChat" component={AdminClientChatScreen as any} options={{ headerShown: false }} />
      <Stack.Screen name="AdminBroadcast" component={AdminBroadcastScreen} options={{ title: 'Mensaje de Difusión' }} />
      <Stack.Screen name="AdminRequests" component={AdminRequestsScreen} options={{ title: 'Solicitudes' }} />
      <Stack.Screen name="AdminFeedbacks" component={AdminFeedbacksScreen} options={{ title: 'Feedbacks' }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
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
      ) : user.role === 'client' && !user.onboardingCompleted ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </Stack.Navigator>
      ) : user.role === 'admin' ? (
        <AdminStack />
      ) : (
        <ClientStack />
      )}
    </NavigationContainer>
  );
}
