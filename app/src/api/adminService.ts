// app/src/api/adminService.ts
import api from './authService';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  rol: {
    nombre: 'vendedor' | 'supervisor' | 'cliente';
  };
}

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

interface UsersResponse {
  message: string;
  users: User[];
}

export const adminService = {
  // Crear usuario con rol
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await api.post('/admin/create/user', data);
    return response.data;
  },

  // Obtener todos los usuarios
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<UsersResponse>('/admin/users');
    // Retornar solo el array de usuarios
    return response.data.users;
  },

  // Actualizar estado del usuario (activar/desactivar)
  updateUserStatus: async (userId: number, isActive: boolean): Promise<User> => {
    const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  // Eliminación suave
  softDeleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/users/${userId}/soft`);
  },

  // Eliminación permanente
  hardDeleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/users/${userId}/hard`);
  },
};