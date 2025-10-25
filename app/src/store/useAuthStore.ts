import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../api/authService";

interface User {
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,

  login: async (data) => {
    set({ loading: true });
    try {
      const response = await authService.login(data);
      const { user, accessToken } = response;

      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("accessToken", accessToken);

      set({ user, accessToken, loading: false });
    } catch (error: any) {
      console.error("Error login:", error.message || error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },

  restoreSession: async () => {
    set({ loading: true });
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("accessToken");

      if (storedUser && storedToken) {
        set({ user: JSON.parse(storedUser), accessToken: storedToken });
      } else {
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          const { user, accessToken } = refreshed;
          set({ user, accessToken });
          await AsyncStorage.setItem("user", JSON.stringify(user));
          await AsyncStorage.setItem("accessToken", accessToken);
        } else {
          set({ user: null, accessToken: null });
        }
      }
    } catch (e) {
      set({ user: null, accessToken: null });
    } finally {
      set({ loading: false });
    }
  },
}));
