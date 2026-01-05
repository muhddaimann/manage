import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  type MD3Theme,
} from "react-native-paper";

const make = (
  family: string,
  weight: "400" | "700",
  fontSize: number,
  lineHeight: number,
  letterSpacing = 0
) => ({
  fontFamily: family,
  fontWeight: weight,
  fontSize,
  lineHeight,
  letterSpacing,
});

const fontConfig = {
  displayLarge: make("ComicNeue_700Bold", "700", 57, 64),
  displayMedium: make("ComicNeue_700Bold", "700", 45, 52),
  displaySmall: make("ComicNeue_700Bold", "700", 36, 44),

  headlineLarge: make("ComicNeue_700Bold", "700", 32, 40),
  headlineMedium: make("ComicNeue_700Bold", "700", 28, 36),
  headlineSmall: make("ComicNeue_700Bold", "700", 24, 32),

  titleLarge: make("ComicNeue_700Bold", "700", 22, 28),
  titleMedium: make("ComicNeue_700Bold", "700", 16, 24, 0.1),
  titleSmall: make("ComicNeue_700Bold", "700", 14, 20, 0.1),

  labelLarge: make("ComicNeue_700Bold", "700", 14, 20, 0.1),
  labelMedium: make("ComicNeue_400Regular", "400", 12, 16, 0.5),
  labelSmall: make("ComicNeue_400Regular", "400", 11, 16, 0.5),

  bodyLarge: make("ComicNeue_400Regular", "400", 16, 24),
  bodyMedium: make("ComicNeue_400Regular", "400", 14, 20),
  bodySmall: make("ComicNeue_400Regular", "400", 12, 16),
};

const fonts = configureFonts({ config: fontConfig });

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 12,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#5B5F97",
    onPrimary: "#FFFFFF",
    primaryContainer: "#C7C9E9",
    onPrimaryContainer: "#1C1E47",

    secondary: "#A14F66",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E1B5C1",
    onSecondaryContainer: "#3F1F29",

    tertiary: "#6D9886",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#C7DDD3",
    onTertiaryContainer: "#223B34",

    error: "#D14343",
    onError: "#FFFFFF",
    errorContainer: "#F3BDBD",
    onErrorContainer: "#5C1A1A",

    surface: "#FFFFFF",
    onSurface: "#1A1A1A",
    surfaceVariant: "#E2E4EC",
    onSurfaceVariant: "#333333",

    background: "#F4F5F7",
    onBackground: "#121212",
    outline: "#B0B3C1",
    shadow: "#A0A3B0",
    scrim: "#000000",
    surfaceDisabled: "rgba(26,27,30,0.12)",
    onSurfaceDisabled: "rgba(26,27,30,0.38)",
    backdrop: "rgba(26,27,30,0.4)",

    elevation: { ...MD3LightTheme.colors.elevation },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 12,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#AEB0E5",
    onPrimary: "#23264C",
    primaryContainer: "#5B5F97",
    onPrimaryContainer: "#FFFFFF",

    secondary: "#E7A6B4",
    onSecondary: "#4A2430",
    secondaryContainer: "#A14F66",
    onSecondaryContainer: "#FFFFFF",

    tertiary: "#AECFC3",
    onTertiary: "#1C322B",
    tertiaryContainer: "#6D9886",
    onTertiaryContainer: "#FFFFFF",

    error: "#B35C5C",
    onError: "#1F0D0D",
    errorContainer: "#8C3B3B",
    onErrorContainer: "#FFFFFF",

    surface: "#262626",
    onSurface: "#F1F1F1",
    surfaceVariant: "#383A46",
    onSurfaceVariant: "#D4D6E2",

    background: "#1A1A1A",
    onBackground: "#F4F4F4",
    outline: "#5E6170",
    shadow: "#A0A3B0",
    scrim: "#000000",
    surfaceDisabled: "rgba(227,227,232,0.12)",
    onSurfaceDisabled: "rgba(227,227,232,0.38)",
    backdrop: "rgba(0,0,0,0.4)",

    elevation: { ...MD3DarkTheme.colors.elevation },
  },
};
