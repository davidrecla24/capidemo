import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import authRouter from "./workers/api/auth";
import plansRouter from "./workers/api/plans";
import ordersRouter from "./workers/api/orders";
import paymentsRouter from "./workers/api/payments";
import addressRouter from "./workers/api/address";
import adminRouter from "./workers/api/admin";
import chatRouter from "./workers/api/chat";
import mcpAdmin from "./workers/mcp/admin";
import mcpGmail from "./workers/mcp/gmail";
import type { Env } from "./env.d.ts";

export { ChatSessionDO } from "./workers/durable/ChatSessionDO";
export { OrderUpdatesDO } from "./workers/durable/OrderUpdatesDO";

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use("*", cors());
app.use("*", secureHeaders());

// Security headers
app.use("*", async (c, next) => {
  await next();
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  c.res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
});

// www → apex redirect
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname === "www.capidemo.com") {
    url.hostname = "capidemo.com";
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// API routes
app.route("/api/auth", authRouter);
app.route("/api/plans", plansRouter);
app.route("/api/orders", ordersRouter);
app.route("/api/payments", paymentsRouter);
app.route("/api/address", addressRouter);
app.route("/api/admin", adminRouter);
app.route("/api/chat", chatRouter);

// MCP routes
app.route("/mcp/admin", mcpAdmin);
app.route("/mcp/gmail", mcpGmail);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

export default app;
