import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { CalendarCheck, Clock } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import useApplication from "../../hooks/useApplication";
import TwoRow from "../../components/a/twoRow";
import ApplicationList from "./applicationList";

type ApplicationMode = "LEAVE" | "OVERTIME";

export default function ApplicationBody({ mode }: { mode: ApplicationMode }) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { leave, overtime } = useApplication();

  const leaveList = useMemo(
    () =>
      leave.history.map((l) => ({
        id: l.id,
        primary: `${l.type} Leave`,
        secondary: `${l.from} → ${l.to}`,
        meta: `${l.days} day(s)`,
        status: l.status,
      })),
    [leave.history]
  );

  const overtimeList = useMemo(
    () =>
      overtime.history.map((o) => ({
        id: o.id,
        primary: `${o.hours} hrs Overtime`,
        secondary: o.date,
        meta: o.reason,
        status: o.status,
      })),
    [overtime.history]
  );

  return (
    <View style={{ gap: tokens.spacing.md }}>
      {mode === "LEAVE" ? (
        <>
          <TwoRow
            left={{
              amount: leave.annualLeaveLeft,
              label: "AL remaining",
              icon: <CalendarCheck size={24} color={colors.onPrimary} />,
              bgColor: colors.primary,
              textColor: colors.onPrimary,
              labelColor: colors.onPrimary,
            }}
            right={{
              amount: leave.pending,
              label: "Pending requests",
              icon: <Clock size={24} color={colors.onPrimaryContainer} />,
              bgColor: colors.primaryContainer,
              textColor: colors.onPrimaryContainer,
              labelColor: colors.onPrimaryContainer,
            }}
          />

          <ApplicationList data={leaveList} mode="LEAVE" />
        </>
      ) : (
        <>
          <TwoRow
            left={{
              amount: overtime.monthTotalHours,
              label: "Hours this month",
              icon: <Clock size={24} color={colors.onPrimary} />,
              bgColor: colors.primary,
              textColor: colors.onPrimary,
              labelColor: colors.onPrimary,
            }}
            right={{
              amount: overtime.pending,
              label: "Pending requests",
              icon: (
                <CalendarCheck size={24} color={colors.onPrimaryContainer} />
              ),
              bgColor: colors.primaryContainer,
              textColor: colors.onPrimaryContainer,
              labelColor: colors.onPrimaryContainer,
            }}
          />

          <ApplicationList data={overtimeList} mode="OVERTIME" />
        </>
      )}
    </View>
  );
}
