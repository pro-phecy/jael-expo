import React from "react";
import { View, Text } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import Button from "./Button";
import { useAppTheme } from "../context/ThemeContext";
import { space, type } from "../theme/tokens";

export default function SubHeader({ title, onBack }) {
  const { theme } = useAppTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, paddingHorizontal: space.xl, paddingBottom: space.lg }}>
      <Button variant="outline" iconOnly round icon={ArrowLeft} size="sm" onPress={onBack} accessibilityLabel="Back to tools" />
      <Text style={{ fontFamily: "Fraunces_500Medium", fontSize: type.title + 2, color: theme.text }}>{title}</Text>
    </View>
  );
}
