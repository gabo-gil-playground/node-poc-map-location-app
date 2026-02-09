import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import type { Region } from 'react-native-maps';
import { SearchBar } from '../components/SearchBar';
import { MapWithMarker } from '../components/MapWithMarker';
import { colors } from '../theme/colors';
import { geocodeAddress, NominatimGeocodingResult } from '../services/geocoding/nominatimApi';
import { getCurrentLocation } from '../services/location/locationService';

const DEFAULT_REGION: Region = {
  latitude: -34.6037, // Buenos Aires as a neutral default
  longitude: -58.3816,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const MapSearchScreen: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [markerCoordinate, setMarkerCoordinate] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    /**
     * On initial mount, try to move the map to the current location.
     * If permission is denied or location is unavailable, we gracefully
     * fall back to the default region.
     */
    const initializeRegion = async () => {
      setIsLocating(true);
      try {
        const currentLocation = await getCurrentLocation();

        const nextRegion: Region = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        setRegion(nextRegion);
        setMarkerCoordinate({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
        setErrorMessage(null);
      } catch {
        // We silence the error here to avoid nagging users on startup.
        // The default region remains, and the user can still search or tap "Use my location".
      } finally {
        setIsLocating(false);
      }
    };

    void initializeRegion();
  }, []);

  const handleSearchPress = async () => {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      setErrorMessage('Please enter an address before searching.');
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);

    try {
      const results: NominatimGeocodingResult[] = await geocodeAddress(trimmedAddress, {
        limit: 3,
      });

      if (results.length === 0) {
        setErrorMessage('No results found for the specified address.');
        return;
      }

      const bestMatch = results[0];

      const nextRegion: Region = {
        latitude: bestMatch.latitude,
        longitude: bestMatch.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(nextRegion);
      setMarkerCoordinate({
        latitude: bestMatch.latitude,
        longitude: bestMatch.longitude,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unexpected error while searching for the address.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseMyLocationPress = async () => {
    setIsLocating(true);
    setErrorMessage(null);

    try {
      const currentLocation = await getCurrentLocation();

      const nextRegion: Region = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(nextRegion);
      setMarkerCoordinate({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unexpected error while obtaining current location.',
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SearchBar
          value={address}
          onChangeText={setAddress}
          onSearchPress={handleSearchPress}
          onUseMyLocationPress={handleUseMyLocationPress}
          isSearching={isSearching}
          isLocating={isLocating}
          errorMessage={errorMessage}
        />
        <View style={styles.mapContainer}>
          <MapWithMarker region={region} markerCoordinate={markerCoordinate} />
        </View>
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerIndicator} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  mapContainer: {
    flex: 1,
  },
  footer: {
    height: 40,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContent: {
    width: '30%',
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.muted,
  },
  footerIndicator: {
    flex: 1,
    borderRadius: 999,
  },
});

