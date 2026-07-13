import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";

/**
 * Wrap a value display (a counter, a checkmark, a badge) with this to
 * replay a small "pop" animation whenever changeKey changes - mirrors
 * the web version's `key={value}` remount + CSS pop keyframe trick.
 */
export default function PopOnChange({ changeKey, children, style }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    scale.setValue(0.6);
    opacity.setValue(0.4);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 170 }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [changeKey]);

  return <Animated.View style={[{ transform: [{ scale }], opacity }, style]}>{children}</Animated.View>;
}
