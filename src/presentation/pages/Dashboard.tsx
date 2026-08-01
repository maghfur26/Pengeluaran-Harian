import { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useMonthlyExpenses, useDailyExpenses } from '../hooks/useMonthlyExpenses';
import { useCategorySummary } from '../hooks/useCategorySummary';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';
import CategoryChart from '../components/CategoryChart';
import SummaryCards from '../components/SummaryCards';
import { useAuth } from '../context/AuthContext';
import type { Expense, ExpenseInput } from '../../domain/expense';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { expenses, loading, filters, applyFilters, addExpense, editExpense, removeExpense } = useExpenses();
  const { data: monthlyData, refetch: refetchMonthly } = useMonthlyExpenses();

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
  }, [expenses, refetchMonthly, refetchDaily, refetchSummary]);

  const [editing, setEditing] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);

  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();
  const totalThisMonth = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((s, e) => s + e.amount, 0);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <header className="sticky top-0 z-20 gradient-primary text-white shadow-lg shadow-blue-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Catatan Keuangan</h1>
              <p className="text-xs text-blue-200 hidden sm:block">Pantau pengeluaranmu setiap hari</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.97] font-semibold text-sm shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="hidden sm:inline">Tambah</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white max-w-[120px] truncate">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                title="Keluar"
                className="btn-icon text-white/80 hover:bg-white/15"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <SummaryCards total={totalAll} thisMonth={totalThisMonth} count={expenses.length} />

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
      </main>

      <ExpenseForm
        isOpen={showForm}
        onSubmit={handleSubmit}
        initial={editing}
        onClose={() => { setEditing(null); setShowForm(false); }}
      />
    </div>
  );
}
