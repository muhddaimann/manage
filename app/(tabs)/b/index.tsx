import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import HeaderSwitcher from "../../../components/b/header";
import ApplicationBody from "../../../components/b/applicationBody";

export default function Application() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const [mode, setMode] = useState<"LEAVE" | "OVERTIME">("LEAVE");

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: tokens.spacing.lg,
        paddingBottom: tokens.spacing["3xl"] * 2,
        gap: tokens.spacing.lg,
      }}
    >
      <View style={{ marginTop: tokens.spacing.md }}>
        <HeaderSwitcher
          value={mode}
          onChange={setMode}
          items={[
            {
              key: "LEAVE",
              label: "Leave",
              hint: "Annual, medical, emergency",
            },
            {
              key: "OVERTIME",
              label: "Overtime",
              hint: "Extra working hours",
            },
          ]}
        />
      </View>

      <ApplicationBody mode={mode} />
    </ScrollView>
  );
}
