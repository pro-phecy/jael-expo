import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';

import WelcomeScreen from '../src/components/welcome/WelcomeScreen';
import { ThemeProvider } from '../src/context/ThemeContext';
import { NotificationsProvider } from '../src/context/NotificationsContext';
import GlobalNotificationsPanel from '../src/components/GlobalNotificationsPanel';
import { useFonts } from "expo-font";
import {
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium,
  Fraunces_500Medium_Italic,
} from "@expo-google-fonts/fraunces";


export default function RootLayout() {
  const [showWelcome, setShowWelcome] = useState(true);

  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium,
    Fraunces_500Medium_Italic,
  });

  if (!fontsLoaded) {
    return null; // or your splash/loading screen
  }
  ;
  

  const appReady = fontsLoaded;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotificationsProvider>
          <View style={styles.flex}>
            {appReady && <Slot />}

            {showWelcome && (
              <View style={StyleSheet.absoluteFill}>
                <WelcomeScreen onFinished={() => setShowWelcome(false)} />
              </View>
            )}

            <GlobalNotificationsPanel />
          </View>
        </NotificationsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});