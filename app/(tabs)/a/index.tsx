import React from "react";
import { View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import useHome from "../../../hooks/useHome";
import Header from "../../../components/a/header";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { today, greeting, user, quickStats, newsFlash } = useHome();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: tokens.spacing.lg,
        paddingBottom: tokens.spacing["3xl"] * 2,
      }}
    >
      <Header
        greeting={greeting}
        name={user.name}
        role={user.role}
        initials={user.initials}
        status="ACTIVE"
      />
    </ScrollView>
  );
}
