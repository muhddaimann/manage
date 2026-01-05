import { useMemo, useState } from "react";

export type NewsPriority = "HIGH" | "MEDIUM" | "LOW";

export type NewsFlash = {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: NewsPriority;
  byDepartment: string;
  by: string;
};

type UserTag = "MANAGEMENT" | "OPERATION";

export type DayStatus =
  | "NOT_CHECKED_IN"
  | "WORKING"
  | "ON_LEAVE"
  | "COMPLETED"
  | "PUBLIC_HOLIDAY"
  | "OFF_DAY"
  | "REST_DAY";

export type DayStatusIcon =
  | "CLOCK"
  | "BRIEFCASE"
  | "PALM"
  | "CHECK"
  | "SUN"
  | "CALENDAR"
  | "MOON";

export type DayStatusTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "outline";

type QuickStat = {
  label: string;
  value: string;
};

type LeaveSummary = {
  annualLeaveLeft: number;
  pendingLeave: number;
};

type UserProfile = {
  name: string;
  role: string;
  initials: string;
  tag: UserTag;
  leave: LeaveSummary;
};

function formatToday() {
  const now = new Date();
  return now.toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default function useHome() {
  const today = useMemo(() => formatToday(), []);
  const greeting = useMemo(() => getGreeting(), []);

  const user: UserProfile = {
    name: "Hakim",
    role: "Executive Web Developer",
    initials: getInitials("Aiman Hakim"),
    tag: "MANAGEMENT",
    leave: {
      annualLeaveLeft: 12,
      pendingLeave: 2,
    },
  };

  const [dayStatus, setDayStatus] = useState<DayStatus>("WORKING");

  const STATUS_FLOW: DayStatus[] = [
    "NOT_CHECKED_IN",
    "WORKING",
    "COMPLETED",
    "ON_LEAVE",
    "PUBLIC_HOLIDAY",
    "OFF_DAY",
    "REST_DAY",
  ];

  const toggleDayStatus = () => {
    setDayStatus((prev) => {
      const idx = STATUS_FLOW.indexOf(prev);
      if (idx === -1) return STATUS_FLOW[0];
      return STATUS_FLOW[(idx + 1) % STATUS_FLOW.length];
    });
  };

  const dayStatusLabel: Record<DayStatus, { title: string; subtitle: string }> =
    {
      NOT_CHECKED_IN: {
        title: "Not checked in",
        subtitle: "Tap to start your shift",
      },
      WORKING: {
        title: "Working",
        subtitle: "Actively on duty today",
      },
      ON_LEAVE: {
        title: "On leave",
        subtitle: "Approved leave for today",
      },
      COMPLETED: {
        title: "Completed",
        subtitle: "Work completed for today",
      },
      PUBLIC_HOLIDAY: {
        title: "Public holiday",
        subtitle: "Office closed nationwide",
      },
      OFF_DAY: {
        title: "Off day",
        subtitle: "No work scheduled today",
      },
      REST_DAY: {
        title: "Rest day",
        subtitle: "Scheduled rest & recovery",
      },
    };

  const dayStatusIcon: Record<DayStatus, DayStatusIcon> = {
    NOT_CHECKED_IN: "CLOCK",
    WORKING: "BRIEFCASE",
    ON_LEAVE: "PALM",
    COMPLETED: "CHECK",
    PUBLIC_HOLIDAY: "SUN",
    OFF_DAY: "CALENDAR",
    REST_DAY: "MOON",
  };

  const dayStatusTone: Record<DayStatus, DayStatusTone> = {
    NOT_CHECKED_IN: "primary",
    WORKING: "primary",
    ON_LEAVE: "tertiary",
    COMPLETED: "outline",
    PUBLIC_HOLIDAY: "tertiary",
    OFF_DAY: "outline",
    REST_DAY: "outline",
  };

  const quickStats: QuickStat[] = [
    { label: "AL Left", value: `${user.leave.annualLeaveLeft} days` },
    { label: "Leave Pending", value: `${user.leave.pendingLeave}` },
    {
      label: "Today Status",
      value: `${dayStatusLabel[dayStatus].title} · ${dayStatusLabel[dayStatus].subtitle}`,
    },
  ];

  const newsFlash: NewsFlash[] = [
    {
      id: "nf-1",
      title: "Public Holiday Notice",
      body: "Office will be closed this Friday due to a public holiday.",
      date: "2 Oct 2026",
      priority: "HIGH",
      byDepartment: "Human Resources",
      by: "HR Admin",
    },
    {
      id: "nf-2",
      title: "System Maintenance",
      body: "HR system maintenance scheduled tonight from 10 PM to 12 AM.",
      date: "1 Oct 2026",
      priority: "MEDIUM",
      byDepartment: "IT Department",
      by: "IT Operations",
    },
    {
      id: "nf-3",
      title: "Policy Update",
      body: "New leave application guidelines are now effective.",
      date: "28 Sep 2026",
      priority: "LOW",
      byDepartment: "Human Resources",
      by: "HR Manager",
    },
  ];

  return {
    today,
    greeting,
    user,
    dayStatus,
    dayStatusLabel,
    dayStatusIcon,
    dayStatusTone,
    setDayStatus,
    toggleDayStatus,
    quickStats,
    newsFlash,
  };
}
