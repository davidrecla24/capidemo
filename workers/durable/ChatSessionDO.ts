import { DurableObject } from "cloudflare:workers";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class ChatSessionDO extends DurableObject {
  private messages: ChatMessage[] = [];

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/message" && request.method === "POST") {
      return this.handleMessage(request);
    }

    if (url.pathname === "/history") {
      return new Response(JSON.stringify(this.messages), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  }

  private async handleMessage(request: Request): Promise<Response> {
    const { message, env } = await request.json() as { message: string; env?: { AI?: Ai } };

    this.messages.push({ role: "user", content: message });

    const systemPrompt: ChatMessage = {
      role: "system",
      content: `You are a helpful customer support assistant for CapiDemo, an internet service provider. 
You can help customers with:
- Information about available plans and pricing
- Order status inquiries
- Address and service area questions
- General account questions
Be friendly, concise, and helpful.`,
    };

    const aiMessages = [systemPrompt, ...this.messages.slice(-20)];

    try {
      // Use Workers AI binding passed through request
      if (env?.AI) {
        const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: aiMessages,
          stream: true,
        });

        this.messages.push({ role: "assistant", content: "[streaming response]" });

        return new Response(response as ReadableStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      }

      // Fallback: stub response
      const stubResponse = "I'm the CapiDemo assistant. I can help you with plans, orders, and account questions. How can I help you today?";
      this.messages.push({ role: "assistant", content: stubResponse });

      return new Response(JSON.stringify({ response: stubResponse }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
