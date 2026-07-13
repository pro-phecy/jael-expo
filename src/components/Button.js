import React, { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
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
  const scale = useRef(new Animated.Value(1)).current;

  const variants = {
    primary: { backgroundColor: theme.accent, color: theme.onAccent, borderWidth: 0 },
    outline: { backgroundColor: theme.card, color: theme.text, borderWidth: 0.5, borderColor: theme.border },
    ghost: { backgroundColor: "transparent", color: theme.accent, borderWidth: 0 },
    subtle: { backgroundColor: theme.blush, color: theme.blushText, borderWidth: 0 },
    dashed: { backgroundColor: "transparent", color: theme.accent, borderWidth: 0.5, borderStyle: "dashed", borderColor: theme.border },
    plain: { backgroundColor: "transparent", color: theme.muted, borderWidth: 0 },
  };

  const sizes = {
    sm: { fontSize: type.caption + 1, paddingVertical: iconOnly ? 0 : space.sm, paddingHorizontal: iconOnly ? 0 : space.lg },
    md: { fontSize: type.body, paddingVertical: iconOnly ? 0 : space.md, paddingHorizontal: iconOnly ? 0 : space.xl },
  };

  const dimension = iconOnly ? (size === "sm" ? 30 : 38) : undefined;
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
      style={{ opacity: disabled ? 0.45 : 1 }}
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
            height: dimension,
            backgroundColor: v.backgroundColor,
            borderWidth: v.borderWidth,
            borderColor: v.borderColor,
            borderStyle: v.borderStyle,
            paddingVertical: s.paddingVertical,
            paddingHorizontal: s.paddingHorizontal,
            transform: [{ scale }],
          },
          style,
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
