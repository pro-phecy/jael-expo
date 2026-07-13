import React from "react";
import { useRouter } from "expo-router";
import ToolsHomeScreen from "../../../src/screens/ToolsHomeScreen";
import TopLevelScreen from "../../../src/components/TopLevelScreen";

// Route names in the ToolsHomeScreen tool list map 1:1 to files in this folder.
const ROUTES = {
  Notes: "/tools/notes",
  Todo: "/tools/todo",
  Water: "/tools/water",
  Habits: "/tools/habits",
  Calendar: "/tools/calendar",
};

export default function ToolsHomeRoute() {
  const router = useRouter();
  return (
    <TopLevelScreen>
      <ToolsHomeScreen onNavigate={(id) => router.push(ROUTES[id])} />
    </TopLevelScreen>
  );
}
