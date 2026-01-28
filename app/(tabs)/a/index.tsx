import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import useHome from "../../../hooks/useHome";
import Header from "../../../components/a/header";
import MainCard from "../../../components/a/mainCard";
import SectionHeader from "../../../components/shared/secHeader";
import TwoRow from "../../../components/a/twoRow";
import CarouselRow from "../../../components/a/newsflashCarousel";
import ScrollTop from "../../../components/shared/scrollTop";
import { CalendarCheck, Bell, Clock, DoorOpen } from "lucide-react-native";
import { useGesture } from "../../../hooks/useGesture";
import { router } from "expo-router";
import FullLoading from "../../../components/shared/fullLoad";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const {
    greeting,
    user,
    newsFlash,
    activeBookings,
    pastBookings,
    staffLoading,
    attendanceLoading,
    broadcastLoading,
    roomLoading,
  } = useHome();
  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture();

  return (
    <>
      <ScrollView
        ref={scrollRef}
        onScroll={(e) => onScroll(e.nativeEvent)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"] * 2.5,
          gap: tokens.spacing.md,
        }}
      >
        {staffLoading ? (
          <FullLoading layout={[1]} />
        ) : user ? (
          <Header
            greeting={greeting}
            name={user.name}
            role={user.role}
            initials={user.initials}
            status="ACTIVE"
          />
        ) : null}

        {attendanceLoading ? <FullLoading layout={[1]} /> : <MainCard />}

        <SectionHeader
          icon={<Bell size={24} color={colors.primary} />}
          head="Newsflash"
          subHeader="Latest announcements & updates"
          rightSlot={
            <Button
              mode="text"
              compact
              onPress={() => router.push("/a/newsflash")}
              labelStyle={{ color: colors.primary, fontWeight: "600" }}
            >
              Read More
            </Button>
          }
        />

        {broadcastLoading ? (
          <FullLoading layout={[1]} />
        ) : (
          <CarouselRow data={newsFlash} />
        )}

        <SectionHeader
          icon={<DoorOpen size={26} color={colors.primary} />}
          head="Room Booking"
          subHeader="Got a meeting to plan? Check here"
          rightSlot={
            <Button
              mode="text"
              compact
              onPress={() => router.push("/a/room")}
              labelStyle={{ color: colors.primary, fontWeight: "600" }}
            >
              Check Rooms
            </Button>
          }
        />

        {roomLoading ? (
          <FullLoading layout={[2]} />
        ) : (
          <TwoRow
            left={{
              amount: activeBookings.length,
              label: "Active booking",
              icon: <CalendarCheck size={24} color={colors.onPrimary} />,
              bgColor: colors.primary,
              textColor: colors.onPrimary,
              labelColor: colors.onPrimary,
            }}
            right={{
              amount: pastBookings.length,
              label: "Booking history",
              icon: <Clock size={24} color={colors.onPrimaryContainer} />,
              bgColor: colors.primaryContainer,
              textColor: colors.onPrimaryContainer,
              labelColor: colors.onPrimaryContainer,
            }}
          />
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
