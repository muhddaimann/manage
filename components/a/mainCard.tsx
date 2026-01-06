import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import useHome from "../../hooks/useHome";
import { Clock, LogIn, LogOut, Briefcase } from "lucide-react-native";
import TwoRow from "../../components/a/twoRow";

export default function MainCard() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const { today, attendance } = useHome();

  const isManagement = !attendance;

  const checkedIn =
    attendance?.actual_login ?? attendance?.original_login ?? null;

  const checkedOut =
    attendance?.actual_logout ?? attendance?.original_logout ?? null;

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
      <View style={{ gap: 4 }}>
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
          {isManagement ? "MANAGEMENT" : "OPERATION"}
        </Text>
      </View>

      {isManagement ? (
        <TwoRow
          left={{
            amount: "09:00",
            label: "Shift start",
            icon: <Clock size={16} color={colors.primary} />,
            bgColor: `${colors.primary}14`,
            textColor: colors.primary,
          }}
          right={{
            amount: "18:00",
            label: "Shift end",
            icon: <Clock size={16} color={colors.primary} />,
            bgColor: `${colors.primary}14`,
            textColor: colors.primary,
          }}
        />
      ) : (
        <TwoRow
          left={{
            amount: checkedIn ?? "—",
            label: checkedIn ? "Checked in" : "Not checked in",
            icon: <LogIn size={16} color={colors.primary} />,
            bgColor: `${colors.primary}14`,
            textColor: colors.primary,
          }}
          right={{
            amount: checkedOut ?? "—",
            label: "Checked out",
            icon: <LogOut size={16} color={colors.tertiary} />,
            bgColor: `${colors.tertiary}14`,
            textColor: colors.tertiary,
          }}
        />
      )}

      {!isManagement && !checkedIn && (
        <View
          style={{
            marginTop: tokens.spacing.sm,
            paddingVertical: tokens.spacing.md,
            borderRadius: tokens.radii.lg,
            backgroundColor: colors.primaryContainer,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: tokens.spacing.sm,
          }}
        >
          <Briefcase size={18} color={colors.onPrimaryContainer} />
          <Text
            variant="labelLarge"
            style={{
              fontWeight: "700",
              color: colors.onPrimaryContainer,
            }}
          >
            Ready to start your shift
          </Text>
        </View>
      )}
    </View>
  );
}
