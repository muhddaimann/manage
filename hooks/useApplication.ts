import { useMemo, useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { useLeaveStore } from "../contexts/api/leaveStore";
import { getAllLeaveBalances } from "../contexts/api/balance";
import type { Leave } from "../contexts/api/leave";

/* ================= TYPES ================= */

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
  leaveTypes: LeaveOption[];
  leavePeriods: LeaveOption[];
  leaveReasons: LeaveOption[];
};

/* ================= STATUS MAP ================= */

const LEAVE_STATUS_META: Record<LeaveStatus, LeaveStatusMeta> = {
  PENDING: { label: "Pending", tone: "secondary" },
  APPROVED: { label: "Approved", tone: "tertiary" },
  REJECTED: { label: "Rejected", tone: "error" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

/* ================= DATE HELPERS ================= */

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function diffDays(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;
}

function buildDateRangeLabel(start: string, end: string) {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} → ${formatDate(end)}`;
}

function buildReturnLabel(endDate?: string) {
  if (!endDate) return undefined;
  const d = new Date(endDate);
  d.setDate(d.getDate() + 1);
  return `Return: ${formatDate(d.toISOString())}`;
}

/* ================= STATUS RESOLVER ================= */

function resolveStatus(l: Leave): LeaveStatus {
  if (
    l.cancellation_dt ||
    l.cancellation_action === "CANCELLED" ||
    l.manager_status === "Cancelled"
  )
    return "CANCELLED";

  if (l.manager_status === "Approved") return "APPROVED";
  if (l.manager_status === "Rejected") return "REJECTED";

  return "PENDING";
}

/* ================= HOOK ================= */

export default function useLeave() {
  const { colors } = useTheme();
  const { leaves, fetchLeaves } = useLeaveStore();
  const [annualLeaveLeft, setAnnualLeaveLeft] = useState(0);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getAllLeaveBalances();
      if ("AL" in res && res.AL) {
        setAnnualLeaveLeft(res.AL.Balance);
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
      container: colors.surfaceVariant,
      onContainer: colors.onSurfaceVariant,
    },
  };

  const options: LeaveOptions = useMemo(
    () => ({
      leaveTypes: [
        { value: "AL", label: "Annual Leave" },
        { value: "MC", label: "Medical Leave" },
        { value: "EL", label: "Emergency Leave" },
        { value: "UL", label: "Unpaid Leave" },
      ],
      leavePeriods: [
        { value: "FULL", label: "Full Day" },
        { value: "HALF_AM", label: "Half Day (Morning)" },
        { value: "HALF_PM", label: "Half Day (Afternoon)" },
      ],
      leaveReasons: [
        { value: "PERSONAL", label: "Personal matters" },
        { value: "HOMETOWN", label: "Back to hometown" },
        { value: "FAMILY", label: "Family matters" },
        { value: "MEDICAL", label: "Medical appointment" },
        { value: "EMERGENCY", label: "Emergency" },
        { value: "OTHER", label: "Other" },
      ],
    }),
    []
  );

  const leave = useMemo<LeaveSummary>(() => {
    const history: LeaveItem[] = leaves.map((l: Leave) => {
      const status = resolveStatus(l);
      const days =
        l.start && l.end ? diffDays(l.start, l.end) : Number(l.duration) || 1;
      const statusMeta = LEAVE_STATUS_META[status];

      return {
        id: String(l.leave_id),
        type: l.leave_type,
        name: l.leave_name,
        status,
        statusMeta,
        statusColors: toneColors[statusMeta.tone],

        periodLabel: l.leave_period,
        dateLabel: formatDate(l.date || l.start),
        dateRangeLabel: buildDateRangeLabel(l.start, l.end),
        durationLabel: `${days} day${days > 1 ? "s" : ""}`,
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
  }, [leaves, annualLeaveLeft, colors]);

  return {
    leave,
    options,
    helpers: {
      diffDays,
      formatDate,
      buildDateRangeLabel,
    },
  };
}
