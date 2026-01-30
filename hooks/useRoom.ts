import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getAllRooms,
  getRoomAvailabilityByDay,
  type Room,
  type Availability,
} from "../contexts/api/room";
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

const isPastDate = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return target < today;
};

const getCutoffMinutes = (date: string) => {
  const now = new Date();
  const target = new Date(date);
  if (now.toDateString() !== target.toDateString()) return null;
  const mins = now.getHours() * 60 + now.getMinutes();
  return Math.ceil(mins / 60) * 60;
};

const formatDateUI = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

export default function useRoom(date: string) {
  const { toast } = useOverlay();

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
        // Tapped a selected slot
        if (tappedMin === startMin) {
          // Tapped the first slot, clear selection
          setSelection(null);
          setSelectingRoom(null);
        } else {
          // Tapped a slot in the middle or end, "unselect slot and slot onward"
          const key = `${roomId}_${date}`;
          const roomAvailability = availability[key];
          if (!roomAvailability) return;

          const allSlots = Object.keys(roomAvailability).sort(
            (a, b) => toMinutes(a) - toMinutes(b),
          );
          const tappedIndex = allSlots.findIndex((l) => l === label);

          if (tappedIndex > 0) {
            const newEndLabel = allSlots[tappedIndex - 1];
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

      // Tapped an unselected slot, extend the selection
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

      // Check for continuity before extending forward
      const key = `${roomId}_${date}`;
      const roomAvailability = availability[key];
      if (!roomAvailability) return;

      const allSlots = Object.keys(roomAvailability).sort(
        (a, b) => toMinutes(a) - toMinutes(b),
      );

      const slotsInBetween = allSlots.filter((slotLabel) => {
        const min = toMinutes(slotLabel);
        return min > endMin && min < tappedMin;
      });

      const isContiguous = slotsInBetween.every(
        (slotLabel) => roomAvailability[slotLabel].status === "Available",
      );

      if (isContiguous) {
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
        // Start a new selection from the tapped slot
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

  const towers = useMemo<TowerGroup[]>(() => {
    if (isPastDate(date)) return [];

    const map = new Map<string, Map<string, RoomUi[]>>();

    rooms.forEach((r) => {
      const tower = r.Tower;
      const level = r.Level;
      const key = `${r.room_id}_${date}`;

      const slots = availability[key]
        ? Object.entries(availability[key])
            .filter(([time]) =>
              cutoffMinutes === null ? true : toMinutes(time) >= cutoffMinutes,
            )
            .sort(([a], [b]) => toMinutes(a) - toMinutes(b))
            .map(([time, v]) => ({
              time,
              status: v.status,
            }))
        : undefined;

      if (!map.has(tower)) map.set(tower, new Map());
      const levelMap = map.get(tower)!;
      if (!levelMap.has(level)) levelMap.set(level, []);

      levelMap.get(level)!.push({
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
  }, [rooms, availability, date, cutoffMinutes]);

  const getTimeSlotRows = useCallback(
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
  );

  return {
    towers,
    roomsLoading,
    availabilityLoading,
    fetchAvailability,
    getTimeSlotRows,
    roomDetails,
    formattedDate,
    error,
    selection,
    onSelectSlot,
    isSlotSelected,
    clearSelection,
  };
}
