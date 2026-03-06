import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export function Account() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-amber-100">
        <Link to="/" className="text-2xl font-bold text-amber-900">Adlai</Link>
        <Link to="/offers" className="text-amber-700 hover:text-amber-900 font-medium">Shop</Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <User className="h-8 w-8 text-amber-600" />
          <h2 className="text-3xl font-bold text-amber-950">Account</h2>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm border border-amber-100">
          <p className="text-amber-700 mb-4">Sign in with your email to manage your account and orders.</p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-lg border border-amber-200 px-4 py-2 text-amber-900 placeholder:text-amber-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              Send Verification Code
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
