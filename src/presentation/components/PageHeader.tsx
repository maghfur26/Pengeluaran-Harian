import type { ReactNode } from 'react';

interface Props {
  badge: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  buttonLabel: string;
  buttonClass: string;
  onAdd: () => void;
}

export default function PageHeader({ badge, title, subtitle, icon, gradient, buttonLabel, buttonClass, onAdd }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 sm:p-7 text-white shadow-lg`}>
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">{icon}</div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">{badge}</span>
            <h2 className="text-2xl font-bold tracking-tight mt-0.5">{title}</h2>
            <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-md transition-all duration-200 hover:shadow-xl active:scale-[0.97] ${buttonClass}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
