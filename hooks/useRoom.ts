import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getAllRooms,
  getRoomAvailabilityByDay,
  type Room,
  type Availability,
} from "../contexts/api/room";
import { useRoomStore } from "../contexts/api/roomStore";
import { useOverlay } from "../contexts/overlayContext";

export type TimeSlot = {
  time: string;
  status: "Available" | "Booked";
};

export type RoomUi = {
  id: string;
  name: string;
  capacity: number;
  slots?: TimeSlot[];
};

export type LevelGroup = {
  level: string;
  rooms: RoomUi[];
};

export type TowerGroup = {
  tower: string;
  levels: LevelGroup[];
};

export type SelectedSlot = {
  roomId: number;
  startLabel: string;
  endLabel: string;
  startTime: string;
  endTime: string;
};

const parseSlot = (label: string) => {
  const [start, end] = label.split(" - ");
  return { start, end };
};

const toMinutes = (label: string) => {
  const [start] = label.split(" - ");
  const [time, meridiem] = start.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

const toApiTime = (label: string) => {
  const [time, meridiem] = label.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const isPastDate = (date: string) => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < t;
};

const getCutoffMinutes = (date: string) => {
  const now = new Date();
  const target = new Date(date);
  if (now.toDateString() !== target.toDateString()) return null;
  return Math.ceil((now.getHours() * 60 + now.getMinutes()) / 60) * 60;
};

const formatDateUI = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

export default function useRoom(date: string) {
  const { toast } = useOverlay();

  const createBooking = useRoomStore((s) => s.createBooking);
  const storeLoading = useRoomStore((s) => s.loading);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [availability, setAvailability] = useState<
    Record<string, Availability>
  >({});
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState<
    Record<string, boolean>
  >({});
  const [roomDetails, setRoomDetails] = useState<Record<string, Room>>({});
  const [error, setError] = useState<string | null>(null);

  const [selection, setSelection] = useState<SelectedSlot | null>(null);
  const [selectingRoom, setSelectingRoom] = useState<number | null>(null);

  const cutoffMinutes = useMemo(() => getCutoffMinutes(date), [date]);
  const formattedDate = useMemo(() => formatDateUI(date), [date]);

  useEffect(() => {
    if (isPastDate(date)) {
      toast({
        message: "You can’t book rooms for past dates",
        variant: "warning",
      });
    }
  }, [date, toast]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const res = await getAllRooms();
      if (!alive) return;

      if ("error" in res) setError(res.error);
      else setRooms(res);

      setRoomsLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const fetchAvailability = useCallback(
    async (roomId: number) => {
      if (isPastDate(date)) return;

      const key = `${roomId}_${date}`;
      if (availability[key] || availabilityLoading[key]) return;

      setAvailabilityLoading((p) => ({ ...p, [key]: true }));
      setError(null);

      const res = await getRoomAvailabilityByDay(roomId, date);

      if ("error" in res) {
        setError(res.error);
      } else {
        setAvailability((p) => ({ ...p, [key]: res.availability }));
        setRoomDetails((p) => ({ ...p, [key]: res.room_details }));
      }

      setAvailabilityLoading((p) => ({ ...p, [key]: false }));
    },
    [date, availability, availabilityLoading],
  );

  const onSelectSlot = useCallback(
    (roomId: number, label: string, status: "Available" | "Booked") => {
      if (status !== "Available") return;

      const { start, end } = parseSlot(label);
      const tappedMin = toMinutes(label);

      if (!selection || selectingRoom !== roomId) {
        setSelection({
          roomId,
          startLabel: label,
          endLabel: label,
          startTime: start,
          endTime: end,
        });
        setSelectingRoom(roomId);
        return;
      }

      const startMin = toMinutes(selection.startLabel);
      const endMin = toMinutes(selection.endLabel);

      if (tappedMin >= startMin && tappedMin <= endMin) {
        if (tappedMin === startMin) {
          setSelection(null);
          setSelectingRoom(null);
        } else {
          const key = `${roomId}_${date}`;
          const roomAvailability = availability[key];
          if (!roomAvailability) return;

          const allSlots = Object.keys(roomAvailability).sort(
            (a, b) => toMinutes(a) - toMinutes(b),
          );
          const idx = allSlots.findIndex((l) => l === label);

          if (idx > 0) {
            const newEndLabel = allSlots[idx - 1];
            const { end: newEndTime } = parseSlot(newEndLabel);
            setSelection({
              ...selection,
              endLabel: newEndLabel,
              endTime: newEndTime,
            });
          } else {
            setSelection(null);
            setSelectingRoom(null);
          }
        }
        return;
      }

      if (tappedMin < startMin) {
        setSelection({
          roomId,
          startLabel: label,
          endLabel: selection.endLabel,
          startTime: start,
          endTime: selection.endTime,
        });
        return;
      }

      const key = `${roomId}_${date}`;
      const roomAvailability = availability[key];
      if (!roomAvailability) return;

      const allSlots = Object.keys(roomAvailability).sort(
        (a, b) => toMinutes(a) - toMinutes(b),
      );

      const between = allSlots.filter((l) => {
        const m = toMinutes(l);
        return m > endMin && m < tappedMin;
      });

      const contiguous = between.every(
        (l) => roomAvailability[l].status === "Available",
      );

      if (contiguous) {
        setSelection({
          ...selection,
          endLabel: label,
          endTime: end,
        });
      } else {
        toast({
          message: "You can only select a contiguous block of time.",
          variant: "warning",
        });
        setSelection({
          roomId,
          startLabel: label,
          endLabel: label,
          startTime: start,
          endTime: end,
        });
      }
    },
    [selection, selectingRoom, date, availability, toast],
  );

  const isSlotSelected = useCallback(
    (roomId: number, label: string) => {
      if (!selection || selection.roomId !== roomId) return false;
      const t = toMinutes(label);
      return (
        t >= toMinutes(selection.startLabel) &&
        t <= toMinutes(selection.endLabel)
      );
    },
    [selection],
  );

  const clearSelection = useCallback(() => {
    setSelection(null);
    setSelectingRoom(null);
  }, []);

  const submitBooking = useCallback(
    async (params: { purpose: string; PIC: string; email: string }) => {
      if (!selection) return { error: "No time selected" };

      const details = roomDetails[`${selection.roomId}_${date}`];
      if (!details) return { error: "Room details missing" };

      const { Room_Name, Tower, Level } = details;
      if (!Room_Name || !Tower || !Level) {
        return { error: "Invalid room information" };
      }

      const payload = {
        bookDate: date,
        start_time: toApiTime(selection.startTime),
        end_time: toApiTime(selection.endTime),
        room: Room_Name,
        tower: Tower,
        level: Level,
        purpose: params.purpose,
        PIC: params.PIC,
        email: params.email,
      };

      console.log("[submitBooking API payload]", payload);

      const res = await createBooking(
        payload.bookDate,
        payload.start_time,
        payload.end_time,
        payload.room,
        payload.tower,
        payload.level,
        payload.purpose,
        payload.PIC,
        payload.email,
      );

      if ("error" in res && res.error) {
        toast({ message: res.error, variant: "error" });
        return res;
      }

      toast({ message: "Room booked successfully", variant: "success" });
      clearSelection();
      return res;
    },
    [selection, roomDetails, date, createBooking, toast, clearSelection],
  );

  return {
    towers: useMemo<TowerGroup[]>(() => {
      if (isPastDate(date)) return [];

      const map = new Map<string, Map<string, RoomUi[]>>();

      rooms.forEach((r) => {
        const key = `${r.room_id}_${date}`;
        const slots = availability[key]
          ? Object.entries(availability[key])
              .filter(([time]) =>
                cutoffMinutes === null
                  ? true
                  : toMinutes(time) >= cutoffMinutes,
              )
              .sort(([a], [b]) => toMinutes(a) - toMinutes(b))
              .map(([time, v]) => ({ time, status: v.status }))
          : undefined;

        if (!map.has(r.Tower)) map.set(r.Tower, new Map());
        const levelMap = map.get(r.Tower)!;
        if (!levelMap.has(r.Level)) levelMap.set(r.Level, []);

        levelMap.get(r.Level)!.push({
          id: String(r.room_id),
          name: r.Room_Name,
          capacity: r.Capacity,
          slots,
        });
      });

      return Array.from(map.entries()).map(([tower, levels]) => ({
        tower,
        levels: Array.from(levels.entries()).map(([level, rooms]) => ({
          level,
          rooms,
        })),
      }));
    }, [rooms, availability, date, cutoffMinutes]),

    roomsLoading,
    availabilityLoading,
    bookingLoading: storeLoading,
    fetchAvailability,
    getTimeSlotRows: useCallback(
      (roomId: number) => {
        if (isPastDate(date)) return [];

        const key = `${roomId}_${date}`;
        const data = availability[key];
        if (!data) return [];

        const ordered = Object.entries(data)
          .filter(([time]) =>
            cutoffMinutes === null ? true : toMinutes(time) >= cutoffMinutes,
          )
          .sort(([a], [b]) => toMinutes(a) - toMinutes(b));

        const rows: (typeof ordered)[] = [];
        for (let i = 0; i < ordered.length; i += 2) {
          rows.push(ordered.slice(i, i + 2));
        }
        return rows;
      },
      [availability, date, cutoffMinutes],
    ),
    roomDetails,
    formattedDate,
    error,
    selection,
    onSelectSlot,
    isSlotSelected,
    clearSelection,
    submitBooking,
  };
}
