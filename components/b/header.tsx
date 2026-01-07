import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type Props = {
  title?: string;
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
};

export default function StaticSectionHeader({
  title = "You’re viewing",
  label,
  hint,
  icon: Icon,
}: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View>
      <Text
        variant="labelLarge"
        style={{
          color: colors.onSurfaceVariant,
          marginBottom: tokens.spacing.xs,
          paddingHorizontal: tokens.spacing.xs,
        }}
      >
        {title}
      </Text>

      <View
        style={{
          padding: tokens.spacing.md,
          borderRadius: tokens.radii.xl,
          backgroundColor: colors.surface,
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.sm,
          elevation: tokens.elevation.level3,
          shadowColor: colors.shadow,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        {Icon && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: tokens.radii.full,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
            }}
          >
            <Icon size={20} color={colors.onPrimary} />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text
            variant="titleSmall"
            style={{ color: colors.onSurface, fontWeight: "600" }}
          >
            {label}
          </Text>

          {hint && (
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {hint}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
