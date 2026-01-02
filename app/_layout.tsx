import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Slot, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { TokenProvider } from "../contexts/tokenContext";
import { ThemeProvider } from "../contexts/themeContext";
import { DesignProvider } from "../contexts/designContext";
import { OverlayProvider } from "../contexts/overlayContext";
import { AuthProvider } from "../contexts/authContext";
import AlertDialog from "../components/shared/alert";
import ConfirmDialog from "../components/shared/confirm";
import ToastBar from "../components/shared/toast";
import ModalSheet from "../components/shared/modal";
import { TabProvider } from "../contexts/tabContext";

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
      <View style={{ flex: 1 }}>
        <Slot />
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
          <TabProvider>
            <DesignProvider>
              <OverlayProvider
                AlertUI={AlertDialog}
                ConfirmUI={ConfirmDialog}
                ToastUI={ToastBar}
                ModalUI={ModalSheet}
              >
                <TokenProvider>
                  <AuthProvider>
                    <AppShell />
                  </AuthProvider>
                </TokenProvider>
              </OverlayProvider>
            </DesignProvider>
          </TabProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
