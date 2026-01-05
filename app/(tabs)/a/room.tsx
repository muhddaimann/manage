import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Pressable,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
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
import { CalendarCheck, Clock, CalendarDays } from "lucide-react-native";

type Room = {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
};

const ROOMS: Room[] = [
  { id: "r1", name: "Meeting Room A", capacity: 6, available: true },
  { id: "r2", name: "Meeting Room B", capacity: 10, available: false },
  { id: "r3", name: "Conference Room", capacity: 20, available: true },
];

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollRef}
          onScroll={(e) => onScroll(e.nativeEvent)}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing["3xl"] * 2,
            gap: tokens.spacing.md,
          }}
        >
          <Header title="Rooms" subtitle="Check availability & book a room" />

          <Pressable
            onPress={() => router.push("a/record")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
            })}
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
              borderRadius: tokens.radii.xl,
              padding: tokens.spacing.lg,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: tokens.spacing.md,
              shadowColor: colors.shadow,
              shadowOpacity: 0.12,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              <CalendarDays size={22} color={colors.primary} />
              <View>
                <Text
                  variant="labelSmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Showing availability for
                </Text>
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                  {formatDate(date)}
                </Text>
              </View>
            </View>

            <Button mode="outlined" compact onPress={openDatePicker}>
              Change
            </Button>
          </View>

          <Animated.View
            style={{
              opacity,
              transform: [{ scale }],
              gap: tokens.spacing.md,
            }}
          >
            {ROOMS.map((room) => (
              <View
                key={room.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: tokens.radii.xl,
                  padding: tokens.spacing.lg,
                  gap: tokens.spacing.sm,
                  shadowColor: colors.shadow,
                  shadowOpacity: 0.12,
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                      {room.name}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      Capacity {room.capacity} pax
                    </Text>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: 4,
                      borderRadius: tokens.radii.full,
                      backgroundColor: room.available
                        ? colors.primaryContainer
                        : colors.errorContainer,
                    }}
                  >
                    <Text
                      variant="labelSmall"
                      style={{
                        fontWeight: "700",
                        color: room.available
                          ? colors.onPrimaryContainer
                          : colors.onErrorContainer,
                      }}
                    >
                      {room.available ? "Available" : "Occupied"}
                    </Text>
                  </View>
                </View>

                <Button
                  mode={room.available ? "contained" : "outlined"}
                  disabled={!room.available}
                  contentStyle={{ height: 40 }}
                >
                  Book room
                </Button>
              </View>
            ))}
          </Animated.View>
        </ScrollView>
      </Pressable>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </KeyboardAvoidingView>
  );
}
