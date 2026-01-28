import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  Animated,
  Easing,
} from "react-native";
import { useTheme, Text, TextInput, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/shared/header";
import useHome from "../../../hooks/useHome";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";

export default function RoomBook() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();
  const { rooms } = useHome();
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const room = useMemo(
    () => rooms.find((r) => r.id === roomId),
    [rooms, roomId]
  );

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");

  const isValid =
    !!room &&
    date.trim().length > 0 &&
    startTime.trim().length > 0 &&
    endTime.trim().length > 0 &&
    purpose.trim().length > 0;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;
  const liftY = useRef(new Animated.Value(0)).current;

  useFocusEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
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

    const show = Keyboard.addListener("keyboardWillShow", () => {
      Animated.spring(liftY, {
        toValue: -20,
        damping: 20,
        stiffness: 180,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardWillHide", () => {
      Animated.spring(liftY, {
        toValue: 0,
        damping: 18,
        stiffness: 150,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.sm,
          }}
        >
          <Header
            title="Book Room"
            subtitle={room ? room.name : "Select a room"}
          />

          <View style={{ flex: 1, paddingTop: tokens.spacing.md }}>
            <Animated.View
              style={{
                backgroundColor: colors.surface,
                borderRadius: tokens.radii["2xl"],
                padding: tokens.spacing.xl,
                gap: tokens.spacing.lg,
                opacity,
                transform: [{ scale }, { translateY: liftY }],
                shadowColor: colors.shadow,
                shadowOpacity: 0.15,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 },
                elevation: 12,
              }}
            >
              {room && (
                <View style={{ gap: 2 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                    {room.name}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {room.location} · {room.capacity} pax · {room.type}
                  </Text>
                </View>
              )}

              <View style={{ gap: tokens.spacing.md }}>
                <TextInput
                  mode="outlined"
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  value={date}
                  onChangeText={setDate}
                  returnKeyType="next"
                />

                <TextInput
                  mode="outlined"
                  label="Start time"
                  placeholder="HH:MM"
                  value={startTime}
                  onChangeText={setStartTime}
                  returnKeyType="next"
                />

                <TextInput
                  mode="outlined"
                  label="End time"
                  placeholder="HH:MM"
                  value={endTime}
                  onChangeText={setEndTime}
                  returnKeyType="next"
                />

                <TextInput
                  mode="outlined"
                  label="Purpose"
                  value={purpose}
                  onChangeText={setPurpose}
                  multiline
                  numberOfLines={3}
                  returnKeyType="done"
                />
              </View>

              <Button
                mode="contained"
                disabled={!isValid}
                contentStyle={{ height: 48 }}
                onPress={() => router.back()}
              >
                Confirm booking
              </Button>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
