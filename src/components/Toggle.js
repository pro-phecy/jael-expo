import React, { useRef, useEffect } from "react";
import { Animated, Pressable, useWindowDimensions } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { radius } from "../theme/tokens";

export default function Toggle({ checked, onChange, label }) {
  const { theme } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();

  // NOTE: a switch's immediate parent is usually just a row next to a label,
  // so its width is arbitrary and has nothing to do with device size —
  // sizing off that (e.g. width: "10%") would make the toggle balloon or
  // shrink unpredictably depending on whatever row it's dropped into.
  // For a small fixed-shape control like this, device-size consistency
  // comes from scaling against the *screen* width instead.
  const trackWidth = screenWidth * 0.1;
  const trackHeight = trackWidth * 0.6;
  const knobSize = trackHeight * 0.75;
  const knobTravel = trackWidth - knobSize - (trackHeight - knobSize);

  const translate = useRef(new Animated.Value(checked ? knobTravel : 0)).current;

  useEffect(() => {
    Animated.spring(translate, { toValue: checked ? knobTravel : 0, useNativeDriver: true, friction: 6, tension: 80 }).start();
  }, [checked]);

  return (
    <Pressable
      onPress={onChange}
      accessibilityRole="switch"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      style={{
        width: trackWidth,
        height: trackHeight,
        borderRadius: radius.pill,
        backgroundColor: checked ? theme.accent : theme.border,
        padding: (trackHeight - knobSize) / 2,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize,
          borderRadius: knobSize / 2,
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
