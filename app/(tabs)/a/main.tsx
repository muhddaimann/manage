import React from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import useHome from "../../../hooks/useHome";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { useGesture } from "../../../hooks/useGesture";
import MainCard from "../../../components/a/mainCard";

export default function MainPage() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { dayStatus } = useHome();
  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture({
    controlNav: false,
  });

  const statusLabel =
    dayStatus === "NOT_CHECKED_IN"
      ? "Not checked in"
      : dayStatus === "WORKING"
      ? "Working"
      : dayStatus === "ON_LEAVE"
      ? "On leave"
      : "Completed";

  const statusColor =
    dayStatus === "NOT_CHECKED_IN"
      ? colors.error
      : dayStatus === "WORKING"
      ? colors.primary
      : dayStatus === "ON_LEAVE"
      ? colors.secondary
      : colors.tertiary;

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
        <Header title="Schedule" subtitle="Review today overview" />

        <MainCard />
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
