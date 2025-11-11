import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Stack, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
import { ThemeProvider } from "../contexts/themeContext";
import { DesignProvider } from "../contexts/designContext";
import { OverlayProvider } from "../contexts/overlayContext";
import { AlertDialog } from "../components/molecule/alert";
import { ConfirmDialog } from "../components/molecule/confirm";
import { ToastBar } from "../components/molecule/toast";
import { ModalSheet } from "../components/molecule/modal";
import { AuthProvider } from "../contexts/authContext";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

void (async () => {
  try {
    await SplashScreen.preventAutoHideAsync();
  } catch {}
})();

function AppShell() {
  const { dark, colors } = useTheme();
  return (
    <>
      <StatusBar style={dark ? "light" : "dark"} />
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      (async () => {
        try {
          await SplashScreen.hideAsync();
        } catch {}
      })();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <ThemeProvider>
          <DesignProvider>
            <OverlayProvider
              AlertUI={AlertDialog}
              ConfirmUI={ConfirmDialog}
              ToastUI={ToastBar}
              ModalUI={ModalSheet}
            >
              <AuthProvider>
                <AppShell />
              </AuthProvider>
            </OverlayProvider>
          </DesignProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
