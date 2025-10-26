import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { AdminScreen } from './screens/AdminScreen';
import { UserScreen } from './screens/UserScreen';
import { setAuthToken } from '../api/authService';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, user, loadStoredAuth, accessToken } = useAuth();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken);
    }
  }, [accessToken]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          {user?.role === 'administrador' ? (
            <Stack.Screen 
              name="Admin" 
              component={AdminScreen}
              options={{ 
                headerShown: true,
                title: 'Panel de Administrador',
                headerStyle: {
                  backgroundColor: '#3B82F6',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          ) : (
            <Stack.Screen 
              name="User" 
              component={UserScreen}
              options={{ 
                headerShown: true,
                title: 'Mi Perfil',
                headerStyle: {
                  backgroundColor: '#3B82F6',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};