import axios, { AxiosResponse } from 'axios';

const API_URL =  'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: number;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface CulinaryItem {
  id: number;
  name: string;
  description: string;
  location: string;
  price_range: string;
  cuisine_type: string;
  rating: number;
  notes: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ItineraryItem {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  getProfile: () => api.get<User>('/auth/profile'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user'),
};

// Posts API
export const postsAPI = {
  getAll: () => api.get<Post[]>('/posts'),
  getById: (id: number) => api.get<Post>(`/posts/${id}`),
  create: (data: { title: string; content: string }) =>
    api.post<Post>('/posts', data),
  update: (id: number, data: { title: string; content: string }) =>
    api.put<Post>(`/posts/${id}`, data),
  delete: (id: number) => api.delete(`/posts/${id}`),
};

// Budget API
export const budgetAPI = {
  getAll: () => api.get<BudgetItem[]>('/budget'),
  getById: (id: number) => api.get<BudgetItem>(`/budget/${id}`),
  create: (data: { category: string; amount: number; description: string; date: string }) =>
    api.post<BudgetItem>('/budget', data),
  update: (id: number, data: { category: string; amount: number; description: string; date: string }) =>
    api.put<BudgetItem>(`/budget/${id}`, data),
  delete: (id: number) => api.delete(`/budget/${id}`),
};

// Packing API
export const packingAPI = {
  getAll: () => api.get('/packing'),
  getOne: (id: number) => api.get(`/packing/${id}`),
  create: (data: any) => api.post('/packing', data),
  update: (id: number, data: any) => api.put(`/packing/${id}`, data),
  delete: (id: number) => api.delete(`/packing/${id}`),
};

// Itinerary API
export const itineraryAPI = {
  getAll: () => api.get<ItineraryItem[]>('/itineraries'),
  getById: (id: number) => api.get<ItineraryItem>(`/itineraries/${id}`),
  create: (data: Omit<ItineraryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<ItineraryItem>('/itineraries', data),
  update: (id: number, data: Partial<ItineraryItem>) =>
    api.patch<ItineraryItem>(`/itineraries/${id}`, data),
  delete: (id: number) => api.delete(`/itineraries/${id}`),
};

// Culinary API
export const culinaryAPI = {
  getAll: () => api.get<CulinaryItem[]>('/culinary'),
  getById: (id: number) => api.get<CulinaryItem>(`/culinary/${id}`),
  create: (data: Omit<CulinaryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<CulinaryItem>('/culinary', data),
  update: (id: number, data: Partial<CulinaryItem>) =>
    api.patch<CulinaryItem>(`/culinary/${id}`, data),
  delete: (id: number) => api.delete(`/culinary/${id}`),
};

// Itinerary Activities API
export const itineraryActivityAPI = {
  getAll: () => api.get('/itinerary-activities'),
  create: (data: any) => api.post('/itinerary-activities', data),
};

// Packing List API
export interface PackingItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  is_packed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export const packingListAPI = {
  getAll: () => api.get<{ data: PackingItem[] }>('/packing'),
  getById: (id: number) => api.get<{ data: PackingItem }>(`/packing/${id}`),
  create: (data: { name: string; category: string; quantity: number }) =>
    api.post<{ data: PackingItem }>('/packing', data),
  update: (
    id: number,
    data: { name: string; category: string; quantity: number; is_packed?: boolean }
  ) => api.put<{ data: PackingItem }>(`/packing/${id}`, data),
  delete: (id: number) => api.delete(`/packing/${id}`),
};

export default api; 