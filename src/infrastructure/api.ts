import axios from 'axios';
import type {
  Expense,
  ExpenseInput,
  MonthlyExpense,
  DailyExpense,
  CategorySummary,
  ApiResponse,
  User,
  AuthResponse,
} from '../domain/expense';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const expenseApi = {
  async getAll(filters?: Record<string, string>): Promise<ApiResponse<Expense[]>> {
    const { data } = await api.get('/api/expenses', { params: filters });
    return data;
  },

  async getOne(id: string): Promise<ApiResponse<Expense>> {
    const { data } = await api.get(`/api/expenses/${id}`);
    return data;
  },

  async create(input: ExpenseInput): Promise<ApiResponse<Expense>> {
    const { data } = await api.post('/api/expenses', input);
    return data;
  },

  async update(id: string, input: Partial<ExpenseInput>): Promise<ApiResponse<Expense>> {
    const { data } = await api.put(`/api/expenses/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete(`/api/expenses/${id}`);
    return data;
  },

  async getMonthly(year?: number): Promise<ApiResponse<MonthlyExpense[]>> {
    const params = year ? { year } : {};
    const { data } = await api.get('/api/expenses/monthly', { params });
    return data;
  },

  async getDaily(year: number, month: number): Promise<ApiResponse<DailyExpense[]>> {
    const { data } = await api.get('/api/expenses/daily', { params: { year, month } });
    return data;
  },

  async getSummary(params?: { startDate?: string; endDate?: string }): Promise<
    ApiResponse<{ summary: CategorySummary[]; total: number }>
  > {
    const { data } = await api.get('/api/expenses/summary', { params });
    return data;
  },
};

export const authApi = {
  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/register', input);
    return data;
  },

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/login', input);
    return data;
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const { data } = await api.get('/api/auth/me');
    return data;
  },
};
