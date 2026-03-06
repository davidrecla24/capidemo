export interface RecordNoteInput {
  orderId?: string;
  entryType: string;
  amountMinor: number;
  notes?: string;
}

// TODO: Implement actual D1-backed accounting operations
export async function accountingRecordNote(_input: RecordNoteInput) {
  return { message: 'Not implemented' };
}
