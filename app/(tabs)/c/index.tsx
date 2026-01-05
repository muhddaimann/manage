import React, { useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { Text, Divider, Switch, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import useSettings from "../../../hooks/useSettings";
import Header from "../../../components/c/header";

export default function Settings() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { user, basicInfo } = useSettings();
  const [notifications, setNotifications] = useState(true);
  const staffId = useMemo(() => {
    const found = basicInfo.find((i) =>
      i.label.toLowerCase().includes("staff")
    );
    return found?.value ?? "0000";
  }, [basicInfo]);

  return (
    <View
      style={{
        padding: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
    >
      <Header user={user} staffId={staffId} />

      <View>
        <Text
          variant="labelLarge"
          style={{
            marginBottom: tokens.spacing.sm,
            color: colors.onSurfaceVariant,
          }}
        >
          App
        </Text>

        <View
          style={{
            borderRadius: tokens.radii.xl,
            backgroundColor: colors.surface,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: tokens.spacing.lg,
              paddingVertical: tokens.spacing.md,
              justifyContent: "space-between",
            }}
          >
            <View style={{ gap: 2 }}>
              <Text variant="labelLarge" style={{ fontWeight: "600" }}>
                Notifications
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Receive app notifications
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              color={colors.primary}
            />
          </View>

          <Divider />

          <Pressable
            style={({ pressed }) => ({
              paddingHorizontal: tokens.spacing.lg,
              paddingVertical: tokens.spacing.md,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text variant="labelLarge" style={{ fontWeight: "600" }}>
              About
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              Faith 1.0.0
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
