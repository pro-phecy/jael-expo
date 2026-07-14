import React, { useRef, useEffect } from "react";
import { Animated, Pressable } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { radius } from "../theme/tokens";

export default function Toggle({ checked, onChange, label }) {
  const { theme } = useAppTheme();
  const translate = useRef(new Animated.Value(checked ? 16 : 0)).current;

  useEffect(() => {
    Animated.spring(translate, { toValue: checked ? 16 : 0, useNativeDriver: true, friction: 6, tension: 80 }).start();
  }, [checked]);

  return (
    <Pressable
      onPress={onChange}
      accessibilityRole="switch"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      style={{
        width: 40,
        height: 24,
        borderRadius: radius.pill,
        backgroundColor: checked ? theme.accent : theme.border,
        padding: 3,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: "#fff",
          transform: [{ translateX: translate }],
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}
      />
    </Pressable>
  );
}
