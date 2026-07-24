import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../../application/expenseService';
import type { MonthlyExpense, DailyExpense } from '../../domain/expense';

export function useMonthlyExpenses() {
  const [data, setData] = useState<MonthlyExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async (year?: number) => {
    setLoading(true);
    try {
      const res = await expenseService.getMonthlyExpenses(year);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, refetch: fetch };
}

export function useDailyExpenses(year: number, month: number) {
  const [data, setData] = useState<DailyExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await expenseService.getDailyExpenses(year, month);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, refetch: fetch };
}
