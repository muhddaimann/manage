import React from "react";
import { View } from "react-native";
import { Text, useTheme, Divider, Button } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { ApplicationListItem } from "./applicationList";

export default function ApplicationModal({
  item,
  mode,
  onClose,
}: {
  item: ApplicationListItem;
  mode: "LEAVE" | "OVERTIME";
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const statusTone = {
    PENDING: colors.secondary,
    APPROVED: colors.tertiary,
    REJECTED: colors.error,
  }[item.status];

  const isPending = item.status === "PENDING";
  const isApproved = item.status === "APPROVED";
  const isRejected = item.status === "REJECTED";

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.xl,
        padding: tokens.spacing.xl,
        gap: tokens.spacing.md,
      }}
    >
      <Text variant="titleMedium">{item.primary}</Text>

      <View
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: 6,
          borderRadius: tokens.radii.full,
          backgroundColor: statusTone + "22",
        }}
      >
        <Text style={{ color: statusTone, fontWeight: "700" }}>
          {item.status}
        </Text>
      </View>

      <Divider />

      {item.secondary && (
        <View style={{ gap: 4 }}>
          <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
            Period
          </Text>
          <Text>{item.secondary}</Text>
        </View>
      )}

      {item.meta && (
        <View style={{ gap: 4 }}>
          <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
            {mode === "LEAVE" ? "Duration" : "Details"}
          </Text>
          <Text>{item.meta}</Text>
        </View>
      )}

      <View style={{ height: tokens.spacing.sm }} />

      <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
        {isPending && (
          <Button
            mode="contained"
            onPress={onClose}
            buttonColor={colors.error}
            textColor={colors.onError}
            style={{ flex: 1, borderRadius: tokens.radii.lg }}
            contentStyle={{ height: 46 }}
          >
            Withdraw
          </Button>
        )}

        {isApproved && (
          <Button
            mode="contained"
            disabled
            style={{ flex: 1, borderRadius: tokens.radii.lg }}
            contentStyle={{ height: 46 }}
          >
            Approved
          </Button>
        )}

        {isRejected && (
          <Button
            mode="contained"
            disabled
            buttonColor={colors.errorContainer}
            textColor={colors.onErrorContainer}
            style={{ flex: 1, borderRadius: tokens.radii.lg }}
            contentStyle={{ height: 46 }}
          >
            Rejected
          </Button>
        )}
      </View>
    </View>
  );
}
