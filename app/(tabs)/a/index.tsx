import React from "react";
import { View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: tokens.spacing.lg,
        paddingBottom: tokens.spacing["3xl"] * 2,
        gap: tokens.spacing.lg,
      }}
    >
      <View>
        <Text variant="headlineMedium">Home</Text>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          Welcome back
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: tokens.radii.lg,
          padding: tokens.spacing.lg,
        }}
      >
        <Text variant="titleMedium">Quick overview</Text>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          Your latest activities will appear here.
        </Text>
      </View>
    </ScrollView>
  );
}
