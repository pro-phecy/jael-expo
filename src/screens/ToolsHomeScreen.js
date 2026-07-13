import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { NotebookPen, ListChecks, Droplet, Flame, CalendarHeart, ChevronRight } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ScreenEnter from "../components/ScreenEnter";

const TOOLS = [
  { id: "Notes", label: "Notes", desc: "Quiet thoughts, kept safe", icon: NotebookPen },
  { id: "Todo", label: "To-do", desc: "Small things, done gently", icon: ListChecks },
  { id: "Water", label: "Water tracker", desc: "A sip at a time", icon: Droplet },
  { id: "Habits", label: "Habit tracker", desc: "Little rituals, weekly", icon: Flame },
  { id: "Calendar", label: "Calendar planner", desc: "Moments worth marking", icon: CalendarHeart },
];

export default function ToolsHomeScreen({ onNavigate }) {
  const { theme } = useAppTheme();
  return (
    <ScrollView contentContainerStyle={{ padding: space.xl, paddingTop: space.md }}>
      <ScreenEnter>
        <Text style={{ fontSize: type.label, letterSpacing: 1, textTransform: "uppercase", color: theme.muted, marginBottom: space.lg }}>
          Tools
        </Text>
        <View style={{ gap: space.md }}>
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Pressable
                key={t.id}
                onPress={() => onNavigate(t.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  backgroundColor: theme.card,
                  borderWidth: 0.5,
                  borderColor: theme.border,
                  borderRadius: radius.xl,
                  padding: space.lg,
                }}
              >
                <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: theme.blush, alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color={theme.blushText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: type.body, fontWeight: "500", color: theme.text }}>{t.label}</Text>
                  <Text style={{ fontSize: type.label, color: theme.muted, marginTop: 2 }}>{t.desc}</Text>
                </View>
                <ChevronRight size={16} color={theme.muted} />
              </Pressable>
            );
          })}
        </View>
      </ScreenEnter>
    </ScrollView>
  );
}
