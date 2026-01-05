import React from "react";
import { View } from "react-native";
import { Text, useTheme, Divider, Button } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { NewsFlash, NewsPriority } from "../../hooks/useHome";

const PRIORITY_COLOR: Record<NewsPriority, string> = {
  HIGH: "#EF4444",
  MEDIUM: "#F59E0B",
  LOW: "#10B981",
};

export default function NewsflashModal({ item }: { item: NewsFlash }) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.xl,
        padding: tokens.spacing.xl,
        gap: tokens.spacing.md,
      }}
    >
      <View
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: 6,
          borderRadius: tokens.radii.full,
          backgroundColor: PRIORITY_COLOR[item.priority],
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          {item.priority}
        </Text>
      </View>

      <Text variant="titleMedium">{item.title}</Text>

      <Divider />

      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
        {item.body}
      </Text>

      <Divider />

      <View style={{ gap: 4 }}>
        <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
          Department
        </Text>
        <Text>{item.byDepartment}</Text>
      </View>

      <View style={{ gap: 4 }}>
        <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
          Published
        </Text>
        <Text>{item.date}</Text>
      </View>

      <Button
        mode="contained"
        disabled
        style={{ marginTop: tokens.spacing.sm, borderRadius: tokens.radii.lg }}
        contentStyle={{ height: 46 }}
      >
        Acknowledged
      </Button>
    </View>
  );
}
