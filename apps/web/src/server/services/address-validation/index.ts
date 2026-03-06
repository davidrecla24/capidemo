export interface AddressInput {
  line1: string;
  line2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
}

export interface ValidatedAddress extends AddressInput {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
  isValidated: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export async function validateAddress(
  input: AddressInput,
  apiKey: string,
): Promise<ValidatedAddress> {
  const addressLines = [input.line1, input.line2].filter(Boolean).join(', ');
  const fullAddress = `${addressLines}, ${input.city}, ${input.stateProvince} ${input.postalCode}, ${input.countryCode}`;

  const response = await fetch(
    'https://addressvalidation.googleapis.com/v1:validateAddress',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
      },
      body: JSON.stringify({
        address: {
          addressLines: [addressLines],
          locality: input.city,
          administrativeArea: input.stateProvince,
          postalCode: input.postalCode,
          regionCode: input.countryCode,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Address validation failed: ${response.statusText}`);
  }

  const data = await response.json() as Record<string, unknown>;
  const result = data.result as Record<string, unknown> | undefined;
  const geocode = result?.geocode as Record<string, unknown> | undefined;
  const location = geocode?.location as Record<string, number> | undefined;
  const verdict = result?.verdict as Record<string, unknown> | undefined;

  return {
    ...input,
    formattedAddress: (result?.address as Record<string, unknown>)?.formattedAddress as string ?? fullAddress,
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
    placeId: (geocode?.placeId as string) ?? '',
    isValidated: true,
    confidence: mapConfidence(verdict?.validationGranularity as string),
  };
}

function mapConfidence(granularity?: string): 'HIGH' | 'MEDIUM' | 'LOW' {
  switch (granularity) {
    case 'SUB_PREMISE':
    case 'PREMISE':
      return 'HIGH';
    case 'BLOCK':
    case 'ROUTE':
      return 'MEDIUM';
    default:
      return 'LOW';
  }
}
