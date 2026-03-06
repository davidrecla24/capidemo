export const ORDER_STATUSES = [
  'pending',
  'pending_payment',
  'paid',
  'fulfilled',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'] as const;

export const SKU_WEIGHTS = [1, 3, 9, 27] as const;

export const DEFAULT_CURRENCY = 'PHP';

export const SESSION_COOKIE_NAME = 'session';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days
