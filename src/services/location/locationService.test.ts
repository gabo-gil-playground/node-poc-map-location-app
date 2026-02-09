import * as ExpoLocation from 'expo-location';
import { getCurrentLocation } from './locationService';

jest.mock('expo-location');

const mockedLocation = ExpoLocation as jest.Mocked<typeof ExpoLocation>;

describe('locationService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws when permission is denied', async () => {
    mockedLocation.getForegroundPermissionsAsync.mockResolvedValue({
      status: ExpoLocation.PermissionStatus.DENIED,
      granted: false,
      canAskAgain: false,
      expires: 'never',
      ios: undefined,
      android: undefined,
    });

    await expect(getCurrentLocation()).rejects.toThrow('Location permission was not granted.');
  });

  it('returns current location when permission is granted', async () => {
    mockedLocation.getForegroundPermissionsAsync.mockResolvedValue({
      status: ExpoLocation.PermissionStatus.GRANTED,
      granted: true,
      canAskAgain: true,
      expires: 'never',
      ios: undefined,
      android: undefined,
    });

    mockedLocation.getCurrentPositionAsync.mockResolvedValue({
      coords: {
        latitude: 1.23,
        longitude: 4.56,
        altitude: null,
        accuracy: 5,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });

    const location = await getCurrentLocation();

    expect(location).toEqual({
      latitude: 1.23,
      longitude: 4.56,
      accuracy: 5,
    });
  });
});

