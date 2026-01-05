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
  const { user, today, dayStatus, toggleDayStatus } = useHome();
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

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii["2xl"],
            padding: tokens.spacing.lg,
            gap: tokens.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ gap: 2 }}>
              <Text variant="labelLarge" style={{ fontWeight: "700" }}>
                {today}
              </Text>
              <Text
                variant="labelMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                {user.role}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.xs,
                borderRadius: tokens.radii.full,
                backgroundColor: statusColor,
              }}
            >
              <Text
                variant="labelMedium"
                style={{ color: colors.onPrimary, fontWeight: "700" }}
              >
                {statusLabel}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={toggleDayStatus}
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              paddingHorizontal: tokens.spacing.md,
              paddingVertical: tokens.spacing.sm,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.primaryContainer,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              variant="labelMedium"
              style={{
                fontWeight: "700",
                color: colors.onPrimaryContainer,
              }}
            >
              Update today status
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
