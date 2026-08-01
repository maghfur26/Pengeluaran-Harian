import { useState } from 'react';
import { AuthProvider, useAuth } from './presentation/context/AuthContext';
import LoginPage from './presentation/pages/LoginPage';
import Dashboard from './presentation/pages/Dashboard';
import IncomePage from './presentation/pages/IncomePage';
import AdminPage from './presentation/pages/AdminPage';
import Navbar from './presentation/components/Navbar';
import Footer from './presentation/components/Footer';
import type { PageKey } from './presentation/components/Navbar';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [page, setPage] = useState<PageKey>('expense');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <p className="text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col">
      <Navbar
        active={page}
        userName={user.name}
        isAdmin={isAdmin}
        onNavigate={setPage}
        onLogout={logout}
      />
      <div className="flex-1">
        {page === 'admin' && isAdmin ? <AdminPage /> : page === 'income' ? <IncomePage /> : <Dashboard />}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
