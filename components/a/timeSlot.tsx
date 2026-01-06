import React, { useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

export type TimeSlot = {
  time: string;
  status: "Available" | "Booked";
};

type Props = {
  slots: TimeSlot[];
  onChange?: (range: { start: string; end: string } | null) => void;
};

const toMinutes = (range: string) => {
  const [start] = range.split("-");
  const [h, m] = start.split(":").map(Number);
  return h * 60 + m;
};

const format = (range: string) => {
  const [start] = range.split("-");
  const [h, m] = start.split(":").map(Number);
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

export default function RoomTimeSlots({ slots, onChange }: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const ordered = useMemo(
    () =>
      [...slots]
        .sort((a, b) => toMinutes(a.time) - toMinutes(b.time))
        .filter((s) => toMinutes(s.time) >= nowMinutes + 30),
    [slots, nowMinutes]
  );

  const [anchor, setAnchor] = useState<number | null>(null);
  const [range, setRange] = useState<[number, number] | null>(null);

  const hasBlockBetween = (a: number, b: number) => {
    const [min, max] = a < b ? [a, b] : [b, a];
    return ordered.slice(min, max + 1).some((s) => s.status === "Booked");
  };

  const select = (i: number) => {
    if (ordered[i].status === "Booked") return;

    if (anchor === null) {
      setAnchor(i);
      setRange([i, i]);
      const [start, end] = ordered[i].time.split("-");
      onChange?.({ start, end });
      return;
    }

    if (anchor === i) {
      setAnchor(null);
      setRange(null);
      onChange?.(null);
      return;
    }

    if (hasBlockBetween(anchor, i)) return;

    const next: [number, number] = anchor < i ? [anchor, i] : [i, anchor];

    setRange(next);
    const start = ordered[next[0]].time.split("-")[0];
    const end = ordered[next[1]].time.split("-")[1];
    onChange?.({ start, end });
  };

  return (
    <View style={{ gap: tokens.spacing.sm }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: tokens.spacing.sm,
        }}
      >
        {ordered.map((slot, i) => {
          const selected = range && i >= range[0] && i <= range[1];
          const disabled =
            slot.status === "Booked" ||
            (anchor !== null && !selected && hasBlockBetween(anchor, i));

          return (
            <Pressable
              key={slot.time}
              disabled={disabled}
              onPress={() => select(i)}
              style={{
                width: "30%",
                paddingVertical: tokens.spacing.sm,
                borderRadius: tokens.radii.lg,
                alignItems: "center",
                backgroundColor:
                  slot.status === "Booked"
                    ? colors.surfaceDisabled
                    : selected
                    ? colors.primary
                    : colors.primaryContainer,
                opacity: disabled ? 0.35 : 1,
              }}
            >
              <Text
                variant="labelSmall"
                style={{
                  fontWeight: "600",
                  color:
                    slot.status === "Booked"
                      ? colors.onSurfaceDisabled
                      : selected
                      ? colors.onPrimary
                      : colors.onPrimaryContainer,
                }}
              >
                {format(slot.time)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {range && (
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {ordered[range[0]].time.split("-")[0]} –{" "}
          {ordered[range[1]].time.split("-")[1]}
        </Text>
      )}
    </View>
  );
}
