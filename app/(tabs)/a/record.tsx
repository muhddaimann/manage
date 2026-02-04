import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { View, Pressable, Animated, Easing, ScrollView } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { ChevronRight, Archive } from "lucide-react-native";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import { useGesture } from "../../../hooks/useGesture";
import { useFocusEffect } from "expo-router";
import useHome from "../../../hooks/useHome";
import { useOverlay } from "../../../contexts/overlayContext";
import RecordModal from "../../../components/a/recordModal";
import { useRoomStore } from "../../../contexts/api/roomStore";
import NoData from "../../../components/shared/noData";
import { useLoader } from "../../../contexts/loaderContext";

export default function RecordRoom() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();
  const { modal, dismissModal, destructiveConfirm, toast } = useOverlay();
  const { show: showLoader, hide: hideLoader } = useLoader();
  const { cancelBooking } = useRoomStore();
  const [tab, setTab] = useState<"ACTIVE" | "PAST">("ACTIVE");
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture({
    controlNav: false,
  });
  const { activeBookings, pastBookings, roomLoading } = useHome();

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => setHideTabBar(false);
    }, [setHideTabBar]),
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 18,
        stiffness: 160,
        mass: 0.6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  const data = useMemo(
    () => (tab === "ACTIVE" ? activeBookings : pastBookings),
    [tab, activeBookings, pastBookings],
  );

  const openRecord = (booking: any) => {
    const executeWithdrawal = async () => {
      const confirmed = await destructiveConfirm({
        title: "Withdraw Booking",
        message:
          "Are you sure you want to withdraw this booking? This action cannot be undone.",
        okText: "Withdraw",
      });

      if (!confirmed) return;

      showLoader("Withdrawing...");
      try {
        const res = await cancelBooking(booking.Booking_Num);
        if ("error" in res) {
          toast({ message: String(res.error), variant: "error" });
        } else {
          toast({
            message: "Booking withdrawn successfully",
            variant: "success",
          });
        }
      } finally {
        hideLoader();
      }
    };

    const initiateWithdrawal = () => {
      dismissModal();
      setTimeout(executeWithdrawal, 400);
    };

    modal({
      dismissible: true,
      content: (
        <RecordModal
          booking={{ ...booking, status: tab }}
          onWithdraw={tab === "ACTIVE" ? initiateWithdrawal : undefined}
        />
      ),
    });
  };

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
          paddingBottom: tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.md,
          flexGrow: 1,
        }}
      >
        <Header title="Room Records" subtitle="Active & past bookings" />

        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
            backgroundColor: colors.surfaceVariant,
            padding: tokens.spacing.xs,
            borderRadius: tokens.radii.full,
          }}
        >
          {(["ACTIVE", "PAST"] as const).map((v) => {
            const active = tab === v;
            return (
              <Pressable
                key={v}
                onPress={() => setTab(v)}
                style={{
                  flex: 1,
                  paddingVertical: tokens.spacing.sm,
                  borderRadius: tokens.radii.full,
                  backgroundColor: active ? colors.surface : "transparent",
                  alignItems: "center",
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{
                    fontWeight: "700",
                    color: active ? colors.onSurface : colors.onSurfaceVariant,
                  }}
                >
                  {v === "ACTIVE" ? "Active" : "Past"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {data.length > 0 && (
          <Animated.View
            style={{
              opacity,
              transform: [{ scale }],
              gap: tokens.spacing.md,
            }}
          >
            {data.map((b) => (
              <Pressable
                key={b.booking_id}
                onPress={() => openRecord(b)}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: tokens.radii.xl,
                  padding: tokens.spacing.lg,
                  shadowColor: colors.shadow,
                  shadowOpacity: 0.12,
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: tokens.spacing.md,
                  }}
                >
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      variant="titleMedium"
                      style={{ fontWeight: "700" }}
                      numberOfLines={1}
                    >
                      {b.Event_Name} @ {b.Room_Name}
                    </Text>

                    <Text
                      variant="bodySmall"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {b.uiDate} · {b.uiTime}
                    </Text>
                  </View>

                  <ChevronRight size={20} color={colors.onSurfaceVariant} />
                </View>
              </Pressable>
            ))}
          </Animated.View>
        )}

        {!roomLoading && data.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NoData
              icon={<Archive size={30} color={colors.onSurfaceVariant} />}
              title="No records found"
              subtitle="Your booking history will appear here."
            />
          </View>
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
