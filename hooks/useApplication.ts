import { useMemo, useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { useLeaveStore } from "../contexts/api/leaveStore";
import { getLeaveBalance } from "../contexts/api/balance";
import type { Leave } from "../contexts/api/leave";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type LeaveStatusTone = "secondary" | "tertiary" | "error" | "neutral";

export type LeaveStatusMeta = {
  label: string;
  tone: LeaveStatusTone;
};

export type LeaveStatusColors = {
  container: string;
  onContainer: string;
};

export type LeaveOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
};

export type LeaveItem = {
  id: string;
  type: string;
  name: string;
  status: LeaveStatus;
  statusMeta: LeaveStatusMeta;
  statusColors: LeaveStatusColors;
  periodLabel: string;
  dateLabel: string;
  dateRangeLabel: string;
  durationLabel: string;
  returnLabel?: string;
  days: number;
  isSingleDay: boolean;
  isCancelled: boolean;
  isPending: boolean;
  raw: Leave;
};

export type LeaveSummary = {
  annualLeaveLeft: number;
  pending: number;
  history: LeaveItem[];
};

export type LeaveOptions = {
  leaveTypes: LeaveOption<
    | "AL"
    | "SL"
    | "UL"
    | "RL"
    | "MR"
    | "PL"
    | "CL"
    | "ML"
    | "CAL"
    | "HL"
    | "PGL"
    | "PH"
    | "GL"
  >[];
  leavePeriods: LeaveOption[];
  leaveReasons: LeaveOption[];
};

const LEAVE_STATUS_META: Record<LeaveStatus, LeaveStatusMeta> = {
  PENDING: { label: "Pending", tone: "secondary" },
  APPROVED: { label: "Approved", tone: "tertiary" },
  REJECTED: { label: "Rejected", tone: "error" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildDateRangeLabel(start: string, end: string) {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} → ${formatDate(end)}`;
}

function buildReturnLabel(endDate?: string) {
  if (!endDate) return undefined;
  const d = new Date(`${endDate}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return `Return: ${formatDate(d.toISOString().slice(0, 10))}`;
}

function resolveStatus(l: Leave): LeaveStatus {
  if (
    l.cancellation_dt ||
    l.cancellation_action === "CANCELLED" ||
    l.manager_status === "Cancelled"
  ) {
    return "CANCELLED";
  }
  if (l.manager_status === "Approved") return "APPROVED";
  if (l.manager_status === "Rejected") return "REJECTED";
  return "PENDING";
}

export default function useLeave() {
  const { colors } = useTheme();
  const { leaves, fetchLeaves, loading } = useLeaveStore();
  const [annualLeaveLeft, setAnnualLeaveLeft] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const month = new Date().toISOString().slice(0, 7);
        const res = await getLeaveBalance(month);
        if (!("error" in res)) {
          setAnnualLeaveLeft(res.balance);
        }
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const toneColors: Record<LeaveStatusTone, LeaveStatusColors> = {
    secondary: {
      container: colors.secondaryContainer,
      onContainer: colors.onSecondaryContainer,
    },
    tertiary: {
      container: colors.tertiaryContainer,
      onContainer: colors.onTertiaryContainer,
    },
    error: {
      container: colors.errorContainer,
      onContainer: colors.onErrorContainer,
    },
    neutral: {
      container: colors.surfaceDisabled,
      onContainer: colors.onSurfaceDisabled,
    },
  };

  const options: LeaveOptions = useMemo(
    () => ({
      leaveTypes: [
        { label: "Annual Leave", value: "AL" },
        { label: "Sick Leave", value: "SL" },
        { label: "Unpaid Leave", value: "UL" },
        { label: "Replacement Leave", value: "RL" },
        { label: "Marriage Leave", value: "MR" },
        { label: "Paternity Leave", value: "PL" },
        { label: "Compassionate Leave", value: "CL" },
        { label: "Maternity Leave", value: "ML" },
        { label: "Calamity Leave", value: "CAL" },
        { label: "Hospitalisation", value: "HL" },
        { label: "Pilgrimage Leave", value: "PGL" },
        { label: "Public Holiday", value: "PH" },
        { label: "Garden Leave", value: "GL" },
      ],
      leavePeriods: [
        { value: "FULL", label: "Full Day" },
        { value: "HALF_AM", label: "First Half Day" },
        { value: "HALF_PM", label: "Second Half Day" },
      ],
      leaveReasons: [
        { value: "PERSONAL", label: "Personal matters" },
        { value: "FAMILY", label: "Family matters" },
        { value: "MEDICAL", label: "Medical appointment" },
        { value: "EMERGENCY", label: "Emergency" },
        { value: "OTHER", label: "Others" },
      ],
    }),
    [],
  );

  const leave = useMemo<LeaveSummary>(() => {
    if (loading) {
      return { annualLeaveLeft, pending: 0, history: [] };
    }

    const history: LeaveItem[] = leaves.map((l) => {
      const status = resolveStatus(l);
      const days = Number(l.duration) || 1;
      const statusMeta = LEAVE_STATUS_META[status];

      return {
        id: String(l.leave_id),
        type: l.leave_type,
        name: l.leave_name,
        status,
        statusMeta,
        statusColors: toneColors[statusMeta.tone],
        periodLabel: l.leave_period,
        dateLabel: formatDate(l.start_date),
        dateRangeLabel: buildDateRangeLabel(l.start_date, l.end_date),
        durationLabel: `${days} day${days !== 1 ? "s" : ""}`,
        returnLabel:
          status !== "CANCELLED" && days >= 1
            ? buildReturnLabel(l.end_date)
            : undefined,
        days,
        isSingleDay: days === 1,
        isCancelled: status === "CANCELLED",
        isPending: status === "PENDING",
        raw: l,
      };
    });

    return {
      annualLeaveLeft,
      pending: history.filter((l) => l.isPending).length,
      history,
    };
  }, [leaves, annualLeaveLeft, loading, colors]);

  return {
    leave,
    loading: loading || balanceLoading,
    options,
  };
}
