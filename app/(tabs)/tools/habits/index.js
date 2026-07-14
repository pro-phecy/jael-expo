import React from "react";
import { useRouter } from "expo-router";
import HabitsScreen from "../../../../src/screens/HabitsScreen";

export default function HabitsScreenRoute() {
  const router = useRouter();
  return (
    <HabitsScreen
      onBack={() => router.back()}
      onAdd={() => router.push("/tools/habits/add")}
      onStatistics={() => router.push("/tools/habits/statistics")}
      onReminders={() => router.push("/tools/habits/reminders")}
      onOpenHabit={(id) => router.push(`/tools/habits/${id}`)}
    />
  );
}
