export interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: Array<{ label: string; quantity: number; priceFormatted: string }>;
  totalFormatted: string;
}

export function draftOrderConfirmationEmail(data: OrderEmailData): { subject: string; body: string } {
  const itemLines = data.items
    .map((i) => `  - ${i.label} x${i.quantity} — ${i.priceFormatted}`)
    .join('\n');

  return {
    subject: `Order Confirmation — ${data.orderNumber}`,
    body: `Hi ${data.customerName},\n\nThank you for your order!\n\nOrder: ${data.orderNumber}\n\nItems:\n${itemLines}\n\nTotal: ${data.totalFormatted}\n\nWe'll notify you when your order ships.\n\nBest,\nAdlai Team`,
  };
}
