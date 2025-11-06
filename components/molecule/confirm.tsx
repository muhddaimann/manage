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

  const okIsDestructive = state.variant === "error";

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={onCancel}
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
          }}
        >
          {state.title ? (
            <View
              style={{
                padding: tokens.spacing.lg,
                paddingBottom: tokens.spacing.sm,
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
              gap: tokens.spacing.xs,
              padding: tokens.spacing.md,
              paddingHorizontal: tokens.spacing.lg,
            }}
          >
            <Button mode="text" onPress={onCancel}>
              {state.cancelText ?? "Cancel"}
            </Button>
            <Button
              mode="contained"
              onPress={onOk}
              tone={okIsDestructive ? "error" : "primary"}
            >
              {state.okText ?? "OK"}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
