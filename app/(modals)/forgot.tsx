import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useTheme, Text, TextInput, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useRouter } from "expo-router";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function ForgotPasswordModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const valid = useMemo(() => isValidEmail(email), [email]);
  const showErr = touched && email.length > 0 && !valid;

  const onSubmit = () => {
    setTouched(true);
    if (!valid) return;
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing.xl * 7,
          gap: tokens.spacing.lg,
          justifyContent: "center",
        }}
      >
        <View style={{ gap: tokens.spacing.xs, alignItems: "center" }}>
          <Text
            style={{
              color: colors.onBackground,
              fontSize: tokens.typography.sizes["2xl"],
              fontWeight: "700",
            }}
          >
            Reset password
          </Text>
          <Text style={{ color: colors.onSurfaceVariant }}>
            Enter your email to receive reset instructions
          </Text>
        </View>

        <View style={{ gap: tokens.spacing.xs }}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={(t) => {
              if (!touched) setTouched(true);
              setEmail(t);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoFocus
            error={showErr}
            onBlur={() => setTouched(true)}
            returnKeyType="send"
            onSubmitEditing={onSubmit}
          />
          {showErr ? (
            <Text style={{ color: colors.error, marginTop: -6 }}>
              Please enter a valid email address
            </Text>
          ) : null}
        </View>

        <Divider style={{ marginTop: tokens.spacing.xs }} />

        <View style={{ gap: tokens.spacing.xs, alignItems: "center" }}>
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: tokens.typography.sizes.sm,
              textAlign: "center",
            }}
          >
            Double-check your email spelling. If the account exists, we’ll send
            a reset link shortly.
          </Text>
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: tokens.typography.sizes.xs,
              textAlign: "center",
            }}
          >
            Didn’t receive it? Check spam/junk or try again in a few minutes.
          </Text>
        </View>
      </View>

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
            disabled={!valid}
            fullWidth
            rounded="sm"
          >
            Send reset link
          </Button>
        </View>
      </View>
    </View>
  );
}
