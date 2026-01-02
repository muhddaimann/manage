import React from "react";
import { ScrollView } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import useHome from "../../../hooks/useHome";
import Header from "../../../components/a/header";
import MainCard from "../../../components/a/mainCard";
import SectionHeader from "../../../components/shared/secHeader";
import TwoRow from "../../../components/a/twoRow";
import { CalendarCheck, Clock, CalendarDays } from "lucide-react-native";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { greeting, user } = useHome();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: tokens.spacing.lg,
        paddingBottom: tokens.spacing["3xl"] * 2,
        gap: tokens.spacing.md,
      }}
    >
      <Header
        greeting={greeting}
        name={user.name}
        role={user.role}
        initials={user.initials}
        status="ACTIVE"
      />

      <MainCard />

      <SectionHeader
        icon={<CalendarDays size={28} color={colors.primary} />}
        head="Leave"
        subHeader="Your leave overview"
        rightSlot={
          <Button
            mode="text"
            compact
            onPress={() => {}}
            labelStyle={{ color: colors.primary, fontWeight: "600" }}
          >
            View More
          </Button>
        }
      />

      <TwoRow
        left={{
          amount: `${user.leave.annualLeaveLeft}`,
          label: "AL remaining",
          icon: <CalendarCheck size={24} color={colors.onSecondary} />,
          bgColor: colors.secondary,
          textColor: colors.onSecondary,
          labelColor: colors.onSecondary,
        }}
        right={{
          amount: `${user.leave.pendingLeave}`,
          label: "Pending requests",
          icon: <Clock size={24} color={colors.onSecondaryContainer} />,
          bgColor: colors.secondaryContainer,
          textColor: colors.onSecondaryContainer,
          labelColor: colors.onSecondaryContainer,
        }}
      />
    </ScrollView>
  );
}
