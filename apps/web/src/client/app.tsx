import { Routes, Route } from 'react-router-dom';
import { Landing } from './routes/landing';
import { Offers } from './routes/offers';
import { Checkout } from './routes/checkout';
import { Account } from './routes/account';
import { OrderTracking } from './routes/order-tracking';
import { AdminDashboard } from './routes/admin/dashboard';
import { AdminOrders } from './routes/admin/orders';
import { AdminInventory } from './routes/admin/inventory';
import { AdminAccounting } from './routes/admin/accounting';
import { AdminCustomers } from './routes/admin/customers';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/account" element={<Account />} />
      <Route path="/orders/:orderNumber" element={<OrderTracking />} />
      <Route path="/track/:trackingCode" element={<OrderTracking />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/inventory" element={<AdminInventory />} />
      <Route path="/admin/accounting" element={<AdminAccounting />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
    </Routes>
  );
}
