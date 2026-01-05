import { useMemo, useState } from "react";

/* ================= NEWS ================= */

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

/* ================= USER / DAY ================= */

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

/* ================= ROOM ================= */

export type RoomType =
  | "MEETING"
  | "CONFERENCE"
  | "TRAINING"
  | "FOCUS"
  | "PHONE_BOOTH";

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export type RoomAmenity =
  | "TV"
  | "PROJECTOR"
  | "WHITEBOARD"
  | "VIDEO_CONF"
  | "AIR_COND";

export type Room = {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  amenities: RoomAmenity[];
  status: RoomStatus;
  location: string;
};

export type RoomBooking = {
  id: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  by: string;
};

/* ================= OTHER ================= */

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

/* ================= HELPERS ================= */

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

/* ================= HOOK ================= */

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

  /* ---------- Day Status ---------- */

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
      return STATUS_FLOW[(idx + 1) % STATUS_FLOW.length];
    });
  };

  const dayStatusLabel: Record<DayStatus, { title: string; subtitle: string }> =
    {
      NOT_CHECKED_IN: {
        title: "Not checked in",
        subtitle: "Tap to start your shift",
      },
      WORKING: { title: "Working", subtitle: "Actively on duty today" },
      ON_LEAVE: { title: "On leave", subtitle: "Approved leave for today" },
      COMPLETED: { title: "Completed", subtitle: "Work completed for today" },
      PUBLIC_HOLIDAY: {
        title: "Public holiday",
        subtitle: "Office closed nationwide",
      },
      OFF_DAY: { title: "Off day", subtitle: "No work scheduled today" },
      REST_DAY: { title: "Rest day", subtitle: "Scheduled rest & recovery" },
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

  /* ---------- News ---------- */

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

  /* ---------- Rooms ---------- */

  const [rooms] = useState<Room[]>([
    {
      id: "room-1",
      name: "Meeting Room A",
      type: "MEETING",
      capacity: 6,
      amenities: ["TV", "WHITEBOARD", "AIR_COND"],
      status: "AVAILABLE",
      location: "Level 3",
    },
    {
      id: "room-2",
      name: "Meeting Room B",
      type: "MEETING",
      capacity: 10,
      amenities: ["TV", "VIDEO_CONF", "WHITEBOARD", "AIR_COND"],
      status: "OCCUPIED",
      location: "Level 3",
    },
    {
      id: "room-3",
      name: "Conference Room",
      type: "CONFERENCE",
      capacity: 20,
      amenities: ["PROJECTOR", "VIDEO_CONF", "AIR_COND"],
      status: "AVAILABLE",
      location: "Level 5",
    },
    {
      id: "room-4",
      name: "Training Room",
      type: "TRAINING",
      capacity: 30,
      amenities: ["PROJECTOR", "WHITEBOARD", "AIR_COND"],
      status: "MAINTENANCE",
      location: "Level 2",
    },
    {
      id: "room-5",
      name: "Focus Room",
      type: "FOCUS",
      capacity: 2,
      amenities: ["AIR_COND"],
      status: "AVAILABLE",
      location: "Level 4",
    },
  ]);

  const [bookings, setBookings] = useState<RoomBooking[]>([
    {
      id: "bk-1",
      roomId: "room-2",
      date: "2026-01-06",
      startTime: "10:00",
      endTime: "11:30",
      purpose: "Sprint planning",
      by: "Hakim",
    },
    {
      id: "bk-2",
      roomId: "room-3",
      date: "2026-01-07",
      startTime: "14:00",
      endTime: "16:00",
      purpose: "Client presentation",
      by: "Sales Team",
    },
  ]);

  const availableRooms = useMemo(
    () => rooms.filter((r) => r.status === "AVAILABLE"),
    [rooms]
  );

  const getRoomById = (id: string) =>
    rooms.find((room) => room.id === id) ?? null;

  const getBookingsByRoom = (roomId: string) =>
    bookings.filter((b) => b.roomId === roomId);

  const bookRoom = (payload: Omit<RoomBooking, "id">) => {
    setBookings((prev) => [
      ...prev,
      { id: `bk-${prev.length + 1}`, ...payload },
    ]);
  };

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

    rooms,
    availableRooms,
    bookings,
    getRoomById,
    getBookingsByRoom,
    bookRoom,
  };
}
