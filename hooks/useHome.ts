import { useEffect, useMemo, useState } from "react";
import { useStaffStore } from "../contexts/api/staffStore";
import { useRoomStore } from "../contexts/api/roomStore";
import { getActiveBroadcasts } from "../contexts/api/broadcast";
import type { Broadcast } from "../contexts/api/broadcast";
import { getAttendanceDef, type Attendance } from "../contexts/api/attendance";

/* ================= TYPES ================= */

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

export type UserProfile = {
  name: string;
  role: string;
  initials: string;
  tag: UserTag;
  leave: LeaveSummary;
};

/* ================= HELPERS ================= */

function formatToday() {
  return new Date().toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function mapPriority(p: string): NewsPriority {
  if (p === "HIGH" || p === "MEDIUM" || p === "LOW") return p;
  return "LOW";
}

function deriveDayStatus(att: Attendance | null): DayStatus {
  if (!att) return "NOT_CHECKED_IN";
  if (att.status === "LEAVE") return "ON_LEAVE";
  if (att.actual_logout) return "COMPLETED";
  if (att.actual_login) return "WORKING";
  return "NOT_CHECKED_IN";
}

/* ================= HOOK ================= */

export default function useHome() {
  const today = useMemo(formatToday, []);
  const greeting = useMemo(getGreeting, []);

  /* ---------- STAFF ---------- */
  const { staff, loading: staffLoading, fetchStaff } = useStaffStore();

  useEffect(() => {
    if (!staff) fetchStaff();
  }, [staff, fetchStaff]);

  const user: UserProfile | null = useMemo(() => {
    if (!staff) return null;

    const tag: UserTag = staff.designation_name
      .toLowerCase()
      .includes("manager")
      ? "MANAGEMENT"
      : "OPERATION";

    return {
      name: staff.nick_name || staff.full_name,
      role: staff.designation_name,
      initials: staff.initials,
      tag,
      leave: {
        annualLeaveLeft: 0,
        pendingLeave: 0,
      },
    };
  }, [staff]);

  /* ---------- ATTENDANCE (API ONLY) ---------- */
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setAttendanceLoading(true);
      const res = await getAttendanceDef();
      if (!alive) return;

      if (Array.isArray(res) && res.length > 0) {
        setAttendance(res[0]);
      } else {
        setAttendance(null);
      }

      setAttendanceLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const dayStatus = useMemo(() => deriveDayStatus(attendance), [attendance]);

  const dayStatusLabel: Record<DayStatus, string> = {
    NOT_CHECKED_IN: "Not checked in",
    WORKING: "Working",
    ON_LEAVE: "On leave",
    COMPLETED: "Completed",
    PUBLIC_HOLIDAY: "Public holiday",
    OFF_DAY: "Off day",
    REST_DAY: "Rest day",
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

  /* ---------- ROOMS ---------- */
  const { myBookings, loading: roomLoading, fetchBookings } = useRoomStore();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const activeBookings = useMemo(
    () => myBookings.filter((b) => b.Tag === "Upcoming"),
    [myBookings]
  );

  /* ---------- NEWS / BROADCAST ---------- */
  const [newsFlash, setNewsFlash] = useState<NewsFlash[]>([]);
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setBroadcastLoading(true);
      const res = await getActiveBroadcasts();
      if (!alive) return;

      if (res?.status === "success" && res.data) {
        setNewsFlash(
          res.data.map((b: Broadcast, i) => ({
            id: String(b.broadcast_id ?? i),
            title: b.NewsName,
            body: b.Description || b.Content,
            date: b.StartDate,
            priority: mapPriority(b.BroadcastPriority),
            byDepartment: b.BroadcastType,
            by: b.CreatedBy,
          }))
        );
      }

      setBroadcastLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* ---------- QUICK STATS ---------- */
  const quickStats: QuickStat[] = useMemo(() => {
    if (!user) return [];
    return [{ label: "Active Booking", value: `${activeBookings.length}` }];
  }, [user, activeBookings.length]);

  return {
    today,
    greeting,

    user,
    staff,

    attendance,

    loading:
      staffLoading || roomLoading || broadcastLoading || attendanceLoading,

    dayStatus,
    dayStatusLabel,
    dayStatusIcon,
    dayStatusTone,

    newsFlash,

    myBookings,
    activeBookings,

    quickStats,
  };
}
