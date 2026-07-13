import React, { useRef, useEffect } from "react";
import { Animated, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius } from "../theme/tokens";

export default function Card({ children, style, delay = 0, animateIn = true }) {
  const { theme } = useAppTheme();
  const opacity = useRef(new Animated.Value(animateIn ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(animateIn ? 10 : 0)).current;

  useEffect(() => {
    if (!animateIn) return;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 380, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 380, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: theme.card,
          borderWidth: 0.5,
          borderColor: theme.border,
          borderRadius: radius.xxl,
          padding: space.lg,
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
