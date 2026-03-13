export interface WattBuyUtility {
  name: string;
  phone: string | null;
  website: string | null;
}

export async function getElectricityProvider(lat: number, lng: number): Promise<WattBuyUtility | null> {
  const apiKey = process.env.WATTBUY_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL('https://api.wattbuy.com/v2/electricity-info');
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lng', lng.toString());

    const res = await fetch(url.toString(), {
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const json = await res.json();

    // WattBuy returns utility info nested under `utility` or at root
    const u = json.utility ?? json;

    return {
      name: u.utility_name ?? u.name ?? null,
      phone: u.phone ?? u.contact_phone ?? null,
      website: u.website ?? u.url ?? u.web_address ?? null,
    };
  } catch {
    return null;
  }
}
