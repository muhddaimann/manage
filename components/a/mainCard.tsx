import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import useHome from "../../hooks/useHome";

export default function MainCard() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { today, user } = useHome();

  const isManagement = user.tag === "MANAGEMENT";

  return (
    <View
      style={{
        backgroundColor: isManagement
          ? colors.primaryContainer
          : colors.secondaryContainer,
        borderRadius: tokens.radii["2xl"],
        padding: tokens.spacing.lg,
        gap: tokens.spacing.sm,
      }}
    >
      <Text
        variant="labelLarge"
        style={{
          letterSpacing: 2,
          fontWeight: "700",
          color: isManagement
            ? colors.onPrimaryContainer
            : colors.onSecondaryContainer,
        }}
      >
        {isManagement ? "MANAGEMENT" : "OPERATION"}
      </Text>

      <Text
        variant="headlineSmall"
        style={{
          fontWeight: "800",
          color: isManagement
            ? colors.onPrimaryContainer
            : colors.onSecondaryContainer,
        }}
      >
        {today}
      </Text>

      <Text
        variant="bodyMedium"
        style={{
          opacity: 0.8,
          color: isManagement
            ? colors.onPrimaryContainer
            : colors.onSecondaryContainer,
        }}
      >
        {isManagement
          ? "Approvals, overview and performance monitoring"
          : "Daily operations, attendance and tasks"}
      </Text>
    </View>
  );
}
