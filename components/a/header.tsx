import React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Bell } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";

type UserStatus = "ACTIVE" | "ON_LEAVE" | "REMOTE";

type HeaderProps = {
  greeting: string;
  name: string;
  role: string;
  initials: string;
  status: UserStatus;
};

const STATUS_COLOR: Record<UserStatus, string> = {
  ACTIVE: "#22C55E",
  ON_LEAVE: "#F59E0B",
  REMOTE: "#3B82F6",
};

export default function Header({
  greeting,
  name,
  role,
  initials,
  status,
}: HeaderProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        paddingTop: tokens.spacing.md,
        gap: tokens.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            variant="bodyLarge"
            style={{
              letterSpacing: 3,
              fontWeight: "800",
              color: colors.primary,
            }}
          >
            FAITH
          </Text>

          <Text variant="bodyMedium">
            {greeting}, <Text style={{ fontWeight: "700" }}>{name}</Text>
          </Text>

          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {role}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
          <Pressable
            style={{
              width: 44,
              height: 44,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.surfaceVariant,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={20} color={colors.onSurfaceVariant} />
          </Pressable>

          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.primaryContainer,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Text
              variant="labelLarge"
              style={{ color: colors.primary, fontWeight: "700" }}
            >
              {initials}
            </Text>

            <View
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 10,
                height: 10,
                borderRadius: tokens.radii.full,
                backgroundColor: STATUS_COLOR[status],
                borderWidth: 2,
                borderColor: colors.surface,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
