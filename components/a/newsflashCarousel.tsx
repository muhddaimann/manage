import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, FlatList, Pressable, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import {
  NewsFlash,
  NewsPriority,
  NEWS_PRIORITY_COLOR,
} from "../../hooks/useHome";
import NewsflashModal from "./newsflashModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PRIORITY_LABEL: Record<NewsPriority, string> = {
  CRITICAL: "Critical",
  IMPORTANT: "Important",
  NORMAL: "Normal",
};

type CarouselRowProps = {
  data: NewsFlash[];
  onAcknowledge: (id: string) => Promise<any>;
};

const stripHtml = (v: string) => v.replace(/<[^>]*>/g, "").trim();

export default function CarouselRow({ data, onAcknowledge }: CarouselRowProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal, toast } = useOverlay();

  const listRef = useRef<FlatList<NewsFlash>>(null);
  const [index, setIndex] = useState(0);

  const limitedData = useMemo(() => data.slice(0, 3), [data]);

  const CARD_GAP = tokens.spacing.md;
  const CARD_WIDTH = SCREEN_WIDTH - tokens.spacing.lg * 2;
  const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

  useEffect(() => {
    if (!limitedData.length) return;

    const timer = setInterval(() => {
      const next = index === limitedData.length - 1 ? 0 : index + 1;
      listRef.current?.scrollToOffset({
        offset: next * SNAP_INTERVAL,
        animated: true,
      });
      setIndex(next);
    }, 4000);

    return () => clearInterval(timer);
  }, [index, limitedData.length, SNAP_INTERVAL]);

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
    <View style={{ gap: tokens.spacing.sm }}>
      <FlatList
        ref={listRef}
        horizontal
        data={limitedData}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{ gap: CARD_GAP }}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL))
        }
        renderItem={({ item }) => {
          const color = NEWS_PRIORITY_COLOR[item.priority];
          const label = PRIORITY_LABEL[item.priority];

          return (
            <Pressable
              onPress={() => openDetails(item)}
              style={{ width: CARD_WIDTH }}
            >
              <View
                style={{
                  backgroundColor: item.acknowledged
                    ? colors.surfaceVariant
                    : colors.surface,
                  borderRadius: tokens.radii.xl,
                  marginHorizontal: tokens.spacing.xxs,
                  padding: tokens.spacing.md,
                  gap: tokens.spacing.xs,
                  elevation: item.acknowledged ? 0 : 3,
                  shadowColor: colors.shadow,
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                  opacity: item.acknowledged ? 0.8 : 1,
                }}
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

                <Text variant="titleSmall" style={{ fontWeight: "700" }}>
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
            </Pressable>
          );
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {limitedData.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === index ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                i === index ? colors.primary : colors.onSurfaceVariant,
              opacity: i === index ? 1 : 0.4,
            }}
          />
        ))}
      </View>
    </View>
  );
}
