import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type SectionHeaderProps = {
  icon?: React.ReactNode;
  head: string;
  subHeader?: string;
  rightSlot?: React.ReactNode;
};

export default function SectionHeader({
  icon,
  head,
  subHeader,
  rightSlot,
}: SectionHeaderProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: tokens.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.sm,
          flex: 1,
        }}
      >
        {icon}

        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {head}
          </Text>
          {subHeader && (
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {subHeader}
            </Text>
          )}
        </View>
      </View>

      {rightSlot && <View>{rightSlot}</View>}
    </View>
  );
}
