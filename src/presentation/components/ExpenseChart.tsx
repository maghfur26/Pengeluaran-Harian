import { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
} from 'chart.js';
import type { MonthlyExpense, DailyExpense } from '../../domain/expense';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);

interface Props {
  monthlyData: MonthlyExpense[];
  dailyData: DailyExpense[];
  selectedMonth: { year: number; month: number } | null;
  onSelectMonth: (year: number, month: number) => void;
  onBack: () => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function ExpenseChart({ monthlyData, dailyData, selectedMonth, onSelectMonth, onBack }: Props) {
  const [year, setYear] = useState(new Date().getFullYear());
  const filteredMonthly = monthlyData.filter((m) => m.year === year);

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        cornerRadius: 12,
        padding: 12,
        titleFont: { weight: 'bold' as const },
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) => formatCurrency(ctx.parsed.y ?? 0),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f1f5f9' },
        border: { display: false },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (v: string | number) => {
            const num = typeof v === 'string' ? parseFloat(v) : v;
            if (num >= 1000000) return `${(num / 1000000).toFixed(0)}jt`;
            if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
            return formatCurrency(num);
          },
        },
        beginAtZero: true,
      },
    },
  };

  const monthlyChartData = {
    labels: filteredMonthly.map((m) => {
      const short = new Date(year, m.month - 1).toLocaleDateString('id-ID', { month: 'short' });
      return short;
    }),
    datasets: [
      {
        data: filteredMonthly.map((m) => m.total),
        backgroundColor: filteredMonthly.map((m) => {
          const now = new Date();
          const isCurrent = m.year === now.getFullYear() && m.month === now.getMonth() + 1;
          return isCurrent ? 'rgba(59, 130, 246, 0.85)' : 'rgba(59, 130, 246, 0.35)';
        }),
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 48,
      },
    ],
  };

  const dailyChartData = {
    labels: dailyData.map((d) => d.day.toString()),
    datasets: [
      {
        data: dailyData.map((d) => d.total),
        backgroundColor: dailyData.map((d) => {
          const now = new Date();
          const isToday = selectedMonth &&
            d.day === now.getDate() &&
            selectedMonth.month === now.getMonth() + 1 &&
            selectedMonth.year === now.getFullYear();
          return isToday ? 'rgba(16, 185, 129, 0.85)' : 'rgba(16, 185, 129, 0.35)';
        }),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 32,
      },
    ],
  };

  const years = [...new Set(monthlyData.map((m) => m.year))].sort((a, b) => b - a);
  if (!years.includes(year)) years.unshift(year);

  const totalYear = filteredMonthly.reduce((s, m) => s + m.total, 0);

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedMonth && (
            <button onClick={onBack} className="btn-icon -ml-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          <div>
            <h2 className="font-bold text-slate-900">
              {selectedMonth
                ? new Date(year, selectedMonth.month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                : 'Grafik Pengeluaran'}
            </h2>
            {selectedMonth && (
              <p className="text-xs text-slate-400 mt-0.5">Klik bar untuk detail</p>
            )}
          </div>
        </div>

        {!selectedMonth && (
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="select-field py-1.5 pr-8 text-sm w-auto font-medium"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}
      </div>

      <div className="p-6">
        {filteredMonthly.length === 0 && !selectedMonth ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-12 h-12 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <p className="text-sm text-slate-400">Belum ada data untuk tahun ini</p>
          </div>
        ) : (
          <div className="h-64 sm:h-72">
            <Chart
              type="bar"
              data={selectedMonth ? dailyChartData : monthlyChartData}
              options={sharedOptions as never}
              onClick={selectedMonth ? undefined : ((_: unknown, elements: Array<{ index: number }>) => {
                if (elements.length > 0) {
                  const item = filteredMonthly[elements[0].index];
                  if (item) onSelectMonth(item.year, item.month);
                }
              }) as never}
            />
          </div>
        )}

        {!selectedMonth && filteredMonthly.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-400">Total {year}</span>
            <span className="text-lg font-bold text-slate-900">{formatCurrency(totalYear)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
