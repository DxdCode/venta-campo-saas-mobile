import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.0.2.2:3000/api", 
  withCredentials: true, 
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response.status === 401) {
      try {
        await api.post("/auth/refresh-token");
        return api(error.config);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
