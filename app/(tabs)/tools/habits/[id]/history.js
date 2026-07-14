import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import HabitHistoryScreen from "../../../../../src/screens/HabitHistoryScreen";

export default function HabitHistoryRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  return <HabitHistoryScreen habitId={id} onBack={() => router.back()} />;
}
