import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
import { useTheme, TextInput, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { useGesture } from "../../../hooks/useGesture";
import { useFocusEffect } from "expo-router";

export default function ApplyRoom() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const isValid = useMemo(
    () =>
      leaveType.trim().length > 0 &&
      startDate.trim().length > 0 &&
      endDate.trim().length > 0 &&
      reason.trim().length > 0,
    [leaveType, startDate, endDate, reason]
  );

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;
  const liftY = useRef(new Animated.Value(0)).current;

  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture({
    controlNav: false,
  });

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);

      return () => {
        setHideTabBar(false);
      };
    }, [])
  );

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
        <ScrollView
          ref={scrollRef}
          onScroll={(e) => onScroll(e.nativeEvent)}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing["3xl"] * 2,
            gap: tokens.spacing.sm,
          }}
        >
          <Header title="Apply Leave" subtitle="Submit your leave request" />

          <Animated.View
            style={{
              marginTop: tokens.spacing.md,
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
            <View style={{ gap: tokens.spacing.md }}>
              <TextInput
                mode="outlined"
                label="Leave type (Annual / Medical / Emergency)"
                value={leaveType}
                onChangeText={setLeaveType}
                returnKeyType="next"
              />

              <TextInput
                mode="outlined"
                label="Start date"
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                returnKeyType="next"
              />

              <TextInput
                mode="outlined"
                label="End date"
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                returnKeyType="next"
              />

              <TextInput
                mode="outlined"
                label="Reason"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
                returnKeyType="done"
              />
            </View>

            <Button
              mode="contained"
              disabled={!isValid}
              contentStyle={{ height: 48 }}
            >
              Submit leave request
            </Button>
          </Animated.View>
        </ScrollView>
      </Pressable>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </KeyboardAvoidingView>
  );
}
