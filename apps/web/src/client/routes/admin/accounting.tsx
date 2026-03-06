import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';

export function AdminAccounting() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
        <Link to="/admin" className="text-xl font-bold">Adlai Admin</Link>
        <Link to="/" className="text-slate-300 hover:text-white text-sm">View Store</Link>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Receipt className="h-8 w-8 text-amber-600" />
          <h2 className="text-3xl font-bold text-slate-900">Accounting</h2>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
          <p className="text-slate-500">Accounting entries and payment tracking view will be implemented here.</p>
        </div>
      </main>
    </div>
  );
}
