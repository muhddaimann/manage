import React from "react";
import { View, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import LeaveBody from "../../../components/b/applicationBody";
import StaticSectionHeader from "../../../components/b/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { CalendarCheck } from "lucide-react-native";
import { useGesture } from "../../../hooks/useGesture";
import { useTabs } from "../../../contexts/tabContext";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function Leave() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();
  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture();

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(false);
    }, [setHideTabBar]),
  );

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
        <View style={{ marginTop: tokens.spacing.md }}>
          <StaticSectionHeader
            title="You’re viewing"
            label="Leave Applications"
            hint="View and manage your leave requests"
            icon={CalendarCheck}
          />
        </View>

        <LeaveBody />
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
