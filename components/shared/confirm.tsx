import React, { useEffect, useRef } from "react";
import { View, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { BlurView } from "expo-blur";
import {
  HelpCircle,
  AlertTriangle,
  XCircle,
  LucideIcon,
} from "lucide-react-native";
import { ConfirmOptions, Variant } from "../../contexts/overlayContext";
import { useDesign } from "../../contexts/designContext";

type Props = {
  visible: boolean;
  state: ConfirmOptions | null;
  onOk: () => void;
  onCancel: () => void;
};

const iconMap: Record<Variant, LucideIcon> = {
  neutral: HelpCircle,
  info: HelpCircle,
  success: HelpCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const tone = (colors: any, variant: Variant) => {
  switch (variant) {
    case "error":
      return { fg: colors.error, bg: colors.errorContainer };
    case "warning":
      return { fg: colors.tertiary, bg: colors.tertiaryContainer };
    case "success":
      return { fg: colors.primary, bg: colors.primaryContainer };
    case "info":
      return { fg: colors.secondary, bg: colors.secondaryContainer };
    default:
      return {
        fg: colors.onSurfaceVariant,
        bg: colors.surfaceVariant,
      };
  }
};

export default function ConfirmDialog({
  visible,
  state,
  onOk,
  onCancel,
}: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    if (visible && state) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 20,
          stiffness: 220,
          mass: 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, state]);

  if (!visible || !state) return null;

  const variant: Variant = state.variant ?? "neutral";
  const Icon = iconMap[variant];
  const { fg, bg } = tone(colors, variant);

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 100 }}>
      <Pressable style={{ flex: 1 }} onPress={onCancel}>
        <Animated.View style={{ flex: 1, opacity: backdropOpacity }}>
          <BlurView intensity={48} tint="default" style={{ flex: 1 }} />
        </Animated.View>
      </Pressable>

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: "32%",
          left: tokens.spacing.lg,
          right: tokens.spacing.lg,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii.xl,
            padding: tokens.spacing.xl,
            gap: tokens.spacing.md,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 12,
            opacity,
            transform: [{ scale }, { translateY }],
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={28} color={fg} />
          </View>

          {state.title && (
            <Text variant="titleMedium" style={{ textAlign: "center" }}>
              {state.title}
            </Text>
          )}

          {state.message && (
            <Text
              variant="bodyMedium"
              style={{
                textAlign: "center",
                color: colors.onSurfaceVariant,
              }}
            >
              {state.message}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.sm,
              marginTop: tokens.spacing.sm,
              alignSelf: "stretch",
            }}
          >
            <Button
              mode="outlined"
              onPress={onCancel}
              contentStyle={{ height: 46 }}
              style={{ flex: 1, borderRadius: tokens.radii.lg }}
            >
              {state.cancelText ?? "Cancel"}
            </Button>

            <Button
              mode="contained"
              onPress={onOk}
              contentStyle={{ height: 46 }}
              style={{ flex: 1, borderRadius: tokens.radii.lg }}
            >
              {state.okText ?? "OK"}
            </Button>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
