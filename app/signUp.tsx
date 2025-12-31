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
import { UserPlus } from "lucide-react-native";
import { useDesign } from "../contexts/designContext";
import { useRouter } from "expo-router";
import Header from "../components/shared/header";

export default function SignUp() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const isValid = useMemo(
    () =>
      username.trim().length > 0 &&
      password.length >= 6 &&
      password === confirm,
    [username, password, confirm]
  );

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const liftY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Header title="Sign up" subtitle="Create your account" />

          <Animated.View
            style={{
              flex: 1,
              paddingHorizontal: tokens.spacing.lg,
              paddingTop: tokens.spacing["3xl"],
              gap: tokens.spacing.md,
              opacity,
              transform: [{ scale }, { translateY: liftY }],
            }}
          >
            <View style={{ alignItems: "center", gap: tokens.spacing.md }}>
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: colors.primaryContainer,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: colors.primary,
                  shadowOpacity: 0.2,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 8,
                }}
              >
                <UserPlus size={40} color={colors.primary} />
              </View>

              <View style={{ alignItems: "center", gap: tokens.spacing.xs }}>
                <Text variant="headlineSmall">Join Faith</Text>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: colors.onSurfaceVariant,
                    textAlign: "center",
                    maxWidth: 280,
                  }}
                >
                  Create an account to get started
                </Text>
              </View>
            </View>

            <TextInput
              mode="outlined"
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TextInput
              mode="outlined"
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
            />

            <Button
              mode="contained"
              disabled={!isValid}
              contentStyle={{ height: 48 }}
              onPress={() => router.replace("/welcome")}
            >
              Create account
            </Button>

            <Button mode="text" onPress={() => router.back()}>
              Already have an account?
            </Button>
          </Animated.View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
