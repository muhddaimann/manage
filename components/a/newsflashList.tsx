import React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import { NewsFlash, NewsPriority } from "../../hooks/useHome";
import NewsflashModal from "./newsflashModal";

type NewsflashListProps = {
  data: NewsFlash[];
};

const PRIORITY_COLOR: Record<NewsPriority, string> = {
  HIGH: "#EF4444",
  MEDIUM: "#F59E0B",
  LOW: "#10B981",
};

export default function NewsflashList({ data }: NewsflashListProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal } = useOverlay();
  const openDetails = (item: NewsFlash) => {
    modal({
      dismissible: true,
      content: (
        <Pressable onPress={dismissModal}>
          <NewsflashModal item={item} />
        </Pressable>
      ),
    });
  };

  return (
    <View style={{ gap: tokens.spacing.md }}>
      {data.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => openDetails(item)}
          style={({ pressed }) => ({
            backgroundColor: colors.surface,
            borderRadius: tokens.radii.xl,
            padding: tokens.spacing.lg,
            gap: tokens.spacing.sm,
            elevation: pressed ? 2 : 6,
            shadowColor: colors.shadow,
            shadowOpacity: pressed ? 0.12 : 0.18,
            shadowRadius: pressed ? 6 : 10,
            shadowOffset: { width: 0, height: pressed ? 2 : 6 },
          })}
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

          <Text
            variant="titleSmall"
            style={{ fontWeight: "700", color: colors.onSurface }}
          >
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
      ))}
    </View>
  );
}
