import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Truck } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-amber-900">Adlai</h1>
        <nav className="flex gap-4">
          <Link to="/offers" className="text-amber-700 hover:text-amber-900 font-medium">
            Shop
          </Link>
          <Link to="/account" className="text-amber-700 hover:text-amber-900 font-medium">
            Account
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-amber-950 mb-6">
          Premium Adlai Grain
        </h2>
        <p className="text-xl text-amber-800 mb-10 max-w-2xl mx-auto">
          Carefully sourced Philippine adlai grain, available in 1kg, 3kg, 9kg, and 27kg packs.
          Healthy, versatile, and delicious.
        </p>
        <Link
          to="/offers"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-8 py-3 text-lg font-semibold text-white hover:bg-amber-700 transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          Shop Now
        </Link>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-amber-100">
            <ShoppingBag className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h3 className="font-semibold text-amber-900 mb-2">Easy Ordering</h3>
            <p className="text-sm text-amber-700">Pick your size, checkout in minutes.</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-amber-100">
            <MessageCircle className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h3 className="font-semibold text-amber-900 mb-2">AI Assistant</h3>
            <p className="text-sm text-amber-700">Get help choosing the right pack for you.</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-amber-100">
            <Truck className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h3 className="font-semibold text-amber-900 mb-2">Order Tracking</h3>
            <p className="text-sm text-amber-700">Track your order from warehouse to door.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
