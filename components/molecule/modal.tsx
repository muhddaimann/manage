import React from "react";
import { View, Animated, Easing, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import type { ModalOptions } from "../../contexts/overlayContext";

const DURATION = 240;

export function ModalSheet({
  visible,
  state,
  onDismiss,
}: {
  visible: boolean;
  state: ModalOptions | null;
  onDismiss: () => void;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const canDismiss = state?.dismissible !== false;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.setValue(40);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 40,
          duration: DURATION,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: DURATION,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => finished && setMounted(false));
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", inset: 0, justifyContent: "flex-end" }}
    >
      <Animated.View style={{ position: "absolute", inset: 0, opacity }}>
        <Pressable
          onPress={canDismiss ? onDismiss : undefined}
          style={{ flex: 1, backgroundColor: "#00000088" }}
        />
      </Animated.View>

      <Animated.View style={{ transform: [{ translateY }] }}>
        {/* Shadow wrapper: no paddingBottom here */}
        <View
          style={{
            width: "100%",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: tokens.elevation.level5 * 2,
            shadowOffset: { width: 0, height: -tokens.elevation.level5 },
            elevation: tokens.elevation.level5,
            backgroundColor: "transparent",
          }}
        >
          {/* Inner sheet: apply safe-area padding here so it paints the same color */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: tokens.radii.xl,
              borderTopRightRadius: tokens.radii.xl,
              overflow: "hidden",
              paddingBottom: insets.bottom + tokens.spacing.md,
            }}
          >
            <View
              style={{ alignItems: "center", paddingTop: tokens.spacing.sm }}
            >
              <View
                style={{
                  width: tokens.spacing.lg * 2,
                  height: tokens.spacing.xs,
                  borderRadius: tokens.radii.pill,
                  backgroundColor: colors.outlineVariant,
                  opacity: 0.8,
                }}
              />
            </View>
            {state?.content}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
