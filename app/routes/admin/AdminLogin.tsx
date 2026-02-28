import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <Link to="/" className="text-2xl font-bold text-primary block text-center mb-2">CapiDemo</Link>
        <p className="text-center text-muted-foreground text-sm mb-8">Admin Dashboard</p>
        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Signing in..." : "Admin Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
