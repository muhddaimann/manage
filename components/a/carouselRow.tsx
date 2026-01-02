import React from "react";
import { View, FlatList, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type NewsPriority = "HIGH" | "MEDIUM" | "LOW";

type NewsFlashItem = {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: NewsPriority;
  byDepartment: string;
  by: string;
};

type CarouselRowProps = {
  data: NewsFlashItem[];
  onPress?: (item: NewsFlashItem) => void;
};

const PRIORITY_COLOR: Record<NewsPriority, string> = {
  HIGH: "#EF4444",
  MEDIUM: "#F59E0B",
  LOW: "#10B981",
};

export default function CarouselRow({ data, onPress }: CarouselRowProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: tokens.spacing.md,
      }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onPress?.(item)}
          style={{
            width: 280,
            backgroundColor: colors.surfaceVariant,
            borderRadius: tokens.radii.xl,
            padding: tokens.spacing.md,
            gap: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: tokens.spacing.sm,
              paddingVertical: 4,
              borderRadius: tokens.radii.full,
              backgroundColor: PRIORITY_COLOR[item.priority],
            }}
          >
            <Text
              variant="labelSmall"
              style={{ color: "#fff", fontWeight: "700" }}
            >
              {item.priority}
            </Text>
          </View>

          <Text variant="titleSmall" style={{ fontWeight: "700" }}>
            {item.title}
          </Text>

          <Text
            variant="bodySmall"
            numberOfLines={3}
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
        </Pressable>
      )}
    />
  );
}
