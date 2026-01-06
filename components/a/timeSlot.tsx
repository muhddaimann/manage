import React, { useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

export type TimeSlot = {
  start: string;
  end: string;
  available: boolean;
};

type Props = {
  slots: TimeSlot[];
  onChange?: (range: { start: string; end: string } | null) => void;
};

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const format = (t: string) => {
  const [h, m] = t.split(":").map(Number);
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
        .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
        .filter((s) => toMinutes(s.start) >= nowMinutes + 30),
    [slots, nowMinutes]
  );

  const [anchor, setAnchor] = useState<number | null>(null);
  const [range, setRange] = useState<[number, number] | null>(null);

  const hasBlockBetween = (a: number, b: number) => {
    const [min, max] = a < b ? [a, b] : [b, a];
    return ordered.slice(min, max + 1).some((s) => !s.available);
  };

  const select = (i: number) => {
    if (!ordered[i].available) return;

    if (anchor === null) {
      setAnchor(i);
      setRange([i, i]);
      onChange?.({ start: ordered[i].start, end: ordered[i].end });
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
    onChange?.({
      start: ordered[next[0]].start,
      end: ordered[next[1]].end,
    });
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
            !slot.available ||
            (anchor !== null && !selected && hasBlockBetween(anchor, i));

          return (
            <Pressable
              key={`${slot.start}-${slot.end}`}
              disabled={disabled}
              onPress={() => select(i)}
              style={{
                width: "30%",
                paddingVertical: tokens.spacing.sm,
                borderRadius: tokens.radii.lg,
                alignItems: "center",
                backgroundColor: !slot.available
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
                  color: !slot.available
                    ? colors.onSurfaceDisabled
                    : selected
                    ? colors.onPrimary
                    : colors.onPrimaryContainer,
                }}
              >
                {format(slot.start)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {range && (
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {format(ordered[range[0]].start)} – {format(ordered[range[1]].end)}
        </Text>
      )}
    </View>
  );
}
