import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { AdminNav } from "./AdminOrders";

interface OrderEvent {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
  createdBy: string | null;
}

interface OrderDetail {
  id: string;
  userId: string;
  planId: string;
  addressId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  events: OrderEvent[];
}

const statuses = ["draft", "submitted", "paid", "provisioning", "shipped", "installed", "complete", "cancelled"];

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  const { data: order } = useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => api.get<OrderDetail>(`/admin/orders?id=${orderId}`),
    enabled: !!orderId,
  });

  const mutation = useMutation({
    mutationFn: (data: { status: string; note?: string }) =>
      api.post(`/admin/orders/${orderId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", orderId] });
      setNewStatus("");
      setNote("");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold mb-2">Order Detail</h1>
        <p className="text-muted-foreground mb-6 font-mono text-sm">{orderId}</p>

        {order && (
          <div className="grid gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold mb-3">Info</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Status:</strong> <span className="capitalize">{order.status}</span></div>
                <div><strong>Plan:</strong> {order.planId}</div>
                <div><strong>User:</strong> <span className="font-mono text-xs">{order.userId}</span></div>
                <div><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold mb-3">Update Status</h2>
              <div className="flex gap-3">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm flex-1">
                  <option value="">Select status...</option>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="text" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm flex-1" />
                <button onClick={() => newStatus && mutation.mutate({ status: newStatus, note: note || undefined })}
                  disabled={!newStatus || mutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                  Update
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold mb-3">Events</h2>
              <div className="space-y-2">
                {order.events?.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 border-l-4 border-primary/20 text-sm">
                    <div>
                      <span className="font-semibold capitalize">{event.status}</span>
                      {event.note && <span className="text-muted-foreground ml-2">— {event.note}</span>}
                      <p className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
