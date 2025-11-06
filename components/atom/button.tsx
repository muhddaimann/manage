import * as React from "react";
import {
  Pressable,
  Platform,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Text,
} from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type Mode = "text" | "outlined" | "contained" | "contained-tonal" | "elevated";
type IconComp = React.ComponentType<{ color?: string; size?: number }>;
type Tone = "primary" | "error";

type Size = "small" | "medium" | "large";

type Props = {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  mode?: Mode;
  tone?: Tone;
  disabled?: boolean;
  loading?: boolean;
  IconLeft?: IconComp;
  IconRight?: IconComp;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  size?: Size;
  dense?: boolean;
  compact?: boolean;
  rounded?: "sm" | "md" | "lg" | "pill";
  textColor?: string;
  accessibilityLabel?: string;
};

export function Button({
  children,
  onPress,
  mode = "contained",
  tone = "primary",
  disabled = false,
  loading = false,
  IconLeft,
  IconRight,
  style,
  fullWidth,
  size = "medium",
  dense,
  compact,
  rounded = "md",
  accessibilityLabel,
  textColor,
}: Props) {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();

  const isDense = dense ?? size === "small";

  const height = size === "large" ? tokens.sizes.touch.minHeight + tokens.spacing.xs : isDense
    ? Math.max(36, tokens.sizes.touch.minHeight - tokens.spacing.xs)
    : tokens.sizes.touch.minHeight;

  const radius =
    rounded === "sm"
      ? tokens.radii.sm
      : rounded === "md"
      ? tokens.radii.md
      : rounded === "lg"
      ? tokens.radii.lg
      : tokens.radii.pill;

  const padX = compact ? tokens.spacing.sm : (size === "large" ? tokens.spacing.xl : isDense ? tokens.spacing.md : tokens.spacing.lg);
  const gap = tokens.spacing.xs;
  const iconSize = tokens.sizes.icon.md;

  const base =
    tone === "error"
      ? {
          main: colors.error,
          onMain: colors.onError,
          container: colors.errorContainer,
          onContainer: colors.onErrorContainer,
          outline: colors.error,
          ripple: dark ? `${colors.onError}22` : `${colors.error}22`,
        }
      : {
          main: colors.primary,
          onMain: colors.onPrimary,
          container: colors.primaryContainer,
          onContainer: colors.onPrimaryContainer,
          outline: colors.outline,
          ripple: dark ? `${colors.onSurface}22` : `${colors.primary}22`,
        };

  const palette = (() => {
    if (disabled) {
      return {
        bg:
          mode === "contained" ||
          mode === "contained-tonal" ||
          mode === "elevated"
            ? colors.surfaceDisabled
            : "transparent",
        fg: colors.onSurfaceDisabled,
        border: colors.surfaceDisabled,
        elevation: 0,
      };
    }
    switch (mode) {
      case "contained":
        return {
          bg: base.main,
          fg: base.onMain,
          border: "transparent",
          elevation: tokens.elevation.level1,
        };
      case "contained-tonal":
        return {
          bg: base.container,
          fg: base.onContainer,
          border: "transparent",
          elevation: 0,
        };
      case "outlined":
        return {
          bg: "transparent",
          fg: base.main,
          border: base.outline,
          elevation: 0,
        };
      case "text":
        return {
          bg: "transparent",
          fg: base.main,
          border: "transparent",
          elevation: 0,
        };
      case "elevated":
        return {
          bg: colors.surface,
          fg: base.main,
          border: "transparent",
          elevation: tokens.elevation.level1,
        };
      default:
        return {
          bg: base.main,
          fg: base.onMain,
          border: "transparent",
          elevation: tokens.elevation.level1,
        };
    }
  })();

  const shadow =
    palette.elevation > 0
      ? Platform.select({
          ios: {
            shadowColor: colors.shadow,
            shadowOpacity: 0.18,
            shadowRadius: palette.elevation * 2,
            shadowOffset: { width: 0, height: palette.elevation },
          },
          android: { elevation: palette.elevation },
          default: { elevation: palette.elevation },
        })
      : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled || loading}
      onPress={onPress}
      android_ripple={
        disabled || loading
          ? undefined
          : { color: base.ripple, borderless: false }
      }
      hitSlop={tokens.sizes.touch.hitSlop}
      style={[
        {
          minHeight: height,
          paddingHorizontal: padX,
          borderRadius: radius,
          backgroundColor: palette.bg,
          borderWidth: mode === "outlined" ? 1 : 0,
          borderColor: palette.border,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap,
          alignSelf: fullWidth ? "stretch" : "auto",
        },
        shadow as any,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.fg} />
      ) : (
        <>
          {IconLeft ? <IconLeft color={textColor ?? palette.fg} size={iconSize} /> : null}
          {typeof children === "string" ? (
            <Text
              style={{
                color: textColor ?? palette.fg,
                fontFamily: "Inter_500Medium",
                fontWeight: "500",
                fontSize: tokens.typography.sizes.md,
                lineHeight: Math.round(tokens.typography.sizes.md * 1.25),
              }}
              numberOfLines={1}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {IconRight ? <IconRight color={textColor ?? palette.fg} size={iconSize} /> : null}
        </>
      )}
    </Pressable>
  );
}
