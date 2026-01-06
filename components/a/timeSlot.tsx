// components/a/TimeSlot.tsx
import React, { useMemo, useRef, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

/* ================= TYPES ================= */

export type TimeSlotItem = {
  time: string; // "09:00-09:30"
  status: "Available" | "Booked";
};

export type TimeSlotRange = {
  start: string;
  end: string;
};

type Props = {
  slots: TimeSlotItem[];
  dateISO: string; // yyyy-mm-dd
  onConfirm: (range: TimeSlotRange) => void;
  onCancel?: () => void;
};

/* ================= HELPERS ================= */

const todayISO = () => new Date().toISOString().slice(0, 10);

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const formatSlot = (range: string) => {
  const [start] = range.split("-");
  const [h, m] = start.split(":").map(Number);
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/* ================= COMPONENT ================= */

export default function TimeSlot({
  slots,
  dateISO,
  onConfirm,
  onCancel,
}: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = dateISO === todayISO();

  const ordered = useMemo(() => {
    return slots
      .map((s) => ({
        ...s,
        startMin: toMinutes(s.time.split("-")[0]),
      }))
      .filter((s) => (!isToday ? true : s.startMin >= nowMinutes + 30))
      .sort((a, b) => a.startMin - b.startMin);
  }, [slots, isToday, nowMinutes]);

  const [range, setRange] = useState<TimeSlotRange | null>(null);

  const startIndex =
    range && ordered.findIndex((s) => s.time.startsWith(range.start));
  const endIndex =
    range && ordered.findIndex((s) => s.time.endsWith(range.end));

  const hasBookedBetween = (a: number, b: number) => {
    const [min, max] = a < b ? [a, b] : [b, a];
    return ordered.slice(min, max + 1).some((s) => s.status === "Booked");
  };

  const onSelect = (i: number) => {
    if (ordered[i].status === "Booked") return;

    if (!range) {
      const [start, end] = ordered[i].time.split("-");
      setRange({ start, end });
      return;
    }

    if (
      startIndex !== null &&
      endIndex !== null &&
      i === startIndex &&
      i === endIndex
    ) {
      setRange(null);
      return;
    }

    if (startIndex !== null && hasBookedBetween(startIndex, i)) return;

    const nextStart = Math.min(startIndex!, i);
    const nextEnd = Math.max(startIndex!, i);

    setRange({
      start: ordered[nextStart].time.split("-")[0],
      end: ordered[nextEnd].time.split("-")[1],
    });
  };

  if (ordered.length === 0) {
    return (
      <Text
        variant="bodySmall"
        style={{ color: colors.onSurfaceVariant, textAlign: "center" }}
      >
        No available time slots
      </Text>
    );
  }

  return (
    <View style={{ gap: tokens.spacing.md }}>
      {/* Horizontal Time Rail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: tokens.spacing.sm,
          paddingVertical: tokens.spacing.xs,
        }}
      >
        {ordered.map((slot, i) => {
          const selected =
            range &&
            startIndex !== null &&
            endIndex !== null &&
            i >= startIndex &&
            i <= endIndex;

          const blocked =
            range &&
            startIndex !== null &&
            !selected &&
            hasBookedBetween(startIndex, i);

          return (
            <Pressable
              key={slot.time}
              onPress={() => onSelect(i)}
              disabled={slot.status === "Booked" || blocked}
              style={{
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                borderRadius: tokens.radii.xl,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  slot.status === "Booked"
                    ? colors.surfaceDisabled
                    : selected
                    ? colors.primary
                    : colors.surfaceVariant,
                opacity: slot.status === "Booked" || blocked ? 0.35 : 1,
                borderWidth: selected ? 0 : 1,
                borderColor: colors.outlineVariant,
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
                      : colors.onSurface,
                }}
              >
                {formatSlot(slot.time)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Footer actions */}
      <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
        {onCancel && (
          <Button mode="text" onPress={onCancel} style={{ flex: 1 }}>
            Cancel
          </Button>
        )}
        <Button
          mode="contained"
          disabled={!range}
          onPress={() => range && onConfirm(range)}
          style={{ flex: 1 }}
        >
          {range ? `${range.start} – ${range.end}` : "Select time"}
        </Button>
      </View>
    </View>
  );
}
