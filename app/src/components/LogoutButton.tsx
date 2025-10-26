import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
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
                showToast.info('Hasta pronto', 'Sesión cerrada correctamente');
              } catch (error: any) {
                console.log('Logout en servidor falló, cerrando sesión local:', error.response?.status);
              }

              setAuthToken(null);
              await logout();

            } catch (error) {
              console.error('Error general al cerrar sesión:', error);
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
      className={`bg-red-500 px-6 py-3 rounded-lg items-center justify-center ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white font-semibold text-base">
          Cerrar Sesión
        </Text>
      )}
    </TouchableOpacity>
  );
};