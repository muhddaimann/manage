import React, { useEffect, useState, useMemo } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CalendarClock, Users, Building, Layers } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import {
  getRoomAvailabilityByDay,
  type Availability,
  type Room,
} from "../../contexts/api/room";
import FullLoading from "../shared/fullLoad";
import NoData from "../shared/noData";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RoomModal({
  roomId,
  roomName,
  date,
}: {
  roomId: number;
  roomName: string;
  capacity: number;
  date: string;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  const ordered = useMemo(
    () =>
      Object.entries(availability || {}).sort(
        ([a], [b]) => toMinutes(a) - toMinutes(b),
      ),
    [availability],
  );

  const rows = useMemo(() => {
    const out: (typeof ordered)[] = [];
    for (let i = 0; i < ordered.length; i += 2) {
      out.push(ordered.slice(i, i + 2));
    }
    return out;
  }, [ordered]);

  return (
    <View
      style={{
        alignSelf: "center",
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.xl,
        padding: tokens.spacing.lg,
        width: SCREEN_WIDTH * 0.9,
        maxHeight: SCREEN_HEIGHT * 0.8,
        gap: tokens.spacing.lg,
      }}
    >
      {/* Header */}
      <View style={{ gap: 6 }}>
        <Text variant="titleLarge" style={{ fontWeight: "700" }}>
          {roomName}
        </Text>

        {loading ? (
          <View style={{ height: 32, width: '60%', backgroundColor: colors.surfaceVariant, borderRadius: tokens.radii.sm }} />
        ) : roomDetails ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Building size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                {roomDetails.Tower}
              </Text>
            </View>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Layers size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                {roomDetails.Level}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Users size={14} color={colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                Capacity {roomDetails.Capacity}
              </Text>
            </View>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CalendarClock size={14} color={colors.onSurfaceVariant} />
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {date}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
            <View
              style={{
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: tokens.radii.full,
                backgroundColor: colors.tertiaryContainer,
              }}
            >
              <Text
                variant="labelSmall"
                style={{
                  fontWeight: "600",
                  color: colors.onTertiaryContainer,
                }}
              >
                Available
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: tokens.radii.full,
                backgroundColor: colors.surfaceVariant,
              }}
            >
              <Text
                variant="labelSmall"
                style={{
                  fontWeight: "600",
                  color: colors.onSurfaceVariant,
                }}
              >
                Booked
              </Text>
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <FullLoading layout={[2, 2, 2, 2]} />
      ) : error ? (
        <NoData title="Error" subtitle={error} icon="alert-circle" />
      ) : rows.length ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: tokens.spacing.sm }}>
            {rows.map((row, rIdx) => (
              <View
                key={rIdx}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: tokens.spacing.sm,
                }}
              >
                {row.map(([time, slot]) => {
                  const available = slot.status === "Available";
                  return (
                    <View
                      key={time}
                      style={{
                        flex: 1,
                        paddingVertical: tokens.spacing.md,
                        borderRadius: tokens.radii.lg,
                        alignItems: "center",
                        backgroundColor: available
                          ? colors.tertiaryContainer
                          : colors.surfaceVariant,
                      }}
                    >
                      <Text
                        variant="bodyMedium"
                        style={{
                          fontWeight: "700",
                          color: available
                            ? colors.onTertiaryContainer
                            : colors.onSurfaceVariant,
                        }}
                      >
                        {time}
                      </Text>
                    </View>
                  );
                })}
                {row.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <NoData
          title="No Slots"
          subtitle="This room has no available slots for today."
          icon="calendar-remove"
        />
      )}
    </View>
  );
}
