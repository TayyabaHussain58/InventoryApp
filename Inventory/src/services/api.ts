import axios, { AxiosError } from 'axios';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface SignupResponse extends LoginResponse {}

interface ApiError {
  message: string;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
  signup: async (email: string, password: string, name: string): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>('/auth/signup', { email, password, name });
    return response.data;
  },
};

const products = {
  getProducts: async () => {
    const response = await axiosInstance.get('/products');
    return response.data;
  },
  addProduct: async (product: any) => {
    const response = await axiosInstance.post('/products', product);
    return response.data;
  },
  updateStock: async (productId: string, quantity: number) => {
    const response = await axiosInstance.patch(`/products/${productId}/stock`, { quantity });
    return response.data;
  },
  removeProduct: async (productId: string) => {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  },
};

const transactions = {
  getTransactions: async () => {
    const response = await axiosInstance.get('/transactions');
    return response.data;
  },
  addTransaction: async (transaction: any) => {
    const response = await axiosInstance.post('/transactions', transaction);
    return response.data;
  },
};

const transactionProcesses = {
  getTransactionProcesses: async () => {
    const response = await axiosInstance.get('/transaction-processes');
    return response.data;
  },
  getTransactionProcess: async (id: string) => {
    const response = await axiosInstance.get(`/transaction-processes/${id}`);
    return response.data;
  },
  createTransactionProcess: async (process: any) => {
    const response = await axiosInstance.post('/transaction-processes', process);
    return response.data;
  },
  updateTransactionProcess: async (id: string, process: any) => {
    const response = await axiosInstance.put(`/transaction-processes/${id}`, process);
    return response.data;
  },
  deleteTransactionProcess: async (id: string) => {
    const response = await axiosInstance.delete(`/transaction-processes/${id}`);
    return response.data;
  },
};

export const api = {
  ...auth,
  ...products,
  ...transactions,
  ...transactionProcesses,
}; 