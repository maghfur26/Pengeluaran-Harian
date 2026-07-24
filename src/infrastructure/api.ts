import axios from 'axios';
import type {
  Expense,
  ExpenseInput,
  MonthlyExpense,
  DailyExpense,
  CategorySummary,
  ApiResponse,
} from '../domain/expense';

const api = axios.create({
  baseURL: '/api',
});

export const expenseApi = {
  async getAll(filters?: Record<string, string>): Promise<ApiResponse<Expense[]>> {
    const { data } = await api.get('/expenses', { params: filters });
    return data;
  },

  async getOne(id: string): Promise<ApiResponse<Expense>> {
    const { data } = await api.get(`/expenses/${id}`);
    return data;
  },

  async create(input: ExpenseInput): Promise<ApiResponse<Expense>> {
    const { data } = await api.post('/expenses', input);
    return data;
  },

  async update(id: string, input: Partial<ExpenseInput>): Promise<ApiResponse<Expense>> {
    const { data } = await api.put(`/expenses/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete(`/expenses/${id}`);
    return data;
  },

  async getMonthly(year?: number): Promise<ApiResponse<MonthlyExpense[]>> {
    const params = year ? { year } : {};
    const { data } = await api.get('/expenses/monthly', { params });
    return data;
  },

  async getDaily(year: number, month: number): Promise<ApiResponse<DailyExpense[]>> {
    const { data } = await api.get('/expenses/daily', { params: { year, month } });
    return data;
  },

  async getSummary(params?: { startDate?: string; endDate?: string }): Promise<
    ApiResponse<{ summary: CategorySummary[]; total: number }>
  > {
    const { data } = await api.get('/expenses/summary', { params });
    return data;
  },
};
