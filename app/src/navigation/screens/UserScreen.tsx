import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { LogoutButton } from '../../components/LogoutButton';

export const UserScreen = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Mi Perfil
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-1">Nombre</Text>
            <Text className="text-xl font-semibold text-gray-800">
              {user?.name}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-1">Rol</Text>
            <View className="bg-green-100 px-3 py-1 rounded-full self-start">
              <Text className="text-green-700 font-medium">
                {user?.role}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Mis Ventas
          </Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="bg-blue-50 rounded-lg p-4 flex-1 mr-2">
              <Text className="text-blue-600 text-2xl font-bold">12</Text>
              <Text className="text-gray-600 text-sm">Esta semana</Text>
            </View>
            <View className="bg-green-50 rounded-lg p-4 flex-1 ml-2">
              <Text className="text-green-600 text-2xl font-bold">47</Text>
              <Text className="text-gray-600 text-sm">Este mes</Text>
            </View>
          </View>

          <View className="bg-purple-50 rounded-lg p-4">
            <Text className="text-purple-600 text-2xl font-bold">$12,450</Text>
            <Text className="text-gray-600 text-sm">Total facturado</Text>
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Acciones
          </Text>
          
          <View className="space-y-2">
            <View className="bg-gray-50 p-4 rounded-lg mb-2">
              <Text className="text-gray-800 font-medium">🛒 Nueva Venta</Text>
            </View>
            <View className="bg-gray-50 p-4 rounded-lg mb-2">
              <Text className="text-gray-800 font-medium">📋 Ver Historial</Text>
            </View>
            <View className="bg-gray-50 p-4 rounded-lg mb-2">
              <Text className="text-gray-800 font-medium">👤 Editar Perfil</Text>
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