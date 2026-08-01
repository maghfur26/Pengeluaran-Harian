import { useState } from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import UserFormModal from '../components/UserFormModal';
import ResetPasswordModal from '../components/ResetPasswordModal';
import type { AdminUser, UserInput, UserUpdateInput } from '../../domain/expense';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const formatDateTime = (d?: string | null) => {
  if (!d) return 'Belum pernah aktif';
  return new Date(d).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

function RoleBadge({ role }: { role: 'user' | 'admin' }) {
  return role === 'admin' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
      User
    </span>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-12 bg-slate-100 rounded-xl" />
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { users, loading, error, searchUsers, addUser, editUser, removeUser, resetUserPassword } = useAdminUsers();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);

  const handleSearch = () => {
    searchUsers(search.trim() || undefined);
  };

  const handleSubmit = async (input: UserInput | UserUpdateInput) => {
    if (editing) {
      await editUser(editing.id, input as UserUpdateInput);
    } else {
      await addUser(input as UserInput);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    setDeleting(null);
    if (confirm(`Yakin ingin menghapus user "${user.name}" beserta semua datanya?`)) {
      await removeUser(user.id);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen User</h2>
          <p className="text-sm text-slate-400">Kelola user, reset password, dan pantau aktivitas</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 gradient-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-900/20 transition-all duration-200 hover:shadow-lg active:scale-[0.97]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.25v-1.75c0-1.036.84-1.875 1.875-1.875h3.375c1.036 0 1.875.84 1.875 1.875v1.75M6.75 12.75a4.5 4.5 0 110-9 4.5 4.5 0 010 9zM18 12.75a3.375 3.375 0 110-6.75 3.375 3.375 0 010 6.75z" />
          </svg>
          Tambah User
        </button>
      </div>

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Cari nama atau email..."
                className="input-field pl-10"
              />
            </div>
            <button onClick={handleSearch} className="btn-primary px-5 py-2.5 text-sm">
              Cari
            </button>
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <Skeleton />
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Tidak ada user ditemukan</p>
            <p className="text-sm text-slate-400 mt-1">Coba ubah kata kunci pencarian</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Terakhir Aktif</th>
                  <th className="px-4 py-3 font-semibold">Transaksi</th>
                  <th className="px-4 py-3 font-semibold">Terdaftar</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${u.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{u.name}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{formatDateTime(u.lastActive)}</td>
                    <td className="px-4 py-4">
                      <div className="text-slate-700 whitespace-nowrap">
                        <span className="text-rose-600 font-medium">{u.expenseCount} pengeluaran</span>
                        <span className="text-slate-300 mx-1">·</span>
                        <span className="text-emerald-600 font-medium">{u.incomeCount} pemasukan</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatCurrency(u.expenseTotal)} keluar / {formatCurrency(u.incomeTotal)} masuk
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditing(u); setShowForm(true); }}
                          className="btn-icon text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                          title="Edit user"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setResetTarget(u)}
                          className="btn-icon text-amber-500 hover:bg-amber-50"
                          title="Reset password"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleting(u)}
                          className="btn-danger"
                          title="Hapus user"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFormModal
        isOpen={showForm}
        initial={editing}
        onSubmit={handleSubmit}
        onClose={() => { setEditing(null); setShowForm(false); }}
      />

      <ResetPasswordModal
        isOpen={Boolean(resetTarget)}
        userName={resetTarget?.name}
        onSubmit={async (password) => {
          if (resetTarget) await resetUserPassword(resetTarget.id, password);
        }}
        onClose={() => setResetTarget(null)}
      />

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up p-6">
            <h3 className="text-lg font-bold text-slate-900">Hapus User</h3>
            <p className="text-sm text-slate-500 mt-2">
              Apakah kamu yakin ingin menghapus user <span className="font-semibold text-slate-800">{deleting.name}</span>? Semua data pengeluaran dan pemasukannya akan ikut terhapus dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDelete(deleting)}
                className="btn-danger flex-1 py-3 justify-center font-semibold text-sm"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setDeleting(null)}
                className="btn-ghost flex-1 py-3 border border-slate-200 font-semibold text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
