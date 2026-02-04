import React from "react";
import { Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { CalendarCheck, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";
import FullLoading from "../shared/fullLoad";
import TwoRow from "./twoRow";

type Props = {
  loading: boolean;
  activeCount: number;
  pastCount: number;
};

export default function RoomSection({
  loading,
  activeCount,
  pastCount,
}: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  if (loading) {
    return <FullLoading layout={[2]} />;
  }

  return (
    <Pressable onPress={() => router.push("/a/record")}>
      <TwoRow
        left={{
          amount: activeCount,
          label: "Active booking",
          icon: <CalendarCheck size={24} color={colors.onPrimary} />,
          bgColor: colors.primary,
          textColor: colors.onPrimary,
          labelColor: colors.onPrimary,
        }}
        right={{
          amount: pastCount,
          label: "Booking history",
          icon: <Clock size={24} color={colors.onPrimaryContainer} />,
          bgColor: colors.primaryContainer,
          textColor: colors.onPrimaryContainer,
          labelColor: colors.onPrimaryContainer,
        }}
      />
    </Pressable>
  );
}
