import { Stack } from "expo-router";
import * as React from "react";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="newsflash" />
      <Stack.Screen name="main" />
      <Stack.Screen name="book" />
      <Stack.Screen name="room" />
      <Stack.Screen name="record" />
    </Stack>
  );
}
