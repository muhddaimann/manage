import React, { useMemo, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Text, useTheme, Divider } from "react-native-paper";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Layers,
  Users,
  DoorOpen,
  CalendarClock,
  CalendarCheck,
  Clock,
} from "lucide-react-native";
import { useDesign } from "../../../contexts/designContext";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import FullLoading from "../../../components/shared/fullLoad";
import TwoRow from "../../../components/a/twoRow";
import { useGesture } from "../../../hooks/useGesture";
import { useRouter } from "expo-router";
import useRoom, { type SelectedSlot } from "../../../hooks/useRoom";
import type { Room } from "../../../contexts/api/room";
import RoomModal from "../../../components/a/roomModal";
import DatePicker from "../../../components/shared/datePicker";
import { useOverlay } from "../../../contexts/overlayContext";

const isPastDate = (date: string) => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < t;
};

export default function RoomPage() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal, toast } = useOverlay();
  const router = useRouter();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const { towers, roomsLoading, formattedDate } = useRoom(selectedDate);

  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture({
    controlNav: false,
  });

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleTower = (tower: string) => {
    setCollapsed((p) => ({ ...p, [tower]: !p[tower] }));
  };

  const totalRooms = useMemo(
    () =>
      towers.reduce(
        (acc, t) => acc + t.levels.reduce((a, l) => a + l.rooms.length, 0),
        0,
      ),
    [towers],
  );

  const totalTowers = towers.length;

  const openRoom = (room: { id: string; name: string }) => {
    const handleConfirm = (selection: SelectedSlot, details: Room) => {
      dismissModal();

      setTimeout(() => {
        router.push({
          pathname: "/a/book",
          params: {
            roomId: selection.roomId,
            roomName: room.name,
            capacity: details.Capacity,
            tower: details.Tower,
            level: details.Level,
            date: selectedDate,
            startTime: selection.startTime,
            endTime: selection.endTime,
          },
        });
      }, 250);
    };

    modal({
      dismissible: true,
      content: (
        <RoomModal
          roomId={Number(room.id)}
          roomName={room.name}
          date={selectedDate}
          onConfirm={handleConfirm}
        />
      ),
    });
  };

  const openDatePicker = () => {
    modal({
      dismissible: true,
      content: (
        <DatePicker
          mode="SINGLE"
          initialDate={selectedDate}
          onConfirm={(value) => {
            if (typeof value === "string") {
              if (isPastDate(value)) {
                toast({
                  message: "You can’t book rooms for past dates",
                  variant: "warning",
                });
                setSelectedDate(today);
              } else {
                setSelectedDate(value);
              }
            }
            dismissModal();
          }}
        />
      ),
    });
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        onScroll={(e) => onScroll(e.nativeEvent)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.lg,
        }}
      >
        <Header
          title="Room Booking"
          subtitle={
            selectedDate === today
              ? "Tap to change date"
              : `Availability for ${formattedDate}`
          }
          rightSlot={
            <Pressable
              onPress={openDatePicker}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                borderRadius: tokens.radii.full,
                backgroundColor:
                  selectedDate === today
                    ? colors.primary
                    : colors.surfaceVariant,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <CalendarClock
                size={14}
                color={
                  selectedDate === today
                    ? colors.onPrimary
                    : colors.onSurfaceVariant
                }
              />
              <Text
                variant="labelMedium"
                style={{
                  fontWeight: "700",
                  color:
                    selectedDate === today
                      ? colors.onPrimary
                      : colors.onSurfaceVariant,
                }}
              >
                {selectedDate === today ? "Today" : "Date"}
              </Text>
            </Pressable>
          }
        />

        {roomsLoading ? (
          <FullLoading layout={[2]} />
        ) : (
          <TwoRow
            left={{
              amount: totalRooms,
              label: "Total rooms",
              icon: <CalendarCheck size={24} color={colors.onPrimary} />,
              bgColor: colors.primary,
              textColor: colors.onPrimary,
              labelColor: colors.onPrimary,
            }}
            right={{
              amount: totalTowers,
              label: "Towers",
              icon: <Clock size={24} color={colors.onPrimaryContainer} />,
              bgColor: colors.primaryContainer,
              textColor: colors.onPrimaryContainer,
              labelColor: colors.onPrimaryContainer,
            }}
          />
        )}

        {roomsLoading ? (
          <FullLoading layout={[1, 1, 1, 1]} />
        ) : (
          <View style={{ gap: tokens.spacing.lg }}>
            {towers.map((tower) => {
              const isCollapsed = collapsed[tower.tower] ?? false;
              const roomCount = tower.levels.reduce(
                (acc, l) => acc + l.rooms.length,
                0,
              );

              return (
                <View
                  key={tower.tower}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: tokens.radii.xl,
                    padding: tokens.spacing.md,
                    gap: tokens.spacing.md,
                  }}
                >
                  <Pressable
                    onPress={() => toggleTower(tower.tower)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <Building2 size={20} color={colors.primary} />
                      <View>
                        <Text
                          variant="titleMedium"
                          style={{ fontWeight: "700" }}
                        >
                          {tower.tower}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: colors.onSurfaceVariant }}
                        >
                          {roomCount} rooms
                        </Text>
                      </View>
                    </View>

                    {isCollapsed ? (
                      <ChevronRight size={22} color={colors.onSurfaceVariant} />
                    ) : (
                      <ChevronDown size={22} color={colors.onSurfaceVariant} />
                    )}
                  </Pressable>

                  {!isCollapsed &&
                    tower.levels.map((level) => (
                      <View
                        key={level.level}
                        style={{ gap: tokens.spacing.sm }}
                      >
                        <Divider />

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Layers size={16} color={colors.onSurfaceVariant} />
                          <Text
                            variant="labelLarge"
                            style={{ color: colors.onSurfaceVariant }}
                          >
                            {level.level}
                          </Text>
                        </View>

                        <View style={{ gap: tokens.spacing.sm }}>
                          {level.rooms.map((room) => (
                            <Pressable
                              key={room.id}
                              onPress={() =>
                                openRoom({ id: room.id, name: room.name })
                              }
                              style={{
                                backgroundColor: colors.background,
                                borderRadius: tokens.radii.lg,
                                padding: tokens.spacing.md,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: tokens.spacing.md,
                                borderWidth: 1,
                                borderColor: colors.outlineVariant,
                              }}
                            >
                              <DoorOpen
                                size={20}
                                color={colors.onSurfaceVariant}
                              />

                              <View style={{ flex: 1, gap: 4 }}>
                                <Text
                                  variant="labelLarge"
                                  style={{ fontWeight: "600" }}
                                >
                                  {room.name}
                                </Text>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <Users
                                    size={14}
                                    color={colors.onSurfaceVariant}
                                  />
                                  <Text
                                    variant="bodySmall"
                                    style={{
                                      color: colors.onSurfaceVariant,
                                    }}
                                  >
                                    Capacity {room.capacity}
                                  </Text>
                                </View>
                              </View>

                              <ChevronRight
                                size={20}
                                color={colors.onSurfaceVariant}
                              />
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    ))}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
