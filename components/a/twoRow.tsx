import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type TwoRowItem = {
  amount: string | number;
  label: string;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  labelColor?: string;
};

type TwoRowProps = {
  left: TwoRowItem;
  right: TwoRowItem;
};

export default function TwoRow({ left, right }: TwoRowProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: tokens.spacing.md,
      }}
    >
      {[left, right].map((item, idx) => (
        <View
          key={idx}
          style={{
            flex: 1,
            backgroundColor: item.bgColor ?? colors.surfaceVariant,
            borderRadius: tokens.radii.xl,
            padding: tokens.spacing.md,
            gap: tokens.spacing.sm,
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: tokens.spacing.sm,
              right: tokens.spacing.sm,
            }}
          >
            {item.icon}
          </View>

          <Text
            variant="headlineSmall"
            style={{
              fontWeight: "800",
              color: item.textColor ?? colors.onSurface,
            }}
          >
            {item.amount}
          </Text>

          <Text
            variant="bodySmall"
            style={{
              color: item.labelColor ?? colors.onSurfaceVariant,
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
