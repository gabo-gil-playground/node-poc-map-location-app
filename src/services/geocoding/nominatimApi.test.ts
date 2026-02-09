import { geocodeAddress } from './nominatimApi';

describe('geocodeAddress', () => {
  beforeEach(() => {
    // @ts-expect-error - we are intentionally overriding the global fetch for testing.
    global.fetch = jest.fn();
  });

  it('throws an error when address is empty', async () => {
    await expect(geocodeAddress('   ')).rejects.toThrow('Address must not be empty.');
  });

  it('returns normalized results when the API responds correctly', async () => {
    // @ts-expect-error - mock implementation for testing only.
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          display_name: 'Test Place',
          lat: '10.1234',
          lon: '-20.5678',
        },
      ],
    });

    const results = await geocodeAddress('Test address', { limit: 1 });

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      displayName: 'Test Place',
      latitude: 10.1234,
      longitude: -20.5678,
    });
  });
});

