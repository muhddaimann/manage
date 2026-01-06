// RoomLevel.tsx — total redesign (clean hierarchy, smart range, AM/PM, reusable)

import React, { useState } from "react";
import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import RoomTimeSlots, { TimeSlot } from "./timeSlot";

export type Room = {
  id: string;
  name: string;
  capacity: number;
  tower: string;
  level: number;
  slots: TimeSlot[];
};

type RoomLevelProps = {
  tower: string;
  level: number;
  rooms: Room[];
};

export default function RoomLevel({ tower, level, rooms }: RoomLevelProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const [ranges, setRanges] = useState<
    Record<string, { start: string; end: string } | null>
  >({});

  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <View
        style={{
          paddingHorizontal: tokens.spacing.sm,
          paddingTop: tokens.spacing.sm,
        }}
      >
        <Text
          variant="labelLarge"
          style={{ color: colors.onSurfaceVariant, fontWeight: "600" }}
        >
          {tower} · Level {level}
        </Text>
      </View>

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
              shadowColor: colors.shadow,
              shadowOpacity: 0.12,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            }}
          >
            <View style={{ gap: 2 }}>
              <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                {room.name}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Capacity {room.capacity} pax
              </Text>
            </View>

            <RoomTimeSlots
              slots={room.slots}
              onChange={(r) =>
                setRanges((prev) => ({
                  ...prev,
                  [room.id]: r,
                }))
              }
            />

            <Button
              mode="contained"
              disabled={!range}
              contentStyle={{ height: 44 }}
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
