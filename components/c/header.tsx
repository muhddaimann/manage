import React from "react";
import { View } from "react-native";
import { Text, Avatar, Button, useTheme } from "react-native-paper";
import { Mail, UserCog } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { router } from "expo-router";

type HeaderProps = {
  user: {
    name: string;
    shortName: string;
    role: string;
    initials: string;
  };
  staffId: string;
};

export default function Header({ user, staffId }: HeaderProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        alignItems: "center",
        gap: tokens.spacing.lg,
      }}
    >
      <Avatar.Text
        size={88}
        label={user.initials}
        style={{ backgroundColor: colors.primaryContainer }}
        labelStyle={{
          fontWeight: "800",
          color: colors.onPrimaryContainer,
        }}
      />

      <View style={{ alignItems: "center", gap: 4 }}>
        <Text variant="titleLarge" style={{ fontWeight: "800" }}>
          {user.name}
        </Text>

        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          {user.role}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: tokens.spacing.xs,
            marginTop: 2,
          }}
        >
          <Text
            variant="labelLarge"
            style={{
              fontWeight: "700",
              color: colors.primary,
            }}
          >
            {user.shortName}
          </Text>

          <View
            style={{
              paddingHorizontal: tokens.spacing.md,
              paddingVertical: 6,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.primaryContainer,
            }}
          >
            <Text
              variant="labelMedium"
              style={{
                fontWeight: "700",
                color: colors.onPrimaryContainer,
                letterSpacing: 0.5,
              }}
            >
              #{staffId}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: tokens.spacing.sm,
          width: "100%",
        }}
      >
        <Button
          mode="contained"
          onPress={() => router.push("/c/update")}
          icon={() => <UserCog size={16} color={colors.onPrimary} />}
          style={{ flex: 1 }}
        >
          Update profile
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.push("/c/email")}
          icon={() => <Mail size={16} color={colors.primary} />}
          style={{ flex: 1 }}
          textColor={colors.primary}
        >
          Email us
        </Button>
      </View>
    </View>
  );
}
