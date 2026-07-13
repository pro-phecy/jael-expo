import React from "react";
import { useRouter } from "expo-router";
import NotesScreen from "../../../src/screens/NotesScreen";

export default function NotesScreenRoute() {
  const router = useRouter();
  return <NotesScreen onBack={() => router.back()} />;
}
