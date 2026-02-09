import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SearchBarProps {
  /**
   * Current address value displayed in the input.
   */
  value: string;
  /**
   * Called whenever the user changes the input text.
   */
  onChangeText: (text: string) => void;
  /**
   * Triggered when the user presses the "Search" button.
   */
  onSearchPress: () => void;
  /**
   * Triggered when the user presses the "Use my location" button.
   * If not provided, the button is not rendered.
   */
  onUseMyLocationPress?: () => void;
  /**
   * Indicates whether a search request is in progress.
   * When true, disables the search button to avoid duplicate requests.
   */
  isSearching?: boolean;
  /**
   * Indicates whether a location request is in progress.
   */
  isLocating?: boolean;
  /**
   * Optional style override for the container.
   */
  style?: ViewStyle;
  /**
   * Optional error message to display below the input.
   */
  errorMessage?: string | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearchPress,
  onUseMyLocationPress,
  isSearching = false,
  isLocating = false,
  style,
  errorMessage,
}) => {
  const isSearchDisabled = isSearching || !value.trim();
  const isUseLocationDisabled = isLocating;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Search address"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={onSearchPress}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            isSearchDisabled && styles.buttonDisabled,
            pressed && !isSearchDisabled && styles.buttonPressed,
          ]}
          disabled={isSearchDisabled}
          onPress={onSearchPress}
        >
          <Text style={styles.primaryButtonLabel}>
            {isSearching ? 'Searching…' : 'Search'}
          </Text>
        </Pressable>
      </View>

      {onUseMyLocationPress && (
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            isUseLocationDisabled && styles.buttonDisabled,
            pressed && !isUseLocationDisabled && styles.secondaryButtonPressed,
          ]}
          disabled={isUseLocationDisabled}
          onPress={onUseMyLocationPress}
        >
          <Text style={styles.secondaryButtonLabel}>
            {isLocating ? 'Locating…' : 'Use my location'}
          </Text>
        </Pressable>
      )}

      {Boolean(errorMessage) && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  row: ViewStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  primaryButton: ViewStyle;
  primaryButtonLabel: TextStyle;
  secondaryButton: ViewStyle;
  secondaryButtonPressed: ViewStyle;
  secondaryButtonLabel: TextStyle;
  buttonPressed: ViewStyle;
  buttonDisabled: ViewStyle;
  errorText: TextStyle;
}>({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    ...typography.input,
    color: colors.textPrimary,
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonLabel: {
    ...typography.buttonLabel,
    color: colors.textPrimary,
  },
  secondaryButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonPressed: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  secondaryButtonLabel: {
    ...typography.buttonLabel,
    color: colors.primary,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    marginTop: 8,
    color: colors.error,
    fontSize: 12,
  },
});

