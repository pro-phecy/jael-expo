import React from "react";
import { useRouter } from "expo-router";
import TodoScreen from "../../../src/screens/TodoScreen";
import SafeSubScreen from "../../../src/components/SafeSubScreen";

export default function TodoScreenRoute() {
  const router = useRouter();
  return (
    <SafeSubScreen>
      <TodoScreen onBack={() => router.back()} />
    </SafeSubScreen>
  );
}
