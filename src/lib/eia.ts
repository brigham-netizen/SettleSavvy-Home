import { PriceTrend } from '@/types/utilities';

const EIA_BASE = 'https://api.eia.gov/v2';

export async function getElectricityTrend(stateCode: string): Promise<PriceTrend[]> {
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) return [];

  // sectorid=RES filters to residential customers only (avoids duplicate rows per sector)
  const url = `${EIA_BASE}/electricity/retail-sales/data/?api_key=${apiKey}&frequency=monthly&data[0]=price&facets[stateid][]=${stateCode}&facets[sectorid][]=RES&sort[0][column]=period&sort[0][direction]=desc&length=12`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const json = await res.json();
    return (json.response?.data ?? []).map((d: { period: string; price: string }) => ({
      month: d.period,
      averageCost: parseFloat(d.price),
    }));
  } catch {
    return [];
  }
}

export async function getGasTrend(stateCode: string): Promise<PriceTrend[]> {
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) return [];

  // EIA gas duoarea codes are prefixed with 'S'. Fetch more rows to cover multiple series, then deduplicate.
  const url = `${EIA_BASE}/natural-gas/pri/sum/data/?api_key=${apiKey}&frequency=monthly&data[0]=value&facets[duoarea][]=S${stateCode}&sort[0][column]=period&sort[0][direction]=desc&length=60`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const json = await res.json();
    const rows: Array<{ period: string; value: string }> = json.response?.data ?? [];

    // Deduplicate by month — keep the first non-null value per month (up to 12)
    const seen = new Map<string, number>();
    for (const d of rows) {
      if (seen.has(d.period)) continue;
      const val = parseFloat(d.value);
      if (!isNaN(val) && val > 0 && val < 50) seen.set(d.period, val); // >50 $/mcf = EIA placeholder
      if (seen.size === 12) break;
    }

    return Array.from(seen.entries()).map(([month, averageCost]) => ({ month, averageCost }));
  } catch {
    return [];
  }
}
