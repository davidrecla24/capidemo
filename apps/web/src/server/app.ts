import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { AppEnv } from './env';
import { publicRoutes } from './routes/public';
import { authRoutes } from './routes/auth';
import { productRoutes } from './routes/products';
import { checkoutRoutes } from './routes/checkout';
import { orderRoutes } from './routes/orders';
import { trackingRoutes } from './routes/tracking';
import { adminOrderRoutes } from './routes/admin.orders';
import { adminInventoryRoutes } from './routes/admin.inventory';
import { adminAccountingRoutes } from './routes/admin.accounting';
import { adminCustomerRoutes } from './routes/admin.customers';
import { aiChatRoutes } from './routes/ai.chat';

const app = new Hono<AppEnv>();

app.use('*', logger());
app.use('/api/*', cors());

// Public pages API
app.route('/api', publicRoutes);
app.route('/api/auth', authRoutes);
app.route('/api/products', productRoutes);
app.route('/api/checkout', checkoutRoutes);
app.route('/api/orders', orderRoutes);
app.route('/api/tracking', trackingRoutes);

// Admin API
app.route('/api/admin/orders', adminOrderRoutes);
app.route('/api/admin/inventory', adminInventoryRoutes);
app.route('/api/admin/accounting', adminAccountingRoutes);
app.route('/api/admin/customers', adminCustomerRoutes);

// AI chat
app.route('/api/ai', aiChatRoutes);

// Health check
app.get('/api/health', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }));

export { app };
