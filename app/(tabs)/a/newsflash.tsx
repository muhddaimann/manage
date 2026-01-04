import React, { useMemo, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import useHome from "../../../hooks/useHome";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { useGesture } from "../../../hooks/useGesture";

type Priority = "ALL" | "HIGH" | "MEDIUM" | "LOW";

const PRIORITIES: Priority[] = ["ALL", "HIGH", "MEDIUM", "LOW"];

export default function NewsflashPage() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { newsFlash } = useHome();
  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture();
  const [priority, setPriority] = useState<Priority>("ALL");

  const filtered = useMemo(() => {
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
          gap: tokens.spacing.lg,
        }}
      >
        <Header title="News Flash" subtitle="All announcements & updates" />

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

        <View style={{ gap: tokens.spacing.md }}>
          {filtered.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: tokens.radii.xl,
                padding: tokens.spacing.lg,
                gap: tokens.spacing.sm,
                elevation: 6,
                shadowColor: colors.shadow,
                shadowOpacity: 0.16,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
              }}
            >
              <Text
                variant="titleSmall"
                style={{ color: colors.onSurface, fontWeight: "600" }}
              >
                {item.title}
              </Text>

              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                {item.body}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: tokens.spacing.xs,
                }}
              >
                <Text
                  variant="labelSmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.byDepartment}
                </Text>

                <Text
                  variant="labelSmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
