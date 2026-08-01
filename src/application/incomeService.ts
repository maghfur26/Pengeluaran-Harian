import { incomeApi } from '../infrastructure/api';
import type { IncomeInput } from '../domain/expense';

export const incomeService = {
  async listIncomes(filters?: { startDate?: string; endDate?: string; search?: string }) {
    const params: Record<string, string> = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.search) params.search = filters.search;
    return incomeApi.getAll(Object.keys(params).length ? params : undefined);
  },

  async getIncome(id: string) {
    return incomeApi.getOne(id);
  },

  async createIncome(input: IncomeInput) {
    return incomeApi.create(input);
  },

  async updateIncome(id: string, input: Partial<IncomeInput>) {
    return incomeApi.update(id, input);
  },

  async deleteIncome(id: string) {
    return incomeApi.remove(id);
  },

  async getIncomeSummary(params?: { startDate?: string; endDate?: string }) {
    return incomeApi.getSummary(params);
  },
};
