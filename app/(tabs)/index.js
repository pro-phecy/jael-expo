import React from "react";
import HomeScreen from "../../src/screens/HomeScreen";
import TopLevelScreen from "../../src/components/TopLevelScreen";
import { useStreak } from "../../src/hooks/useStreak";

export default function HomeRoute() {
  const streak = useStreak();
  return (
    <TopLevelScreen>
      <HomeScreen streak={streak} />
    </TopLevelScreen>
  );
}
