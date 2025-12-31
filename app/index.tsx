import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { UserCircle } from "lucide-react-native";
import { useDesign } from "../contexts/designContext";
import { useRouter } from "expo-router";
import { useOverlay } from "../contexts/overlayContext";

export default function Index() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
  const { alert, confirm, toast, modal } = useOverlay();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 18,
        stiffness: 160,
        mass: 0.6,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View
        style={{
          flex: 1,
          paddingTop: tokens.spacing["3xl"] * 3,
          paddingHorizontal: tokens.spacing.lg,
          opacity,
          transform: [{ scale }, { translateY }],
          gap: tokens.spacing.lg,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.primaryContainer,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: tokens.spacing.md,
            }}
          >
            <UserCircle size={42} color={colors.primary} />
          </View>

          <Text variant="headlineSmall">Overlay demo</Text>
          <Text
            variant="bodyMedium"
            style={{
              color: colors.onSurfaceVariant,
              textAlign: "center",
              maxWidth: 280,
              marginTop: tokens.spacing.xs,
            }}
          >
            Demo for alert, confirm, toast, and modal
          </Text>
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          <Button
            mode="contained"
            onPress={() =>
              alert({
                title: "Alert",
                message: "This is a simple alert dialog",
                variant: "error",
              })
            }
          >
            Show alert
          </Button>

          <Button
            mode="outlined"
            onPress={async () => {
              const ok = await confirm({
                variant:"error",
                title: "Confirm action",
                message: "Do you want to proceed?",
                okText: "Yes",
                cancelText: "No",
              });
              toast({
                message: ok ? "Confirmed" : "Cancelled",
                variant: ok ? "success" : "warning",
              });
            }}
          >
            Show confirm
          </Button>

          <Button
            mode="outlined"
            onPress={() =>
              toast({
                message: "This is a toast message",
                variant: "info",
              })
            }
          >
            Show toast
          </Button>

          <Button
            mode="outlined"
            onPress={() =>
              modal({
                content: (
                  <View
                    style={{
                      backgroundColor: colors.background,
                      padding: tokens.spacing.lg,
                      borderRadius: tokens.radii.lg,
                      gap: tokens.spacing.md,
                    }}
                  >
                    <Text variant="titleMedium">Modal content</Text>
                    <Text
                      variant="bodyMedium"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      This modal is rendered via OverlayContext.
                    </Text>
                    <Button mode="contained" onPress={() => toast("Closed")}>
                      Close
                    </Button>
                  </View>
                ),
              })
            }
          >
            Show modal
          </Button>
        </View>

        <View style={{ marginTop: tokens.spacing.xl, gap: tokens.spacing.sm }}>
          <Button mode="text" onPress={() => router.push("/signIn")}>
            Go to sign in
          </Button>
          <Button mode="text" onPress={() => router.push("/signUp")}>
            Go to sign up
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}
