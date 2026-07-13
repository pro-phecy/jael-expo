import React from "react";
import { useRouter } from "expo-router";
import CalendarScreen from "../../../src/screens/CalendarScreen";

export default function CalendarScreenRoute() {
  const router = useRouter();
  return <CalendarScreen onBack={() => router.back()} />;
}
