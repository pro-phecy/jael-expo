import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../context/ThemeContext";
import ScreenEnter from "./ScreenEnter";

// Wraps the standalone tool detail screens (Notes/Todo/Water/Habits/Calendar).
// Unlike Home/Profile/ToolsHome, these are pushed directly by expo-router
// with no TopLevelScreen ancestor, so without their own SafeAreaView their
// SubHeader/back-button renders under the status bar notch and scrollable
// content can end up behind the home indicator.
export default function ToolScreen({ children, style }) {
  const { theme } = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top", "bottom", "left", "right"]}>
      <ScreenEnter style={[{ flex: 1 }, style]}>{children}</ScreenEnter>
    </SafeAreaView>
  );
}
