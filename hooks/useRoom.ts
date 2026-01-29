// hooks/useRooms.ts
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getAllRooms,
  getRoomAvailabilityByDay,
  type Room,
  type Availability,
} from "../contexts/api/room";

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

export default function useRooms(date: string) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availability, setAvailability] = useState<
    Record<string, Availability>
  >({});
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState<
    Record<string, boolean>
  >({});

  /* ---------- ROOMS ---------- */
  useEffect(() => {
    let alive = true;

    (async () => {
      const res = await getAllRooms();
      if (!alive || "error" in res) {
        setRoomsLoading(false);
        return;
      }
      setRooms(res);
      setRoomsLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* ---------- AVAILABILITY (ON-DEMAND) ---------- */
  const fetchAvailability = useCallback(
    async (roomId: number) => {
      const key = `${roomId}_${date}`;
      if (availability[key] || availabilityLoading[key]) return;

      setAvailabilityLoading((p) => ({ ...p, [key]: true }));

      const res = await getRoomAvailabilityByDay(roomId, date);

      if (!("error" in res)) {
        setAvailability((p) => ({
          ...p,
          [key]: res.availability,
        }));
      }

      setAvailabilityLoading((p) => ({ ...p, [key]: false }));
    },
    [date, availability, availabilityLoading],
  );

  /* ---------- GROUPING ---------- */
  const towers = useMemo<TowerGroup[]>(() => {
    const map = new Map<string, Map<string, RoomUi[]>>();

    rooms.forEach((r) => {
      const tower = r.Tower;
      const level = r.Level;
      const roomKey = `${r.room_id}_${date}`;
      const slots = availability[roomKey]
        ? Object.entries(availability[roomKey]).map(([time, v]) => ({
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
  }, [rooms, availability, date]);

  return {
    towers,
    roomsLoading,
    availabilityLoading,
    fetchAvailability,
  };
}
