import React from "react";
import { View, Pressable, Platform } from "react-native";
import { useTheme, Divider, Text } from "react-native-paper";
import { Button } from "../../components/atom/button";
import { useDesign } from "../../contexts/designContext";
import type { AlertOptions } from "../../contexts/overlayContext";

export function AlertDialog({
  visible,
  state,
  onDismiss,
}: {
  visible: boolean;
  state: AlertOptions | null;
  onDismiss: () => void;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  if (!visible || !state) return null;

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
        onPress={onDismiss}
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
              padding: tokens.spacing.md,
              paddingHorizontal: tokens.spacing.lg,
            }}
          >
            <Button mode="contained" onPress={onDismiss}>
              OK
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
