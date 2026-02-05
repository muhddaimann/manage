import React from "react";
import { View } from "react-native";
import { Text, useTheme, Avatar, Divider } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import useSettings from "../../hooks/useSettings";

export default function StaffModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { staff } = useSettings();

  if (!staff) return null;

  const Row = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <View style={{ gap: 4 }}>
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
          {label}
        </Text>
        <Text variant="bodyLarge">{value}</Text>
        <Divider />
      </View>
    ) : null;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii["2xl"],
        paddingHorizontal: tokens.spacing.xl,
        paddingVertical: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
    >
      <View style={{ alignItems: "center", gap: tokens.spacing.sm }}>
        <Avatar.Text
          size={64}
          label={staff.initials}
          style={{ backgroundColor: colors.primaryContainer }}
          labelStyle={{
            fontWeight: "800",
            color: colors.onPrimaryContainer,
          }}
        />

        <View style={{ alignItems: "center", gap: 2 }}>
          <Text
            variant="titleLarge"
            style={{
              fontWeight: "800",
              textAlign: "center",
              maxWidth: "90%",
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {staff.full_name}
          </Text>

          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            {staff.designation_name}
          </Text>

          <View
            style={{
              marginTop: 4,
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
              #{staff.staff_no}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ gap: tokens.spacing.md }}>
        <Row label="Preferred name" value={staff.by_name} />
        <Row label="NRIC / ID" value={staff.nric} />
        <Row label="Email" value={staff.email} />
        <Row label="Contact number" value={staff.contact_no} />
        <Row label="Join date" value={staff.join_date_formatted} />
        <Row
          label="Address"
          value={[staff.address1, staff.address2, staff.address3]
            .filter(Boolean)
            .join(", ")}
        />
      </View>
    </View>
  );
}
