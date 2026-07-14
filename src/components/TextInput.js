import React, { useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";

export default function TextInput({ style, ...props }) {
  const { theme } = useAppTheme();
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
          paddingVertical: space.md,
          paddingHorizontal: space.lg,
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
