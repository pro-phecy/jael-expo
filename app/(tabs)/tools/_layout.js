import React from "react";
import { Stack } from "expo-router";

export default function ToolsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="notes" />
      <Stack.Screen name="todo" />
      <Stack.Screen name="water" />
      <Stack.Screen name="habits" />
      <Stack.Screen name="calendar" />
    </Stack>
  );
}
