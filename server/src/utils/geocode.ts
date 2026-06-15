/**
 * geocode.ts
 *
 * Lightweight reverse-geocoding using the free OpenStreetMap Nominatim API.
 * No API key required. Rate limit: 1 req/sec — handled by callers.
 *
 * Returns the most specific locality available:
 *   city_district → suburb → city → town → village → county → state
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const USER_AGENT = 'GlowFix/1.0 (support@glowfix.app)';

/**
 * Reverse-geocode a lat/lng coordinate to a city/suburb name.
 * Returns null if the lookup fails or no locality is found.
 */
export async function reverseGeocodeCity(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    // accept-language=en forces English names (prevents Arabic / local-script responses)
    const url = `${NOMINATIM_URL}?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=12&accept-language=en`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
        'Accept-Language': 'en',
      },
      signal: AbortSignal.timeout(5000), // 5 s timeout
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as NominatimResponse;
    const addr = data?.address;

    if (!addr) return null;

    // Prefer the most specific locality label available
    return (
      addr.city_district ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state ||
      null
    );
  } catch {
    // Network error or timeout — don't block business registration
    return null;
  }
}

// ─── Nominatim response types ────────────────────────────────────────────────

interface NominatimAddress {
  city_district?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
}
