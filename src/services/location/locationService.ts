import * as Location from 'expo-location';

/**
 * Represents a simplified location object used across the app.
 */
export interface SimpleLocation {
  /**
   * Latitude in WGS84 decimal degrees.
   */
  latitude: number;
  /**
   * Longitude in WGS84 decimal degrees.
   */
  longitude: number;
  /**
   * Optional accuracy in meters, if available.
   */
  accuracy?: number | null;
}

/**
 * Requests foreground (when-in-use) location permissions from the user.
 *
 * @returns A promise that resolves with a boolean indicating whether
 *          the permission was granted.
 */
export async function requestForegroundLocationPermission(): Promise<boolean> {
  const permission = await Location.requestForegroundPermissionsAsync();
  return permission.status === Location.PermissionStatus.GRANTED;
}

/**
 * Retrieves the device's current location in a safe and controlled way.
 *
 * This function:
 * - Ensures permissions are granted (and requests them if necessary).
 * - Throws a clear error when the user denies permission.
 * - Handles platform-specific constraints (e.g. emulators).
 *
 * @throws Error when permissions are denied or the position cannot be obtained.
 */
export async function getCurrentLocation(): Promise<SimpleLocation> {
  const permissionGranted = await ensureForegroundPermission();

  if (!permissionGranted) {
    throw new Error('Location permission was not granted.');
  }

  let location: Location.LocationObject;

  try {
    location = await Location.getCurrentPositionAsync({});
  } catch {
    throw new Error('Unable to obtain current location from the device.');
  }

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy ?? null,
  };
}

/**
 * Ensures that foreground location permission is granted.
 * If not already granted, it will request it from the user.
 *
 * This function is intentionally kept private to reduce the surface
 * area of exported APIs and centralize permission logic.
 */
async function ensureForegroundPermission(): Promise<boolean> {
  /**
   * Always delegate to Expo's requestForegroundPermissionsAsync.
   * The underlying implementation will decide whether to show
   * a system dialog or immediately return the current status.
   */
  return requestForegroundLocationPermission();
}

