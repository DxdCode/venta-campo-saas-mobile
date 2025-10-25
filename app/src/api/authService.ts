import { api } from "./apiClient";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const register = async (data: RegisterData) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const refreshToken = async () => {
  const res = await api.post("/auth/refresh-token");
  return res.data;
};
