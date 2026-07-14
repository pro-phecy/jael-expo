import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import HabitDetailScreen from "../../../../../src/screens/HabitDetailScreen";

export default function HabitDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  return (
    <HabitDetailScreen
      habitId={id}
      onBack={() => router.back()}
      onHistory={() => router.push(`/tools/habits/${id}/history`)}
    />
  );
}
