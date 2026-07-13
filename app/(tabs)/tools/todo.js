import React from "react";
import { useRouter } from "expo-router";
import TodoScreen from "../../../src/screens/TodoScreen";

export default function TodoScreenRoute() {
  const router = useRouter();
  return <TodoScreen onBack={() => router.back()} />;
}
