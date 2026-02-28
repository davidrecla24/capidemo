import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { Package, Users, DollarSign, BarChart3, LogOut } from "lucide-react";

interface Order {
  id: string;
  userId: string;
  planId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function AdminNav() {
  const { logout } = useAuth();
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/admin/orders" className="text-lg font-bold">CapiDemo Admin</Link>
        <Link to="/admin/orders" className="flex items-center gap-1 text-sm hover:text-blue-300"><Package className="w-4 h-4" /> Orders</Link>
        <Link to="/admin/inventory" className="flex items-center gap-1 text-sm hover:text-blue-300"><BarChart3 className="w-4 h-4" /> Inventory</Link>
        <Link to="/admin/accounting" className="flex items-center gap-1 text-sm hover:text-blue-300"><DollarSign className="w-4 h-4" /> Accounting</Link>
        <Link to="/admin/customers" className="flex items-center gap-1 text-sm hover:text-blue-300"><Users className="w-4 h-4" /> Customers</Link>
      </div>
      <button onClick={logout} className="flex items-center gap-1 text-sm hover:text-red-300"><LogOut className="w-4 h-4" /> Logout</button>
    </nav>
  );
}

export { AdminNav };

export default function AdminOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api.get<Order[]>("/admin/orders"),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium">User ID</th>
                  <th className="text-left px-4 py-3 font-medium">Plan</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 12)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{order.userId.slice(0, 12)}</td>
                    <td className="px-4 py-3">{order.planId}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders/${order.id}`} className="text-primary hover:underline text-xs font-medium">View</Link>
                    </td>
                  </tr>
                ))}
                {!orders?.length && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
