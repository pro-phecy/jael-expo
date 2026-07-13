import React from "react";
import { useRouter } from "expo-router";
import HabitsScreen from "../../../src/screens/HabitsScreen";

export default function HabitsScreenRoute() {
  const router = useRouter();
  return <HabitsScreen onBack={() => router.back()} />;
}
