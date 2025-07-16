import axios from 'axios';
import { AuthResponse, Categoria, Lancamento, DashboardData } from '../types/api';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/token/', { username, password });
    return response.data;
  },
  
  register: async (username: string, password: string, email?: string): Promise<AuthResponse> => {
    const response = await api.post('/register/', { username, password, email });
    return response.data;
  },
};

// Categorias endpoints
export const categoriasAPI = {
  list: async (): Promise<Categoria[]> => {
    const response = await api.get('/categorias/');
    return response.data;
  },
  
  create: async (data: Omit<Categoria, 'id' | 'usuario'>): Promise<Categoria> => {
    const response = await api.post('/categorias/', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Categoria>): Promise<Categoria> => {
    const response = await api.put(`/categorias/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}/`);
  },
};

// Lançamentos endpoints
export const lancamentosAPI = {
  list: async (): Promise<Lancamento[]> => {
    const response = await api.get('/lancamentos/');
    return response.data;
  },
  
  create: async (data: Omit<Lancamento, 'id' | 'usuario' | 'categoria'>): Promise<Lancamento> => {
    const response = await api.post('/lancamentos/', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Lancamento>): Promise<Lancamento> => {
    const response = await api.put(`/lancamentos/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/lancamentos/${id}/`);
  },
  
  dashboard: async (mes?: number, ano?: number): Promise<DashboardData> => {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (ano) params.append('ano', ano.toString());
    
    const response = await api.get(`/lancamentos/dashboard/?${params.toString()}`);
    return response.data;
  },
};

export default api; 