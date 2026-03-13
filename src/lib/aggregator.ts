import { geocodeAddress } from './geocoding';
import { getElectricityTrend, getGasTrend } from './eia';
import { getInternetProviders } from './broadband';
import { getElectricityProvider } from './wattbuy';
import { searchUtilityProvider } from './search';
import { UtilityReport, UtilityProvider } from '@/types/utilities';

const DMV_URLS: Record<string, string> = {
  AL: 'https://www.alabamadmv.org/',
  AK: 'https://doa.alaska.gov/dmv/',
  AZ: 'https://azdot.gov/motor-vehicles',
  AR: 'https://www.dfa.arkansas.gov/driver-services/',
  CA: 'https://www.dmv.ca.gov/portal/driver-licenses-identification-cards/dl-id-online-app-edl/',
  CO: 'https://dmv.colorado.gov/',
  CT: 'https://portal.ct.gov/dmv',
  DE: 'https://www.dmv.de.gov/',
  FL: 'https://www.flhsmv.gov/driver-licenses-id-cards/',
  GA: 'https://dds.georgia.gov/',
  HI: 'https://www.honolulu.gov/csd/vehicle.html',
  ID: 'https://itd.idaho.gov/dmv/',
  IL: 'https://www.ilsos.gov/facilities/facility.html',
  IN: 'https://www.in.gov/bmv/',
  IA: 'https://iowadot.gov/mvd',
  KS: 'https://www.ksrevenue.gov/dovindex.html',
  KY: 'https://drive.ky.gov/',
  LA: 'https://www.expresslane.org/',
  ME: 'https://www.maine.gov/sos/bmv/',
  MD: 'https://mva.maryland.gov/',
  MA: 'https://www.mass.gov/orgs/registry-of-motor-vehicles',
  MI: 'https://www.michigan.gov/sos/',
  MN: 'https://dps.mn.gov/divisions/dvs/',
  MS: 'https://www.dps.state.ms.us/driver-services/',
  MO: 'https://dor.mo.gov/motor-vehicle/',
  MT: 'https://dojmt.gov/driving/',
  NE: 'https://dmv.nebraska.gov/',
  NV: 'https://dmv.nv.gov/',
  NH: 'https://www.nh.gov/safety/divisions/dmv/',
  NJ: 'https://www.nj.gov/mvc/',
  NM: 'https://www.mvd.newmexico.gov/',
  NY: 'https://dmv.ny.gov/address-change',
  NC: 'https://www.ncdot.gov/dmv/',
  ND: 'https://www.dot.nd.gov/divisions/driverslicense/',
  OH: 'https://www.bmv.ohio.gov/',
  OK: 'https://www.ok.gov/dps/',
  OR: 'https://www.oregon.gov/odot/dmv/',
  PA: 'https://www.dmv.pa.gov/',
  RI: 'https://dmv.ri.gov/',
  SC: 'https://www.scdmvonline.com/',
  SD: 'https://dor.sd.gov/motor-vehicles/',
  TN: 'https://www.tn.gov/safety/driver-services.html',
  TX: 'https://www.dps.texas.gov/section/driver-license',
  UT: 'https://dld.utah.gov/',
  VT: 'https://dmv.vermont.gov/',
  VA: 'https://www.dmv.virginia.gov/',
  WA: 'https://www.dol.wa.gov/',
  WV: 'https://transportation.wv.gov/DMV/',
  WI: 'https://www.dot.wisconsin.gov/drivers/',
  WY: 'https://dot.state.wy.us/home/driver_license_records.html',
  DC: 'https://dmv.dc.gov/',
};

export async function buildUtilityReport(rawAddress: string): Promise<UtilityReport> {
  const geo = await geocodeAddress(rawAddress);

  const [electricityTrend, gasTrend, internetProviders, wattbuyProvider] = await Promise.all([
    getElectricityTrend(geo.state),
    getGasTrend(geo.state),
    getInternetProviders(geo.lat, geo.lng),
    getElectricityProvider(geo.lat, geo.lng),
  ]);

  const [waterResults, trashResults, gasResults] = await Promise.all([
    searchUtilityProvider(`${geo.city} ${geo.state} water utility start service`),
    searchUtilityProvider(`${geo.city} ${geo.state} trash garbage collection signup`),
    searchUtilityProvider(`${geo.city} ${geo.state} natural gas utility provider start service`),
  ]);

  const municipalProviders: UtilityProvider[] = [
    {
      category: 'electricity',
      name: wattbuyProvider?.name ?? `${geo.state} Electric Utility`,
      estimatedMonthlyCost: electricityTrend[0]?.averageCost ?? null,
      costUnit: '¢/kWh',
      confidence: wattbuyProvider ? 'confirmed' : 'estimated',
      serviceStartUrl: wattbuyProvider?.website ?? null,
      notes: wattbuyProvider?.phone ?? undefined,
    },
    {
      category: 'gas',
      name: gasResults[0]?.title ?? `${geo.state} Natural Gas`,
      estimatedMonthlyCost: gasTrend[0]?.averageCost ?? null,
      costUnit: '$/mcf',
      confidence: gasResults.length > 0 ? 'confirmed' : 'estimated',
      serviceStartUrl: gasResults[0]?.url ?? null,
    },
    {
      category: 'water',
      name: waterResults[0]?.title ?? `${geo.city} Water Department`,
      estimatedMonthlyCost: 50,
      costUnit: '$/month',
      confidence: waterResults.length > 0 ? 'confirmed' : 'estimated',
      serviceStartUrl: waterResults[0]?.url ?? null,
    },
    {
      category: 'sewer',
      name: `${geo.city} Sewer Authority`,
      estimatedMonthlyCost: 40,
      costUnit: '$/month',
      confidence: 'estimated',
      serviceStartUrl: null,
    },
    {
      category: 'trash',
      name: trashResults[0]?.title ?? `${geo.city} Sanitation`,
      estimatedMonthlyCost: 30,
      costUnit: '$/month',
      confidence: trashResults.length > 0 ? 'confirmed' : 'estimated',
      serviceStartUrl: trashResults[0]?.url ?? null,
    },
  ];

  return {
    address: {
      formatted: geo.formatted,
      city: geo.city,
      county: geo.county,
      state: geo.state,
      zip: geo.zip,
    },
    providers: [...municipalProviders, ...internetProviders],
    electricityTrend,
    gasTrend,
    uspsChangeAddressUrl: 'https://moversguide.usps.com/',
    dmvUpdateUrl: DMV_URLS[geo.state] ?? null,
    generatedAt: new Date().toISOString(),
  };
}
