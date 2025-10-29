import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { useAuthStore } from '../store/useAuthStore';
import { authService, setAuthToken } from '../api/authService';
import { showToast } from '../utils/toast';

interface LogoutButtonProps {
  className?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '' }) => {
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Intentar cerrar sesión en el backend
              try {
                await authService.logout();
              } catch (error: any) {
                console.log('Logout en servidor falló:', error.response?.status);
              }
              
              // Siempre cerramos sesión localmente
              setAuthToken(null);
              await logout();
              
              showToast.info('Hasta pronto', 'Sesión cerrada correctamente');
              
            } catch (error) {
              console.error('Error general al cerrar sesión:', error);
              // Incluso si hay error, cerramos sesión localmente
              setAuthToken(null);
              await logout();
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      disabled={loading}
      className={`bg-red-500 px-6 py-3 rounded-lg flex-row items-center justify-center ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <LogOut size={20} color="#fff" />
          <Text className="text-white font-semibold text-base ml-2">
            Cerrar Sesión
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};