import React from "react";
import { useRouter } from "expo-router";
import CalendarScreen from "../../../src/screens/CalendarScreen";
import SafeSubScreen from "../../../src/components/SafeSubScreen";

export default function CalendarScreenRoute() {
  const router = useRouter();
  return (
    <SafeSubScreen>
      <CalendarScreen onBack={() => router.back()} />
    </SafeSubScreen>
  );
}
