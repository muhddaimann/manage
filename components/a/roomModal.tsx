import React, { useEffect } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CalendarClock, Users, Building, Layers } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import FullLoading from "../shared/fullLoad";
import NoData from "../shared/noData";
import useRoom from "../../hooks/useRoom";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RoomModal({
  roomId,
  roomName,
  date,
}: {
  roomId: number;
  roomName: string;
  date: string;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const {
    roomsLoading,
    availabilityLoading,
    fetchAvailability,
    getTimeSlotRows,
    roomDetails,
    formattedDate,
    error,
  } = useRoom(date);

  const key = `${roomId}_${date}`;

  useEffect(() => {
    fetchAvailability(roomId);
  }, [roomId, fetchAvailability]);

  const details = roomDetails[key];
  const timeSlotRows = getTimeSlotRows(roomId);
  const loading = roomsLoading || availabilityLoading[key];

  return (
    <View
      style={{
        alignSelf: "center",
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.xl,
        padding: tokens.spacing.lg,
        width: SCREEN_WIDTH * 0.9,
        maxHeight: SCREEN_HEIGHT * 0.8,
        gap: tokens.spacing.lg,
      }}
    >
      <View style={{ gap: 6 }}>
        <Text variant="titleLarge" style={{ fontWeight: "700" }}>
          {roomName}
        </Text>

        {loading ? (
          <View
            style={{
              height: 28,
              width: "65%",
              backgroundColor: colors.surfaceVariant,
              borderRadius: tokens.radii.sm,
            }}
          />
        ) : details ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              flexWrap: "wrap",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Building size={14} color={colors.onSurfaceVariant} />
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                {details.Tower}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Layers size={14} color={colors.onSurfaceVariant} />
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                {details.Level}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Users size={14} color={colors.onSurfaceVariant} />
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                Capacity {details.Capacity}
              </Text>
            </View>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CalendarClock size={14} color={colors.onSurfaceVariant} />
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {formattedDate}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
            <View
              style={{
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: tokens.radii.full,
                backgroundColor: colors.tertiaryContainer,
              }}
            >
              <Text
                variant="labelSmall"
                style={{
                  fontWeight: "600",
                  color: colors.onTertiaryContainer,
                }}
              >
                Available
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: tokens.radii.full,
                backgroundColor: colors.surfaceVariant,
              }}
            >
              <Text
                variant="labelSmall"
                style={{
                  fontWeight: "600",
                  color: colors.onSurfaceVariant,
                }}
              >
                Booked
              </Text>
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <FullLoading layout={[2, 2, 2, 2]} />
      ) : error ? (
        <NoData title="Error" subtitle={error} icon="alert-circle" />
      ) : timeSlotRows.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: tokens.spacing.sm }}>
            {timeSlotRows.map((row, rIdx) => (
              <View
                key={rIdx}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: tokens.spacing.sm,
                }}
              >
                {row.map(([time, slot]) => {
                  const available = slot.status === "Available";
                  return (
                    <View
                      key={time}
                      style={{
                        flex: 1,
                        paddingVertical: tokens.spacing.md,
                        borderRadius: tokens.radii.lg,
                        alignItems: "center",
                        backgroundColor: available
                          ? colors.tertiaryContainer
                          : colors.surfaceVariant,
                      }}
                    >
                      <Text
                        variant="bodyMedium"
                        style={{
                          fontWeight: "700",
                          color: available
                            ? colors.onTertiaryContainer
                            : colors.onSurfaceVariant,
                        }}
                      >
                        {time}
                      </Text>
                    </View>
                  );
                })}
                {row.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <NoData
          title="No Slots"
          subtitle="This room has no available slots for the selected date."
          icon="calendar-remove"
        />
      )}
    </View>
  );
}
