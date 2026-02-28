import { Hono } from "hono";
import { authMiddleware, adminMiddleware } from "../api/middleware";
import type { Env } from "../../env.d.ts";

type GmailEnv = {
  Bindings: Env;
  Variables: { userId: string; userRole: string };
};

const mcpGmail = new Hono<GmailEnv>();

mcpGmail.use("*", authMiddleware, adminMiddleware);

// MCP tool: draftOrderUpdateEmail
mcpGmail.post("/tools/draftOrderUpdateEmail", async (c) => {
  const { orderId, tone } = await c.req.json() as { orderId: string; tone?: string };

  const toneText = tone || "professional";
  const subject = `Order ${orderId} — Status Update`;
  const body = `Dear Customer,

We're writing to let you know about an update to your order ${orderId}.

[Status details will be filled based on the order]

Thank you for choosing CapiDemo.

Best regards,
CapiDemo Team`;

  return c.json({
    result: { subject, body, tone: toneText },
  });
});

// MCP tool: sendOrderUpdateEmail
mcpGmail.post("/tools/sendOrderUpdateEmail", async (c) => {
  const adminId = c.get("userId");
  const { orderId, toEmail, subject, body } = await c.req.json() as {
    orderId: string; toEmail: string; subject: string; body: string;
  };

  // Get OAuth token from KV
  const tokenData = await c.env.OAUTH_KV.get(`gmail:${adminId}`, "json") as {
    access_token?: string; refresh_token?: string;
  } | null;

  if (!tokenData?.access_token) {
    return c.json({
      error: "Gmail not authorized. Please complete OAuth flow first.",
      authUrl: buildAuthUrl(c.env.GOOGLE_CLIENT_ID),
    }, 401);
  }

  try {
    const rawEmail = [
      `To: ${toEmail}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      "",
      body,
    ].join("\r\n");

    const encodedEmail = btoa(rawEmail).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodedEmail }),
    });

    if (!response.ok) {
      const err = await response.text();
      return c.json({ error: `Gmail API error: ${err}` }, 500);
    }

    const result = await response.json();
    return c.json({ result: { messageId: (result as { id: string }).id, orderId, toEmail } });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: errMsg }, 500);
  }
});

// OAuth callback handler
mcpGmail.get("/oauth/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.json({ error: "Missing code" }, 400);

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${new URL(c.req.url).origin}/mcp/gmail/oauth/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return c.json({ error: "Token exchange failed" }, 500);
  }

  const tokens = await tokenResponse.json();
  const adminId = c.get("userId");
  await c.env.OAUTH_KV.put(`gmail:${adminId}`, JSON.stringify(tokens), { expirationTtl: 86400 * 30 });

  return c.json({ success: true, message: "Gmail connected successfully" });
});

function buildAuthUrl(clientId: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: "https://capidemo.com/mcp/gmail/oauth/callback",
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/auth?${params}`;
}

export default mcpGmail;
