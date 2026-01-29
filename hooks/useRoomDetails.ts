// hooks/useRoomDetails.ts
import { useEffect, useState, useMemo } from "react";
import {
  getRoomAvailabilityByDay,
  type Availability,
  type Room,
} from "../contexts/api/room";

export default function useRoomDetails(roomId: number, date: string) {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || !date) {
        setLoading(false);
        return;
    };

    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await getRoomAvailabilityByDay(roomId, date);
      if (!alive) return;

      if ("error" in res) {
        setError(res.error);
      } else {
        setAvailability(res.availability);
        setRoomDetails(res.room_details);
      }
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [roomId, date]);

  const toMinutes = (label: string) => {
    const [start] = label.split(" - ");
    const [time, meridiem] = start.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (meridiem === "PM" && h !== 12) h += 12;
    if (meridiem === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const timeSlotRows = useMemo(() => {
    if (!availability) return [];
    
    const ordered = Object.entries(availability).sort(
      ([a], [b]) => toMinutes(a) - toMinutes(b)
    );

    const rows: (typeof ordered)[] = [];
    for (let i = 0; i < ordered.length; i += 2) {
      rows.push(ordered.slice(i, i + 2));
    }
    return rows;
  }, [availability]);

  return {
    loading,
    error,
    roomDetails,
    timeSlotRows,
  };
}
