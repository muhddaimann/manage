import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { UserCircle } from "lucide-react-native";
import { useDesign } from "../contexts/designContext";
import { useRouter } from "expo-router";

export default function Index() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
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
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          paddingTop: tokens.spacing["3xl"] * 3,
          paddingHorizontal: tokens.spacing.lg,
          opacity,
          transform: [{ scale }, { translateY }],
        }}
      >
        <View
          style={{ alignItems: "center", marginBottom: tokens.spacing["2xl"] }}
        >
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.primaryContainer,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: colors.primary,
              shadowOpacity: 0.2,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
              marginBottom: tokens.spacing.md,
            }}
          >
            <UserCircle size={42} color={colors.primary} />
          </View>

          <Text
            variant="headlineSmall"
            style={{ marginBottom: tokens.spacing.xs }}
          >
            Welcome to Faith
          </Text>

          <Text
            variant="bodyMedium"
            style={{
              color: colors.onSurfaceVariant,
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            Sign in or create an account to continue
          </Text>
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          <Button
            mode="contained"
            contentStyle={{ height: 48 }}
            onPress={() => router.push("/signIn")}
          >
            Sign in
          </Button>

          <Button
            mode="outlined"
            contentStyle={{ height: 48 }}
            onPress={() => router.push("/signUp")}
          >
            Sign up
          </Button>
        </View>

        <View style={{ marginTop: tokens.spacing.md, alignItems: "center" }}>
          <Button mode="text" onPress={() => router.push("/forgot")}>
            Forgot password?
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}
