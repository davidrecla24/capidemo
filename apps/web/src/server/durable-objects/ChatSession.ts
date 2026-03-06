import { DurableObject } from 'cloudflare:workers';

export class ChatSession extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/messages') {
      const messages = (await this.ctx.storage.get<unknown[]>('messages')) ?? [];
      return Response.json({ messages });
    }

    if (request.method === 'POST' && url.pathname === '/message') {
      const body = await request.json<{ role: string; content: string }>();
      const messages = (await this.ctx.storage.get<unknown[]>('messages')) ?? [];
      const newMessage = {
        id: crypto.randomUUID(),
        role: body.role,
        content: body.content,
        createdAt: new Date().toISOString(),
      };
      messages.push(newMessage);
      await this.ctx.storage.put('messages', messages);
      return Response.json(newMessage, { status: 201 });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  }
}
