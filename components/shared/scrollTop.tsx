import React, { useEffect, useRef } from "react";
import { Pressable, Animated } from "react-native";
import { ChevronUp } from "lucide-react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

export default function ScrollTop({
  visible,
  onPress,
}: {
  visible: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : -10,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={{
        position: "absolute",
        top: tokens.spacing.lg,
        left: "50%",
        transform: [{ translateX: -26 }, { translateY }],
        opacity,
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: tokens.radii.full,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 12,
        }}
      >
        <ChevronUp size={22} color={colors.onPrimary} />
      </Pressable>
    </Animated.View>
  );
}
