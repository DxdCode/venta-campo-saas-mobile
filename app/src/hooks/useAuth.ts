import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api, { authService, setAuthToken } from '../api/authService';
import { showToast } from '../utils/toast';

export const useAuth = () => {
    const { accessToken, setUser, logout } = useAuthStore();

    useEffect(() => {
        let sessionToastShown = false;

        // Interceptor para manejar tokens expirados (401)
        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Si es 401 y no hemos reintentado ya
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        console.log('Token expirado, intentando refrescar...');

                        // Intentar refrescar el token
                        const response = await authService.refreshToken();

                        // Actualizar el token en el store
                        await setUser(response.user, response.accessToken);
                        setAuthToken(response.accessToken);
                        showToast.info('Sesión renovada', 'Tu sesión ha sido actualizada');

                        // Reintentar la petición original con el nuevo token
                        originalRequest.headers['Authorization'] = `Bearer ${response.accessToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        console.log('No se pudo refrescar el token, cerrando sesión');
                        if (!sessionToastShown) {
                            showToast.error('Sesión expirada', 'Por favor inicia sesión nuevamente');
                            sessionToastShown = true;
                        } await logout();
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
    }, [accessToken, setUser, logout]);

    return useAuthStore();
};