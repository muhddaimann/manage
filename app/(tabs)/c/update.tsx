import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { useTheme, Text, TextInput, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/shared/header";

export default function UpdateProfile() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { setHideTabBar } = useTabs();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isValid = useMemo(
    () =>
      name.trim().length > 0 &&
      role.trim().length > 0 &&
      email.trim().length > 0,
    [name, role, email]
  );

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

    const show = Keyboard.addListener("keyboardWillShow", () => {
      Animated.spring(liftY, {
        toValue: -20,
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
      setHideTabBar(false);
      show.remove();
      hide.remove();
    };
  }, []);

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
          <Header title="Update Profile" subtitle="Complete this form" />

          <View
            style={{
              flex: 1,
              paddingTop: tokens.spacing.md,
            }}
          >
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
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />

                <TextInput
                  mode="outlined"
                  label="Role"
                  value={role}
                  onChangeText={setRole}
                  returnKeyType="next"
                />

                <TextInput
                  mode="outlined"
                  label="Department"
                  value={department}
                  onChangeText={setDepartment}
                  returnKeyType="next"
                />

                <TextInput
                  mode="outlined"
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType={phone ? "next" : "done"}
                />

                <TextInput
                  mode="outlined"
                  label="Phone (optional)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                />
              </View>

              <Button
                mode="contained"
                disabled={!isValid}
                contentStyle={{ height: 48 }}
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
