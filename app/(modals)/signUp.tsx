import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  TextInput as RNInput,
  Animated,
  InteractionManager,
} from "react-native";
import { useTheme, Text, TextInput, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useAuth } from "../../contexts/authContext";
import { useFocusEffect } from "expo-router";

export default function SignUpModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { signIn, loading, error, clearError } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErr, setFieldErr] = useState<{
    user?: string;
    pass?: string;
    conf?: string;
  }>({});

  const userRef = useRef<RNInput>(null);
  const passRef = useRef<RNInput>(null);
  const confRef = useRef<RNInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  const mismatch =
    confirm.trim().length > 0 &&
    password.trim().length > 0 &&
    confirm !== password;

  useEffect(() => {
    setFieldErr((e) => ({
      ...e,
      conf: mismatch ? "Passwords do not match" : undefined,
    }));
  }, [mismatch]);

  const isValid =
    username.trim().length > 0 &&
    password.trim().length > 0 &&
    confirm.trim().length > 0 &&
    !mismatch;

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => userRef.current?.focus());
    });
    return () => task.cancel();
  }, []);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        clearError();
        setUsername("");
        setPassword("");
        setConfirm("");
        setShowPass(false);
        setShowConfirm(false);
        setFieldErr({});
        shake.setValue(0);
      };
    }, [clearError, shake])
  );

  useEffect(() => {
    if (!error) return;
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [error, shake]);

  const onSubmit = async () => {
    const u = username.trim();
    const p = password.trim();
    const c = confirm.trim();
    const nextErr: typeof fieldErr = {};
    if (!u) nextErr.user = "Required";
    if (!p) nextErr.pass = "Required";
    if (!c) nextErr.conf = "Required";
    setFieldErr(nextErr);
    if (Object.keys(nextErr).length || mismatch) {
      if (!u) userRef.current?.focus();
      else if (!p) passRef.current?.focus();
      else confRef.current?.focus();
      return;
    }
    await signIn(u, p);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing.xl * 4,
          justifyContent: "center",
          gap: tokens.spacing.lg,
        }}
        bounces={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: tokens.spacing.xxs, alignItems: "center" }}>
          <Text
            style={{
              color: colors.onBackground,
              fontSize: tokens.typography.sizes["2xl"],
              fontWeight: "700",
            }}
          >
            Create account
          </Text>
        </View>

        {!!error && (
          <View
            style={{
              backgroundColor: colors.errorContainer,
              borderColor: colors.error,
              borderWidth: 1,
              borderRadius: tokens.radii.lg,
              paddingVertical: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.md,
            }}
          >
            <Text style={{ color: colors.onErrorContainer, fontWeight: "600" }}>
              {error}
            </Text>
          </View>
        )}

        <Animated.View style={{ transform: [{ translateX: shake }] }}>
          <View style={{ gap: tokens.spacing.md }}>
            <TextInput
              mode="outlined"
              label="Username"
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                if (fieldErr.user)
                  setFieldErr((e) => ({ ...e, user: undefined }));
              }}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
              error={!!fieldErr.user}
              ref={userRef}
            />
            {fieldErr.user ? (
              <Text style={{ color: colors.error, marginTop: -8 }}>
                {fieldErr.user}
              </Text>
            ) : null}

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (fieldErr.pass)
                  setFieldErr((e) => ({ ...e, pass: undefined }));
                if (confirm && t === confirm)
                  setFieldErr((e) => ({ ...e, conf: undefined }));
              }}
              secureTextEntry={!showPass}
              ref={passRef}
              returnKeyType="next"
              onSubmitEditing={() => confRef.current?.focus()}
              error={!!fieldErr.pass}
              right={
                <TextInput.Icon
                  icon={showPass ? "eye-off" : "eye"}
                  onPress={() => setShowPass((v) => !v)}
                  forceTextInputFocus={false}
                />
              }
            />
            {fieldErr.pass ? (
              <Text style={{ color: colors.error, marginTop: -8 }}>
                {fieldErr.pass}
              </Text>
            ) : null}

            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={confirm}
              onChangeText={(t) => {
                setConfirm(t);
                if (!t || t === password)
                  setFieldErr((e) => ({ ...e, conf: undefined }));
              }}
              secureTextEntry={!showConfirm}
              ref={confRef}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
              error={!!fieldErr.conf}
              right={
                <TextInput.Icon
                  icon={showConfirm ? "eye-off" : "eye"}
                  onPress={() => setShowConfirm((v) => !v)}
                  forceTextInputFocus={false}
                />
              }
            />
            {fieldErr.conf ? (
              <Text style={{ color: colors.error, marginTop: -8 }}>
                {fieldErr.conf}
              </Text>
            ) : confirm && !mismatch ? (
              <Text style={{ color: colors.tertiary, marginTop: -8 }}>
                Passwords match
              </Text>
            ) : null}
          </View>
        </Animated.View>

        <Divider style={{ marginTop: tokens.spacing.sm }} />
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            paddingTop: tokens.spacing.sm,
            paddingBottom: insets.bottom + tokens.spacing.lg,
            backgroundColor: colors.background,
            borderTopWidth: 0.5,
            borderTopColor: colors.outlineVariant,
          }}
        >
          <Button
            onPress={onSubmit}
            variant="default"
            disabled={loading || !isValid}
            fullWidth
            rounded="sm"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </View>
      </View>
    </View>
  );
}
