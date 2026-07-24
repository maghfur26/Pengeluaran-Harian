import { expenseApi } from '../infrastructure/api';
import type { ExpenseInput, ExpenseFilter } from '../domain/expense';

export const expenseService = {
  async listExpenses(filters?: ExpenseFilter) {
    const params: Record<string, string> = {};
    if (filters?.category) params.category = filters.category;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.search) params.search = filters.search;
    return expenseApi.getAll(Object.keys(params).length ? params : undefined);
  },

  async getExpense(id: string) {
    return expenseApi.getOne(id);
  },

  async createExpense(input: ExpenseInput) {
    return expenseApi.create(input);
  },

  async updateExpense(id: string, input: Partial<ExpenseInput>) {
    return expenseApi.update(id, input);
  },

  async deleteExpense(id: string) {
    return expenseApi.remove(id);
  },

  async getMonthlyExpenses(year?: number) {
    return expenseApi.getMonthly(year);
  },

  async getDailyExpenses(year: number, month: number) {
    return expenseApi.getDaily(year, month);
  },

  async getCategorySummary(params?: { startDate?: string; endDate?: string }) {
    return expenseApi.getSummary(params);
  },
};
