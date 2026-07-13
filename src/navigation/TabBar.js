import React, { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Home as HomeIcon, Wrench, User } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { radius } from "../theme/tokens";

// Keys match the file-based route names Expo Router derives from
// app/(tabs)/index.js, app/(tabs)/tools/, app/(tabs)/profile.js.
const ICONS = { index: HomeIcon, tools: Wrench, profile: User };
const LABELS = { index: "Home", tools: "Tools", profile: "Profile" };

export default function TabBar({ state, navigation }) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const tabCount = state.routes.length;
  const tabWidth = containerWidth / tabCount;

  useEffect(() => {
    if (!containerWidth) return;
    Animated.spring(translateX, { toValue: state.index * tabWidth, useNativeDriver: true, friction: 8, tension: 90 }).start();
  }, [state.index, containerWidth]);

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 12), paddingTop: 8, backgroundColor: theme.bg }}>
      <View
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width - 10)}
        style={{ position: "relative", flexDirection: "row", borderWidth: 0.5, borderColor: theme.border, borderRadius: radius.xl, padding: 5, backgroundColor: theme.card }}
      >
        {containerWidth > 0 && (
          <Animated.View
            style={{
              position: "absolute",
              top: 5,
              bottom: 5,
              left: 5,
              width: tabWidth,
              borderRadius: radius.lg,
              backgroundColor: theme.blush,
              transform: [{ translateX }],
            }}
          />
        )}
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const Icon = ICONS[route.name];
          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 9, gap: 3, zIndex: 1 }}
            >
              <Icon size={18} color={focused ? theme.accent : theme.muted} />
              <Text style={{ fontSize: 10, letterSpacing: 0.2, color: focused ? theme.accent : theme.muted }}>{LABELS[route.name]}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
