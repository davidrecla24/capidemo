import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import Landing from "./routes/Landing";
import Offers from "./routes/Offers";
import Checkout from "./routes/Checkout";
import Account from "./routes/Account";
import OrderTracking from "./routes/OrderTracking";
import Login from "./routes/Login";
import Register from "./routes/Register";
import AdminLogin from "./routes/admin/AdminLogin";
import AdminOrders from "./routes/admin/AdminOrders";
import AdminOrderDetail from "./routes/admin/AdminOrderDetail";
import AdminInventory from "./routes/admin/AdminInventory";
import AdminAccounting from "./routes/admin/AdminAccounting";
import AdminCustomers from "./routes/admin/AdminCustomers";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Customer routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/checkout/:planId" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders/:orderId" element={<OrderTracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:orderId" element={<AdminOrderDetail />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/accounting" element={<AdminAccounting />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
      </Routes>
    </AuthProvider>
  );
}
