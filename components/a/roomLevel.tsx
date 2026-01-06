import React, { useState } from "react";
import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import RoomTimeSlots, { TimeSlot } from "./timeSlot";
import { router } from "expo-router";

export type UiRoom = {
  id: string;
  name: string;
  capacity: number;
  tower: string;
  level: number;
  slots: TimeSlot[];
};

type Props = {
  tower: string;
  level: number;
  rooms: UiRoom[];
  date: string;
};

export default function RoomLevel({ tower, level, rooms, date }: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const [ranges, setRanges] = useState<
    Record<string, { start: string; end: string } | null>
  >({});

  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <Text
        variant="labelLarge"
        style={{
          color: colors.onSurfaceVariant,
          fontWeight: "600",
          paddingHorizontal: tokens.spacing.sm,
        }}
      >
        {tower} · Level {level}
      </Text>

      {rooms.map((room) => {
        const range = ranges[room.id];

        return (
          <View
            key={room.id}
            style={{
              backgroundColor: colors.surface,
              borderRadius: tokens.radii["2xl"],
              padding: tokens.spacing.lg,
              gap: tokens.spacing.md,
            }}
          >
            <Text variant="titleMedium" style={{ fontWeight: "700" }}>
              {room.name}
            </Text>

            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              Capacity {room.capacity} pax
            </Text>

            <RoomTimeSlots
              slots={room.slots}
              onChange={(r) => setRanges((prev) => ({ ...prev, [room.id]: r }))}
            />

            <Button
              mode="contained"
              disabled={!range}
              onPress={() =>
                router.push({
                  pathname: "/a/room/book",
                  params: {
                    roomId: room.id,
                    date,
                    start: range?.start,
                    end: range?.end,
                  },
                })
              }
            >
              {range
                ? `Book ${range.start} – ${range.end}`
                : "Select time range"}
            </Button>
          </View>
        );
      })}
    </View>
  );
}
