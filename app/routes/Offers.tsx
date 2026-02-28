import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Check } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  speedMbps: number;
  priceMonthly: number;
  promoText: string | null;
  isActive: boolean;
}

export default function Offers() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get<Plan[]>("/plans"),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur shadow-sm">
        <Link to="/" className="text-2xl font-bold text-primary">CapiDemo</Link>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-sm font-medium hover:text-primary">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
        <p className="text-center text-muted-foreground mb-12">No lock-in contracts. Cancel anytime.</p>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading plans...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans?.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition border">
                {plan.promoText && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                    {plan.promoText}
                  </span>
                )}
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-muted-foreground mb-4">{plan.speedMbps} Mbps</p>
                <div className="text-4xl font-bold mb-1">
                  ₱{plan.priceMonthly.toLocaleString()}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </div>
                <ul className="my-6 space-y-2">
                  {["Unlimited data", "Free installation", "Free router", "24/7 support"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/checkout/${plan.id}`}
                  className="block w-full text-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
