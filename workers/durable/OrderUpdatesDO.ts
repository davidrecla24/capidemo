import { DurableObject } from "cloudflare:workers";

export class OrderUpdatesDO extends DurableObject {
  private subscribers: Set<WritableStreamDefaultWriter> = new Set();

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/subscribe") {
      return this.handleSubscribe();
    }

    if (url.pathname === "/broadcast" && request.method === "POST") {
      const data = await request.json() as Record<string, unknown>;
      await this.broadcast(data);
      return new Response("OK");
    }

    return new Response("Not Found", { status: 404 });
  }

  private handleSubscribe(): Response {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    this.subscribers.add(writer);

    const encoder = new TextEncoder();
    writer.write(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

    // Clean up when client disconnects
    const cleanup = () => {
      this.subscribers.delete(writer);
      try { writer.close(); } catch {}
    };

    // Heartbeat to detect disconnects
    const interval = setInterval(async () => {
      try {
        await writer.write(encoder.encode(": heartbeat\n\n"));
      } catch {
        cleanup();
        clearInterval(interval);
      }
    }, 30000);

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  private async broadcast(data: Record<string, unknown>): Promise<void> {
    const encoder = new TextEncoder();
    const message = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);

    const deadWriters: WritableStreamDefaultWriter[] = [];

    for (const writer of this.subscribers) {
      try {
        await writer.write(message);
      } catch {
        deadWriters.push(writer);
      }
    }

    for (const writer of deadWriters) {
      this.subscribers.delete(writer);
      try { writer.close(); } catch {}
    }
  }
}
