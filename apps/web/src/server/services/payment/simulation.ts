import { nanoid } from 'nanoid';
import type {
  PaymentProvider,
  CreatePaymentIntentInput,
  CreatePaymentIntentResult,
  ConfirmPaymentInput,
  ConfirmPaymentResult,
  RefundPaymentInput,
  RefundPaymentResult,
} from './types';

export class SimulationPaymentProvider implements PaymentProvider {
  async createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult> {
    return {
      intentId: `sim_${nanoid(16)}`,
      status: 'pending',
    };
  }

  async confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmPaymentResult> {
    return {
      status: 'succeeded',
      providerRef: `sim_pay_${nanoid(16)}`,
      paidAt: new Date().toISOString(),
    };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return {
      status: 'refunded',
      refundRef: `sim_ref_${nanoid(16)}`,
    };
  }
}
