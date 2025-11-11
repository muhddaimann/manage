import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../contexts/designContext";
import { Button } from "../components/atom/button";

export default function Index() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: tokens.spacing.lg,
        justifyContent: "center",
        gap: tokens.spacing.xl,
      }}
    >
      <View style={{ alignItems: "center", gap: tokens.spacing.xs }}>
        <Text
          style={{
            color: colors.onBackground,
            fontSize: tokens.typography.sizes["2xl"],
            fontWeight: "700",
          }}
        >
          Welcome
        </Text>
        <Text style={{ color: colors.onSurfaceVariant }}>
          Sign in or create an account to continue
        </Text>
      </View>

      <View style={{ gap: tokens.spacing.md }}>
        <Button
          onPress={() => router.push("/(modals)/signIn")}
          variant="default"
          fullWidth
          rounded="sm"
        >
          Sign In
        </Button>
        <Button
          onPress={() => router.push("/(modals)/signUp")}
          variant="secondary"
          fullWidth
          rounded="sm"
        >
          Create Account
        </Button>
      </View>

      <View style={{ alignItems: "center" }}>
        <Button variant="link" onPress={() => router.push("/(modals)/forgot")}>
          Forgot password?
        </Button>
      </View>
    </View>
  );
}
