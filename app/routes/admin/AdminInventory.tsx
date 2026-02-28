import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { AdminNav } from "./AdminOrders";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  qtyAvailable: number;
  qtyReserved: number;
  location: string | null;
  updatedAt: string;
}

export default function AdminInventory() {
  const queryClient = useQueryClient();
  const [sku, setSku] = useState("");
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: () => api.get<InventoryItem[]>("/admin/inventory"),
  });

  const mutation = useMutation({
    mutationFn: (data: { sku: string; delta: number; reason: string }) =>
      api.post("/admin/inventory/adjust", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      setSku("");
      setDelta(0);
      setReason("");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Inventory</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold mb-3">Adjust Stock</h2>
          <div className="flex gap-3">
            <input type="text" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm flex-1" />
            <input type="number" placeholder="Delta (+/-)" value={delta} onChange={(e) => setDelta(parseInt(e.target.value) || 0)}
              className="border rounded-lg px-3 py-2 text-sm w-28" />
            <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm flex-1" />
            <button onClick={() => sku && reason && mutation.mutate({ sku, delta, reason })}
              disabled={!sku || !reason || mutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
              Adjust
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">SKU</th>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Available</th>
                  <th className="text-left px-4 py-3 font-medium">Reserved</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 font-semibold">{item.qtyAvailable}</td>
                    <td className="px-4 py-3">{item.qtyReserved}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.location ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(item.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!items?.length && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No inventory items</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
