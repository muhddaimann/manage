import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { View, Pressable, Animated, Easing, ScrollView } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { useGesture } from "../../../hooks/useGesture";
import { useFocusEffect } from "expo-router";
import TwoRow from "../../../components/a/twoRow";
import { CalendarCheck, Clock } from "lucide-react-native";

type RoomBooking = {
  id: string;
  room: string;
  date: string;
  time: string;
  purpose: string;
  status: "ACTIVE" | "PAST";
};

const BOOKINGS: RoomBooking[] = [
  {
    id: "b1",
    room: "Meeting Room A",
    date: "8 Jan 2026",
    time: "10:00 – 11:00",
    purpose: "Sprint planning",
    status: "ACTIVE",
  },
  {
    id: "b2",
    room: "Conference Room",
    date: "2 Jan 2026",
    time: "14:00 – 16:00",
    purpose: "Client presentation",
    status: "PAST",
  },
];

export default function RecordRoom() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();

  const [tab, setTab] = useState<"ACTIVE" | "PAST">("ACTIVE");

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
        duration: 320,
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

  const data = useMemo(() => BOOKINGS.filter((b) => b.status === tab), [tab]);

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
          gap: tokens.spacing.md,
        }}
      >
        <Header title="Room Records" subtitle="Active & past bookings" />

        <TwoRow
          left={{
            amount: BOOKINGS.filter((b) => b.status === "ACTIVE").length,
            label: "Active booking",
            icon: <CalendarCheck size={24} color={colors.onPrimary} />,
            bgColor: colors.primary,
            textColor: colors.onPrimary,
            labelColor: colors.onPrimary,
          }}
          right={{
            amount: BOOKINGS.filter((b) => b.status === "PAST").length,
            label: "Booking history",
            icon: <Clock size={24} color={colors.onPrimaryContainer} />,
            bgColor: colors.primaryContainer,
            textColor: colors.onPrimaryContainer,
            labelColor: colors.onPrimaryContainer,
          }}
        />

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
            backgroundColor: colors.surfaceVariant,
            padding: tokens.spacing.xs,
            borderRadius: tokens.radii.full,
          }}
        >
          {(["ACTIVE", "PAST"] as const).map((v) => {
            const active = tab === v;
            return (
              <Pressable
                key={v}
                onPress={() => setTab(v)}
                style={{
                  flex: 1,
                  paddingVertical: tokens.spacing.sm,
                  borderRadius: tokens.radii.full,
                  backgroundColor: active ? colors.surface : "transparent",
                  alignItems: "center",
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{
                    fontWeight: "700",
                    color: active ? colors.onSurface : colors.onSurfaceVariant,
                  }}
                >
                  {v === "ACTIVE" ? "Active" : "Past"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Animated.View
          style={{
            opacity,
            transform: [{ scale }],
            gap: tokens.spacing.md,
          }}
        >
          {data.map((b) => (
            <View
              key={b.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: tokens.radii.xl,
                padding: tokens.spacing.lg,
                gap: tokens.spacing.xs,
                shadowColor: colors.shadow,
                shadowOpacity: 0.12,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 8,
              }}
            >
              <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                {b.room}
              </Text>

              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                {b.date} · {b.time}
              </Text>

              <Text variant="bodySmall">{b.purpose}</Text>

              {tab === "ACTIVE" && (
                <Button mode="outlined" contentStyle={{ height: 40 }}>
                  Cancel booking
                </Button>
              )}
            </View>
          ))}

          {data.length === 0 && (
            <Text
              variant="bodyMedium"
              style={{
                color: colors.onSurfaceVariant,
                textAlign: "center",
                marginTop: tokens.spacing.lg,
              }}
            >
              No records found
            </Text>
          )}
        </Animated.View>
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
