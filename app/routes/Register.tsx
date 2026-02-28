import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      navigate("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <Link to="/" className="text-2xl font-bold text-primary block text-center mb-8">CapiDemo</Link>
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
