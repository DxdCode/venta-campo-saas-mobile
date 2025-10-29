// app/src/navigation/screens/CreateUserScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { User, Mail, Lock, UserPlus, Shield, Briefcase, ShoppingCart, Users } from 'lucide-react-native';
import { adminService } from '../../api/adminService';
import { showToast, showApiError } from '../../utils/toast';

type RoleType = 'vendedor' | 'supervisor' | 'cliente';

export const CreateUserScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('vendedor');
  const [loading, setLoading] = useState(false);

  const roles: { value: RoleType; label: string; color: string; icon: any }[] = [
    { value: 'vendedor', label: 'Vendedor', color: 'bg-green-500', icon: ShoppingCart },
    { value: 'supervisor', label: 'Supervisor', color: 'bg-blue-500', icon: Briefcase },
    { value: 'cliente', label: 'Cliente', color: 'bg-purple-500', icon: Users },
  ];

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      showToast.error('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      showToast.error('Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);

      await adminService.createUser({
        name,
        email,
        password,
        rol: {
          nombre: selectedRole,
        },
      });

      showToast.success('¡Usuario creado!', `${name} ha sido creado correctamente`);
      navigation.goBack();
    } catch (error: any) {
      console.error('Error creando usuario:', error);
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 py-8">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Crear Nuevo Usuario
          </Text>
          <Text className="text-gray-600 mb-6">
            Completa los datos del nuevo usuario
          </Text>

          {/* Nombre */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Nombre completo</Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4 py-3">
              <User size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Ej: Juan Pérez"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Mail size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="usuario@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          {/* Contraseña */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Contraseña</Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Lock size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
          </View>

          {/* Selección de Rol */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-3 font-medium">Rol del usuario</Text>
            <View className="space-y-3">
              {roles.map((role) => {
                const RoleIcon = role.icon;
                return (
                  <TouchableOpacity
                    key={role.value}
                    onPress={() => setSelectedRole(role.value)}
                    disabled={loading}
                    className={`border-2 rounded-lg p-4 ${
                      selectedRole === role.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                          selectedRole === role.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedRole === role.value && (
                          <View className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-800 font-semibold text-base">
                          {role.label}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {role.value === 'vendedor' && 'Puede registrar ventas y gestionar clientes'}
                          {role.value === 'supervisor' && 'Puede ver reportes y supervisar vendedores'}
                          {role.value === 'cliente' && 'Usuario cliente del sistema'}
                        </Text>
                      </View>
                      <View className={`px-3 py-2 rounded-full ${role.color} flex-row items-center`}>
                        <RoleIcon size={14} color="#fff" />
                        <Text className="text-white text-xs font-medium ml-1">
                          {role.value}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Botones */}
          <View className="space-y-3">
            <TouchableOpacity
              onPress={handleCreateUser}
              disabled={loading}
              className="bg-blue-500 py-4 rounded-lg flex-row items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <UserPlus size={20} color="#fff" />
                  <Text className="text-white font-semibold text-base ml-2">
                    Crear Usuario
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={loading}
              className="bg-gray-200 py-4 rounded-lg"
            >
              <Text className="text-gray-700 text-center font-semibold text-base">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};