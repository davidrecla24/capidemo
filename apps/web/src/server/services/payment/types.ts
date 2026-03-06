export interface CreatePaymentIntentInput {
  orderId: string;
  amountMinor: number;
  currency: string;
}

export interface CreatePaymentIntentResult {
  intentId: string;
  status: 'pending' | 'requires_action';
}

export interface ConfirmPaymentInput {
  intentId: string;
  orderId: string;
}

export interface ConfirmPaymentResult {
  status: 'succeeded' | 'failed';
  providerRef: string;
  paidAt: string | null;
}

export interface RefundPaymentInput {
  paymentId: string;
  amountMinor: number;
}

export interface RefundPaymentResult {
  status: 'refunded' | 'failed';
  refundRef: string;
}

export interface PaymentProvider {
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult>;
  confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmPaymentResult>;
  refundPayment?(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
