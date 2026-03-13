export interface GeocodedAddress {
  formatted: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<GeocodedAddress> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY is not set');

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' || !data.results[0]) {
    throw new Error(`Geocoding failed: ${data.status}`);
  }

  const result = data.results[0];
  const components = result.address_components as Array<{ long_name: string; short_name: string; types: string[] }>;

  const get = (type: string) => components.find(c => c.types.includes(type))?.long_name ?? '';
  const getShort = (type: string) => components.find(c => c.types.includes(type))?.short_name ?? '';

  return {
    formatted: result.formatted_address,
    city: get('locality') || get('sublocality'),
    county: get('administrative_area_level_2'),
    state: getShort('administrative_area_level_1'),
    zip: get('postal_code'),
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  };
}
