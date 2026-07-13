import React from "react";
import { useRouter } from "expo-router";
import HabitsScreen from "../../../src/screens/HabitsScreen";
import SafeSubScreen from "../../../src/components/SafeSubScreen";

export default function HabitsScreenRoute() {
  const router = useRouter();
  return (
    <SafeSubScreen>
      <HabitsScreen onBack={() => router.back()} />
    </SafeSubScreen>
  );
}
