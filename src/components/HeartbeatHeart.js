import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";
import { Heart } from "lucide-react-native";

export default function HeartbeatHeart({ size = 12, color }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.22, duration: 220, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.14, duration: 220, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 1740, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Heart size={size} color={color} fill={color} />
    </Animated.View>
  );
}
