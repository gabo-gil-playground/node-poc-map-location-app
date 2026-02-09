import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('calls onSearchPress when button is pressed and value is not empty', () => {
    const handleSearchPress = jest.fn();

    const { getByText } = render(
      <SearchBar
        value="Some address"
        onChangeText={() => {}}
        onSearchPress={handleSearchPress}
      />,
    );

    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    expect(handleSearchPress).toHaveBeenCalledTimes(1);
  });
});

