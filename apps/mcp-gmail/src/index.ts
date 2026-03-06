import { Hono } from 'hono';

const app = new Hono();

// MCP Gmail server — placeholder tools with adapter boundary
app.get('/mcp/gmail', (c) => {
  return c.json({
    name: 'adlai-mcp-gmail',
    version: '0.1.0',
    tools: [
      { name: 'gmail.draftOrderConfirmation', description: 'Draft order confirmation email' },
      { name: 'gmail.sendOrderConfirmation', description: 'Send order confirmation email' },
      { name: 'gmail.draftTrackingUpdate', description: 'Draft tracking update email' },
      { name: 'gmail.sendTrackingUpdate', description: 'Send tracking update email' },
    ],
  });
});

app.post('/mcp/gmail/tool/:toolName', async (c) => {
  const toolName = c.req.param('toolName');
  // TODO: Route to actual Gmail adapter implementations
  return c.json({ tool: toolName, result: 'Not implemented — email sending mocked' }, 501);
});

export default app;
