import FullLoading from "../../components/shared/fullLoad";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { CalendarCheck, Clock } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import useLeave from "../../hooks/useApplication";
import TwoRow from "../../components/a/twoRow";
import LeaveList, { LeaveListItem } from "./applicationList";

export default function LeaveBody() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { leave, loading } = useLeave();

  const leaveList = useMemo<LeaveListItem[]>(
    () =>
      leave.history.map((l) => ({
        id: l.id,
        primary: l.name,
        secondary: l.dateRangeLabel,
        meta: l.durationLabel,
        status: l.status,
        statusMeta: l.statusMeta,
        statusColors: l.statusColors,
        raw: l.raw,
      })),
    [leave.history],
  );

  if (loading) {
    return <FullLoading layout={[2, 1, 1, 1]} />;
  }

  return (
    <View style={{ gap: tokens.spacing.md }}>
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

      <LeaveList data={leaveList} />
    </View>
  );
}
