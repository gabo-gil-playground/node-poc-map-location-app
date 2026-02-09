/**
 * Typography tokens for Map Search POC.
 * Uses platform default fonts with sizes and weights tuned
 * for clarity and hierarchy on mobile and web.
 */
export const typography = {
  appTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  input: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
};

