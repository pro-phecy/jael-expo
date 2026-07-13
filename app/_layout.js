import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';

import WelcomeScreen from '../src/components/welcome/WelcomeScreen';
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
      <View style={styles.flex}>
        {appReady && <Slot />}

        {showWelcome && (
          <View style={StyleSheet.absoluteFill}>
            <WelcomeScreen onFinished={() => setShowWelcome(false)} />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});