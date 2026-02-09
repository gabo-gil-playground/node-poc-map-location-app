import { Platform } from 'react-native';

/**
 * Base URL for Nominatim search endpoint.
 * Uses the public OpenStreetMap Nominatim instance by default.
 * If you host your own Nominatim instance, replace this URL.
 */
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Type representing a single Nominatim geocoding result.
 * This type is intentionally minimal and can be extended if needed.
 */
export interface NominatimGeocodingResult {
  /**
   * Display name returned by Nominatim, usually a full formatted address.
   */
  displayName: string;
  /**
   * Latitude in WGS84 decimal degrees.
   */
  latitude: number;
  /**
   * Longitude in WGS84 decimal degrees.
   */
  longitude: number;
}

/**
 * Raw Nominatim response shape (partial).
 * This mirrors the fields we actually consume from the API response.
 */
interface NominatimRawResult {
  display_name?: string;
  lat?: string;
  lon?: string;
}

/**
 * Small helper to build a compliant User-Agent and Referer for Nominatim.
 * Nominatim's usage policy requires a valid HTTP User-Agent and, ideally, a Referer.
 */
function buildNominatimHeaders(): HeadersInit {
  const userAgent = `node-poc-map-location-app/1.0 (${Platform.OS})`;

  return {
    // User-Agent is required by Nominatim usage policy.
    'User-Agent': userAgent,
    // Referer is helpful for admins of the Nominatim instance.
    Referer: 'https://example.com/node-poc-map-location-app',
    Accept: 'application/json',
  };
}

/**
 * Converts a free-form address into a list of geocoding results using Nominatim.
 *
 * @param address - The human readable address to search for.
 * @param options - Optional configuration object.
 * @returns A promise that resolves with an array of normalized geocoding results.
 *
 * This function:
 * - Validates the input.
 * - Calls the Nominatim `/search` endpoint with JSON output.
 * - Normalizes the results to a stable internal structure.
 * - Handles network and parsing errors gracefully.
 */
export async function geocodeAddress(
  address: string,
  options?: {
    /**
     * Limit the number of results returned by Nominatim.
     * Defaults to 5 to keep responses small and focused.
     */
    limit?: number;
    /**
     * Optional country codes filter (comma-separated ISO codes, e.g. "ar,br").
     */
    countryCodes?: string;
  },
): Promise<NominatimGeocodingResult[]> {
  const trimmedAddress = address.trim();

  if (!trimmedAddress) {
    throw new Error('Address must not be empty.');
  }

  const { limit = 5, countryCodes } = options ?? {};

  const url = new URL(NOMINATIM_BASE_URL);
  url.searchParams.set('q', trimmedAddress);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', String(limit));
  // `addressdetails=1` is useful if later we want structured address info.
  url.searchParams.set('addressdetails', '1');

  if (countryCodes) {
    url.searchParams.set('countrycodes', countryCodes);
  }

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildNominatimHeaders(),
    });
  } catch (error) {
    // Network errors or CORS issues will be caught here.
    throw new Error('Failed to reach geocoding service. Please check your network connection.');
  }

  if (!response.ok) {
    // Nominatim may return 4xx or 5xx in case of errors or rate limiting.
    throw new Error('Geocoding service responded with an unexpected status. Please try again later.');
  }

  let rawResults: unknown;

  try {
    rawResults = await response.json();
  } catch {
    throw new Error('Received an invalid response from the geocoding service.');
  }

  if (!Array.isArray(rawResults)) {
    throw new Error('Geocoding service returned an unexpected payload format.');
  }

  const normalizedResults: NominatimGeocodingResult[] = rawResults
    .map((item: NominatimRawResult | unknown): NominatimGeocodingResult | null => {
      const candidate = item as NominatimRawResult;

      if (!candidate.display_name || !candidate.lat || !candidate.lon) {
        return null;
      }

      const latitude = Number(candidate.lat);
      const longitude = Number(candidate.lon);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }

      return {
        displayName: candidate.display_name,
        latitude,
        longitude,
      };
    })
    .filter((result): result is NominatimGeocodingResult => result !== null);

  return normalizedResults;
}

