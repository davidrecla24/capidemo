import { Link, useParams } from 'react-router-dom';
import { Package } from 'lucide-react';

export function OrderTracking() {
  const { orderNumber, trackingCode } = useParams();

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-amber-100">
        <Link to="/" className="text-2xl font-bold text-amber-900">Adlai</Link>
        <Link to="/account" className="text-amber-700 hover:text-amber-900 font-medium">Account</Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-amber-600" />
          <h2 className="text-3xl font-bold text-amber-950">Order Tracking</h2>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm border border-amber-100">
          <p className="text-amber-700">
            {orderNumber
              ? `Tracking order: ${orderNumber}`
              : trackingCode
                ? `Tracking code: ${trackingCode}`
                : 'No tracking info provided.'}
          </p>
          <p className="text-amber-500 mt-4 text-sm">Order timeline and status updates will appear here.</p>
        </div>
      </main>
    </div>
  );
}
