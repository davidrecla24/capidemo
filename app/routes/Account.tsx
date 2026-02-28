import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";

interface Order {
  id: string;
  planId: string;
  status: string;
  createdAt: string;
}

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: orders } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get<Order[]>("/orders"),
    enabled: !!user,
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur shadow-sm">
        <Link to="/" className="text-2xl font-bold text-primary">CapiDemo</Link>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <button onClick={logout} className="text-sm text-destructive hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">My Orders</h2>
          {!orders?.length ? (
            <p className="text-muted-foreground">No orders yet. <Link to="/offers" className="text-primary">Browse plans</Link></p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                    {order.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
