import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, Button, IconButton, useTheme } from "react-native-paper";
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
    start: initialRange?.start ?? "",
    end: initialRange?.end ?? "",
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

    if (!range.start) return {};

    const marks: Record<string, any> = {};

    if (!range.end) {
      marks[range.start] = {
        selected: true,
        startingDay: true,
        endingDay: true,
        color: colors.primary,
        textColor: colors.onPrimary,
      };
      return marks;
    }

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

  const canConfirm = mode === "SINGLE" || (!!range.start && !!range.end);

  const buttonLabel =
    mode === "SINGLE"
      ? `Confirm · ${formatDate(single)}`
      : range.start && range.end && range.start !== range.end
        ? `Confirm · ${formatDate(range.start)} – ${formatDate(range.end)}`
        : range.start && range.end
          ? `Confirm · ${formatDate(range.start)}`
          : range.start
            ? `Confirm · ${formatDate(range.start)}`
            : "Confirm";

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii["2xl"],
        paddingVertical: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: tokens.spacing.xxs }}>
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {mode === "SINGLE" ? "Select a date" : "Select a date range"}
          </Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {mode === "SINGLE"
              ? "Tap a day to continue"
              : "Tap start date, then end date"}
          </Text>
        </View>

        <IconButton
          icon="calendar"
          size={30}
          iconColor={colors.primary}
          style={{ margin: 0 }}
        />
      </View>

      <Calendar
        markingType={mode === "RANGE" ? "period" : undefined}
        markedDates={markedDates}
        onDayPress={(day) => {
          if (mode === "SINGLE") {
            setSingle(day.dateString);
            return;
          }

          const newDate = day.dateString;

          if (!range.start || (range.start && range.end)) {
            // If no start date, or if both are already set (starting a new range)
            setRange({ start: newDate, end: "" });
            return;
          }

          // If only start date is set, now select the end date
          // Smartly decide start and end based on chronological order
          if (newDate < range.start) {
            setRange({ start: newDate, end: range.start });
          } else {
            setRange({ start: range.start, end: newDate });
          }
        }}
        theme={{
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
          textDisabledColor: colors.onSurfaceDisabled,
        }}
      />

      <Button
        mode="contained"
        style={{ marginTop: tokens.spacing.md }}
        contentStyle={{ height: 48 }}
        disabled={!canConfirm}
        onPress={() => onConfirm(mode === "SINGLE" ? single : range)}
      >
        {buttonLabel}
      </Button>
    </View>
  );
}
