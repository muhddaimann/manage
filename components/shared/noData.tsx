import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type NoDataProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function NoData({ icon, title, subtitle }: NoDataProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: tokens.spacing.xl,
        gap: tokens.spacing.sm,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: tokens.radii.full,
          backgroundColor: colors.surfaceVariant,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>

      <Text
        variant="labelLarge"
        style={{ color: colors.onSurface, fontWeight: "600" }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          variant="bodySmall"
          style={{ color: colors.onSurfaceVariant, textAlign: "center" }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
