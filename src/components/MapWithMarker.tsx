import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, ViewStyle, TextStyle } from 'react-native';
import MapView, { Marker, UrlTile, Region, MapViewProps } from 'react-native-maps';
import { colors } from '../theme/colors';
import { getTileUrlTemplate } from '../config/mapConfig';

interface MapWithMarkerProps {
  /**
   * The map region to display.
   */
  region: Region;
  /**
   * Optional coordinate for the marker to display.
   */
  markerCoordinate?: { latitude: number; longitude: number } | null;
}

/**
 * Leaflet-style OpenStreetMap tiles through react-native-maps UrlTile.
 * We include attribution as required by OpenStreetMap.
 */
export const MapWithMarker: React.FC<MapWithMarkerProps> = ({
  region,
  markerCoordinate,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const tileUrlTemplate = getTileUrlTemplate();

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // Smoothly animate to the new region when it changes.
    mapRef.current.animateToRegion(region, 500);
  }, [region]);

  const mapProps: MapViewProps = {
    ref: mapRef,
    style: styles.map,
    initialRegion: region,
    customMapStyle: [],
  };

  return (
    <View style={styles.container}>
      <MapView {...mapProps}>
        {tileUrlTemplate ? (
          <UrlTile
            /**
             * OSM-based tile provider.
             * The concrete URL (and API key if needed) is supplied via
             * environment configuration to comply with tile usage policies.
             */
            urlTemplate={tileUrlTemplate}
            maximumZ={19}
            tileSize={256}
            zIndex={0}
          />
        ) : null}
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title="Selected location"
          />
        )}
      </MapView>
      {tileUrlTemplate ? (
        <View style={styles.attributionContainer}>
          <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
        </View>
      ) : (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Map tile server is not configured. Please set EXPO_PUBLIC_MAP_TILE_URL.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  map: ViewStyle;
  attributionContainer: ViewStyle;
  attributionText: TextStyle;
  warningContainer: ViewStyle;
  warningText: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: colors.mapBackground,
  },
  map: {
    flex: 1,
  },
  attributionContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 8 : 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 999,
  },
  attributionText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  warningContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(127, 29, 29, 0.9)',
    borderRadius: 12,
  },
  warningText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
});

