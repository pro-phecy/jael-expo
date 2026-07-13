import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../context/ThemeContext";
import AppHeader from "./AppHeader";

export default function TopLevelScreen({ children }) {
  const { theme, darkMode } = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top", "left", "right"]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <AppHeader />
      <View style={{ flex: 1, width: "100%" }}>{children}</View>
    </SafeAreaView>
  );
}
