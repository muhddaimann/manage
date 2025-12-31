import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useDesign } from "../../contexts/designContext";

type HeaderProps = {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  showBack?: boolean;
};

export default function Header({
  title,
  subtitle,
  rightSlot,
  showBack = true,
}: HeaderProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();

  return (
    <View
      style={{
        paddingHorizontal: tokens.spacing.lg,
        backgroundColor: colors.background,
        flexDirection: "row",
        alignItems: "center",
        paddingTop: tokens.spacing.lg,
        gap: tokens.spacing.md,
      }}
    >
      <View style={{ width: 40 }}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={18} color={colors.onPrimary} />
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text variant="titleMedium">{title}</Text>
        {subtitle && (
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={{ minWidth: 40, alignItems: "flex-end" }}>{rightSlot}</View>
    </View>
  );
}
