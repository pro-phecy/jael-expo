import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Slot } from 'expo-router';

import WelcomeScreen from '../src/components/welcome/WelcomeScreen';
import { HabitsProvider } from '../src/context/HabitsContext';
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
    <HabitsProvider>
      <View style={styles.flex}>
        {appReady && <Slot />}

        {showWelcome && (
          <View style={StyleSheet.absoluteFill}>
            <WelcomeScreen onFinished={() => setShowWelcome(false)} />
          </View>
        )}
      </View>
    </HabitsProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});