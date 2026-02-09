import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  AppState,
  AppStateStatus,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { MapSearchScreen } from './src/screens/MapSearchScreen';
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';

// Ideal splash duration to show the logo and name
// without making the app feel slow.
const SPLASH_DURATION_MS = 2000;

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [screenKey, setScreenKey] = useState<number>(0);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    /**
     * Handles app state transitions to simulate "closing" the app when
     * it goes to the background. When the app comes back to the foreground,
     * we reset the main screen and show the splash again.
     */
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = appState.current;
      appState.current = nextAppState;

      if (previousState === 'background' && nextAppState === 'active') {
        // Reset the main screen by changing its key and show splash again.
        setScreenKey((prevKey) => prevKey + 1);
        showSplashScreen();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial splash on first launch.
    showSplashScreen();

    return () => {
      subscription.remove();
    };
  }, [opacity]);

  const showSplashScreen = () => {
    setShowSplash(true);
    opacity.setValue(1);

    // Keep the splash visible for the configured duration.
    const timeoutId = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timeoutId);
  };

  if (showSplash) {
    return (
      <View style={styles.root}>
        <Animated.View style={[styles.splashContainer, { opacity }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoSymbol}>
              <View style={styles.logoInnerDot} />
            </View>
            <View style={styles.logoTextContainer}>
              <Text style={styles.appTitle}>Map Search POC</Text>
              <Text style={styles.appSubtitle}>Powered by OpenStreetMap</Text>
            </View>
          </View>
        </Animated.View>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <MapSearchScreen key={screenKey} />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoSymbol: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  logoInnerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  appTitle: {
    ...typography.appTitle,
    color: colors.textPrimary,
  },
  appSubtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

