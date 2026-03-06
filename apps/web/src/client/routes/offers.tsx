import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const SKUS = [
  { code: 'ADLAI-1KG', label: '1 kg', weightKg: 1, priceMinor: 29900 },
  { code: 'ADLAI-3KG', label: '3 kg', weightKg: 3, priceMinor: 79900 },
  { code: 'ADLAI-9KG', label: '9 kg', weightKg: 9, priceMinor: 219900 },
  { code: 'ADLAI-27KG', label: '27 kg', weightKg: 27, priceMinor: 599900 },
];

export function Offers() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-amber-100">
        <Link to="/" className="text-2xl font-bold text-amber-900">Adlai</Link>
        <Link to="/account" className="text-amber-700 hover:text-amber-900 font-medium">Account</Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="text-3xl font-bold text-amber-950 mb-8">Choose Your Pack</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKUS.map((sku) => (
            <div
              key={sku.code}
              className="rounded-xl bg-white p-6 shadow-sm border border-amber-100 flex flex-col items-center"
            >
              <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-amber-700">{sku.label}</span>
              </div>
              <p className="text-2xl font-bold text-amber-950 mb-1">
                {formatCurrency(sku.priceMinor)}
              </p>
              <p className="text-sm text-amber-600 mb-4">
                {formatCurrency(Math.round(sku.priceMinor / sku.weightKg))}/kg
              </p>
              <Link
                to={`/checkout?sku=${sku.code}`}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors w-full justify-center"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
