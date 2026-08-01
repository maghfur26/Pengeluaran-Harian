import { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useMonthlyExpenses, useDailyExpenses } from '../hooks/useMonthlyExpenses';
import { useCategorySummary } from '../hooks/useCategorySummary';
import { useIncomeSummary } from '../hooks/useIncomeSummary';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';
import CategoryChart from '../components/CategoryChart';
import SummaryCards from '../components/SummaryCards';
import type { Expense, ExpenseInput } from '../../domain/expense';

export default function Dashboard() {
  const { expenses, loading, filters, applyFilters, addExpense, editExpense, removeExpense } = useExpenses();
  const { data: monthlyData, refetch: refetchMonthly } = useMonthlyExpenses();
  const { total: totalIncome, refetch: refetchIncome } = useIncomeSummary();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number } | null>(null);
  const { data: dailyData, refetch: refetchDaily } = useDailyExpenses(
    selectedMonth?.year ?? now.getFullYear(),
    selectedMonth?.month ?? now.getMonth() + 1
  );

  const { data: categoryData, total: categoryTotal, loading: categoryLoading, refetch: refetchSummary } = useCategorySummary();

  useEffect(() => {
    refetchMonthly();
    refetchDaily();
    refetchSummary();
    refetchIncome();
  }, [expenses, refetchMonthly, refetchDaily, refetchSummary, refetchIncome]);

  const [editing, setEditing] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  const handleSubmit = async (input: ExpenseInput) => {
    if (editing) {
      await editExpense(editing._id, input);
      setEditing(null);
    } else {
      await addExpense(input);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus pengeluaran ini?')) {
      await removeExpense(id);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pengeluaran</h2>
          <p className="text-sm text-slate-400">Catat dan pantau pengeluaranmu</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 gradient-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-900/20 transition-all duration-200 hover:shadow-lg active:scale-[0.97]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Tambah Pengeluaran</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <SummaryCards totalExpense={totalExpense} totalIncome={totalIncome} count={expenses.length} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ExpenseChart
            monthlyData={monthlyData}
            dailyData={dailyData}
            selectedMonth={selectedMonth}
            onSelectMonth={(year, month) => setSelectedMonth({ year, month })}
            onBack={() => setSelectedMonth(null)}
          />
        </div>
        <div className="lg:col-span-2">
          <CategoryChart data={categoryData} total={categoryTotal} loading={categoryLoading} />
        </div>
      </div>

      <ExpenseList
        expenses={expenses}
        loading={loading}
        filters={filters}
        onFilterChange={applyFilters}
        onEdit={(e) => { setEditing(e); setShowForm(true); }}
        onDelete={handleDelete}
      />

      <ExpenseForm
        isOpen={showForm}
        onSubmit={handleSubmit}
        initial={editing}
        onClose={() => { setEditing(null); setShowForm(false); }}
      />
    </main>
  );
}
