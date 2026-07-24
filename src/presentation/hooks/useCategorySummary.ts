import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../../application/expenseService';
import type { CategorySummary } from '../../domain/expense';

export function useCategorySummary() {
  const [data, setData] = useState<CategorySummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async (params?: { startDate?: string; endDate?: string }) => {
    setLoading(true);
    try {
      const res = await expenseService.getCategorySummary(params);
      setData(res.data.summary);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, total, loading, refetch: fetch };
}
