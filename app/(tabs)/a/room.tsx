import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { View, Animated, Easing, ScrollView } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useOverlay } from "../../../contexts/overlayContext";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { useGesture } from "../../../hooks/useGesture";
import { useFocusEffect } from "expo-router";
import TwoRow from "../../../components/a/twoRow";
import DatePicker from "../../../components/shared/datePicker";
import { CalendarCheck, Clock } from "lucide-react-native";
import RoomLevel, { UiRoom } from "../../../components/a/roomLevel";
import { TimeSlot } from "../../../components/a/timeSlot";
import {
  getAllRooms,
  getRoomAvailabilityByDay,
  Room as ApiRoom,
} from "../../../contexts/api/room";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RoomList() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();
  const { modal, dismissModal } = useOverlay();

  const [date, setDate] = useState(todayISO());
  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture({
    controlNav: false,
  });

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => setHideTabBar(false);
    }, [])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 18,
        stiffness: 160,
        mass: 0.6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const res = await getAllRooms();
      if (!mounted || "error" in res) return setLoading(false);

      const enriched: UiRoom[] = [];

      for (const r of res as ApiRoom[]) {
        const availabilityRes = await getRoomAvailabilityByDay(r.room_id, date);

        if ("error" in availabilityRes) continue;

        const slots: TimeSlot[] = Object.entries(
          availabilityRes.availability
        ).map(([time, v]) => ({
          time, // "HH:mm-HH:mm"
          status: v.status,
        }));

        enriched.push({
          id: String(r.room_id),
          name: r.Room_Name,
          capacity: r.Capacity,
          tower: r.Tower,
          level: Number(r.Level),
          slots,
        });
      }

      setRooms(enriched);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [date]);

  const groupedRooms = useMemo(
    () =>
      rooms.reduce<Record<string, UiRoom[]>>((acc, room) => {
        const key = `${room.tower}-${room.level}`;
        acc[key] = acc[key] ? [...acc[key], room] : [room];
        return acc;
      }, {}),
    [rooms]
  );

  const openDatePicker = () => {
    modal({
      dismissible: true,
      content: (
        <DatePicker
          mode="SINGLE"
          initialDate={date}
          onConfirm={(value) => {
            setDate(value as string);
            dismissModal();
          }}
        />
      ),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        ref={scrollRef}
        onScroll={(e) => onScroll(e.nativeEvent)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"] * 3,
          gap: tokens.spacing.md,
        }}
      >
        <Header title="Rooms" subtitle="Check availability & book a room" />

        <TwoRow
          left={{
            amount: 0,
            label: "Active booking",
            icon: <CalendarCheck size={24} color={colors.onPrimary} />,
            bgColor: colors.primary,
            textColor: colors.onPrimary,
            labelColor: colors.onPrimary,
          }}
          right={{
            amount: 0,
            label: "Booking history",
            icon: <Clock size={24} color={colors.onPrimaryContainer} />,
            bgColor: colors.primaryContainer,
            textColor: colors.onPrimaryContainer,
            labelColor: colors.onPrimaryContainer,
          }}
        />

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii["2xl"],
            padding: tokens.spacing.lg,
          }}
        >
          <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
            Now showing availability
          </Text>
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {formatDate(date)}
          </Text>

          <Button
            mode="contained"
            onPress={openDatePicker}
            style={{ marginTop: tokens.spacing.sm }}
            icon="calendar"
          >
            Change date
          </Button>
        </View>

        {!loading && (
          <Animated.View
            style={{ opacity, transform: [{ scale }], gap: tokens.spacing.lg }}
          >
            {Object.entries(groupedRooms).map(([key, list]) => (
              <RoomLevel
                key={key}
                tower={list[0].tower}
                level={list[0].level}
                rooms={list}
                date={date}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
