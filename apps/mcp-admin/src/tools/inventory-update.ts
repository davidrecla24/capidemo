export interface InventoryGetInput {
  skuId: string;
}

export interface InventoryAdjustInput {
  skuId: string;
  delta: number;
  note?: string;
}

// TODO: Implement actual D1-backed inventory operations
export async function inventoryGet(_input: InventoryGetInput) {
  return { message: 'Not implemented' };
}

export async function inventoryAdjust(_input: InventoryAdjustInput) {
  return { message: 'Not implemented' };
}
