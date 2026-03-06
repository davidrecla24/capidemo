import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, Boxes, Receipt, Users } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
        <h1 className="text-xl font-bold">Adlai Admin</h1>
        <Link to="/" className="text-slate-300 hover:text-white text-sm">View Store</Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="h-8 w-8 text-slate-600" />
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/orders" className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:border-slate-400 transition-colors">
            <Package className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-slate-900">Orders</h3>
            <p className="text-sm text-slate-500">Manage and fulfill orders</p>
          </Link>
          <Link to="/admin/inventory" className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:border-slate-400 transition-colors">
            <Boxes className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-slate-900">Inventory</h3>
            <p className="text-sm text-slate-500">Stock levels and adjustments</p>
          </Link>
          <Link to="/admin/accounting" className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:border-slate-400 transition-colors">
            <Receipt className="h-8 w-8 text-amber-600 mb-3" />
            <h3 className="font-semibold text-slate-900">Accounting</h3>
            <p className="text-sm text-slate-500">Payments and entries</p>
          </Link>
          <Link to="/admin/customers" className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:border-slate-400 transition-colors">
            <Users className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-slate-900">Customers</h3>
            <p className="text-sm text-slate-500">Customer database</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
