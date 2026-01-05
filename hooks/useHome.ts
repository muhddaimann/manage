import { useMemo } from "react";

/* =======================
   Shared Types (exported)
   ======================= */

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

/* =======================
   Helpers
   ======================= */

function formatToday() {
  const now = new Date();
  return now.toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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

/* =======================
   Hook
   ======================= */

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

  const quickStats: QuickStat[] = [
    { label: "AL Left", value: `${user.leave.annualLeaveLeft} days` },
    { label: "Leave Pending", value: `${user.leave.pendingLeave}` },
    { label: "Attendance", value: "On Track" },
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
    quickStats,
    newsFlash,
  };
}
