import React, { useEffect, useMemo } from "react";
import { View, ScrollView, Dimensions, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CalendarClock, Users, Building, Layers } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import BlockSkeleton from "../shared/blockSkeleton";
import NoData from "../shared/noData";
import useRoom, { type SelectedSlot } from "../../hooks/useRoom";
import type { Room } from "../../contexts/api/room";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RoomModal({
  roomId,
  roomName,
  date,
  onConfirm,
}: {
  roomId: number;
  roomName: string;
  date: string;
  onConfirm: (selection: SelectedSlot, details: Room) => void;
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
    selection,
    onSelectSlot,
    isSlotSelected,
  } = useRoom(date);

  const key = `${roomId}_${date}`;

  useEffect(() => {
    fetchAvailability(roomId);
  }, [roomId, fetchAvailability]);

  const details = roomDetails[key];
  const timeSlotRows = getTimeSlotRows(roomId);
  const loading = roomsLoading || availabilityLoading[key];

  const confirmLabel = useMemo(() => {
    if (!selection) return "Select time slot";
    if (selection.startTime === selection.endTime) {
      return `Confirm ${selection.startTime}`;
    }
    return `Confirm ${selection.startTime} - ${selection.endTime}`;
  }, [selection]);

  return (
    <View
      style={{
        alignSelf: "center",
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.xl,
        padding: tokens.spacing.lg,
        width: SCREEN_WIDTH * 0.9,
        maxHeight: SCREEN_HEIGHT * 0.8,
        gap: tokens.spacing.md,
      }}
    >
      <View style={{ gap: 6 }}>
        <Text variant="titleLarge" style={{ fontWeight: "700" }}>
          {roomName}
        </Text>

        {loading ? (
          <BlockSkeleton width="65%" height={20} />
        ) : details ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              flexWrap: "wrap",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Building size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                {details.Tower}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Layers size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                {details.Level}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Users size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
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
            {loading ? (
              <BlockSkeleton width={110} height={12} />
            ) : (
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                {formattedDate}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: tokens.radii.full,
                backgroundColor: colors.tertiaryContainer,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.onTertiaryContainer,
                }}
              />
              <Text
                variant="labelSmall"
                style={{ fontWeight: "600", color: colors.onTertiaryContainer }}
              >
                Available
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: tokens.radii.full,
                backgroundColor: colors.surfaceVariant,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.onSurfaceVariant,
                }}
              />
              <Text
                variant="labelSmall"
                style={{ fontWeight: "600", color: colors.onSurfaceVariant }}
              >
                Booked
              </Text>
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={{ gap: tokens.spacing.sm }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <BlockSkeleton key={i} height={44} radius={tokens.radii.lg} />
          ))}
        </View>
      ) : error ? (
        <NoData title="Error" subtitle={error} icon="alert-circle" />
      ) : timeSlotRows.length > 0 ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: tokens.spacing.sm }}>
              {timeSlotRows.map((row, rIdx) => (
                <View
                  key={rIdx}
                  style={{ flexDirection: "row", gap: tokens.spacing.sm }}
                >
                  {row.map(([time, slot]) => {
                    const available = slot.status === "Available";
                    const selected = isSlotSelected(roomId, time);

                    return (
                      <Pressable
                        key={time}
                        disabled={!available}
                        onPress={() =>
                          onSelectSlot(roomId, time, slot.status)
                        }
                        style={{
                          flex: 1,
                          paddingVertical: tokens.spacing.md,
                          borderRadius: tokens.radii.lg,
                          alignItems: "center",
                          backgroundColor: selected
                            ? colors.primary
                            : available
                            ? colors.tertiaryContainer
                            : colors.surfaceVariant,
                        }}
                      >
                        <Text
                          variant="bodyMedium"
                          style={{
                            fontWeight: "700",
                            color: selected
                              ? colors.onPrimary
                              : available
                              ? colors.onTertiaryContainer
                              : colors.onSurfaceVariant,
                          }}
                        >
                          {time}
                        </Text>
                      </Pressable>
                    );
                  })}
                  {row.length === 1 && <View style={{ flex: 1 }} />}
                </View>
              ))}
            </View>
          </ScrollView>

          <Pressable
            disabled={!selection || !details}
            onPress={() => {
              if (selection && details) {
                onConfirm(selection, details);
              }
            }}
            style={{
              paddingVertical: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              alignItems: "center",
              backgroundColor: selection
                ? colors.primary
                : colors.surfaceVariant,
            }}
          >
            <Text
              variant="labelLarge"
              style={{
                fontWeight: "700",
                color: selection
                  ? colors.onPrimary
                  : colors.onSurfaceVariant,
              }}
            >
              {confirmLabel}
            </Text>
          </Pressable>
        </>
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
