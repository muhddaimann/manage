import React from "react";
import { View } from "react-native";
import { Text, List, Divider, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";

export default function Settings() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
    >
      <Text variant="headlineSmall">Settings</Text>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: tokens.radii.lg,
          overflow: "hidden",
        }}
      >
        <List.Item
          title="Profile"
          description="View and update your personal details"
          left={(props) => <List.Icon {...props} icon="account" />}
        />
        <Divider />
        <List.Item
          title="Notifications"
          description="Manage notification preferences"
          left={(props) => <List.Icon {...props} icon="bell" />}
        />
        <Divider />
        <List.Item
          title="Security"
          description="Change password and security settings"
          left={(props) => <List.Icon {...props} icon="lock" />}
        />
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: tokens.radii.lg,
          padding: tokens.spacing.lg,
          gap: tokens.spacing.sm,
        }}
      >
        <Text variant="titleMedium">About</Text>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          Staff Management App v1.0.0
        </Text>
      </View>
    </View>
  );
}
