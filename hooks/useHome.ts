import { useEffect, useMemo, useState, useCallback } from "react";
import { useStaffStore } from "../contexts/api/staffStore";
import { useRoomStore } from "../contexts/api/roomStore";
import {
  getActiveBroadcasts,
  acknowledgeBroadcast,
} from "../contexts/api/broadcast";
import type { Broadcast } from "../contexts/api/broadcast";
import { getAttendanceDef, type Attendance } from "../contexts/api/attendance";
import { getAllRooms, type Room } from "../contexts/api/room";
import { useOverlay } from "../contexts/overlayContext";

export type NewsPriority = "NORMAL" | "IMPORTANT" | "CRITICAL";

export const NEWS_PRIORITY_COLOR: Record<NewsPriority, string> = {
  CRITICAL: "#EF4444",
  IMPORTANT: "#F59E0B",
  NORMAL: "#10B981",
};

export type NewsFlash = {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: NewsPriority;
  byDepartment: string;
  by: string;
  acknowledged: boolean;
};

export type UserProfile = {
  name: string;
  role: string;
  initials: string;
};

export type DayStatus =
  | "NOT_CHECKED_IN"
  | "WORKING"
  | "ON_LEAVE"
  | "COMPLETED"
  | "PUBLIC_HOLIDAY"
  | "OFF_DAY"
  | "REST_DAY";

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

function mapBroadcastPriority(p: string): NewsPriority {
  switch (p.toLowerCase()) {
    case "critical":
      return "CRITICAL";
    case "important":
      return "IMPORTANT";
    default:
      return "NORMAL";
  }
}

function deriveDayStatus(att: Attendance | null): DayStatus {
  if (!att) return "NOT_CHECKED_IN";
  if (att.status === "LEAVE") return "ON_LEAVE";
  if (att.actual_logout) return "COMPLETED";
  if (att.actual_login) return "WORKING";
  return "NOT_CHECKED_IN";
}

function formatBookingDateTime(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);

  const date = s.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const startTime = s.toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = e.toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    date,
    time: `${startTime} – ${endTime}`,
  };
}

const PRIORITY_WEIGHT: Record<NewsPriority, number> = {
  CRITICAL: 3,
  IMPORTANT: 2,
  NORMAL: 1,
};

export default function useHome() {
  const { toast } = useOverlay();

  const today = useMemo(formatToday, []);
  const greeting = useMemo(getGreeting, []);

  const { staff, loading: staffLoading, fetchStaff } = useStaffStore();

  useEffect(() => {
    if (!staff) fetchStaff();
  }, [staff, fetchStaff]);

  const user: UserProfile | null = useMemo(() => {
    if (!staff) return null;
    return {
      name: staff.nick_name || staff.full_name,
      role: staff.designation_name,
      initials: staff.initials,
    };
  }, [staff]);

  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setAttendanceLoading(true);
      const res = await getAttendanceDef();
      if (!alive) return;

      setAttendance(Array.isArray(res) && res.length > 0 ? res[0] : null);
      setAttendanceLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const dayStatus = useMemo(() => deriveDayStatus(attendance), [attendance]);

  const { myBookings, loading: roomLoading, fetchBookings } = useRoomStore();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await getAllRooms();
      if (!alive || "error" in res) return;
      setRooms(res);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const mappedBookings = useMemo(
    () =>
      myBookings.map((b) => {
        const ui = formatBookingDateTime(b.Start_Date, b.End_Date);
        const room = rooms.find((r) => r.Room_Name === b.Room_Name);
        return {
          ...b,
          uiDate: ui.date,
          uiTime: ui.time,
          Capacity: room?.Capacity,
          Tower: b.Tower || room?.Tower,
          Level: b.Level || room?.Level,
        };
      }),
    [myBookings, rooms],
  );

  const activeBookings = useMemo(
    () => mappedBookings.filter((b) => b.Tag === "Upcoming"),
    [mappedBookings],
  );

  const pastBookings = useMemo(
    () => mappedBookings.filter((b) => b.Tag !== "Upcoming"),
    [mappedBookings],
  );

  const [newsFlash, setNewsFlash] = useState<NewsFlash[]>([]);
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  const fetchBroadcasts = useCallback(async () => {
    setBroadcastLoading(true);
    const res = await getActiveBroadcasts();

    if (res?.status === "success" && res.data) {
      setNewsFlash(
        res.data.map((b: Broadcast, i) => ({
          id: String(b.ID ?? i),
          title: b.NewsName,
          body: b.Description || b.Content,
          date: b.StartDate,
          priority: mapBroadcastPriority(b.BroadcastPriority),
          byDepartment: b.BroadcastType,
          by: b.CreatedBy,
          acknowledged: b.Acknowledged === 1,
        })),
      );
    }

    setBroadcastLoading(false);
  }, []);

  useEffect(() => {
    fetchBroadcasts();
  }, [fetchBroadcasts]);

  const acknowledgeNews = useCallback(
    async (id: string) => {
      const numericId = Number(id);
      const res = await acknowledgeBroadcast(numericId);

      if (res?.status === "success") {
        setNewsFlash((prev) =>
          prev.map((n) => (n.id === id ? { ...n, acknowledged: true } : n)),
        );


      }

      return res;
    },
    [toast],
  );

  const carouselNews = useMemo(() => {
    return [...newsFlash].sort((a, b) => {
      // 1. Unread items first
      if (a.acknowledged !== b.acknowledged) {
        return a.acknowledged ? 1 : -1;
      }

      // 2. Higher priority first
      if (a.priority !== b.priority) {
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }

      // 3. Newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [newsFlash]);

  return {
    today,
    greeting,
    user,
    attendance,
    staffLoading,
    attendanceLoading,
    roomLoading,
    broadcastLoading,
    dayStatus,
    activeBookings,
    pastBookings,
    newsFlash,
    carouselNews,
    acknowledgeNews,
    refetchBroadcasts: fetchBroadcasts,
    NEWS_PRIORITY_COLOR,
  };
}
