import { PriceTrend } from '@/types/utilities';

const EIA_BASE = 'https://api.eia.gov/v2';

export async function getElectricityTrend(stateCode: string): Promise<PriceTrend[]> {
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) return [];

  const url = `${EIA_BASE}/electricity/retail-sales/data/?api_key=${apiKey}&frequency=monthly&data[0]=price&facets[stateid][]=${stateCode}&sort[0][column]=period&sort[0][direction]=desc&length=12`;

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

  const url = `${EIA_BASE}/natural-gas/pri/sum/data/?api_key=${apiKey}&frequency=monthly&data[0]=value&facets[duoarea][]=${stateCode}&sort[0][column]=period&sort[0][direction]=desc&length=12`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const json = await res.json();
    return (json.response?.data ?? []).map((d: { period: string; value: string }) => ({
      month: d.period,
      averageCost: parseFloat(d.value),
    }));
  } catch {
    return [];
  }
}
