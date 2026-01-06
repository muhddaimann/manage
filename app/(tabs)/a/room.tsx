import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { View, Animated, Easing, ScrollView, Pressable } from "react-native";
import { useTheme, Text, Button, Chip } from "react-native-paper";
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
import useRooms from "../../../hooks/useRoom";
import TimeSlot, { TimeSlotRange } from "../../../components/a/timeSlot";

/* ================= HELPERS ================= */

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

/* ================= COMPONENT ================= */

export default function RoomList() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();
  const { modal, dismissModal } = useOverlay();

  const [date, setDate] = useState(todayISO());
  const { towers, loading } = useRooms(date);

  const [activeTower, setActiveTower] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

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
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 18,
        stiffness: 160,
        mass: 0.7,
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

  const towersList = useMemo(() => towers.map((t) => t.tower), [towers]);

  const levelsList = useMemo(() => {
    if (!activeTower) return [];
    return (
      towers.find((t) => t.tower === activeTower)?.levels.map((l) => l.level) ??
      []
    );
  }, [towers, activeTower]);

  const rooms = useMemo(() => {
    return towers
      .filter((t) => !activeTower || t.tower === activeTower)
      .flatMap((t) =>
        t.levels.filter((l) => !activeLevel || l.level === activeLevel)
      )
      .flatMap((l) => l.rooms);
  }, [towers, activeTower, activeLevel]);

  const openTimeSlotModal = (room: any) => {
    modal({
      dismissible: true,
      content: (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii["2xl"],
            padding: tokens.spacing.lg,
            gap: tokens.spacing.md,
          }}
        >
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {room.name}
          </Text>

          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            Select time slot
          </Text>

          <TimeSlot
            slots={room.slots}
            dateISO={date}
            onConfirm={(range: TimeSlotRange) => {
              dismissModal();
            }}
            onCancel={dismissModal}
          />
        </View>
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
          gap: tokens.spacing.lg,
        }}
      >
        <Header title="Rooms" subtitle="Choose room, then time slot" />

        <TwoRow
          left={{
            amount: 1,
            label: "Active booking",
            icon: <CalendarCheck size={22} color={colors.onPrimary} />,
            bgColor: colors.primary,
            textColor: colors.onPrimary,
            labelColor: colors.onPrimary,
          }}
          right={{
            amount: 0,
            label: "Booking history",
            icon: <Clock size={22} color={colors.onPrimaryContainer} />,
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
            gap: tokens.spacing.xs,
          }}
        >
          <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
            Availability date
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="titleMedium" style={{ fontWeight: "700" }}>
              {formatDate(date)}
            </Text>

            <Button mode="outlined" icon="calendar" onPress={openDatePicker}>
              Change
            </Button>
          </View>
        </View>

        {!loading && (
          <Animated.View
            style={{
              opacity,
              transform: [{ scale }],
              gap: tokens.spacing.lg,
            }}
          >
            <View style={{ gap: tokens.spacing.sm }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {towersList.map((t) => (
                    <Chip
                      key={t}
                      selected={activeTower === t}
                      onPress={() => {
                        setActiveTower(t);
                        setActiveLevel(null);
                      }}
                    >
                      {t}
                    </Chip>
                  ))}
                </View>
              </ScrollView>

              {activeTower && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {levelsList.map((l) => (
                      <Chip
                        key={l}
                        selected={activeLevel === l}
                        onPress={() => setActiveLevel(l)}
                      >
                        Level {l}
                      </Chip>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            <View style={{ gap: tokens.spacing.md }}>
              {rooms.map((room) => (
                <Pressable
                  key={room.id}
                  onPress={() => openTimeSlotModal(room)}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface,
                    borderRadius: tokens.radii["2xl"],
                    padding: tokens.spacing.lg,
                    gap: tokens.spacing.xs,
                    shadowColor: colors.shadow,
                    shadowOpacity: 0.08,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                    opacity: pressed ? 0.92 : 1,
                  })}
                >
                  <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                    {room.name}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Capacity {room.capacity} pax
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
