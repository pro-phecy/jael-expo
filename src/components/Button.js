import React, { useRef } from "react";
import { Animated, Pressable, Text, useWindowDimensions } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconSize = 15,
  iconOnly = false,
  round = false,
  style,
  textStyle,
  children,
  onPress,
  disabled,
  accessibilityLabel,
}) {
  const { theme } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();
  const scale = useRef(new Animated.Value(1)).current;

  const variants = {
    primary: { backgroundColor: theme.accent, color: theme.onAccent, borderWidth: 0 },
    outline: { backgroundColor: theme.card, color: theme.text, borderWidth: 0.5, borderColor: theme.border },
    ghost: { backgroundColor: "transparent", color: theme.accent, borderWidth: 0 },
    subtle: { backgroundColor: theme.blush, color: theme.blushText, borderWidth: 0 },
    dashed: { backgroundColor: "transparent", color: theme.accent, borderWidth: 0.5, borderStyle: "dashed", borderColor: theme.border },
    plain: { backgroundColor: "transparent", color: theme.muted, borderWidth: 0 },
  };

  // Padding scales off *screen* width rather than the button's own/parent
  // width. Buttons are frequently used with flex:1 (e.g. two buttons split
  // evenly in a row) — percentage padding there creates a circular
  // dependency in Yoga (padding needs the final width, flex:1 needs to grow
  // to fill it) and silently collapses the button to fit its content,
  // ignoring flex:1 entirely. Scaling off screen width still makes padding
  // responsive to device size without that trap.
  const sizes = {
    sm: { fontSize: type.caption + 1, paddingVertical: iconOnly ? 0 : screenWidth * 0.021, paddingHorizontal: iconOnly ? 0 : screenWidth * 0.037 },
    md: { fontSize: type.body, paddingVertical: iconOnly ? 0 : screenWidth * 0.027, paddingHorizontal: iconOnly ? 0 : screenWidth * 0.048 },
  };

  // Icon-only buttons need an explicit box (no text to size around).
  // aspectRatio keeps them square while the base size scales with the
  // screen instead of being pinned to a fixed px value.
  const dimension = iconOnly ? screenWidth * (size === "sm" ? 0.08 : 0.1013) : undefined;
  const v = variants[variant];
  const s = sizes[size];

  const onPressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[{ opacity: disabled ? 0.45 : 1 }, style]}
    >
      <Animated.View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: space.sm,
            borderRadius: round ? radius.pill : radius.md,
            width: dimension,
            aspectRatio: iconOnly ? 1 : undefined,
            backgroundColor: v.backgroundColor,
            borderWidth: v.borderWidth,
            borderColor: v.borderColor,
            borderStyle: v.borderStyle,
            paddingVertical: s.paddingVertical,
            paddingHorizontal: s.paddingHorizontal,
            transform: [{ scale }],
          },
        ]}
      >
        {Icon && <Icon size={iconSize} color={v.color} />}
        {!iconOnly && (
          <Text style={[{ fontSize: s.fontSize, fontWeight: "500", color: v.color }, textStyle]}>{children}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
