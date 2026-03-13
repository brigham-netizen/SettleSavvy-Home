import { UtilityProvider } from '@/types/utilities';

export async function getInternetProviders(lat: number, lng: number): Promise<UtilityProvider[]> {
  // FCC Broadband Map API v1
  const url = `https://broadbandmap.fcc.gov/api/public/map/listAvailability?latitude=${lat}&longitude=${lng}&unit_id=&category=Fixed+Broadband`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json();
    const providers: UtilityProvider[] = (json.results ?? []).slice(0, 3).map((p: { provider_name?: string; brand_name?: string }) => ({
      category: 'internet' as const,
      name: p.brand_name ?? p.provider_name ?? 'Unknown ISP',
      estimatedMonthlyCost: null, // pricing not in FCC dataset
      costUnit: '$/month',
      confidence: 'confirmed' as const,
      serviceStartUrl: null,
    }));
    return providers;
  } catch {
    return [];
  }
}
