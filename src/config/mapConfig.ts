/**
 * Map configuration.
 *
 * The tile URL template is intentionally read from an environment variable
 * so that we do not rely directly on OpenStreetMap's public tile servers
 * from within a mobile application, which would violate their tile usage policy.
 *
 * To configure a compliant OSM-based provider, set:
 *   EXPO_PUBLIC_MAP_TILE_URL=...
 *
 * For example (MapTiler, Stadia Maps, etc.):
 *   EXPO_PUBLIC_MAP_TILE_URL=https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=YOUR_KEY
 */

const TILE_URL_TEMPLATE = process.env.EXPO_PUBLIC_MAP_TILE_URL ?? '';

export function getTileUrlTemplate(): string | null {
  const trimmed = TILE_URL_TEMPLATE.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed;
}

