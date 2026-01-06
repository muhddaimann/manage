import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { View, Animated, Easing, ScrollView, Pressable } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useOverlay } from "../../../contexts/overlayContext";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { useGesture } from "../../../hooks/useGesture";
import { useFocusEffect, router } from "expo-router";
import TwoRow from "../../../components/a/twoRow";
import DatePicker from "../../../components/shared/datePicker";
import { CalendarCheck, Clock } from "lucide-react-native";
import RoomLevel, { Room } from "../../../components/a/roomLevel";

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

const ROOMS: Room[] = [
  {
    id: "r1",
    name: "Meeting Room A",
    capacity: 6,
    tower: "Tower A",
    level: 3,
    slots: [
      { start: "08:00", end: "08:30", available: true },
      { start: "08:30", end: "09:00", available: true },

      { start: "09:00", end: "09:30", available: true },
      { start: "09:30", end: "10:00", available: true },

      { start: "10:00", end: "10:30", available: false }, // booked
      { start: "10:30", end: "11:00", available: false }, // booked

      { start: "11:00", end: "11:30", available: true },
      { start: "11:30", end: "12:00", available: true },

      { start: "12:00", end: "12:30", available: false }, // lunch block
      { start: "12:30", end: "13:00", available: false },

      { start: "13:00", end: "13:30", available: true },
      { start: "13:30", end: "14:00", available: true },

      { start: "14:00", end: "14:30", available: true },
      { start: "14:30", end: "15:00", available: true },

      { start: "15:00", end: "15:30", available: false }, // meeting
      { start: "15:30", end: "16:00", available: false },

      { start: "16:00", end: "16:30", available: true },
      { start: "16:30", end: "17:00", available: true },
    ],
  },

  {
    id: "r2",
    name: "Meeting Room B",
    capacity: 10,
    tower: "Tower A",
    level: 3,
    slots: [
      { start: "08:00", end: "08:30", available: false },
      { start: "08:30", end: "09:00", available: false },

      { start: "09:00", end: "09:30", available: false },
      { start: "09:30", end: "10:00", available: false },

      { start: "10:00", end: "10:30", available: true },
      { start: "10:30", end: "11:00", available: true },

      { start: "11:00", end: "11:30", available: true },
      { start: "11:30", end: "12:00", available: false },

      { start: "12:00", end: "12:30", available: false },
      { start: "12:30", end: "13:00", available: false },

      { start: "13:00", end: "13:30", available: true },
      { start: "13:30", end: "14:00", available: true },

      { start: "14:00", end: "14:30", available: false },
      { start: "14:30", end: "15:00", available: false },

      { start: "15:00", end: "15:30", available: true },
      { start: "15:30", end: "16:00", available: true },
    ],
  },

  {
    id: "r3",
    name: "Conference Room",
    capacity: 20,
    tower: "Tower B",
    level: 5,
    slots: [
      { start: "09:00", end: "09:30", available: true },
      { start: "09:30", end: "10:00", available: true },

      { start: "10:00", end: "10:30", available: true },
      { start: "10:30", end: "11:00", available: true },

      { start: "11:00", end: "11:30", available: false },
      { start: "11:30", end: "12:00", available: false },

      { start: "12:00", end: "12:30", available: true },
      { start: "12:30", end: "13:00", available: true },

      { start: "13:00", end: "13:30", available: true },
      { start: "13:30", end: "14:00", available: true },

      { start: "14:00", end: "14:30", available: false },
      { start: "14:30", end: "15:00", available: false },

      { start: "15:00", end: "15:30", available: false },
      { start: "15:30", end: "16:00", available: false },

      { start: "16:00", end: "16:30", available: true },
      { start: "16:30", end: "17:00", available: true },
    ],
  },
];

export default function RoomList() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();
  const { modal, dismissModal } = useOverlay();
  const [date, setDate] = useState(todayISO());
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

  const groupedRooms = useMemo(() => {
    return ROOMS.reduce<Record<string, Room[]>>((acc, room) => {
      const key = `${room.tower}-${room.level}`;
      acc[key] = acc[key] ? [...acc[key], room] : [room];
      return acc;
    }, {});
  }, []);

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

        <Pressable
          onPress={() => router.push("a/record")}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <TwoRow
            left={{
              amount: 1,
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
        </Pressable>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii["2xl"],
            padding: tokens.spacing.lg,
            shadowColor: colors.shadow,
            shadowOpacity: 0.12,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                variant="labelSmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Now showing availability
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                {formatDate(date)}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={openDatePicker}
              labelStyle={{ fontWeight: "600" }}
              contentStyle={{ flexDirection: "row-reverse" }}
              icon="calendar"
            >
              Change
            </Button>
          </View>
        </View>

        <Animated.View
          style={{
            opacity,
            transform: [{ scale }],
            gap: tokens.spacing.lg,
          }}
        >
          {Object.entries(groupedRooms).map(([key, rooms]) => {
            const { tower, level } = rooms[0];
            return (
              <RoomLevel key={key} tower={tower} level={level} rooms={rooms} />
            );
          })}
        </Animated.View>
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
