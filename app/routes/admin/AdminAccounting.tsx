import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { AdminNav } from "./AdminOrders";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  createdAt: string;
}

export default function AdminAccounting() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-accounting"],
    queryFn: () => api.get<Payment[]>("/admin/accounting"),
  });

  const total = payments?.filter((p) => p.status === "success").reduce((sum, p) => sum + p.amount, 0) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Accounting</h1>
          <div className="bg-white rounded-xl shadow-sm px-6 py-3">
            <span className="text-sm text-muted-foreground">Total Revenue: </span>
            <span className="text-xl font-bold text-green-600">₱{total.toLocaleString()}</span>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Payment ID</th>
                  <th className="text-left px-4 py-3 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Currency</th>
                  <th className="text-left px-4 py-3 font-medium">Method</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{payment.id.slice(0, 12)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{payment.orderId.slice(0, 12)}</td>
                    <td className="px-4 py-3 font-semibold">₱{payment.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{payment.currency}</td>
                    <td className="px-4 py-3">{payment.method}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "success" ? "bg-green-100 text-green-700" :
                        payment.status === "failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}>{payment.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!payments?.length && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No payments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
