import React from "react";
import { useRouter } from "expo-router";
import WaterScreen from "../../../src/screens/WaterScreen";
import SafeSubScreen from "../../../src/components/SafeSubScreen";

export default function WaterScreenRoute() {
  const router = useRouter();
  return (
    <SafeSubScreen>
      <WaterScreen onBack={() => router.back()} />
    </SafeSubScreen>
  );
}
