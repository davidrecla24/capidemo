import { DurableObject } from 'cloudflare:workers';

export type OrderStatus = 'pending' | 'pending_payment' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['pending_payment', 'cancelled'],
  pending_payment: ['paid', 'cancelled'],
  paid: ['fulfilled', 'cancelled'],
  fulfilled: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export class OrderCoordinator extends DurableObject<Env> {
  private status: OrderStatus = 'pending';

  async getStatus(): Promise<OrderStatus> {
    const stored = await this.ctx.storage.get<OrderStatus>('status');
    if (stored) this.status = stored;
    return this.status;
  }

  async transition(newStatus: OrderStatus): Promise<{ ok: boolean; status: OrderStatus; error?: string }> {
    const current = await this.getStatus();
    const allowed = VALID_TRANSITIONS[current];

    if (!allowed.includes(newStatus)) {
      return { ok: false, status: current, error: `Cannot transition from ${current} to ${newStatus}` };
    }

    this.status = newStatus;
    await this.ctx.storage.put('status', newStatus);
    await this.ctx.storage.put('updatedAt', new Date().toISOString());

    return { ok: true, status: newStatus };
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/status') {
      const status = await this.getStatus();
      return Response.json({ status });
    }

    if (request.method === 'POST' && url.pathname === '/transition') {
      const body = await request.json<{ status: OrderStatus }>();
      const result = await this.transition(body.status);
      return Response.json(result, { status: result.ok ? 200 : 400 });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  }
}
