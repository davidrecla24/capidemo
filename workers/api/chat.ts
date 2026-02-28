import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from "nanoid";
import { chatMessageSchema } from "../../shared/schemas";
import type { Env } from "../../env.d.ts";

const chatRouter = new Hono<{ Bindings: Env }>();

// POST /api/chat/stream — streaming chat via ChatSessionDO
chatRouter.post("/stream", zValidator("json", chatMessageSchema), async (c) => {
  const { message, sessionId } = c.req.valid("json");
  const sid = sessionId || nanoid();

  const doId = c.env.CHAT_SESSION_DO.idFromName(sid);
  const stub = c.env.CHAT_SESSION_DO.get(doId);

  const response = await stub.fetch(new Request("https://internal/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, env: { AI: c.env.AI } }),
  }));

  // Forward the response (SSE stream or JSON)
  const headers = new Headers(response.headers);
  headers.set("X-Session-Id", sid);

  return new Response(response.body, {
    status: response.status,
    headers,
  });
});

export default chatRouter;
