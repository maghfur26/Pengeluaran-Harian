import { useState, useMemo, useEffect } from 'react';
import type { Expense, Category, ExpenseFilter } from '../../domain/expense';
import { CATEGORIES } from '../../domain/expense';
import { todayDateString } from '../../utils/date';

interface Props {
  expenses: Expense[];
  loading: boolean;
  filters: ExpenseFilter;
  onFilterChange: (filters: ExpenseFilter) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const CATEGORY_STYLE: Record<Category, { bg: string; text: string; dot: string }> = {
  Makanan:      { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-400' },
  Transportasi: { bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-400' },
  Belanja:      { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-400' },
  Tagihan:      { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400' },
  Hiburan:      { bg: 'bg-pink-50',   text: 'text-pink-600',   dot: 'bg-pink-400' },
  Kesehatan:    { bg: 'bg-green-50',  text: 'text-green-600',  dot: 'bg-green-400' },
  Pendidikan:   { bg: 'bg-amber-50',  text: 'text-amber-600',  dot: 'bg-amber-400' },
  Lainnya:      { bg: 'bg-slate-50',  text: 'text-slate-600',  dot: 'bg-slate-400' },
};

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0">
          <div className="w-10 h-10 rounded-xl bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-100 rounded-lg w-1/3" />
            <div className="h-3 bg-slate-50 rounded-lg w-2/3" />
          </div>
          <div className="h-4 bg-slate-100 rounded-lg w-20" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters, isToday }: { hasFilters: boolean; isToday: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          {hasFilters || isToday ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          )}
        </svg>
      </div>
      <p className="text-slate-500 font-medium">
        {isToday ? 'Belum ada pengeluaran hari ini' : hasFilters ? 'Tidak ada hasil ditemukan' : 'Belum ada pengeluaran'}
      </p>
      <p className="text-sm text-slate-400 mt-1">
        {isToday ? 'Mulai catat pengeluaranmu hari ini' : hasFilters ? 'Coba ubah filter tanggal atau pencarianmu' : 'Mulai catat pengeluaranmu hari ini'}
      </p>
    </div>
  );
}

export default function ExpenseList({ expenses, loading, filters, onFilterChange, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');
  const [category, setCategory] = useState<Category | ''>(filters.category ?? '');
  const [startDate, setStartDate] = useState(filters.startDate ?? '');
  const [endDate, setEndDate] = useState(filters.endDate ?? '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearch(filters.search ?? '');
    setCategory(filters.category ?? '');
    setStartDate(filters.startDate ?? '');
    setEndDate(filters.endDate ?? '');
  }, [filters]);

  const isTodayView = filters.startDate === todayDateString() &&
    filters.endDate === todayDateString() &&
    !filters.category &&
    !filters.search;

  const hasActiveFilters = !isTodayView && Boolean(filters.category || filters.startDate || filters.endDate || filters.search);

  const handleSearch = () => {
    onFilterChange({
      search: search.trim() || undefined,
      category: category || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClearFilters = () => {
    const t = todayDateString();
    setSearch('');
    setCategory('');
    setStartDate(t);
    setEndDate(t);
    onFilterChange({ startDate: t, endDate: t });
  };

  const activeFilterCount = useMemo(() => {
    if (isTodayView) return 0;
    let count = 0;
    if (filters.category) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.search) count++;
    return count;
  }, [filters, isTodayView]);

  const subtitle = isTodayView
    ? `${expenses.length} transaksi hari ini`
    : hasActiveFilters
      ? `${expenses.length} hasil ditemukan`
      : `${expenses.length} transaksi`;

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Riwayat Pengeluaran</h2>
            {expenses.length > 0 && (
              <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${showFilters || hasActiveFilters
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            {isTodayView ? 'Hari Ini' : 'Filter'}
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 space-y-3 animate-slide-down">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Cari pengeluaran..."
                className="input-field pl-10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category | '')}
                className="select-field"
              >
                <option value="">Semua Kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Dari tanggal"
                className="input-field"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Sampai tanggal"
                className="input-field"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={handleSearch} className="btn-primary text-xs px-4 py-2">
                Terapkan
              </button>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="btn-ghost text-xs px-4 py-2 border border-slate-200">
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <SkeletonCard />
      ) : expenses.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} isToday={isTodayView} />
      ) : (
        <div className="divide-y divide-slate-100">
          {expenses.map((e, i) => {
            const style = CATEGORY_STYLE[e.category] ?? CATEGORY_STYLE.Lainnya;
            return (
              <div
                key={e._id}
                className="group flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors duration-150 animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 truncate">{e.description}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-medium ${style.text}`}>{e.category}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{formatDate(e.date)}</span>
                  </div>
                  {e.notes && <p className="text-xs text-slate-400 mt-1 truncate">{e.notes}</p>}
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap mr-1">
                    {formatCurrency(e.amount)}
                  </span>
                  <button
                    onClick={() => onEdit(e)}
                    className="btn-icon transition-opacity"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(e._id)}
                    className="btn-danger transition-opacity"
                    title="Hapus"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
