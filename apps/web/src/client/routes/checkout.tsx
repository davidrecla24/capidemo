import { Link } from 'react-router-dom';

export function Checkout() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-amber-100">
        <Link to="/" className="text-2xl font-bold text-amber-900">Adlai</Link>
        <Link to="/offers" className="text-amber-700 hover:text-amber-900 font-medium">Back to Shop</Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h2 className="text-3xl font-bold text-amber-950 mb-8">Checkout</h2>
        <div className="rounded-xl bg-white p-8 shadow-sm border border-amber-100">
          <p className="text-amber-700">Checkout flow coming soon. Address validation, cart summary, and simulated payment will be implemented here.</p>
        </div>
      </main>
    </div>
  );
}
