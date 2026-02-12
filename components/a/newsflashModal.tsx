import React, { useState, useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import { Text, useTheme, Divider, Button } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { useDesign } from "../../contexts/designContext";
import {
  NewsFlash,
  NewsPriority,
  NEWS_PRIORITY_COLOR,
} from "../../hooks/useHome";

const PRIORITY_LABEL: Record<NewsPriority, string> = {
  CRITICAL: "Critical",
  IMPORTANT: "Important",
  NORMAL: "Normal",
};

export default function NewsflashModal({
  item,
  onAcknowledge,
}: {
  item: NewsFlash;
  onAcknowledge: (id: string) => Promise<any>;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { width } = useWindowDimensions();
  const priorityColor = NEWS_PRIORITY_COLOR[item.priority];
  const priorityLabel = PRIORITY_LABEL[item.priority];

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [canAcknowledge, setCanAcknowledge] = useState(false);

  useEffect(() => {
    if (item.acknowledged) {
      setCountdown(3);
      setCanAcknowledge(false);
      return;
    }

    setCountdown(3);
    setCanAcknowledge(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanAcknowledge(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [item.id, item.acknowledged]);

  const isHtml =
    typeof item.body === "string" && /<\/?[a-z][\s\S]*>/i.test(item.body);

  const handleAcknowledge = async () => {
    if (item.acknowledged || !canAcknowledge) return;

    setLoading(true);
    await onAcknowledge(item.id);
    setLoading(false);
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.xl,
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.md,
        gap: tokens.spacing.xs,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: tokens.spacing.xs,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <View
          style={{
            paddingHorizontal: tokens.spacing.md,
            paddingVertical: 6,
            borderRadius: tokens.radii.full,
            backgroundColor: priorityColor,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {priorityLabel}
          </Text>
        </View>

        <View
          style={{
            maxWidth: "100%",
            paddingHorizontal: tokens.spacing.md,
            paddingVertical: 6,
            borderRadius: tokens.radii.full,
            backgroundColor: colors.surfaceVariant,
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: colors.onSurfaceVariant,
              fontWeight: "600",
            }}
          >
            {item.byDepartment}
          </Text>
        </View>
      </View>

      <Text variant="titleMedium" style={{ fontWeight: "700" }}>
        {item.title}
      </Text>

      <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
        {item.by} • {item.date}
      </Text>

      <Divider />

      {isHtml ? (
        <RenderHTML
          contentWidth={width - tokens.spacing.lg * 2}
          source={{ html: item.body }}
          baseStyle={{
            color: colors.onSurfaceVariant,
            fontSize: 14,
            lineHeight: 20,
          }}
          tagsStyles={{
            a: {
              color: colors.primary,
              textDecorationLine: "underline",
              fontWeight: "600",
            },
            p: { marginVertical: 6 },
            img: {
              marginVertical: 10,
              borderRadius: tokens.radii.md,
            },
          }}
        />
      ) : (
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          {item.body}
        </Text>
      )}

      <Button
        mode="contained"
        loading={loading}
        disabled={item.acknowledged || loading || !canAcknowledge}
        onPress={handleAcknowledge}
        style={{
          marginTop: tokens.spacing.sm,
          borderRadius: tokens.radii.lg,
        }}
        contentStyle={{ height: 46 }}
      >
        {item.acknowledged
          ? "Acknowledged"
          : canAcknowledge
            ? "Acknowledge"
            : `Acknowledge in ${countdown}...`}
      </Button>
    </View>
  );
}
