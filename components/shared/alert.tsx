import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { BlurView } from "expo-blur";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react-native";
import { AlertOptions } from "../../contexts/overlayContext";
import { useDesign } from "../../contexts/designContext";

type Props = {
  visible: boolean;
  state: AlertOptions | null;
  onDismiss: () => void;
};

const iconMap = {
  neutral: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const tone = (colors: any, variant?: AlertOptions["variant"]) => {
  switch (variant) {
    case "success":
      return { fg: colors.primary, bg: colors.primaryContainer };
    case "warning":
      return { fg: colors.tertiary, bg: colors.tertiaryContainer };
    case "error":
      return { fg: colors.error, bg: colors.errorContainer };
    case "info":
      return { fg: colors.secondary, bg: colors.secondaryContainer };
    default:
      return { fg: colors.onSurfaceVariant, bg: colors.surfaceVariant };
  }
};

export default function AlertDialog({ visible, state, onDismiss }: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const [rendered, setRendered] = useState(false);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    if (visible && state) {
      setRendered(true);

      backdropOpacity.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.92);
      translateY.setValue(18);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
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
    } else if (rendered) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 140,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 140,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 140,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: 140,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRendered(false);
      });
    }
  }, [visible, state]);

  if (!rendered || !state) return null;

  const variant = state.variant ?? "neutral";
  const Icon = iconMap[variant];
  const { fg, bg } = tone(colors, variant);

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 100 }}>
      <Pressable style={{ flex: 1 }} onPress={onDismiss}>
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
            borderRadius: tokens.radii["2xl"] ?? tokens.radii.xl,
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

          <Button
            mode="contained"
            onPress={onDismiss}
            contentStyle={{ height: 46 }}
            style={{
              marginTop: tokens.spacing.sm,
              borderRadius: tokens.radii.lg,
              alignSelf: "stretch",
            }}
          >
            OK
          </Button>
        </Animated.View>
      </View>
    </View>
  );
}
