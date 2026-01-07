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

  const { container: bg, onContainer: fg } = item.statusColors;
  const isPending = item.status === "PENDING";

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.xl,
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.md,
        gap: tokens.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: tokens.spacing.md,
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
            backgroundColor: bg,
          }}
        >
          <Text variant="labelMedium" style={{ color: fg, fontWeight: "700" }}>
            {item.statusMeta.label}
          </Text>
        </View>
      </View>

      <View style={{ gap: 2 }}>
        <Text variant="bodyLarge">
          {leave.start === leave.end
            ? leave.start
            : `${leave.start} → ${leave.end}`}
        </Text>

        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          {leave.duration_name} · {leave.leave_period}
        </Text>
      </View>

      {leave.reason && (
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          “{leave.reason}”
        </Text>
      )}

      {leave.cancellation_dt && (
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
          Cancelled on {leave.cancellation_dt}
        </Text>
      )}

      {isPending && (
        <Button
          mode="outlined"
          onPress={() => onWithdraw?.(leave.leave_id)}
          style={{
            marginTop: tokens.spacing.xs,
            borderRadius: tokens.radii.lg,
            borderColor: colors.error,
          }}
          textColor={colors.error}
          contentStyle={{ height: 44 }}
        >
          Withdraw
        </Button>
      )}
    </View>
  );
}
