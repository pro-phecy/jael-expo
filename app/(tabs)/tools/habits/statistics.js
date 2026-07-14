import React from "react";
import { useRouter } from "expo-router";
import HabitStatisticsScreen from "../../../../src/screens/HabitStatisticsScreen";

export default function HabitStatisticsRoute() {
  const router = useRouter();
  return (
    <HabitStatisticsScreen
      onBack={() => router.back()}
      onOpenHabit={(id) => router.push(`/tools/habits/${id}`)}
    />
  );
}
