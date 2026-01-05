import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { useDesign } from "../../contexts/designContext";

type Mode = "SINGLE" | "RANGE";

type DatePickerProps = {
  mode?: Mode;
  initialDate?: string;
  initialRange?: { start: string; end: string };
  onConfirm: (value: string | { start: string; end: string }) => void;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function DatePicker({
  mode = "SINGLE",
  initialDate,
  initialRange,
  onConfirm,
}: DatePickerProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const [single, setSingle] = useState(initialDate ?? todayISO());
  const [range, setRange] = useState({
    start: initialRange?.start ?? todayISO(),
    end: initialRange?.end ?? todayISO(),
  });

  const markedDates = useMemo(() => {
    if (mode === "SINGLE") {
      return {
        [single]: {
          selected: true,
          selectedColor: colors.primary,
        },
      };
    }

    const marks: Record<string, any> = {};
    let current = new Date(range.start);
    const end = new Date(range.end);

    while (current <= end) {
      const key = current.toISOString().slice(0, 10);
      marks[key] = {
        selected: true,
        color: colors.primaryContainer,
        textColor: colors.onPrimaryContainer,
        ...(key === range.start && {
          startingDay: true,
          color: colors.primary,
          textColor: colors.onPrimary,
        }),
        ...(key === range.end && {
          endingDay: true,
          color: colors.primary,
          textColor: colors.onPrimary,
        }),
      };
      current.setDate(current.getDate() + 1);
    }

    return marks;
  }, [mode, single, range, colors]);

  const confirmLabel =
    mode === "SINGLE" ? single : `${range.start} → ${range.end}`;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii["2xl"],
        padding: tokens.spacing.xl,
        gap: tokens.spacing.lg,
      }}
    >
      <Text variant="titleMedium" style={{ fontWeight: "700" }}>
        Select date
      </Text>

      <Calendar
        markingType={mode === "RANGE" ? "period" : undefined}
        markedDates={markedDates}
        onDayPress={(day) => {
          if (mode === "SINGLE") {
            setSingle(day.dateString);
          } else {
            if (!range.start || (range.start && range.end !== range.start)) {
              setRange({ start: day.dateString, end: day.dateString });
            } else {
              if (day.dateString < range.start) {
                setRange({ start: day.dateString, end: range.start });
              } else {
                setRange({ start: range.start, end: day.dateString });
              }
            }
          }
        }}
        theme={{
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
        }}
      />

      <Button
        mode="contained"
        contentStyle={{ height: 48 }}
        onPress={() => onConfirm(mode === "SINGLE" ? single : range)}
      >
        Confirm ({confirmLabel})
      </Button>
    </View>
  );
}
