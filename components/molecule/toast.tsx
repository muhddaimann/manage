import React, { useEffect, useMemo, useRef } from "react";
import { View, Pressable, Animated, Platform } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import type { ToastOptions } from "../../contexts/overlayContext";
import { Button } from "../../components/atom/button";

const hex = (c: string) => {
  const s = c.replace("#", "");
  const n =
    s.length === 3
      ? s
          .split("")
          .map((x) => x + x)
          .join("")
      : s;
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
};
const mix = (a: string, b: string, t: number) => {
  const A = hex(a),
    B = hex(b);
  const r = Math.round(A.r + (B.r - A.r) * t);
  const g = Math.round(A.g + (B.g - A.g) * t);
  const b2 = Math.round(A.b + (B.b - A.b) * t);
  return `rgb(${r}, ${g}, ${b2})`;
};

export function ToastBar({
  visible,
  state,
  onDismiss,
}: {
  visible: boolean;
  state: ToastOptions;
  onDismiss: () => void;
}) {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const { bg, fg, border } = useMemo(() => {
    const base =
      state.variant === "success"
        ? colors.tertiary
        : state.variant === "warning"
        ? colors.secondary
        : state.variant === "error"
        ? colors.error
        : colors.primary;

    const t = dark ? 0.2 : 0.12;
    const softBg = mix(colors.surface, base, t);
    const brd = mix(softBg, colors.outlineVariant, 0.6);
    const fg = colors.onSurface;

    return { bg: softBg, fg, border: brd };
  }, [state.variant, colors, dark]);

  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]);
    const hide = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 80,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]);
    (visible ? show : hide).start();
  }, [visible, translateY, opacity]);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onDismiss, state.duration ?? 2500);
    return () => clearTimeout(id);
  }, [visible, state.duration, onDismiss]);

  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: tokens.spacing.lg,
        paddingBottom: Math.max(insets.bottom, tokens.spacing.lg),
        zIndex: 9999,
        ...(Platform.OS === "android" ? { elevation: 9999 } : null),
      }}
    >
      <Animated.View style={{ transform: [{ translateY }], opacity }}>
        <View
          style={{
            borderRadius: tokens.radii.lg,
            backgroundColor: "transparent",
            ...Platform.select({
              ios: {
                shadowColor: colors.shadow,
                shadowOpacity: 0.18,
                shadowRadius: tokens.elevation.level5 * 2,
                shadowOffset: { width: 0, height: tokens.elevation.level5 },
              },
              android: { elevation: tokens.elevation.level5 },
              default: { elevation: tokens.elevation.level5 },
            }),
          }}
        >
          <View
            style={{
              backgroundColor: bg,
              borderRadius: tokens.radii.lg,
              overflow: "hidden",
              paddingVertical: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.md,
              borderWidth: 1,
              borderColor: border,
            }}
          >
            <Pressable
              onPress={onDismiss}
              accessibilityLabel="Dismiss notification"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.sm,
              }}
            >
              <View style={{ flex: 1, paddingVertical: tokens.spacing.xs }}>
                <Text
                  style={{
                    color: fg,
                    fontSize: tokens.typography.sizes.md,
                    fontWeight: tokens.typography.weights.reg,
                  }}
                  numberOfLines={2}
                >
                  {state.message}
                </Text>
              </View>

              {state.actionLabel ? (
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => {
                    state.onAction?.();
                    onDismiss();
                  }}
                  rounded="sm"
                  style={{ paddingHorizontal: 0, paddingVertical: 0 }}
                >
                  <Text style={{ color: fg, fontWeight: "600" }}>
                    {state.actionLabel}
                  </Text>
                </Button>
              ) : null}
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
