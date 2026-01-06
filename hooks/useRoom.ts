// hooks/useRooms.ts
import { useEffect, useMemo, useState } from "react";
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
  slots: TimeSlot[];
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
  const [loading, setLoading] = useState(true);

  /* ---------- ROOMS ---------- */
  useEffect(() => {
    let alive = true;

    (async () => {
      const res = await getAllRooms();
      if (!alive || "error" in res) {
        setLoading(false);
        return;
      }
      setRooms(res);
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* ---------- AVAILABILITY ---------- */
  useEffect(() => {
    if (!rooms.length) {
      setLoading(false);
      return;
    }

    let pending = rooms.length;

    rooms.forEach(async (r) => {
      const res = await getRoomAvailabilityByDay(r.room_id, date);

      if (!("error" in res)) {
        setAvailability((prev) => ({
          ...prev,
          [String(r.room_id)]: res.availability,
        }));
      }

      pending -= 1;
      if (pending === 0) {
        setLoading(false);
      }
    });
  }, [rooms, date]);

  /* ---------- GROUPING ---------- */
  const towers = useMemo<TowerGroup[]>(() => {
    const map = new Map<string, Map<string, RoomUi[]>>();

    rooms.forEach((r) => {
      const tower = r.Tower;
      const level = r.Level;
      const roomKey = String(r.room_id);

      if (!map.has(tower)) map.set(tower, new Map());
      const levelMap = map.get(tower)!;
      if (!levelMap.has(level)) levelMap.set(level, []);

      const slots = availability[roomKey]
        ? Object.entries(availability[roomKey]).map(([time, v]) => ({
            time,
            status: v.status,
          }))
        : [];

      levelMap.get(level)!.push({
        id: roomKey,
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
  }, [rooms, availability]);

  return { towers, loading };
}
