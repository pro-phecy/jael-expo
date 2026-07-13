import React, { useEffect } from "react";
import { Text, TextInput as RNTextInputBase } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts as useFraunces,
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_400Regular_Italic,
} from "@expo-google-fonts/fraunces";
import { useFonts as useInter, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";

import { ThemeProvider } from "../src/context/ThemeContext";
import { NotificationsProvider, useNotifications } from "../src/context/NotificationsContext";
import NotificationsPanel from "../src/components/NotificationsPanel";

SplashScreen.preventAutoHideAsync().catch(() => {});

function NotificationsOverlay() {
  const { visible, notifications, close, markRead, markAllRead } = useNotifications();
  return (
    <NotificationsPanel
      visible={visible}
      notifications={notifications}
      onClose={close}
      onMarkRead={markRead}
      onMarkAllRead={markAllRead}
    />
  );
}

export default function RootLayout() {
  const [frauncesLoaded] = useFraunces({ Fraunces_400Regular, Fraunces_500Medium, Fraunces_400Regular_Italic });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const fontsLoaded = frauncesLoaded && interLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
      // Default font for every <Text>/<TextInput> that doesn't set its own -
      // mirrors the web version's global `font-family: Inter` base style.
      Text.defaultProps = Text.defaultProps || {};
      Text.defaultProps.style = [{ fontFamily: "Inter_400Regular" }, Text.defaultProps.style];
      RNTextInputBase.defaultProps = RNTextInputBase.defaultProps || {};
      RNTextInputBase.defaultProps.style = [{ fontFamily: "Inter_400Regular" }, RNTextInputBase.defaultProps.style];
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotificationsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <NotificationsOverlay />
        </NotificationsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
