import React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import {
  NewsFlash,
  NewsPriority,
  NEWS_PRIORITY_COLOR,
} from "../../hooks/useHome";
import NewsflashModal from "./newsflashModal";

type NewsflashListProps = {
  data: NewsFlash[];
  onAcknowledge: (id: string) => Promise<any>;
};

const PRIORITY_LABEL: Record<NewsPriority, string> = {
  CRITICAL: "Critical",
  IMPORTANT: "Important",
  NORMAL: "Normal",
};

const stripHtml = (v: string) => v.replace(/<[^>]*>/g, "").trim();

export default function NewsflashList({
  data,
  onAcknowledge,
}: NewsflashListProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal, toast } = useOverlay();

  const openDetails = (item: NewsFlash) => {
    const handleModalAcknowledge = async (id: string) => {
      const result = await onAcknowledge(id);
      if (result?.status === "success") {
        dismissModal();
        toast({
          message: "Acknowledged successfully",
          variant: "success",
        });
      }
      return result;
    };

    modal({
      dismissible: true,
      content: (
        <NewsflashModal item={item} onAcknowledge={handleModalAcknowledge} />
      ),
    });
  };

  return (
    <View style={{ gap: tokens.spacing.md }}>
      {data.map((item) => {
        const color = NEWS_PRIORITY_COLOR[item.priority];
        const label = PRIORITY_LABEL[item.priority];

        return (
          <Pressable
            key={item.id}
            onPress={() => openDetails(item)}
            style={({ pressed }) => ({
              backgroundColor: item.acknowledged
                ? colors.surfaceVariant
                : colors.surface,
              borderRadius: tokens.radii.xl,
              padding: tokens.spacing.lg,
              gap: tokens.spacing.xs,
              elevation: item.acknowledged ? 0 : pressed ? 2 : 6,
              shadowColor: colors.shadow,
              shadowOpacity: pressed ? 0.12 : 0.18,
              shadowRadius: pressed ? 6 : 10,
              shadowOffset: { width: 0, height: pressed ? 2 : 6 },
              opacity: item.acknowledged ? 0.8 : 1,
            })}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingHorizontal: tokens.spacing.sm,
                  paddingVertical: 4,
                  borderRadius: tokens.radii.full,
                  backgroundColor: color,
                }}
              >
                <Text
                  variant="labelSmall"
                  style={{ color: "#fff", fontWeight: "700" }}
                >
                  {label}
                </Text>
              </View>

              {item.acknowledged && (
                <Text
                  variant="labelSmall"
                  style={{
                    color: colors.onSurfaceVariant,
                    fontWeight: "600",
                    fontStyle: "italic",
                  }}
                >
                  Read
                </Text>
              )}
            </View>

            <Text
              variant="titleSmall"
              style={{ fontWeight: "700", color: colors.onSurface }}
            >
              {item.title}
            </Text>

            <Text
              variant="bodySmall"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: colors.onSurfaceVariant }}
            >
              {stripHtml(item.body)}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: tokens.spacing.xs,
              }}
            >
              <Text
                variant="labelSmall"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  flex: 1,
                  color: colors.onSurfaceVariant,
                }}
              >
                {item.byDepartment}
              </Text>

              <Text
                variant="labelSmall"
                style={{
                  marginLeft: tokens.spacing.sm,
                  flexShrink: 0,
                  color: colors.onSurfaceVariant,
                }}
              >
                {item.date}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
