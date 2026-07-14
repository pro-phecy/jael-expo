import React from "react";
import { StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../context/ThemeContext";
import ScreenEnter from "./ScreenEnter";
import SubHeader from "./SubHeader";

// Shared wrapper for tool detail screens (Notes, Todo, Water, Habits, Calendar).
// Gives every tool screen the same safe-area, status bar, background, and
// fade-in treatment that TopLevelScreen gives the main tabs, so nothing looks
// or behaves inconsistently depending on which screen you're on.
//
// - title/onBack  -> renders the standard SubHeader (default case)
// - header        -> pass a custom node instead (e.g. the note editor's
//                     Cancel / Undo / Redo / Save row) to override SubHeader
// - avoidKeyboard -> wraps content in a KeyboardAvoidingView, for screens
//                     with a text editor and/or a toolbar docked above the keyboard
export default function ToolScreen({ title, onBack, header, avoidKeyboard = false, children, style }) {
  const { theme, darkMode } = useAppTheme();

  const content = (
    <ScreenEnter style={[{ flex: 1 }, style]}>
      {header !== undefined ? header : title !== undefined && <SubHeader title={title} onBack={onBack} />}
      {children}
    </ScreenEnter>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top", "left", "right"]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}