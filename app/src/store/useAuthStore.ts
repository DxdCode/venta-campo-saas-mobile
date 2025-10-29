// app/src/store/useAuthStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  updateAccessToken: (accessToken: string) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setAuth: async (user, accessToken, refreshToken) => {
    try {
      // Guardar tokens en SecureStore (encriptado)
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      
      // Guardar usuario en AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        isAuthenticated: true, 
        error: null 
      });
    } catch (error) {
      console.error('Error saving auth data:', error);
      set({ error: 'Error al guardar datos de autenticación' });
    }
  },

  updateAccessToken: async (accessToken) => {
    try {
      await SecureStore.setItemAsync('accessToken', accessToken);
    } catch (error) {
      console.error('Error updating access token:', error);
    }
  },

  getAccessToken: async () => {
    try {
      return await SecureStore.getItemAsync('accessToken');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  getRefreshToken: async () => {
    try {
      return await SecureStore.getItemAsync('refreshToken');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  logout: async () => {
    try {
      // Eliminar tokens de SecureStore
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      
      // Eliminar usuario de AsyncStorage
      await AsyncStorage.removeItem('user');
      
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  loadStoredAuth: async () => {
    try {
      set({ isLoading: true });
      
      const userString = await AsyncStorage.getItem('user');
      const accessToken = await SecureStore.getItemAsync('accessToken');
      
      if (userString && accessToken) {
        const user = JSON.parse(userString);
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      set({ isLoading: false });
    }
  },

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),
}));