import * as React from "react";
import {
  Pressable,
  Platform,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type Variant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";
type Size = "sm" | "md" | "lg" | "icon";
type IconComp = React.ComponentType<{ color?: string; size?: number }>;

type Props = {
  children?: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  IconLeft?: IconComp;
  IconRight?: IconComp;
  style?: StyleProp<ViewStyle>;
  rounded?: "sm" | "md" | "lg" | "pill";
  fullWidth?: boolean;
  accessibilityLabel?: string;
};

export function Button({
  children,
  onPress,
  disabled,
  loading,
  variant = "default",
  size = "md",
  IconLeft,
  IconRight,
  style,
  rounded = "md",
  fullWidth,
  accessibilityLabel,
}: Props) {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();

  const radius =
    rounded === "sm"
      ? tokens.radii.sm
      : rounded === "md"
      ? tokens.radii.md
      : rounded === "lg"
      ? tokens.radii.lg
      : tokens.radii.pill;

  const h =
    size === "sm"
      ? Math.max(36, tokens.sizes.touch.minHeight - tokens.spacing.xs)
      : size === "lg"
      ? tokens.sizes.touch.minHeight + tokens.spacing.xs
      : tokens.sizes.touch.minHeight;

  const padX =
    size === "icon"
      ? 0
      : size === "sm"
      ? tokens.spacing.md
      : size === "lg"
      ? tokens.spacing.xl
      : tokens.spacing.lg;

  const iconSize =
    size === "sm"
      ? tokens.sizes.icon.sm
      : size === "lg"
      ? tokens.sizes.icon.lg
      : size === "icon"
      ? tokens.sizes.icon.lg
      : tokens.sizes.icon.md;

  const base = {
    fg: colors.onSurface,
    muted: colors.onSurfaceVariant,
    border: colors.outline,
    surface: colors.surface,
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    danger: colors.error,
    onDanger: colors.onError,
  };

  const palette = disabled
    ? {
        bg: colors.surfaceDisabled,
        fg: colors.onSurfaceDisabled,
        border: colors.surfaceDisabled,
      }
    : variant === "default"
    ? { bg: base.primary, fg: base.onPrimary, border: "transparent" }
    : variant === "secondary"
    ? { bg: base.surface, fg: base.fg, border: base.border }
    : variant === "destructive"
    ? { bg: base.danger, fg: base.onDanger, border: "transparent" }
    : variant === "outline"
    ? { bg: "transparent", fg: base.fg, border: base.border }
    : variant === "ghost"
    ? { bg: "transparent", fg: base.fg, border: "transparent" }
    : { bg: "transparent", fg: base.primary, border: "transparent" };

  const [pressed, setPressed] = React.useState(false);

  const shadow = Platform.select({
    ios:
      variant === "default" || variant === "destructive"
        ? {
            shadowColor: colors.shadow,
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }
        : undefined,
    android: undefined,
    default: undefined,
  });

  const content = loading ? (
    <ActivityIndicator size="small" color={palette.fg as string} />
  ) : (
    <>
      {IconLeft ? (
        <IconLeft color={palette.fg as string} size={iconSize} />
      ) : null}
      {typeof children === "string" ? (
        <Text
          style={{
            color: palette.fg as string,
            fontFamily: "Inter_500Medium",
            fontWeight: "500",
            fontSize:
              size === "sm"
                ? tokens.typography.sizes.sm
                : size === "lg"
                ? tokens.typography.sizes.lg
                : tokens.typography.sizes.md,
            lineHeight: Math.round(
              (size === "sm"
                ? tokens.typography.sizes.sm
                : size === "lg"
                ? tokens.typography.sizes.lg
                : tokens.typography.sizes.md) * 1.25
            ),
            textDecorationLine: variant === "link" ? "underline" : "none",
          }}
          numberOfLines={1}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {IconRight ? (
        <IconRight color={palette.fg as string} size={iconSize} />
      ) : null}
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled || loading}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      android_ripple={
        disabled || loading
          ? undefined
          : { color: dark ? "#ffffff22" : "#00000011", borderless: false }
      }
      hitSlop={tokens.sizes.touch.hitSlop}
      style={[
        {
          alignSelf: fullWidth ? "stretch" : "auto",
          minHeight: h,
          paddingHorizontal: padX,
          borderRadius: radius,
          backgroundColor: palette.bg as string,
          borderWidth:
            variant === "outline" || variant === "secondary"
              ? StyleSheet.hairlineWidth
              : 0,
          borderColor: palette.border as string,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: tokens.spacing.xs,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        shadow as any,
        size === "icon" ? { width: h, paddingHorizontal: 0 } : null,
        style,
      ]}
    >
      {variant === "ghost" || variant === "link" ? (
        <View style={{ paddingVertical: tokens.spacing.xs }}>{content}</View>
      ) : (
        content
      )}
    </Pressable>
  );
}
