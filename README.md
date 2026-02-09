# Map Search POC

Map Search POC is a React Native mobile application built with Expo. It allows users to:

- Enter a textual address.
- Geocode it to coordinates using **Nominatim** (OpenStreetMap).
- Visualize the location on a **React Native Maps** map powered by **OSM-based tiles**.
- Optionally center the map on the device's **current GPS location** using **expo-location**.

The app is designed with clean code, strong typing (TypeScript), and modern UX/UI best practices (as of February 2026).

## Tech Stack

- **Framework**: Expo (SDK 54)
- **UI**: React Native (0.81), React 19
- **Maps**: `react-native-maps` with OSM-based tiles (via `UrlTile`)
- **Geocoding**: Nominatim (OpenStreetMap)
- **Location**: `expo-location`
- **Language**: TypeScript
- **Testing**: Jest + `jest-expo` + `@testing-library/react-native`

## Project structure

- `App.tsx` – App entry point, splash screen, and root navigation logic.
- `src/theme/` – Centralized colors and typography.
- `src/config/mapConfig.ts` – Map configuration (tile URL template).
- `src/services/geocoding/` – Nominatim geocoding service.
- `src/services/location/` – Location service built on top of `expo-location`.
- `src/components/` – Reusable UI components (`SearchBar`, `MapWithMarker`).
- `src/screens/` – Screen-level components (`MapSearchScreen`).

## Prerequisites

- Node.js (LTS version recommended)
- npm (or yarn, though this project uses npm by default)
- Expo CLI (installed globally is optional; you can also use `npx expo` commands)
- Expo Go app on your device **or** Android/iOS emulators properly configured

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Configuring the map tile provider

To comply with the OpenStreetMap tile usage policy, this app **does not** use `https://tile.openstreetmap.org` directly from mobile clients.

Instead, configure an OSM-based tile provider (for example, MapTiler, Stadia Maps, or your own tile server) and expose the URL template via an Expo public environment variable:

1. Choose a provider and obtain an API key if required.
2. Set the environment variable `EXPO_PUBLIC_MAP_TILE_URL` to your tile URL template, for example:

```bash
EXPO_PUBLIC_MAP_TILE_URL="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=YOUR_API_KEY"
```

3. Make sure this variable is available when running the app (for example, using `.env` + `expo env` or your CI/CD environment configuration).

If `EXPO_PUBLIC_MAP_TILE_URL` is not set, the app will:

- Render the map view without tiles.
- Show an in-app warning: “Map tile server is not configured. Please set EXPO_PUBLIC_MAP_TILE_URL.”

## Running the app

Start the Expo development server:

```bash
npm run start
```

Then, in a separate terminal (or from the Expo UI), run:

- **Android**:

  ```bash
  npm run android
  ```

- **iOS** (macOS required for simulator):

  ```bash
  npm run ios
  ```

- **Web**:

  ```bash
  npm run web
  ```

## Features

- **Splash / loading screen**:
  - Shows the app logo and title **“Map Search POC”** for ~2 seconds on startup and when returning from background.

- **Main screen**:
  - Top **search bar**:
    - Text input for the address.
    - **Search** button.
    - Optional **Use my location** button.
  - Central **map**:
    - Centers on current location (if permission is granted), otherwise a default region.
    - Displays a marker at the searched or current location.
    - Uses OSM-based tiles configured via `EXPO_PUBLIC_MAP_TILE_URL`.
  - Bottom **footer** bar:
    - Minimalistic visual separation from the Android/iOS system navigation bar, for better contrast.

## Testing and coverage

This project uses Jest, `jest-expo`, and `@testing-library/react-native` for unit testing.

Available npm scripts:

- **Run all tests**:

  ```bash
  npm test
  ```

- **Run tests with coverage (HTML + lcov + text)**:

  ```bash
  npm run test:coverage
  ```

- **CI-friendly test run (coverage, single run, non-watch)**:

  ```bash
  npm run test:ci
  ```

Coverage reports (including HTML) are generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in your browser to explore line-level coverage.

## Notes on permissions and location

- The app uses `expo-location` to:
  - Request foreground (when-in-use) location permissions.
  - Retrieve the device’s current position.
- If the user denies location permission:
  - The app will not crash.
  - A clear, user-friendly error message is shown.
  - The user can still search by address using Nominatim.

## OpenStreetMap & Nominatim

- The app uses OpenStreetMap data through:
  - A third-party OSM-based tile provider for raster tiles.
  - Nominatim (public service) for geocoding.
- The map includes **“© OpenStreetMap contributors”** attribution when tiles are configured.
- Always review and comply with:
  - Nominatim usage policy.
  - The chosen tile provider’s terms of service.

