import React, { useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { useTheme, TextInput, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/shared/header";
import useSettings from "../../../hooks/useSettings";
import { useOverlay } from "../../../contexts/overlayContext";
import { useLoader } from "../../../contexts/loaderContext";
import { router } from "expo-router";

export default function UpdateProfile() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();
  const { toast } = useOverlay();
  const { show, hide } = useLoader();
  const { staff, form, loading, updateField, saveProfile, hasChanges } =
    useSettings();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;
  const liftY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setHideTabBar(true);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
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

    const showKb = Keyboard.addListener("keyboardWillShow", () => {
      Animated.spring(liftY, {
        toValue: -20,
        damping: 20,
        stiffness: 180,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    });

    const hideKb = Keyboard.addListener("keyboardWillHide", () => {
      Animated.spring(liftY, {
        toValue: 0,
        damping: 18,
        stiffness: 150,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showKb.remove();
      hideKb.remove();
    };
  }, [setHideTabBar]);

  const onSave = async () => {
    if (!form?.email || !form.contact_no) {
      toast({
        message: "Email and contact number are required",
        variant: "warning",
      });
      return;
    }

    show("Updating profile…");

    try {
      await saveProfile();

      router.back();

      setTimeout(() => {
        toast({
          message: "Profile updated successfully",
          variant: "success",
        });
      }, 1000);
    } catch {
      toast({
        message: "Failed to update profile",
        variant: "error",
      });
    } finally {
      hide();
    }
  };

  if (loading || !staff || !form) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.sm,
          }}
        >
          <Header
            title="Update Profile"
            subtitle="Some fields can’t be changed"
          />

          <View style={{ flex: 1, paddingTop: tokens.spacing.md }}>
            <Animated.View
              style={{
                backgroundColor: colors.surface,
                borderRadius: tokens.radii["2xl"],
                padding: tokens.spacing.xl,
                gap: tokens.spacing.lg,
                opacity,
                transform: [{ scale }, { translateY: liftY }],
                shadowColor: colors.shadow,
                shadowOpacity: 0.15,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 },
                elevation: 12,
              }}
            >
              <View style={{ gap: tokens.spacing.md }}>
                <TextInput
                  mode="outlined"
                  label="Nickname"
                  value={form.nick_name ?? ""}
                  onChangeText={(v) => updateField("nick_name", v)}
                />

                <TextInput
                  mode="outlined"
                  label="Email"
                  value={form.email ?? ""}
                  onChangeText={(v) => updateField("email", v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextInput
                  mode="outlined"
                  label="Phone"
                  value={form.contact_no ?? ""}
                  onChangeText={(v) => updateField("contact_no", v)}
                  keyboardType="phone-pad"
                />

                <TextInput
                  mode="outlined"
                  label="Address line 1"
                  value={form.address1 ?? ""}
                  onChangeText={(v) => updateField("address1", v)}
                />

                <TextInput
                  mode="outlined"
                  label="Address line 2"
                  value={form.address2 ?? ""}
                  onChangeText={(v) => updateField("address2", v)}
                />

                <TextInput
                  mode="outlined"
                  label="Address line 3"
                  value={form.address3 ?? ""}
                  onChangeText={(v) => updateField("address3", v)}
                />
              </View>

              <Button
                mode="contained"
                disabled={!hasChanges}
                contentStyle={{ height: 48 }}
                onPress={onSave}
              >
                Save changes
              </Button>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
