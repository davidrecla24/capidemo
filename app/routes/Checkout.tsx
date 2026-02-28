import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";

export default function Checkout() {
  const { planId } = useParams<{ planId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ line1: "", line2: "", city: "", province: "", postalCode: "", country: "PH" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"address" | "payment" | "done">("address");
  const [orderId, setOrderId] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="mb-4">Please sign in to continue</p>
          <Link to="/login" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ id: string }>("/orders", { planId, address: form });
      setOrderId(res.id);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (outcome: "success" | "fail") => {
    setError("");
    setLoading(true);
    try {
      await api.post("/payments/simulate", { orderId, outcome });
      if (outcome === "success") {
        setStep("done");
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur shadow-sm">
        <Link to="/" className="text-2xl font-bold text-primary">CapiDemo</Link>
      </nav>

      <div className="max-w-lg mx-auto px-8 py-16">
        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">{error}</div>}

        {step === "address" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-6">Service Address</h1>
            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                <input type="text" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                <input type="text" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Province</label>
                  <input type="text" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input type="text" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? "Processing..." : "Continue to Payment"}
              </button>
            </form>
          </div>
        )}

        {step === "payment" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Payment (Simulated)</h1>
            <p className="text-muted-foreground mb-8">Order #{orderId.slice(0, 8)}</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => handlePayment("success")} disabled={loading}
                className="px-8 py-3 rounded-lg bg-green-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50">
                Pay (Success)
              </button>
              <button onClick={() => handlePayment("fail")} disabled={loading}
                className="px-8 py-3 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:opacity-90 transition disabled:opacity-50">
                Pay (Fail)
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">Your order has been placed.</p>
            <Link to={`/orders/${orderId}`}
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
              Track Order
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
