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
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import { useStaffStore } from "../../../contexts/api/staffStore";
import { useRoomStore } from "../../../contexts/api/roomStore";
import { useOverlay } from "../../../contexts/overlayContext";

const toApiTime = (label: string) => {
  if (!label) return "";
  const [time, meridiem] = label.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const formatDateUI = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function RoomBook() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();
  const { toast } = useOverlay();

  const {
    roomName,
    tower,
    level,
    capacity,
    date: dateParam,
    startTime: startTimeParam,
    endTime: endTimeParam,
  } = useLocalSearchParams<{
    roomName?: string;
    tower?: string;
    level?: string;
    capacity?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  }>();

  const date = useMemo(() => dateParam || "", [dateParam]);
  const startTime = useMemo(() => startTimeParam || "", [startTimeParam]);
  const endTime = useMemo(() => endTimeParam || "", [endTimeParam]);

  const { createBooking, loading: bookingLoading } = useRoomStore();
  const { staff, fetchStaff } = useStaffStore();

  const [purpose, setPurpose] = useState("");
  const [pic, setPic] = useState("");
  const [email, setEmail] = useState("");

  const isValid =
    purpose.trim().length > 0 &&
    pic.trim().length > 0 &&
    email.trim().length > 0;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;
  const liftY = useRef(new Animated.Value(0)).current;

  useFocusEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  });

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useEffect(() => {
    if (staff) {
      setPic(staff.full_name);
      setEmail(staff.email);
    }
  }, [staff]);

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
          <Header title="Book Room" subtitle={roomName || ""} />

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
              {roomName && (
                <View style={{ gap: 2 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                    {roomName}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {tower} {level} · {capacity} pax
                  </Text>
                </View>
              )}

              <View style={{ gap: tokens.spacing.md }}>
                <TextInput
                  mode="outlined"
                  label="Date"
                  value={formatDateUI(date)}
                  editable={false}
                />

                <TextInput
                  mode="outlined"
                  label="Time"
                  value={`${startTime} - ${endTime}`}
                  editable={false}
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
                loading={bookingLoading}
                disabled={!isValid || bookingLoading}
                contentStyle={{ height: 48 }}
                onPress={async () => {
                  if (roomName && tower && level) {
                    const res = await createBooking(
                      date,
                      toApiTime(startTime),
                      toApiTime(endTime),
                      roomName!,
                      tower!,
                      level!,
                      purpose,
                      pic,
                      email,
                    );

                    if ("error" in res && res.error) {
                      toast({ message: res.error, variant: "error" });
                    } else {
                      toast({
                        message: "Room booked successfully!",
                        variant: "success",
                      });
                      router.back();
                    }
                  } else {
                    toast({
                      message: "Missing room details for submission.",
                      variant: "error",
                    });
                  }
                }}
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
