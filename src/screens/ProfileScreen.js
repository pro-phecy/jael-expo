import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Bell, Lock, HelpCircle, Moon, Sun, ChevronRight } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ScreenEnter from "../components/ScreenEnter";
import Button from "../components/Button";
import Toggle from "../components/Toggle";
import { usePersistedState } from "../hooks/usePersistedState";

const ROWS = [
  { label: "Privacy", icon: Lock },
  { label: "Help", icon: HelpCircle },
];

export default function ProfileScreen() {
  const { theme, darkMode, toggleDarkMode } = useAppTheme();
  const [pushEnabled, setPushEnabled] = usePersistedState("jael:push-enabled", true);

  return (
    <ScrollView style={{ flex: 1, width: "100%" }} contentContainerStyle={{ padding: space.xl, paddingTop: space.md, width: "100%" }}>
      <ScreenEnter style={{ width: "100%" }}>
        <View style={{ alignItems: "center", paddingVertical: space.xl }}>
          <View
            style={{
              width: 62,
              height: 62,
              borderRadius: 31,
              backgroundColor: theme.blush,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: space.md,
            }}
          >
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: 19, color: theme.blushText }}>JD</Text>
          </View>
          <Text style={{ fontSize: type.bodyLg, fontWeight: "500", color: theme.text }}>Jordan</Text>
          <Button variant="outline" size="sm" round style={{ marginTop: space.md }}>Edit profile</Button>
        </View>

        <View style={{ borderWidth: 0.5, borderColor: theme.border, borderRadius: radius.xl, overflow: "hidden" }}>
          <View style={{ padding: 13, paddingHorizontal: space.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 0.5, borderBottomColor: theme.border }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
              {darkMode ? <Moon size={15} color={theme.muted} /> : <Sun size={15} color={theme.muted} />}
              <Text style={{ fontSize: type.body, color: theme.text }}>Dark mode</Text>
            </View>
            <Toggle checked={darkMode} onChange={toggleDarkMode} label="Toggle dark mode" />
          </View>

          <View style={{ padding: 13, paddingHorizontal: space.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 0.5, borderBottomColor: theme.border }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, flex: 1 }}>
              <Bell size={15} color={theme.muted} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: type.body, color: theme.text }}>Push notifications</Text>
                <Text style={{ fontSize: type.caption, color: theme.muted, marginTop: 2 }}>Reminders, streaks, and gentle nudges</Text>
              </View>
            </View>
            <Toggle checked={pushEnabled} onChange={() => setPushEnabled((p) => !p)} label="Toggle push notifications" />
          </View>

          {ROWS.map((r, i) => {
            const Icon = r.icon;
            return (
              <Pressable
                key={r.label}
                style={{
                  padding: 13,
                  paddingHorizontal: space.lg,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: i < ROWS.length - 1 ? 0.5 : 0,
                  borderBottomColor: theme.border,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                  <Icon size={15} color={theme.muted} />
                  <Text style={{ fontSize: type.body, color: theme.text }}>{r.label}</Text>
                </View>
                <ChevronRight size={15} color={theme.muted} />
              </Pressable>
            );
          })}
        </View>
      </ScreenEnter>
    </ScrollView>
  );
}
