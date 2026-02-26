import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Text, Divider, Switch, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import Header from "../../../components/c/header";
import { ChevronRight, CreditCard } from "lucide-react-native";
import { useNotifications } from "../../../contexts/notificationContext";
import { useOverlay } from "../../../contexts/overlayContext";
import StaffModal from "../../../components/c/staffModal";
import { useTabs } from "../../../contexts/tabContext";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function Settings() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, alert } = useOverlay();
  const { setHideTabBar } = useTabs();
  const { permissionStatus, register } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(false);
    }, [setHideTabBar]),
  );

  return (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.background,
    }}
  >
    <View
      style={{
        padding: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
    >
      <Header />

      <View>
        <Text
          variant="labelLarge"
          style={{
            marginBottom: tokens.spacing.sm,
            color: colors.onSurfaceVariant,
          }}
        >
          Profile
        </Text>

        <Pressable
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: tokens.spacing.lg,
            paddingVertical: tokens.spacing.md,
            borderRadius: tokens.radii.xl,
            backgroundColor: colors.surface,
            opacity: pressed ? 0.85 : 1,
          })}
          onPress={() =>
            modal({
              dismissible: true,
              content: <StaffModal />,
            })
          }
        >
          <View style={{ flexDirection: "row", gap: tokens.spacing.md }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: tokens.radii.lg,
                backgroundColor: colors.primaryContainer,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CreditCard size={20} color={colors.onPrimaryContainer} />
            </View>

            <View style={{ gap: 2 }}>
              <Text variant="labelLarge" style={{ fontWeight: "600" }}>
                Staff Card
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                View your staff information
              </Text>
            </View>
          </View>

          <ChevronRight size={20} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

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
              value={permissionStatus === "granted"}
              onValueChange={async () => {
                await register(true);
              }}
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
  </View>
);
}
