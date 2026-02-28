import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

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
  status: string;
  createdAt: string;
  updatedAt: string;
  events: OrderEvent[];
}

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const [liveEvents, setLiveEvents] = useState<{ type?: string; status?: string; note?: string }[]>([]);

  const { data: order, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get<OrderDetail>(`/orders/${orderId}`),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (!orderId) return;
    const es = new EventSource(`/api/orders/${orderId}/stream`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.status) {
        setLiveEvents((prev) => [...prev, data]);
        refetch();
      }
    };
    return () => es.close();
  }, [orderId, refetch]);

  const statusSteps = ["submitted", "paid", "provisioning", "shipped", "installed", "complete"];
  const currentIndex = statusSteps.indexOf(order?.status ?? "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur shadow-sm">
        <Link to="/" className="text-2xl font-bold text-primary">CapiDemo</Link>
        <Link to="/account" className="text-sm font-medium hover:text-primary">My Account</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
        <p className="text-muted-foreground mb-8">Order #{orderId?.slice(0, 8)}</p>

        {order && (
          <>
            {/* Progress bar */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex justify-between mb-2">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${i <= currentIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <span className="text-xs mt-1 capitalize">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Status History</h2>
              <div className="space-y-3">
                {order.events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 border-l-4 border-primary/20">
                    <div>
                      <span className="font-semibold capitalize">{event.status}</span>
                      {event.note && <p className="text-sm text-muted-foreground">{event.note}</p>}
                      <p className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {liveEvents.map((ev, i) => (
                  <div key={`live-${i}`} className="flex items-start gap-3 p-3 border-l-4 border-green-400 bg-green-50 rounded">
                    <div>
                      <span className="font-semibold capitalize">{ev.status} (live)</span>
                      {ev.note && <p className="text-sm text-muted-foreground">{ev.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
