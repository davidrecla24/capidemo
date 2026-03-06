export interface CustomerGetInput {
  userId: string;
}

export interface CustomerUpdateInput {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// TODO: Implement actual D1-backed customer operations
export async function customerGet(_input: CustomerGetInput) {
  return { message: 'Not implemented' };
}

export async function customerUpdate(_input: CustomerUpdateInput) {
  return { message: 'Not implemented' };
}
