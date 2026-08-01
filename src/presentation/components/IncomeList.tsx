import type { Income } from '../../domain/expense';

interface Props {
  incomes: Income[];
  loading: boolean;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50" />
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-slate-500 font-medium">Belum ada pemasukan</p>
      <p className="text-sm text-slate-400 mt-1">Mulai catat pemasukanmu hari ini</p>
    </div>
  );
}

export default function IncomeList({ incomes, loading, onEdit, onDelete }: Props) {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="font-bold text-slate-900">Riwayat Pemasukan</h2>
        {incomes.length > 0 && (
          <p className="text-sm text-slate-400 mt-0.5">{incomes.length} transaksi</p>
        )}
      </div>

      {loading ? (
        <SkeletonCard />
      ) : incomes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-slate-100">
          {incomes.map((inc, i) => (
            <div
              key={inc._id}
              className="group flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors duration-150 animate-fade-in"
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{inc.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{formatDate(inc.date)}</span>
                </div>
                {inc.notes && <p className="text-xs text-slate-400 mt-1 truncate">{inc.notes}</p>}
              </div>

              <div className="flex items-center gap-1">
                <span className="font-bold text-emerald-600 text-sm sm:text-base whitespace-nowrap mr-1">
                  +{formatCurrency(inc.amount)}
                </span>
                <button
                  onClick={() => onEdit(inc)}
                  className="btn-icon transition-opacity"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(inc._id)}
                  className="btn-danger transition-opacity"
                  title="Hapus"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
