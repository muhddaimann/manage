import React, { useEffect, useRef } from "react";
import { DimensionValue, Animated, Easing } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type BlockSkeletonProps = {
  visible?: boolean;
  width?: DimensionValue;
  height?: number;
  radius?: number;
};

export default function BlockSkeleton({
  visible = true,
  width = "100%",
  height = 16,
  radius,
}: BlockSkeletonProps) {
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
    outputRange: [0.35, 0.75],
  });

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius ?? tokens.radii.sm,
        backgroundColor: colors.surfaceVariant ?? colors.surface,
        opacity,
      }}
    />
  );
}
