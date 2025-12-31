import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";

export default function Settings() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: tokens.spacing.lg,
        backgroundColor: colors.background,
      }}
    >
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
          gap: tokens.spacing.lg,
        }}
      >
        <Text variant="headlineSmall">Home</Text>

        <Card>
          <Card.Content>
            <Text variant="titleMedium">Today</Text>
            <Text
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant }}
            >
              You’re all set for the day.
            </Text>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Text variant="titleMedium">Quick actions</Text>
            <View
              style={{ gap: tokens.spacing.sm, marginTop: tokens.spacing.sm }}
            >
              <Button mode="contained">Check attendance</Button>
              <Button mode="outlined">Apply leave</Button>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </View>
  );
}
