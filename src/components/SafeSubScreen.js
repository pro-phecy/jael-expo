import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../context/ThemeContext";

/**
 * Wraps a tool sub-screen (Notes, Todo, Water, Habits, Calendar) in a
 * SafeAreaView so its content — and the back button in SubHeader — clears
 * the status bar / notch instead of rendering underneath it.
 *
 * Only the top/left/right edges are protected here: the bottom edge is
 * already handled by TabBar (it reads insets.bottom itself), and these
 * sub-screens still render inside the same bottom tab bar as the rest
 * of the app, so adding a bottom inset here would double it up.
 */
export default function SafeSubScreen({ children }) {
  const { theme } = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor: theme.bg }} edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
}
