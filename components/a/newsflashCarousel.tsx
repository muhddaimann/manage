import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, FlatList, Pressable, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import { NewsFlash, NewsPriority } from "../../hooks/useHome";
import NewsflashModal from "./newsflashModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PRIORITY_COLOR: Record<NewsPriority, string> = {
  HIGH: "#EF4444",
  MEDIUM: "#F59E0B",
  LOW: "#10B981",
};

type CarouselRowProps = {
  data: NewsFlash[];
};

export default function CarouselRow({ data }: CarouselRowProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal } = useOverlay();
  const listRef = useRef<FlatList<NewsFlash>>(null);
  const [index, setIndex] = useState(0);
  const limitedData = useMemo(() => data.slice(0, 3), [data]);
  const CARD_GAP = tokens.spacing.md;
  const CARD_WIDTH = SCREEN_WIDTH - tokens.spacing.lg * 2;
  const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

  useEffect(() => {
    if (!limitedData.length) return;

    const timer = setInterval(() => {
      const nextIndex = index === limitedData.length - 1 ? 0 : index + 1;
      listRef.current?.scrollToOffset({
        offset: nextIndex * SNAP_INTERVAL,
        animated: true,
      });
      setIndex(nextIndex);
    }, 4000);

    return () => clearInterval(timer);
  }, [index, limitedData.length, SNAP_INTERVAL]);

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
    <View style={{ gap: tokens.spacing.sm }}>
      <FlatList
        ref={listRef}
        horizontal
        data={limitedData}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{
          gap: CARD_GAP,
          paddingBottom: tokens.spacing.sm,
        }}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openDetails(item)}
            style={{ width: CARD_WIDTH }}
          >
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: tokens.radii.xl,
                marginHorizontal: tokens.spacing.xxs,
                padding: tokens.spacing.md,
                gap: tokens.spacing.sm,
                elevation: 3,
                shadowColor: colors.shadow,
                shadowOpacity: 0.12,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
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
            </View>
          </Pressable>
        )}
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
