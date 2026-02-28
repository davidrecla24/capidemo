import { Link } from "react-router-dom";
import { Wifi, Shield, Zap, MessageCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur shadow-sm">
        <Link to="/" className="text-2xl font-bold text-primary">CapiDemo</Link>
        <div className="flex gap-4 items-center">
          <Link to="/offers" className="text-sm font-medium hover:text-primary">Plans</Link>
          <Link to="/login" className="text-sm font-medium hover:text-primary">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
          Fast, Reliable Internet <br className="hidden md:block" />
          <span className="text-primary">For Everyone</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Experience blazing-fast fiber internet with plans starting at just ₱999/month. 
          No lock-in contracts, no hidden fees.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/offers" className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition">
            View Plans
          </Link>
          <Link to="/register" className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold text-lg hover:bg-primary/5 transition">
            Sign Up
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-24 grid md:grid-cols-4 gap-8">
        {[
          { icon: Zap, title: "Blazing Fast", desc: "Up to 1 Gbps symmetric speeds" },
          { icon: Shield, title: "Secure", desc: "Enterprise-grade network security" },
          { icon: Wifi, title: "Reliable", desc: "99.9% uptime guarantee" },
          { icon: MessageCircle, title: "24/7 Support", desc: "AI-powered chat + human agents" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <Icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CapiDemo. All rights reserved.
      </footer>
    </div>
  );
}
