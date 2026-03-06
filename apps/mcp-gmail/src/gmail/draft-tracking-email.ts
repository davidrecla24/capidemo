export interface TrackingEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingCode: string;
  status: string;
}

export function draftTrackingUpdateEmail(data: TrackingEmailData): { subject: string; body: string } {
  return {
    subject: `Shipping Update — ${data.orderNumber}`,
    body: `Hi ${data.customerName},\n\nYour order ${data.orderNumber} has been updated.\n\nStatus: ${data.status}\nTracking Code: ${data.trackingCode}\n\nTrack your order at: https://capidemo.com/track/${data.trackingCode}\n\nBest,\nAdlai Team`,
  };
}
