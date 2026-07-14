import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ChevronRight, Heart } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import { useHabits } from "../context/HabitsContext";
import { overallCompletionRate, weeklyProgress, completionRate, HABIT_ICONS } from "../utils/habits";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";

function CompletionRing({ pct, size = 92 }) {
  const { theme } = useAppTheme();
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (c * pct) / 100;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme.blush} strokeWidth={stroke} fill="none" />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={theme.accent}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        rotation={-90}
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}

export default function HabitStatisticsScreen({ onBack, onOpenHabit }) {
  const { theme } = useAppTheme();
  const { habits } = useHabits();
  const overall = overallCompletionRate(habits, 30);
  const week = weeklyProgress(habits);
  const maxPct = 100;

  return (
    <ScreenEnter style={{ flex: 1 }}>
      <SubHeader title="Statistics" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <Card style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.xl }}>
          <View>
            <Text style={{ fontSize: type.body - 1, fontWeight: "600", color: theme.text, marginBottom: 2 }}>Completion Rate</Text>
            <Text style={{ fontSize: type.caption + 1, color: theme.muted, marginBottom: space.md }}>Last 30 days</Text>
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.displayLg, color: theme.blushText }}>{overall}%</Text>
          </View>
          <CompletionRing pct={overall} />
        </Card>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.md }}>
          Weekly progress
        </Text>
        <Card style={{ marginBottom: space.xl }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 100 }}>
            {week.map((d, i) => (
              <View key={i} style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 14,
                    height: Math.max(4, (d.pct / maxPct) * 76),
                    borderRadius: radius.sm,
                    backgroundColor: d.disabled ? theme.border : d.pct > 0 ? theme.accent : theme.blush,
                    marginBottom: space.sm,
                  }}
                />
                <Text style={{ fontSize: type.caption, color: theme.muted }}>{d.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.md }}>
          Habit performance
        </Text>
        <View style={{ gap: space.md }}>
          {habits.map((h, idx) => {
            const Icon = HABIT_ICONS[h.icon] || Heart;
            const pct = completionRate(h, 30);
            return (
              <Pressable key={h.id} onPress={() => onOpenHabit(h.id)}>
                <Card
                  delay={idx * 50}
                  style={{ flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: space.md }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: theme.blush, alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={theme.blushText} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: type.body - 1, fontWeight: "500", color: theme.text }}>{h.name}</Text>
                    <Text style={{ fontSize: type.caption + 1, color: theme.muted, marginTop: 1 }}>{pct}% Complete</Text>
                  </View>
                  <ChevronRight size={15} color={theme.muted} />
                </Card>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ScreenEnter>
  );
}
