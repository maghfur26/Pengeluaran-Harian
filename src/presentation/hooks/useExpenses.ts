import { useState, useEffect, useCallback, useRef } from 'react';
import { expenseService } from '../../application/expenseService';
import { todayDateString } from '../../utils/date';
import type { Expense, ExpenseInput, ExpenseFilter } from '../../domain/expense';

const isTodayDefault = (f: ExpenseFilter, today: string) =>
  f.startDate === today && f.endDate === today && !f.category && !f.search;

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExpenseFilter>(() => {
    const t = todayDateString();
    return { startDate: t, endDate: t };
  });
  const autoTodayRef = useRef<string | null>(todayDateString());

  const fetchExpenses = useCallback(async (f?: ExpenseFilter) => {
    setLoading(true);
    setError(null);
    try {
      const res = await expenseService.listExpenses(f);
      setExpenses(res.data);
    } catch {
      setError('Gagal mengambil data pengeluaran');
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback((f: ExpenseFilter) => {
    setFilters(f);
    autoTodayRef.current = isTodayDefault(f, todayDateString()) ? todayDateString() : null;
  }, []);

  useEffect(() => {
    fetchExpenses(filters);
  }, [fetchExpenses, filters]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = todayDateString();
      if (autoTodayRef.current && autoTodayRef.current !== now) {
        autoTodayRef.current = now;
        setFilters({ startDate: now, endDate: now });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const addExpense = async (input: ExpenseInput) => {
    const res = await expenseService.createExpense(input);
    setExpenses((prev) => [res.data, ...prev]);
    return res;
  };

  const editExpense = async (id: string, input: Partial<ExpenseInput>) => {
    const res = await expenseService.updateExpense(id, input);
    setExpenses((prev) => prev.map((e) => (e._id === id ? res.data : e)));
    return res;
  };

  const removeExpense = async (id: string) => {
    await expenseService.deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  };

  return { expenses, loading, error, filters, applyFilters, addExpense, editExpense, removeExpense };
}
