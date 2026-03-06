import { Hono } from 'hono';

const app = new Hono();

// MCP Admin server — placeholder tools with typed contracts
app.get('/mcp/admin', (c) => {
  return c.json({
    name: 'adlai-mcp-admin',
    version: '0.1.0',
    tools: [
      { name: 'inventory.get', description: 'Get inventory for a SKU' },
      { name: 'inventory.adjust', description: 'Adjust inventory quantity' },
      { name: 'order.get', description: 'Get order details' },
      { name: 'order.updateStatus', description: 'Update order status' },
      { name: 'accounting.recordNote', description: 'Record accounting note' },
      { name: 'customer.get', description: 'Get customer details' },
      { name: 'customer.update', description: 'Update customer details' },
    ],
  });
});

app.post('/mcp/admin/tool/:toolName', async (c) => {
  const toolName = c.req.param('toolName');
  // TODO: Route to actual tool implementations
  return c.json({ tool: toolName, result: 'Not implemented yet' }, 501);
});

export default app;
