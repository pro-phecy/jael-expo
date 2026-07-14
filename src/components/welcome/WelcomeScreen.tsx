/**
 * Jael — Welcome Screen (React Native)
 *
 * A premium, romantic onboarding sequence: the wordmark fades in and out,
 * then a "Welcome" message with a romantic line fades in and slowly fades
 * out, with ambient floating hearts drifting from the bottom of the screen
 * to the top throughout.
 *
 * Install:
 *   npx expo install @expo/vector-icons
 *   npx expo install expo-font @expo-google-fonts/fraunces   (optional, for the serif wordmark)
 *
 * No other dependencies required — the shimmer effect below is done with
 * plain Animated color interpolation, no MaskedView/LinearGradient needed.
 */

import React, { useEffect, useRef, useState } from "react";
import { useFonts, Fraunces_500Medium, Fraunces_500Medium_Italic,Fraunces_400Regular,
  Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_H } = Dimensions.get("window");

const theme = {
  pageBg: "#F3ECEA",
  bg: "#FBF6F4",
  card: "#FFFFFF",
  blush: "#F7E8EA",
  blushText: "#8A3B52",
  accent: "#C8577A",
  accentDark: "#7A2E45",
  text: "#2E2422",
  muted: "#9C8D89",
  border: "#EDE1DD",
};

// Swap for 'Fraunces_500Medium' (from @expo-google-fonts/fraunces) once loaded via useFonts.
// Georgia only exists as a system font on iOS — Android/web fall back to the
// platform's default serif so React Native doesn't warn about a missing font.
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "Fraunces_500Medium",
  default: "serif",
});

/* ---------------------------------------------------------------- */
/* Ambient floating hearts — drift from below the screen to above it */
/* ---------------------------------------------------------------- */
const HEART_CONFIG = [
  { left: "6%", size: 9, duration: 6200, delay: 0 },
  { left: "16%", size: 12, duration: 7400, delay: 1600 },
  { left: "26%", size: 8, duration: 5500, delay: 600 },
  { left: "36%", size: 11, duration: 6800, delay: 2400 },
  { left: "46%", size: 7, duration: 5200, delay: 1100 },
  { left: "56%", size: 14, duration: 7800, delay: 200 },
  { left: "64%", size: 9, duration: 6400, delay: 2800 },
  { left: "74%", size: 12, duration: 7000, delay: 900 },
  { left: "83%", size: 8, duration: 5800, delay: 1900 },
  { left: "92%", size: 10, duration: 6600, delay: 400 },
];

function FloatingHeart({ left, size, duration, delay }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress, duration, delay]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(SCREEN_H + 80)],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.1, 0.85, 1],
    outputRange: [0, 0.45, 0.28, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });



  return (
    <Animated.View
      style={{
        position: "absolute",
        left,
        bottom: -20,
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    >
      <Ionicons name="heart" size={size} color={theme.accent} />
    </Animated.View>
  );
}

function FloatingHearts() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {HEART_CONFIG.map((h, i) => (
        <FloatingHeart key={i} {...h} />
      ))}
    </View>
  );
}

/* ---------------------------------------------------------------- */
/* FadeStage — fades children in, holds, fades out, then calls onComplete */
/* ---------------------------------------------------------------- */
function FadeStage({ children, holdMs = 1400, fadeInMs = 700, fadeOutMs = 1400, onComplete, style }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: fadeInMs, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.delay(holdMs),
      Animated.timing(opacity, { toValue: 0, duration: fadeOutMs, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished && onComplete) onComplete();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}

/* ---------------------------------------------------------------- */
/* Heartbeat — a small pulsing heart icon                            */
/* ---------------------------------------------------------------- */
function Heartbeat({ size = 14 }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.22, duration: 240, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 240, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.14, duration: 220, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 220, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.delay(700),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: 12 }}>
      <Ionicons name="heart" size={size} color={theme.accent} />
    </Animated.View>
  );
}

/* ---------------------------------------------------------------- */
/* ShimmerText — a soft color sweep across the wordmark, using only  */
/* Animated color interpolation (no extra native dependencies)       */
/* ---------------------------------------------------------------- */
function ShimmerText({ text, style }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(progress, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const color = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [theme.text, theme.accent, theme.text],
  });

  return <Animated.Text style={[style, { color }]}>{text}</Animated.Text>;
}

/* ---------------------------------------------------------------- */
/* WelcomeScreen                                                     */
/* ---------------------------------------------------------------- */
export function WelcomeScreen({ onFinished }) {
  const [phase, setPhase] = useState("logo"); // 'logo' -> 'welcome'

  return (
    <View style={styles.container}>
      <FloatingHearts />

      {phase === "logo" && (
        <FadeStage
          holdMs={1300}
          fadeInMs={700}
          fadeOutMs={700}
          onComplete={() => setPhase("welcome")}
          style={styles.centerColumn}
        >
          <ShimmerText text="Jael" style={styles.logo} />
          <Heartbeat size={14} />
        </FadeStage>
      )}

      {phase === "welcome" && (
        <FadeStage
          holdMs={1800}
          fadeInMs={800}
          fadeOutMs={1600}
          onComplete={onFinished}
          style={[styles.centerColumn, { maxWidth: 260 }]}
        >
          <Heartbeat size={16} />
          <Text style={styles.welcomeHeading}>Welcome</Text>
          <Text style={styles.welcomeSubtitle}>
            Some feelings deserve a place of their own. This one is yours.
          </Text>
        </FadeStage>
      )}
    </View>
  );
}

/* ---------------------------------------------------------------- */
/* Default export — pass your own onFinished to navigate away         */
/* once the sequence completes. Falls back to a looping demo if no    */
/* onFinished is provided (handy for quickly previewing the screen).  */
/* ---------------------------------------------------------------- */
export default function JaelWelcome({ onFinished }) {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_500Medium_Italic,
    Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  });

  const [runKey, setRunKey] = useState(0);

  if (!fontsLoaded) {
    return null; // or a splash/loading screen
  }

  const handleFinished = onFinished || (() => setRunKey((k) => k + 1));

  return (
    <SafeAreaView style={styles.screen}>
      <WelcomeScreen key={runKey} onFinished={handleFinished} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  centerColumn: {
    alignItems: "center",
  },
  logo: {
    fontFamily: SERIF_FONT,
    fontSize: 42,
    marginBottom: 10,
    color: theme.text,
    textAlign: "center",
  },
  welcomeHeading: {
    fontFamily: SERIF_FONT,
    fontSize: 36,
    color: theme.text,
    marginBottom: 14,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontFamily: "Fraunces_500Medium_Italic",
    fontSize: 16,
    lineHeight: 24,
    color: theme.accentDark,
    textAlign: "center",
  },
});