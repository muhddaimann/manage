import React from "react";
import { View } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import {
  CalendarClock,
  Building,
  Layers,
  Users,
  DoorOpen,
} from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";

type Props = {
  booking: {
    booking_id: string | number;
    Room_Name: string;
    Event_Name: string;
    uiDate: string;
    uiTime: string;
    Tower?: string;
    Level?: string;
    Capacity?: number;
    status: "ACTIVE" | "PAST";
  };
  onWithdraw?: () => void;
  bookingLoading?: boolean;
};

export default function RecordModal({
  booking,
  onWithdraw,
  bookingLoading,
}: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const isActive = booking.status === "ACTIVE";

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii["2xl"],
        paddingVertical: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.xl,
        gap: tokens.spacing.lg,
        shadowColor: colors.shadow,
        shadowOpacity: 0.18,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 16,
      }}
    >
      <View style={{ gap: 4 }}>
        <Text
          variant="titleLarge"
          style={{ fontWeight: "800" }}
          numberOfLines={2}
        >
          {booking.Event_Name}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <DoorOpen size={14} color={colors.onSurfaceVariant} />
          <Text
            variant="bodyMedium"
            style={{ color: colors.onSurfaceVariant }}
            numberOfLines={1}
          >
            {booking.Room_Name}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.background,
          borderRadius: tokens.radii.lg,
          padding: tokens.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: tokens.spacing.xs,
        }}
      >
        <CalendarClock size={18} color={colors.primary} />
        <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
          {booking.uiDate}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: colors.onSurfaceVariant }}
          numberOfLines={1}
        >
          · {booking.uiTime}
        </Text>
      </View>

      {(booking.Tower || booking.Level || booking.Capacity !== undefined) && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: tokens.spacing.md,
          }}
        >
          {booking.Tower && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Building size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodySmall" numberOfLines={1}>
                {booking.Tower}
              </Text>
            </View>
          )}

          {booking.Level && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Layers size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodySmall" numberOfLines={1}>
                {booking.Level}
              </Text>
            </View>
          )}

          {typeof booking.Capacity === "number" && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Users size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodySmall">{booking.Capacity} pax</Text>
            </View>
          )}
        </View>
      )}

      {isActive ? (
        onWithdraw && (
          <Button
            mode="contained"
            buttonColor={colors.error}
            textColor={colors.onError}
            contentStyle={{ height: 46 }}
            onPress={onWithdraw}
            loading={bookingLoading}
            disabled={bookingLoading}
          >
            Withdraw booking
          </Button>
        )
      ) : (
        <Button
          mode="outlined"
          disabled
          contentStyle={{ height: 46 }}
          textColor={colors.onSurfaceVariant}
        >
          Past booking
        </Button>
      )}
    </View>
  );
}
