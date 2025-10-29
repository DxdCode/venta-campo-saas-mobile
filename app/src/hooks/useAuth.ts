// app/src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api, { authService, setAuthToken } from '../api/authService';
import { showToast } from '../utils/toast';

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    // Configurar token al iniciar
    const setupToken = async () => {
      const accessToken = await store.getAccessToken();
      if (accessToken) {
        setAuthToken(accessToken);
      }
    };
    setupToken();

    // Interceptor para manejar tokens expirados (401)
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Si es 401 y no hemos reintentado ya
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log('🔄 Token expirado, refrescando...');
            
            // Obtener refresh token
            const refreshToken = await store.getRefreshToken();
            
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Intentar refrescar el token
            const response = await authService.refreshToken(refreshToken);
            
            // Actualizar el access token
            await store.updateAccessToken(response.accessToken);
            setAuthToken(response.accessToken);

            // Si el backend rotó el refresh token, actualizarlo también
            if (response.refreshToken) {
              await store.setAuth(store.user!, response.accessToken, response.refreshToken);
            }

            showToast.info('Sesión renovada', 'Tu sesión ha sido actualizada');

            // Reintentar la petición original con el nuevo token
            originalRequest.headers['Authorization'] = `Bearer ${response.accessToken}`;
            return api(originalRequest);
            
          } catch (refreshError) {
            console.log('❌ No se pudo refrescar el token, cerrando sesión');
            showToast.error('Sesión expirada', 'Por favor inicia sesión nuevamente');
            
            // Si falla el refresh, cerrar sesión
            await store.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup: remover interceptor cuando el componente se desmonte
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return store;
};