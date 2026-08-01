import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../application/adminService';
import type { AdminUser, UserInput, UserUpdateInput } from '../../domain/expense';

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.listUsers(search);
      setUsers(res.data);
    } catch {
      setError('Gagal mengambil daftar user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const searchUsers = useCallback(async (search?: string) => {
    await fetchUsers(search);
  }, [fetchUsers]);

  const addUser = async (input: UserInput) => {
    const res = await adminService.createUser(input);
    await fetchUsers();
    return res;
  };

  const editUser = async (id: string, input: UserUpdateInput) => {
    const res = await adminService.updateUser(id, input);
    await fetchUsers();
    return res;
  };

  const removeUser = async (id: string) => {
    await adminService.deleteUser(id);
    await fetchUsers();
  };

  const resetUserPassword = async (id: string, password: string) => {
    const res = await adminService.resetUserPassword(id, password);
    await fetchUsers();
    return res;
  };

  return { users, loading, error, refetch: fetchUsers, searchUsers, addUser, editUser, removeUser, resetUserPassword };
}
