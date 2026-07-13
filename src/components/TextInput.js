import React, { useState } from "react";
import { TextInput as RNTextInput, useWindowDimensions } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { radius, type } from "../theme/tokens";

export default function TextInput({ style, ...props }) {
  const { theme } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [focused, setFocused] = useState(false);

  return (
    <RNTextInput
      placeholderTextColor={theme.muted}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        {
          borderWidth: 0.5,
          borderColor: focused ? theme.accent : theme.border,
          borderRadius: radius.md,
          // Scaled off screen width, not the field's own/parent width —
          // several call sites use this with flex:1 (e.g. Calendar/Habits/
          // Todo "add item" rows), and percentage padding there creates a
          // circular layout dependency that silently breaks flex:1.
          paddingVertical: screenWidth * 0.027,
          paddingHorizontal: screenWidth * 0.037,
          fontSize: type.body,
          backgroundColor: theme.card,
          color: theme.text,
        },
        style,
      ]}
      {...props}
    />
  );
}
