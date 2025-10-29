import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { AdminScreen } from './screens/AdminScreen';
import { UserScreen } from './screens/UserScreen';
import { UsersListScreen } from './screens/UsersListScreen';
import { CreateUserScreen } from './screens/CreateUserScreen';
import { LoginScreen } from './screens/RegisterScreen';
import { RegisterScreen } from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, user, loadStoredAuth } = useAuth();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          {user?.role === 'administrador' ? (
            <>
              <Stack.Screen name="Admin" component={AdminScreen} />
              <Stack.Screen name="UsersList" component={UsersListScreen} />
              <Stack.Screen name="CreateUser" component={CreateUserScreen} />
            </>
          ) : (
            <Stack.Screen name="User" component={UserScreen} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};
