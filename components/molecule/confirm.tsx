import React from "react";
import { View, Pressable, Platform } from "react-native";
import { Text, useTheme, Divider } from "react-native-paper";
import { Button } from "../../components/atom/button";
import { useDesign } from "../../contexts/designContext";
import type { ConfirmOptions } from "../../contexts/overlayContext";

export function ConfirmDialog({
  visible,
  state,
  onOk,
  onCancel,
}: {
  visible: boolean;
  state: ConfirmOptions | null;
  onOk: () => void;
  onCancel: () => void;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  if (!visible || !state) return null;

  const okVariant = state.variant === "error" ? "destructive" : "default";

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      accessible
      accessibilityLabel={state.title ?? "Confirmation dialog"}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      <Pressable
        onPress={onCancel}
        accessible={false}
        style={{ position: "absolute", inset: 0, backgroundColor: "#00000088" }}
      />

      <View
        style={{
          width: "90%",
          maxWidth: 420,
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
            backgroundColor: colors.surface,
            borderRadius: tokens.radii.lg,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.outlineVariant,
          }}
        >
          {state.title ? (
            <View
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingTop: tokens.spacing.lg,
                paddingBottom: tokens.spacing.xs,
              }}
            >
              <Text
                style={{
                  color: colors.onBackground,
                  fontSize: tokens.typography.sizes.lg,
                  fontWeight: tokens.typography.weights.semibold,
                }}
              >
                {state.title}
              </Text>
            </View>
          ) : null}

          {state.message ? (
            <View
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingBottom: tokens.spacing.lg,
              }}
            >
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: tokens.typography.sizes.md,
                  fontWeight: tokens.typography.weights.reg,
                }}
              >
                {state.message}
              </Text>
            </View>
          ) : null}

          <Divider
            style={{ backgroundColor: colors.outlineVariant, opacity: 0.6 }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: tokens.spacing.sm,
              padding: tokens.spacing.md,
              paddingHorizontal: tokens.spacing.lg,
            }}
          >
            <Button variant="secondary" onPress={onCancel} rounded="sm">
              {state.cancelText ?? "Cancel"}
            </Button>
            <Button variant={okVariant as any} onPress={onOk} rounded="sm">
              {state.okText ?? "OK"}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
