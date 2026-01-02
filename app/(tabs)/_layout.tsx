import React from "react";
import { Tabs } from "expo-router";
import FloatingTabBar from "../../components/shared/navBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="a" options={{ title: "Home" }} />
      <Tabs.Screen name="b" options={{ title: "Application" }} />
      <Tabs.Screen name="c" options={{ title: "Settings" }} />
    </Tabs>
  );
}
