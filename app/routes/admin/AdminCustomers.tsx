import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { AdminNav } from "./AdminOrders";

interface Customer {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminCustomers() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => api.get<Customer[]>("/admin/customers"),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Customers</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">ID</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{c.id.slice(0, 12)}</td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3 capitalize">{c.role}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!customers?.length && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
