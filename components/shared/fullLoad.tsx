import React, { useEffect, useRef } from "react";
import { View, DimensionValue, Animated, Easing } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type FullLoadingProps = {
  visible?: boolean;
  layout?: number[];
};

export default function FullLoading({
  visible = true,
  layout = [1, 2, 2],
}: FullLoadingProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: tokens.motion.duration.slow,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: tokens.motion.duration.slow,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [breathe, tokens.motion.duration.slow]);

  if (!visible) return null;

  const opacity = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  const Skeleton = ({
    width,
    height,
  }: {
    width: DimensionValue;
    height: number;
  }) => (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: tokens.radii.sm,
        backgroundColor: colors.surfaceVariant ?? colors.surface,
        opacity,
      }}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        gap: tokens.spacing.lg,
      }}
    >
      {layout.map((cols, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: tokens.spacing.sm,
          }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <View
              key={colIndex}
              style={{
                flexBasis: `${100 / cols - 2}%` as DimensionValue,
                padding: tokens.spacing.md,
                borderRadius: tokens.radii.md,
                backgroundColor: colors.surface,
                gap: tokens.spacing.xs,
              }}
            >
              <Skeleton width="70%" height={14} />
              <Skeleton width="100%" height={12} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
