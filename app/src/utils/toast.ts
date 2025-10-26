import Toast from 'react-native-toast-message';

export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
    });
  },

  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      topOffset: 50,
    });
  },

  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
    });
  },
};

// Helper para errores de Axios del backend
export const showApiError = (error: any) => {
  // Si hay errores de validación (objeto errors)
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    
    // Mostrar cada error de validación
    Object.keys(errors).forEach((field, index) => {
      setTimeout(() => {
        showToast.error(
          field.charAt(0).toUpperCase() + field.slice(1), // Capitalizar nombre del campo
          errors[field]
        );
      }, index * 500); // Espaciar los toasts 500ms
    });
    return;
  }
  
  // Si hay mensaje normal del backend
  if (error.response?.data?.message) {
    showToast.error('Error', error.response.data.message);
    return;
  }
  
  // Fallback para errores sin estructura específica
  const status = error.response?.status;
  let title = 'Error';
  let message = error.message || 'Ha ocurrido un error';
  
  if (status === 400) title = 'Datos inválidos';
  else if (status === 401) title = 'No autorizado';
  else if (status === 403) title = 'Acceso denegado';
  else if (status === 404) title = 'No encontrado';
  else if (status === 500) title = 'Error del servidor';
  else if (!error.response) {
    title = 'Sin conexión';
    message = 'Verifica tu conexión a internet';
  }
  
  showToast.error(title, message);
};