import React from "react";
import ProfileScreen from "../../src/screens/ProfileScreen";
import TopLevelScreen from "../../src/components/TopLevelScreen";

export default function ProfileRoute() {
  return (
    <TopLevelScreen>
      <ProfileScreen />
    </TopLevelScreen>
  );
}
