import { useMemo } from "react";

type UserTag = "MANAGEMENT" | "OPERATION";

type LeaveType = "ANNUAL" | "MEDICAL" | "EMERGENCY";

type LeaveItem = {
  id: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

type LeaveSummary = {
  annualLeaveLeft: number;
  pending: number;
  history: LeaveItem[];
};

type OvertimeItem = {
  id: string;
  date: string;
  hours: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

type OvertimeSummary = {
  monthTotalHours: number;
  pending: number;
  history: OvertimeItem[];
};

type UserProfile = {
  name: string;
  role: string;
  initials: string;
  tag: UserTag;
  leave: LeaveSummary;
  overtime: OvertimeSummary;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default function useApplication() {
  const user: UserProfile = useMemo(
    () => ({
      name: "Hakim",
      role: "Executive Web Developer",
      initials: getInitials("Aiman Hakim"),
      tag: "MANAGEMENT",

      leave: {
        annualLeaveLeft: 12,
        pending: 2,
        history: [
          {
            id: "lv-1",
            type: "ANNUAL",
            from: "2026-10-12",
            to: "2026-10-14",
            days: 3,
            status: "PENDING",
          },
          {
            id: "lv-2",
            type: "MEDICAL",
            from: "2026-09-20",
            to: "2026-09-20",
            days: 1,
            status: "APPROVED",
          },
          {
            id: "lv-3",
            type: "ANNUAL",
            from: "2026-08-05",
            to: "2026-08-07",
            days: 3,
            status: "APPROVED",
          },
        ],
      },

      overtime: {
        monthTotalHours: 6.5,
        pending: 1,
        history: [
          {
            id: "ot-1",
            date: "2026-10-01",
            hours: 2,
            reason: "Production deployment",
            status: "PENDING",
          },
          {
            id: "ot-2",
            date: "2026-09-18",
            hours: 3.5,
            reason: "Urgent bug fix",
            status: "APPROVED",
          },
          {
            id: "ot-3",
            date: "2026-09-03",
            hours: 1,
            reason: "Client meeting prep",
            status: "APPROVED",
          },
        ],
      },
    }),
    []
  );

  return {
    user,
    leave: user.leave,
    overtime: user.overtime,
  };
}
