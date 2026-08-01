export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Catatan Keuangan</p>
              <p className="text-[11px] text-slate-400">Kelola keuanganmu lebih mudah dan teratur</p>
            </div>
          </div>

          <p className="text-center sm:text-right">
            <span className="text-xs text-slate-400">
              © {year} · Dibuat dengan{' '}
              <span className="text-rose-400">♥</span> oleh{' '}
            </span>
            <span className="text-xs font-semibold text-slate-100">Maghfur Hasani</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
