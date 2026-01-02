import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Pressable,
  Animated,
  Easing,
  Image,
} from "react-native";
import { useTheme, Text, TextInput, Button } from "react-native-paper";
import { useDesign } from "../contexts/designContext";
import { useAuth } from "../contexts/authContext";

export default function SignIn() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { signIn, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const focusPassword = useRef<(() => void) | null>(null);

  const isValid = useMemo(
    () => username.trim().length > 0 && password.length > 0,
    [username, password]
  );

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;
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
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            paddingTop: tokens.spacing["3xl"] * 1.5,
            paddingHorizontal: tokens.spacing.lg,
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
            <View style={{ alignItems: "center", gap: tokens.spacing.sm }}>
              <Image
                source={require("../assets/images/iconn.png")}
                style={{ width: 56, height: 56, resizeMode: "contain" }}
              />

              <View style={{ alignItems: "center", gap: tokens.spacing.xs }}>
                <Text variant="headlineSmall">Hello Rockstar 👋</Text>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: colors.onSurfaceVariant,
                    textAlign: "center",
                  }}
                >
                  Sign in to continue your journey
                </Text>
              </View>
            </View>

            <View style={{ gap: tokens.spacing.md }}>
              <TextInput
                mode="outlined"
                label="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => focusPassword.current?.()}
              />

              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="go"
                ref={(
                  instance: React.ComponentRef<typeof TextInput> | null
                ) => {
                  focusPassword.current = instance?.focus ?? null;
                }}
                onSubmitEditing={() => {
                  if (isValid && !loading) {
                    Keyboard.dismiss();
                    signIn(username, password);
                  }
                }}
              />
            </View>

            <Button
              mode="contained"
              loading={loading}
              disabled={!isValid || loading}
              contentStyle={{ height: 48 }}
              onPress={() => {
                Keyboard.dismiss();
                signIn(username, password);
              }}
            >
              Sign in
            </Button>
          </Animated.View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
