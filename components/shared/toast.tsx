import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LucideIcon,
} from "lucide-react-native";
import { ToastOptions, Variant } from "../../contexts/overlayContext";
import { useDesign } from "../../contexts/designContext";

type Props = {
  visible: boolean;
  state: ToastOptions;
  onDismiss: () => void;
};

const iconMap: Record<Variant, LucideIcon> = {
  neutral: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const accentColor = (colors: any, variant: Variant) => {
  switch (variant) {
    case "success":
      return colors.tertiary;
    case "warning":
      return colors.error;
    case "error":
      return colors.error;
    case "info":
      return colors.primary;
    default:
      return colors.secondary;
  }
};

export default function ToastBar({ visible, state, onDismiss }: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(32)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          stiffness: 260,
          mass: 0.7,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 22,
          stiffness: 240,
          mass: 0.7,
          useNativeDriver: true,
        }),
      ]).start();

      const t = setTimeout(onDismiss, state.duration ?? 2600);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!visible) return null;

  const variant: Variant = state.variant ?? "neutral";
  const Icon = iconMap[variant];
  const accent = accentColor(colors, variant);

  return (
    <View
      pointerEvents="box-none"
      style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 220,
        justifyContent: "flex-end",
      }}
    >
      <Animated.View
        style={{
          marginHorizontal: tokens.spacing.lg,
          marginBottom: tokens.spacing["3xl"],
          opacity,
          transform: [{ translateY }, { scale }],
        }}
      >
        <Pressable onPress={onDismiss}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: tokens.radii["2xl"],
              borderWidth: 1,
              borderColor: accent + "55",
              elevation: 10,
              shadowColor: accent,
              shadowOpacity: 0.18,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 10 },
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: tokens.spacing.md,
                paddingHorizontal: tokens.spacing.lg,
                gap: tokens.spacing.md,
              }}
            >
              <Icon size={26} color={accent} />

              <Text
                variant="bodyMedium"
                numberOfLines={2}
                style={{
                  color: colors.onSurface,
                  flex: 1,
                }}
              >
                {state.message}
              </Text>

              {state.actionLabel && (
                <Pressable
                  onPress={() => {
                    state.onAction?.();
                    onDismiss();
                  }}
                  style={{
                    paddingHorizontal: tokens.spacing.sm,
                    paddingVertical: tokens.spacing.xs,
                  }}
                >
                  <Text variant="labelLarge" style={{ color: accent }}>
                    {state.actionLabel}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}
