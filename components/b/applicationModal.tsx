import React from "react";
import { View } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { LeaveListItem } from "./applicationList";

export default function LeaveModal({
  item,
  onWithdraw,
}: {
  item: LeaveListItem;
  onClose: () => void;
  onWithdraw?: (leaveId: number) => void;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const leave = item.raw;
  const isPending = item.status === "PENDING";

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.xl,
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.lg,
        gap: tokens.spacing.sm,
      }}
    >
      <View style={{ gap: tokens.spacing.xxs }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Text variant="titleLarge" style={{ fontWeight: "700", flex: 1 }}>
            {leave.leave_name}
          </Text>

          <View
            style={{
              paddingHorizontal: tokens.spacing.md,
              paddingVertical: 6,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.primaryContainer,
            }}
          >
            <Text
              variant="labelSmall"
              style={{
                color: colors.onPrimaryContainer,
                fontWeight: "700",
              }}
            >
              #{leave.leave_id}
            </Text>
          </View>
        </View>

        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          {item.secondary}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: tokens.spacing.sm,
        }}
      >
        <View
          style={{
            paddingHorizontal: tokens.spacing.md,
            paddingVertical: 6,
            borderRadius: tokens.radii.full,
            backgroundColor: item.statusColors.container,
          }}
        >
          <Text
            variant="labelSmall"
            style={{
              color: item.statusColors.onContainer,
              fontWeight: "700",
            }}
          >
            {item.statusMeta.label}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.md,
            paddingVertical: 6,
            borderRadius: tokens.radii.full,
            backgroundColor: colors.surfaceVariant,
          }}
        >
          <Text
            variant="labelSmall"
            style={{
              color: colors.onSurfaceVariant,
              fontWeight: "600",
            }}
          >
            {leave.leave_period}
          </Text>
        </View>
      </View>

      {leave.reason && (
        <View style={{ gap: 4 }}>
          <Text
            variant="labelMedium"
            style={{ color: colors.onSurfaceVariant }}
          >
            Reason
          </Text>
          <Text variant="bodyMedium">{leave.reason}</Text>
        </View>
      )}

      {leave.remarks && (
        <View style={{ gap: 4 }}>
          <Text
            variant="labelMedium"
            style={{ color: colors.onSurfaceVariant }}
          >
            Remarks
          </Text>
          <Text variant="bodyMedium">{leave.remarks}</Text>
        </View>
      )}

      {leave.cancellation_dt && (
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
          Cancelled on {leave.cancellation_dt}
        </Text>
      )}

      {isPending && (
        <Button
          mode="contained"
          onPress={() => onWithdraw?.(leave.leave_id)}
          style={{
            marginTop: tokens.spacing.sm,
            borderRadius: tokens.radii.lg,
            borderColor: colors.error,
          }}
          buttonColor={colors.error}
          textColor={colors.onError}
          contentStyle={{ height: 44 }}
        >
          Withdraw
        </Button>
      )}
    </View>
  );
}
