import { useState, useEffect, useCallback } from 'react';
import { incomeService } from '../../application/incomeService';

export function useIncomeSummary() {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await incomeService.getIncomeSummary();
      setTotal(res.data.total);
      setCount(res.data.count);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { total, count, loading, refetch: fetch };
}
