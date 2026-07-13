import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, type TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type HeartProps = {
  delay: number;
  duration: number;
  startX: number;
  size: number;
  opacity: number;
  drift: number;
};

/**
 * A single heart that drifts upward, swaying gently left/right,
 * fading in then out, then looping forever.
 */
function Heart({ delay, duration, startX, size, opacity, drift }: HeartProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle((): TextStyle => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [SCREEN_H * 0.15, -SCREEN_H * 0.25],
      Extrapolate.CLAMP
    );
    const translateX =
      startX + Math.sin(progress.value * Math.PI * 2) * drift;
    const scale = interpolate(
      progress.value,
      [0, 0.15, 0.85, 1],
      [0.4, 1, 1, 0.4],
      Extrapolate.CLAMP
    );
    const fade = interpolate(
      progress.value,
      [0, 0.15, 0.8, 1],
      [0, opacity, opacity, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }, { translateY }, { scale }],
      opacity: fade,
    };
  });

  return (
    <Animated.Text style={[styles.heart, { fontSize: size }, style]}>
      ♥
    </Animated.Text>
  );
}

/**
 * A soft field of drifting hearts, positioned absolutely to sit
 * behind foreground content. Purely decorative — pointerEvents="none".
 */
export default function FloatingHearts({ count = 14 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        key: i,
        delay: Math.random() * 4000,
        duration: 7000 + Math.random() * 6000,
        startX: Math.random() * SCREEN_W,
        size: 14 + Math.random() * 22,
        opacity: 0.15 + Math.random() * 0.35,
        drift: 12 + Math.random() * 24,
      })),
    [count]
  );

  return (
    <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
      {hearts.map((h) => (
        <Heart key={h.key} {...h} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
    color: '#FFFFFF',
  },
});