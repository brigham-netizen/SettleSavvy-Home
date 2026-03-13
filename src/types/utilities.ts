export type UtilityCategory = 'electricity' | 'gas' | 'water' | 'sewer' | 'trash' | 'internet';

export type ConfidenceLevel = 'confirmed' | 'estimated';

export interface UtilityProvider {
  category: UtilityCategory;
  name: string;
  estimatedMonthlyCost: number | null;
  costUnit: string; // e.g. "$/month", "$/kWh"
  confidence: ConfidenceLevel;
  serviceStartUrl: string | null;
  notes?: string;
}

export interface PriceTrend {
  month: string; // "YYYY-MM"
  averageCost: number;
}

export interface UtilityReport {
  address: {
    formatted: string;
    city: string;
    county: string;
    state: string;
    zip: string;
  };
  providers: UtilityProvider[];
  electricityTrend: PriceTrend[];
  gasTrend: PriceTrend[];
  uspsChangeAddressUrl: string;
  dmvUpdateUrl: string | null;
  generatedAt: string; // ISO timestamp
}
