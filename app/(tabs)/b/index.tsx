import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme, SegmentedButtons } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";

type AppTab = "leave" | "overtime";

export default function Application() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const [tab, setTab] = useState<AppTab>("leave");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: tokens.spacing.lg,
        paddingBottom: tokens.spacing["3xl"] * 2,
        gap: tokens.spacing.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <Text variant="headlineSmall">Application</Text>

        <SegmentedButtons
          value={tab}
          onValueChange={(v) => setTab(v as AppTab)}
          buttons={[
            { value: "leave", label: "Leave" },
            { value: "overtime", label: "Overtime" },
          ]}
        />

        {tab === "leave" && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: tokens.radii.lg,
              padding: tokens.spacing.lg,
            }}
          >
            <Text variant="titleMedium">Leave Application</Text>
            <Text
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant }}
            >
              Apply and manage your leave here.
            </Text>
          </View>
        )}

        {tab === "overtime" && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: tokens.radii.lg,
              padding: tokens.spacing.lg,
            }}
          >
            <Text variant="titleMedium">Overtime Application</Text>
            <Text
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant }}
            >
              Submit and track overtime requests here.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
