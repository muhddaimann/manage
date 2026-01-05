import React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import useHome from "../../hooks/useHome";
import { router } from "expo-router";
import {
  Clock,
  Briefcase,
  Palmtree,
  CheckCircle,
  Sun,
  Calendar,
  Moon,
  LogIn,
  LogOut,
  RefreshCcw,
} from "lucide-react-native";
import TwoRow from "../../components/a/twoRow";

const ICON_MAP = {
  CLOCK: Clock,
  BRIEFCASE: Briefcase,
  PALM: Palmtree,
  CHECK: CheckCircle,
  SUN: Sun,
  CALENDAR: Calendar,
  MOON: Moon,
} as const;

export default function MainCard() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const {
    today,
    user,
    dayStatus,
    dayStatusLabel,
    dayStatusIcon,
    dayStatusTone,
    toggleDayStatus,
  } = useHome();

  const tone = dayStatusTone[dayStatus];

  const toneColor =
    tone === "error"
      ? colors.error
      : tone === "primary"
      ? colors.primary
      : tone === "secondary"
      ? colors.secondary
      : tone === "tertiary"
      ? colors.tertiary
      : colors.outline;

  const StatusIcon = ICON_MAP[dayStatusIcon[dayStatus]];

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii["2xl"],
        padding: tokens.spacing.lg,
        gap: tokens.spacing.md,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      }}
    >
      <Pressable
        onPress={() => router.push("/a/main")}
        style={({ pressed }) => ({
          flexDirection: "row",
          justifyContent: "space-between",
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <View>
          <Text variant="headlineSmall" style={{ fontWeight: "800" }}>
            {today}
          </Text>
          <Text
            variant="labelLarge"
            style={{
              letterSpacing: 1.5,
              fontWeight: "700",
              color: colors.onSurfaceVariant,
            }}
          >
            {user.tag}
          </Text>
        </View>

        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: tokens.radii.full,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${toneColor}22`,
          }}
        >
          <StatusIcon size={22} color={toneColor} />
        </View>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          gap: tokens.spacing.sm,
          padding: tokens.spacing.md,
          borderRadius: tokens.radii.lg,
          backgroundColor: `${toneColor}14`,
          alignItems: "center",
        }}
      >
        <Clock size={16} color={toneColor} />
        <View style={{ flex: 1 }}>
          <Text
            variant="labelMedium"
            style={{ fontWeight: "700", color: toneColor }}
          >
            {dayStatusLabel[dayStatus].title}
          </Text>
          <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
            {dayStatusLabel[dayStatus].subtitle}
          </Text>
        </View>
      </View>

      {dayStatus === "NOT_CHECKED_IN" && (
        <Pressable
          style={({ pressed }) => ({
            paddingVertical: tokens.spacing.lg,
            borderRadius: tokens.radii.xl,
            backgroundColor: toneColor,
            alignItems: "center",
            opacity: pressed ? 0.9 : 1,
            flexDirection: "row",
            justifyContent: "center",
            gap: tokens.spacing.sm,
          })}
        >
          <LogIn size={18} color={colors.onPrimary} />
          <Text
            variant="labelLarge"
            style={{ fontWeight: "800", color: colors.onPrimary }}
          >
            Check in now
          </Text>
        </Pressable>
      )}

      {dayStatus === "WORKING" && (
        <TwoRow
          left={{
            amount: "09:03",
            label: "Checked in",
            icon: <LogIn size={16} color={toneColor} />,
            bgColor: `${toneColor}14`,
            textColor: toneColor,
          }}
          right={{
            amount: "—",
            label: "Check out",
            icon: <LogOut size={16} color={colors.onPrimary} />,
            bgColor: toneColor,
            textColor: colors.onPrimary,
            labelColor: `${colors.onPrimary}CC`,
          }}
        />
      )}

      {dayStatus === "COMPLETED" && (
        <TwoRow
          left={{
            amount: "09:03",
            label: "Checked in",
            icon: <LogIn size={16} color={colors.primary} />,
            bgColor: `${colors.primary}14`,
            textColor: colors.primary,
          }}
          right={{
            amount: "18:11",
            label: "Checked out",
            icon: <CheckCircle size={16} color={colors.tertiary} />,
            bgColor: `${colors.tertiary}14`,
            textColor: colors.tertiary,
          }}
        />
      )}

      {(dayStatus === "ON_LEAVE" ||
        dayStatus === "PUBLIC_HOLIDAY" ||
        dayStatus === "OFF_DAY" ||
        dayStatus === "REST_DAY") && (
        <View
          style={{
            paddingVertical: tokens.spacing.lg,
            borderRadius: tokens.radii.xl,
            backgroundColor: `${toneColor}14`,
            alignItems: "center",
          }}
        >
          <Text
            variant="labelMedium"
            style={{ color: colors.onSurfaceVariant }}
          >
            Enjoy your day 🌿
          </Text>
        </View>
      )}
    </View>
  );
}
