import { useState } from 'react';
import { useIncomes } from '../hooks/useIncomes';
import { useCategorySummary } from '../hooks/useCategorySummary';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import SummaryCards from '../components/SummaryCards';
import type { Income, IncomeInput } from '../../domain/expense';

export default function IncomePage() {
  const { incomes, total, loading, addIncome, editIncome, removeIncome } = useIncomes();
  const { total: totalExpense } = useCategorySummary();

  const [editing, setEditing] = useState<Income | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (input: IncomeInput) => {
    if (editing) {
      await editIncome(editing._id, input);
      setEditing(null);
    } else {
      await addIncome(input);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus pemasukan ini?')) {
      await removeIncome(id);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pemasukan</h2>
          <p className="text-sm text-slate-400">Catat dan pantau pemasukanmu</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 gradient-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-900/20 transition-all duration-200 hover:shadow-lg active:scale-[0.97]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Tambah Pemasukan</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <SummaryCards totalExpense={totalExpense} totalIncome={total} count={incomes.length} />

      <IncomeList
        incomes={incomes}
        loading={loading}
        onEdit={(inc) => { setEditing(inc); setShowForm(true); }}
        onDelete={handleDelete}
      />

      <IncomeForm
        isOpen={showForm}
        onSubmit={handleSubmit}
        initial={editing}
        onClose={() => { setEditing(null); setShowForm(false); }}
      />
    </main>
  );
}
