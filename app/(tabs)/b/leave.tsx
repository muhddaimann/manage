import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Pressable,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { useTheme, TextInput, Button, Text } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useOverlay } from "../../../contexts/overlayContext";
import Header from "../../../components/shared/header";
import ScrollTop from "../../../components/shared/scrollTop";
import DatePicker from "../../../components/shared/datePicker";
import OptionPicker from "../../../components/shared/optionPicker";
import DocumentPicker from "../../../components/shared/documentPicker";
import { useGesture } from "../../../hooks/useGesture";
import { useFocusEffect } from "expo-router";
import useLeave from "../../../hooks/useApplication";

export default function ApplyLeave() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal, alert } = useOverlay();
  const { setHideTabBar } = useTabs();
  const { options, helpers } = useLeave();
  const [leaveType, setLeaveType] = useState<string>();
  const [period, setPeriod] = useState<string>();
  const [range, setRange] = useState<{ start: string; end: string }>();
  const [reasonType, setReasonType] = useState<string>();
  const [remarks, setRemarks] = useState("");
  const [attachmentName, setAttachmentName] = useState<string>();
  const [attachmentRef, setAttachmentRef] = useState<string>();

  const duration = useMemo(() => {
    if (!period || !range?.start) return 0;
    if (period === "FULL" && range?.end) {
      return helpers.diffDays(range.start, range.end);
    }
    return 0.5;
  }, [period, range, helpers]);

  const isValid = useMemo(
    () =>
      !!leaveType &&
      !!period &&
      !!range?.start &&
      (period !== "FULL" || !!range?.end) &&
      !!reasonType &&
      duration > 0,
    [leaveType, period, range, reasonType, duration]
  );

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const liftY = useRef(new Animated.Value(0)).current;

  const { scrollRef, onScroll, scrollToTop, showScrollTop } = useGesture({
    controlNav: false,
  });

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => {
        setHideTabBar(false);
        setLeaveType(undefined);
        setPeriod(undefined);
        setRange(undefined);
        setReasonType(undefined);
        setRemarks("");
        setAttachmentName(undefined);
        setAttachmentRef(undefined);
      };
    }, [])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 360,
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

    const show = Keyboard.addListener("keyboardWillShow", () => {
      Animated.spring(liftY, {
        toValue: -16,
        damping: 20,
        stiffness: 180,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardWillHide", () => {
      Animated.spring(liftY, {
        toValue: 0,
        damping: 18,
        stiffness: 150,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const openLeaveType = () =>
    modal({
      dismissible: true,
      content: (
        <OptionPicker
          title="Leave type"
          subtitle="Tap to select leave category"
          icon="briefcase"
          options={options.leaveTypes}
          initialValue={leaveType}
          onSelect={(v) => {
            setLeaveType(v);
            dismissModal();
          }}
        />
      ),
    });

  const openPeriod = () =>
    modal({
      dismissible: true,
      content: (
        <OptionPicker
          title="Leave duration"
          subtitle="Select full or half day"
          icon="clock-outline"
          options={options.leavePeriods}
          initialValue={period}
          onSelect={(v) => {
            setPeriod(v);
            setRange(undefined);
            dismissModal();
          }}
        />
      ),
    });

  const openDates = () => {
    if (!period) {
      alert({
        title: "Select leave period",
        message: "Please choose leave duration before selecting dates.",
        variant: "info",
      });
      return;
    }

    modal({
      dismissible: true,
      content: (
        <DatePicker
          mode={period === "FULL" ? "RANGE" : "SINGLE"}
          initialRange={period === "FULL" ? range : undefined}
          initialDate={period !== "FULL" ? range?.start : undefined}
          onConfirm={(v) => {
            if (typeof v === "string") {
              setRange({ start: v, end: v });
            } else {
              setRange(v);
            }
            dismissModal();
          }}
        />
      ),
    });
  };

  const openReason = () =>
    modal({
      dismissible: true,
      content: (
        <OptionPicker
          title="Reason"
          subtitle="Tap to select reason"
          icon="comment-text-outline"
          options={options.leaveReasons}
          initialValue={reasonType}
          onSelect={(v) => {
            setReasonType(v);
            dismissModal();
          }}
        />
      ),
    });

  const openAttachment = () =>
    modal({
      dismissible: true,
      content: (
        <DocumentPicker
          title="Attachment"
          subtitle="Attach supporting document (optional)"
          onDone={(payload) => {
            if (payload) {
              setAttachmentName(payload.name);
              setAttachmentRef(payload.referenceNo);
            }
            dismissModal();
          }}
        />
      ),
    });

  const dateLabel = range
    ? helpers.buildDateRangeLabel(range.start, range.end ?? range.start)
    : "";

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Text style={{ fontWeight: "600", color: colors.onSurface }}>
        {label}:
      </Text>
      <Text style={{ fontWeight: "600", color: colors.onSurface }}>
        {value}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollRef}
          onScroll={(e) => onScroll(e.nativeEvent)}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing["3xl"] * 2,
            gap: tokens.spacing.sm,
          }}
        >
          <Header title="Apply Leave" subtitle="Submit a new leave request" />

          <Animated.View
            style={{
              marginTop: tokens.spacing.md,
              backgroundColor: colors.surface,
              borderRadius: tokens.radii["2xl"],
              padding: tokens.spacing.lg,
              gap: tokens.spacing.lg,
              opacity,
              transform: [{ scale }, { translateY: liftY }],
              shadowColor: colors.shadow,
              shadowOpacity: 0.14,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 10,
            }}
          >
            <View style={{ gap: tokens.spacing.md }}>
              <Pressable onPress={openLeaveType}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Leave type"
                    value={
                      options.leaveTypes.find((o) => o.value === leaveType)
                        ?.label ?? ""
                    }
                    editable={false}
                  />
                </View>
              </Pressable>

              <Pressable onPress={openPeriod}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Leave Period"
                    value={
                      options.leavePeriods.find((o) => o.value === period)
                        ?.label ?? ""
                    }
                    editable={false}
                  />
                </View>
              </Pressable>

              <Pressable onPress={openDates}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Leave date(s)"
                    value={dateLabel}
                    editable={false}
                  />
                </View>
              </Pressable>

              {duration > 0 && (
                <InfoRow label="Duration" value={`${duration} day(s)`} />
              )}

              <Pressable onPress={openReason}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Reason"
                    value={
                      options.leaveReasons.find((o) => o.value === reasonType)
                        ?.label ?? ""
                    }
                    editable={false}
                  />
                </View>
              </Pressable>

              <Pressable onPress={openAttachment}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Attachment"
                    value={attachmentName ?? ""}
                    placeholder="Tap to attach document"
                    editable={false}
                  />
                </View>
              </Pressable>

              {attachmentRef && (
                <InfoRow label="Reference" value={attachmentRef} />
              )}

              <TextInput
                mode="outlined"
                label="Remarks (optional)"
                value={remarks}
                onChangeText={setRemarks}
                multiline
                numberOfLines={3}
              />
            </View>

            <Button
              mode="contained"
              disabled={!isValid}
              contentStyle={{ height: 48 }}
            >
              Submit request
            </Button>
          </Animated.View>
        </ScrollView>
      </Pressable>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </KeyboardAvoidingView>
  );
}
