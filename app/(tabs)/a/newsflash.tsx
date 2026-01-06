import React, { useMemo, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import useHome, { NewsFlash, NewsPriority } from "../../../hooks/useHome";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { useGesture } from "../../../hooks/useGesture";
import NewsflashList from "../../../components/a/newsflashList";

type PriorityFilter = "ALL" | NewsPriority;

const PRIORITIES: PriorityFilter[] = ["ALL", "CRITICAL", "IMPORTANT", "NORMAL"];

export default function NewsflashPage() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { newsFlash } = useHome();
  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture({
    controlNav: false,
  });

  const [priority, setPriority] = useState<PriorityFilter>("ALL");

  const filteredData = useMemo<NewsFlash[]>(() => {
    if (priority === "ALL") return newsFlash;
    return newsFlash.filter((n) => n.priority === priority);
  }, [newsFlash, priority]);

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
          gap: tokens.spacing.sm,
        }}
      >
        <Header title="Newsflash" subtitle="All announcements & updates" />

        <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
          {PRIORITIES.map((p) => {
            const active = p === priority;

            return (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={({ pressed }) => ({
                  paddingHorizontal: tokens.spacing.md,
                  paddingVertical: tokens.spacing.sm,
                  borderRadius: tokens.radii.full,
                  backgroundColor: active
                    ? colors.primary
                    : colors.surfaceVariant,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text
                  variant="labelMedium"
                  style={{
                    color: active ? colors.onPrimary : colors.onSurfaceVariant,
                    fontWeight: active ? "700" : "500",
                  }}
                >
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <NewsflashList data={filteredData} />
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
