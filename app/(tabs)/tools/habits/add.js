import React from "react";
import { useRouter } from "expo-router";
import AddHabitScreen from "../../../../src/screens/AddHabitScreen";

export default function AddHabitRoute() {
  const router = useRouter();
  return <AddHabitScreen onDone={() => router.back()} />;
}
