// app/src/navigation/screens/UsersListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { 
  UserPlus, 
  UserCheck, 
  UserX, 
  Trash2, 
  Shield, 
  Briefcase, 
  ShoppingCart, 
  Users 
} from 'lucide-react-native';
import { adminService } from '../../api/adminService';
import { showToast, showApiError } from '../../utils/toast';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  rol: {
    id: number;
    nombre: string;
  };
  deletedAt: string | null;
}

export const UsersListScreen = ({ navigation }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      console.log('✅ Usuarios cargados:', data.length);
      setUsers(data);
    } catch (error: any) {
      console.error('Error cargando usuarios:', error);
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    const action = user.isActive ? 'desactivar' : 'activar';
    
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Usuario`,
      `¿Estás seguro de ${action} a ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: async () => {
            try {
              await adminService.updateUserStatus(user.id, !user.isActive);
              showToast.success('Estado actualizado', `Usuario ${action}do correctamente`);
              loadUsers();
            } catch (error: any) {
              showApiError(error);
            }
          },
        },
      ]
    );
  };

  const handleSoftDelete = async (user: User) => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Eliminar a ${user.name}? (Puede restaurarse)`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.softDeleteUser(user.id);
              showToast.success('Usuario eliminado', 'Se puede restaurar desde la papelera');
              loadUsers();
            } catch (error: any) {
              showApiError(error);
            }
          },
        },
      ]
    );
  };

  const handleHardDelete = async (user: User) => {
    Alert.alert(
      '⚠️ Eliminar Permanentemente',
      `¿Eliminar PERMANENTEMENTE a ${user.name}? Esta acción NO se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Permanentemente',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.hardDeleteUser(user.id);
              showToast.success('Usuario eliminado', 'Eliminación permanente completada');
              loadUsers();
            } catch (error: any) {
              showApiError(error);
            }
          },
        },
      ]
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrador':
        return 'bg-red-100 text-red-700';
      case 'supervisor':
        return 'bg-blue-100 text-blue-700';
      case 'vendedor':
        return 'bg-green-100 text-green-700';
      case 'cliente':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrador':
        return <Shield size={14} color="#B91C1C" />;
      case 'supervisor':
        return <Briefcase size={14} color="#1D4ED8" />;
      case 'vendedor':
        return <ShoppingCart size={14} color="#15803D" />;
      case 'cliente':
        return <Users size={14} color="#6B21A8" />;
      default:
        return null;
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
          <Text className="text-gray-600 text-sm">{item.email}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full flex-row items-center ${getRoleBadgeColor(item.rol.nombre)}`}>
          {getRoleIcon(item.rol.nombre)}
          <Text className="text-xs font-medium ml-1">{item.rol.nombre}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-3">
        <View className={`w-2 h-2 rounded-full mr-2 ${item.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
        <Text className={`text-sm ${item.isActive ? 'text-green-600' : 'text-red-600'}`}>
          {item.isActive ? 'Activo' : 'Inactivo'}
        </Text>
      </View>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={() => handleToggleStatus(item)}
          className={`flex-1 py-2 rounded-lg flex-row items-center justify-center ${item.isActive ? 'bg-orange-100' : 'bg-green-100'}`}
        >
          {item.isActive ? (
            <UserX size={16} color="#C2410C" />
          ) : (
            <UserCheck size={16} color="#15803D" />
          )}
          <Text className={`font-medium ml-1 ${item.isActive ? 'text-orange-700' : 'text-green-700'}`}>
            {item.isActive ? 'Desactivar' : 'Activar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSoftDelete(item)}
          className="flex-1 py-2 rounded-lg bg-yellow-100 flex-row items-center justify-center"
        >
          <Trash2 size={16} color="#A16207" />
          <Text className="font-medium text-yellow-700 ml-1">
            Eliminar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleHardDelete(item)}
          className="px-3 py-2 rounded-lg bg-red-100 flex-row items-center justify-center"
        >
          <Trash2 size={18} color="#B91C1C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Cargando usuarios...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Users size={28} color="#1F2937" />
            <Text className="text-2xl font-bold text-gray-800 ml-2">Usuarios</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateUser')}
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
          >
            <UserPlus size={18} color="#fff" />
            <Text className="text-white font-semibold ml-1">Nuevo</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600 mb-2">Total: {users.length} usuarios</Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 text-lg">No hay usuarios</Text>
          </View>
        }
      />
    </View>
  );
};