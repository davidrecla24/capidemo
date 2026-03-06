// Gmail send adapter — mocked for MVP
export interface SendMailInput {
  to: string;
  subject: string;
  body: string;
}

export interface SendMailResult {
  messageId: string;
  status: 'sent' | 'mocked';
}

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  // TODO: Implement actual Gmail API send when OAuth is configured
  console.log(`[MOCKED] Sending email to ${input.to}: ${input.subject}`);
  return {
    messageId: `mock_${Date.now()}`,
    status: 'mocked',
  };
}
