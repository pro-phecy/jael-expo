import React from "react";
import { useRouter } from "expo-router";
import WaterScreen from "../../../src/screens/WaterScreen";

export default function WaterScreenRoute() {
  const router = useRouter();
  return <WaterScreen onBack={() => router.back()} />;
}
