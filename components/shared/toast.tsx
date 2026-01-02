import React, { useEffect, useRef, useState } from "react";
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

  const [rendered, setRendered] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      setRendered(true);

      opacity.setValue(0);
      translateY.setValue(-100);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      const t = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 220,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration: 220,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start(() => {
          setRendered(false);
          onDismiss();
        });
      }, state.duration ?? 2600);

      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!rendered) return null;

  const variant: Variant = state.variant ?? "neutral";
  const Icon = iconMap[variant];
  const accent = accentColor(colors, variant);

  return (
    <View
      pointerEvents="box-none"
      style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 220,
      }}
    >
      <Animated.View
        style={{
          marginTop: tokens.spacing["3xl"],
          marginHorizontal: tokens.spacing.lg,
          opacity,
          transform: [{ translateY }],
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
                style={{ color: colors.onSurface, flex: 1 }}
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
