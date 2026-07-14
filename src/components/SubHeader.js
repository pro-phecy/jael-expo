import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import Button from "./Button";
import { useAppTheme } from "../context/ThemeContext";
import { space, type } from "../theme/tokens";

export default function SubHeader({ title, onBack, right, numberOfLines = 1 }) {
  const { theme } = useAppTheme();
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: theme.bg }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space.md,
          paddingHorizontal: space.xl,
          paddingTop: space.md,
          paddingBottom: space.lg,
        }}
      >
        <View style={{ flexShrink: 0 }}>
          <Button variant="outline" iconOnly round icon={ArrowLeft} size="sm" onPress={onBack} accessibilityLabel="Back to tools" />
        </View>
        <Text
          style={{ flex: 1, flexShrink: 1, fontFamily: "Fraunces_500Medium", fontSize: type.title + 2, color: theme.text }}
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        {right ? <View style={{ flexShrink: 0 }}>{right}</View> : null}
      </View>
    </SafeAreaView>
  );
}
