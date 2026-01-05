import { Stack } from "expo-router";
import * as React from "react";

export default function CLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="update" />
    </Stack>
    );
}
