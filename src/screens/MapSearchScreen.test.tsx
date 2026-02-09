import React from 'react';
import { render } from '@testing-library/react-native';
import { MapSearchScreen } from './MapSearchScreen';

jest.mock('../components/MapWithMarker', () => {
  const Mock = () => null;
  return {
    MapWithMarker: Mock,
  };
});

jest.mock('../services/location/locationService', () => ({
  getCurrentLocation: jest.fn().mockResolvedValue({
    latitude: -34.6037,
    longitude: -58.3816,
    accuracy: 10,
  }),
}));

describe('MapSearchScreen', () => {
  it('renders without crashing and shows the search input', () => {
    const { getByPlaceholderText } = render(<MapSearchScreen />);

    expect(getByPlaceholderText('Search address')).toBeTruthy();
  });
});

