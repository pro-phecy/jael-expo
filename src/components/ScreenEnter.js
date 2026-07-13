import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";

export default function ScreenEnter({ children, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start();
  }, []);

  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}
