export interface AddressInput {
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface ValidationResult {
  valid: boolean;
  normalized: AddressInput;
  metadata: Record<string, unknown>;
}

export interface AddressValidationProvider {
  validate(address: AddressInput): Promise<ValidationResult>;
}

export class StubProvider implements AddressValidationProvider {
  async validate(address: AddressInput): Promise<ValidationResult> {
    const normalized: AddressInput = {
      line1: address.line1.trim(),
      line2: address.line2?.trim(),
      city: address.city.trim(),
      province: address.province.trim(),
      postalCode: address.postalCode.trim().toUpperCase(),
      country: address.country.trim().toUpperCase(),
    };

    const valid = !!(normalized.line1 && normalized.city && normalized.province && normalized.postalCode);

    return {
      valid,
      normalized,
      metadata: { provider: "stub", timestamp: new Date().toISOString() },
    };
  }
}
