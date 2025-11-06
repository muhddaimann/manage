import React, { useEffect, useMemo, useRef } from "react";
import { View, Pressable, Animated, Platform } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { Button } from "../../components/atom/button";
import { useDesign } from "../../contexts/designContext";
import type { ToastOptions } from "../../contexts/overlayContext";

export function ToastBar({
  visible,
  state,
  onDismiss,
}: {
  visible: boolean;
  state: ToastOptions;
  onDismiss: () => void;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const { bg, fg } = useMemo(() => {
    const bg =
      state.variant === "info"
        ? colors.primary
        : state.variant === "success"
        ? colors.tertiary
        : state.variant === "warning"
        ? colors.secondary
        : state.variant === "error"
        ? colors.error
        : colors.inverseSurface ?? colors.surface;

    const fg =
      state.variant === "warning" ? "#1f1300" : colors.onPrimary ?? "#ffffff";
    return { bg, fg };
  }, [state.variant, colors]);

  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
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
      ]).start();
    } else {
      Animated.parallel([
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
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onDismiss, state.duration ?? 2500);
    return () => clearTimeout(id);
  }, [visible, state.duration, onDismiss]);

  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: tokens.spacing.lg,
        paddingBottom: tokens.spacing["2xl"],
      }}
    >
      <Animated.View style={{ transform: [{ translateY }], opacity }}>
        <View
          style={{
            borderRadius: tokens.radii.lg,
            backgroundColor: "transparent",
            ...Platform.select({
              ios: {
                shadowColor: "#000",
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
            }}
          >
            <Pressable
              onPress={onDismiss}
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
                  mode="text"
                  compact
                  onPress={() => {
                    state.onAction?.();
                    onDismiss();
                  }}
                  textColor={fg}
                  style={{ marginLeft: tokens.spacing.xs }}
                >
                  {state.actionLabel}
                </Button>
              ) : null}
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
