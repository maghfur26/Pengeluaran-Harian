import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import type { CategorySummary } from '../../domain/expense';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

interface Props {
  data: CategorySummary[];
  total: number;
  loading: boolean;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const COLORS = [
  '#f97316', '#3b82f6', '#a855f7', '#ef4444',
  '#ec4899', '#22c55e', '#f59e0b', '#64748b',
];

export default function CategoryChart({ data, total, loading }: Props) {
  if (loading) {
    return (
      <div className="glass-strong rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-100 rounded-lg w-1/3" />
          <div className="h-48 bg-slate-50 rounded-full mx-auto" style={{ width: 200, height: 200 }} />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-6 flex flex-col items-center justify-center">
        <svg className="w-12 h-12 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
        <p className="text-sm text-slate-400">Belum ada data kategori</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: COLORS.slice(0, data.length),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="font-bold text-slate-900">Pengeluaran per Kategori</h2>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="w-48 h-48 flex-shrink-0">
            <Chart
              type="doughnut"
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                cutout: '65%',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    cornerRadius: 12,
                    padding: 12,
                    callbacks: {
                      label: (ctx: { parsed: number; label: string }) => {
                        const val = ctx.parsed;
                        const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                        return `${ctx.label}: ${formatCurrency(val)} (${pct}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>

          <div className="flex-1 w-full space-y-2">
            {data.map((item, i) => {
              const pct = total > 0 ? ((item.total / total) * 100).toFixed(1) : 0;
              return (
                <div key={item._id} className="grid grid-cols-[12px_1fr_auto_auto] items-center gap-x-3 gap-y-0.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-sm text-slate-600 truncate">{item._id}</span>
                  <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">{formatCurrency(item.total)}</span>
                  <span className="text-xs text-slate-400 text-right w-11">{pct}%</span>
                </div>
              );
            })}

            <div className="pt-2 mt-2 border-t border-slate-100 grid grid-cols-[12px_1fr_auto_auto] items-center gap-x-3">
              <div />
              <span className="text-sm text-slate-400">Total</span>
              <span className="text-sm font-bold text-slate-900 whitespace-nowrap">{formatCurrency(total)}</span>
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
