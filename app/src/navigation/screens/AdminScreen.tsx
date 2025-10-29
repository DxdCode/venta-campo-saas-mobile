import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { LogoutButton } from '../../components/LogoutButton';

export const AdminScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Panel de Administrador
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-1">Bienvenido</Text>
            <Text className="text-xl font-semibold text-gray-800">
              {user?.name}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-1">Rol</Text>
            <View className="bg-blue-100 px-3 py-1 rounded-full self-start">
              <Text className="text-blue-700 font-medium">
                {user?.role}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Estadísticas
          </Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="bg-blue-50 rounded-lg p-4 flex-1 mr-2">
              <Text className="text-blue-600 text-2xl font-bold">24</Text>
              <Text className="text-gray-600 text-sm">Vendedores</Text>
            </View>
            <View className="bg-green-50 rounded-lg p-4 flex-1 ml-2">
              <Text className="text-green-600 text-2xl font-bold">156</Text>
              <Text className="text-gray-600 text-sm">Ventas</Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="bg-purple-50 rounded-lg p-4 flex-1 mr-2">
              <Text className="text-purple-600 text-2xl font-bold">$45K</Text>
              <Text className="text-gray-600 text-sm">Este mes</Text>
            </View>
            <View className="bg-orange-50 rounded-lg p-4 flex-1 ml-2">
              <Text className="text-orange-600 text-2xl font-bold">98%</Text>
              <Text className="text-gray-600 text-sm">Satisfacción</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Acciones Rápidas
          </Text>
          
          <View className="space-y-2">
            <TouchableOpacity 
              onPress={() => navigation.navigate('UsersList')}
              className="bg-gray-50 p-4 rounded-lg mb-2"
            >
              <Text className="text-gray-800 font-medium">👥 Gestionar Usuarios</Text>
            </TouchableOpacity>
            <View className="bg-gray-50 p-4 rounded-lg mb-2">
              <Text className="text-gray-800 font-medium">📊 Ver Reportes</Text>
            </View>
            <View className="bg-gray-50 p-4 rounded-lg mb-2">
              <Text className="text-gray-800 font-medium">⚙️ Configuración</Text>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <LogoutButton />
        </View>
      </View>
    </ScrollView>
  );
};