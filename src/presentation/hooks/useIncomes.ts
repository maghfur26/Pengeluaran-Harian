import { useState, useEffect, useCallback } from 'react';
import { incomeService } from '../../application/incomeService';
import type { Income, IncomeInput } from '../../domain/expense';

export function useIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, summaryRes] = await Promise.all([
        incomeService.listIncomes(),
        incomeService.getIncomeSummary(),
      ]);
      setIncomes(listRes.data);
      setTotal(summaryRes.data.total);
    } catch {
      setError('Gagal mengambil data pemasukan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const addIncome = async (input: IncomeInput) => {
    const res = await incomeService.createIncome(input);
    await fetchIncomes();
    return res;
  };

  const editIncome = async (id: string, input: Partial<IncomeInput>) => {
    const res = await incomeService.updateIncome(id, input);
    await fetchIncomes();
    return res;
  };

  const removeIncome = async (id: string) => {
    await incomeService.deleteIncome(id);
    await fetchIncomes();
  };

  return { incomes, total, loading, error, refetch: fetchIncomes, addIncome, editIncome, removeIncome };
}
