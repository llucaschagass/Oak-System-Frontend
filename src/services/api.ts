import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const isAuthRoute = config.url?.startsWith('/api/auth');

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const failedUrl = error.config.url || '';

      if (!failedUrl.startsWith('/api/auth')) {
        localStorage.removeItem('authToken');

        await Swal.fire({
          icon: 'warning',
          title: 'Sessão Expirada',
          text: 'Por favor, faça login novamente para continuar.',
          confirmButtonColor: '#d33',
        });
        
        window.location.href = '/'; 
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;