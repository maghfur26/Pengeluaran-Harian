import { adminApi } from '../infrastructure/api';
import type { UserInput, UserUpdateInput } from '../domain/expense';

export const adminService = {
  async listUsers(search?: string) {
    return adminApi.getAllUsers(search);
  },

  async getUser(id: string) {
    return adminApi.getOneUser(id);
  },

  async createUser(input: UserInput) {
    return adminApi.createUser(input);
  },

  async updateUser(id: string, input: UserUpdateInput) {
    return adminApi.updateUser(id, input);
  },

  async deleteUser(id: string) {
    return adminApi.deleteUser(id);
  },

  async resetUserPassword(id: string, password: string) {
    return adminApi.resetUserPassword(id, password);
  },
};
