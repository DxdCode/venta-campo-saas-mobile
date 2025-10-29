import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { User, Mail, Lock, UserPlus } from 'lucide-react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { authService, setAuthToken } from '../../api/authService';
import { showToast, showApiError } from '../../utils/toast';

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const setError = useAuthStore((state) => state.setError);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showToast.error('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register({ name, email, password });
      
      // Guardar tokens y usuario
      await setAuth(response.user, response.accessToken, response.refreshToken);
      
      // Configurar token para futuras peticiones
      setAuthToken(response.accessToken);
      
      showToast.success('¡Cuenta creada!', `Bienvenido ${response.user.name}`);
    } catch (error: any) {
      console.error('Error en registro:', error);
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Crear Cuenta
          </Text>
          <Text className="text-gray-600 mb-8">
            Completa tus datos para registrarte
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Nombre</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <User size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Tu nombre completo"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <Mail size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Contraseña</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <Lock size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-blue-500 py-4 rounded-lg mb-4 flex-row items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <UserPlus size={20} color="#fff" />
                <Text className="text-white font-semibold text-base ml-2">
                  Registrarse
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text className="text-blue-500 text-center">
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};