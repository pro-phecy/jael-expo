import React from "react";
import { useRouter } from "expo-router";
import NotesScreen from "../../../src/screens/NotesScreen";
import SafeSubScreen from "../../../src/components/SafeSubScreen";

export default function NotesScreenRoute() {
  const router = useRouter();
  return (
    <SafeSubScreen>
      <NotesScreen onBack={() => router.back()} />
    </SafeSubScreen>
  );
}
