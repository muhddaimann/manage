import * as React from "react";
import {
  Pressable,
  Platform,
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";

type IconComp = React.ComponentType<{ color?: string; size?: number }>;
type Variant = "primary" | "secondary" | "destructive" | "surface";
type Size = "md" | "lg";
type Corner = "br" | "bl" | "tr" | "tl" | "center-bottom";

type Props = {
  icon: IconComp;
  label?: string;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  corner?: Corner;
  offset?: number;
  style?: any;
  accessibilityLabel?: string;
};

export function Fab({
  icon: Icon,
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
  size = "md",
  corner = "br",
  offset,
  style,
  accessibilityLabel,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { tokens } = useDesign();

  const pressedScale = React.useRef(false);
  const [pressed, setPressed] = React.useState(false);

  const dims = size === "lg" ? Math.max(60, tokens.sizes.touch.minHeight + 8) : Math.max(56, tokens.sizes.touch.minHeight);
  const radius = dims / 2;

  const palette =
    variant === "primary"
      ? { bg: colors.primary, fg: colors.onPrimary, border: "transparent" }
      : variant === "secondary"
      ? { bg: colors.secondary, fg: colors.onSecondary, border: "transparent" }
      : variant === "destructive"
      ? { bg: colors.error, fg: colors.onError, border: "transparent" }
      : { bg: colors.surface, fg: colors.primary, border: colors.outline };

  const disabledPalette = {
    bg: colors.surfaceDisabled,
    fg: colors.onSurfaceDisabled,
    border: colors.surfaceDisabled,
  };

  const isExtended = !!label;

  const baseShadow = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 6 },
    default: { elevation: 6 },
  });

  const pos = (() => {
    const g = offset ?? tokens.spacing.lg;
    const b = Math.max(insets.bottom, g);
    const t = Math.max(insets.top, g);
    switch (corner) {
      case "br":
        return { right: g, bottom: b };
      case "bl":
        return { left: g, bottom: b };
      case "tr":
        return { right: g, top: t };
      case "tl":
        return { left: g, top: t };
      case "center-bottom":
        return { alignSelf: "center", bottom: b };
      default:
        return { right: g, bottom: b };
    }
  })();

  const iconSize = size === "lg" ? tokens.sizes.icon.lg : tokens.sizes.icon.md;

  const bg = disabled ? disabledPalette.bg : palette.bg;
  const fg = disabled ? disabledPalette.fg : palette.fg;
  const border = disabled ? disabledPalette.border : palette.border;

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          position: "absolute",
          zIndex: 1000,
          ...(Platform.OS === "android" ? { elevation: 1000 } : null),
        },
        pos,
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? (label ? String(label) : "Floating Action Button")}
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={() => {
          pressedScale.current = true;
          setPressed(true);
        }}
        onPressOut={() => {
          pressedScale.current = false;
          setPressed(false);
        }}
        android_ripple={
          disabled || loading
            ? undefined
            : { color: "#ffffff22", borderless: true }
        }
        style={[
          baseShadow as any,
          isExtended
            ? {
                minHeight: dims,
                borderRadius: tokens.radii.pill,
                backgroundColor: bg,
                borderWidth: variant === "surface" ? StyleSheet.hairlineWidth : 0,
                borderColor: border as string,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: tokens.spacing.lg,
                gap: tokens.spacing.sm,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              }
            : {
                width: dims,
                height: dims,
                borderRadius: radius,
                backgroundColor: bg,
                borderWidth: variant === "surface" ? StyleSheet.hairlineWidth : 0,
                borderColor: border as string,
                alignItems: "center",
                justifyContent: "center",
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            <Icon color={fg as string} size={iconSize} />
            {isExtended ? (
              <Text
                style={{
                  color: fg as string,
                  fontFamily: "Inter_600SemiBold",
                  fontWeight: "600",
                  fontSize: tokens.typography.sizes.md,
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            ) : null}
          </>
        )}
      </Pressable>
    </View>
  );
}
