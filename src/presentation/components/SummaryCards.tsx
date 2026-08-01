interface Props {
  totalExpense: number;
  totalIncome: number;
  count: number;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const cards = [
  {
    key: 'income' as const,
    label: 'Total Pemasukan',
    gradient: 'from-emerald-500 to-teal-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    key: 'expense' as const,
    label: 'Total Pengeluaran',
    gradient: 'from-rose-500 to-red-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'net' as const,
    label: 'Sisa Uang',
    gradient: 'from-blue-600 to-indigo-600',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0a2.25 2.25 0 01-2.25 2.25H15a3 3 0 01-6 0H5.25A2.25 2.25 0 013 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6" />
      </svg>
    ),
  },
  {
    key: 'count' as const,
    label: 'Total Transaksi',
    gradient: 'from-slate-900 to-slate-800',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
];

export default function SummaryCards({ totalExpense, totalIncome, count }: Props) {
  const net = totalIncome - totalExpense;
  const values = { income: totalIncome, expense: totalExpense, net, count };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.key}
          className={`animate-slide-up group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/5" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-white/15">{card.icon}</div>
              <span className="text-sm font-medium text-white/80">{card.label}</span>
            </div>
            <p className="text-2xl font-bold tracking-tight">
              {card.key === 'count' ? count : formatCurrency(values[card.key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
