import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Svg, { Polyline, Polygon, Circle } from "react-native-svg";
import { PieChart, Flame } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import { useHabits } from "../context/HabitsContext";
import { weeklyTrend, monthlyTrend, yearlyTrend, completionRate, longestStreak } from "../utils/habits";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";

const TABS = ["Weekly", "Monthly", "Yearly"];
const CHART_W = 280;
const CHART_H = 130;
const PAD = 16;

export default function HabitHistoryScreen({ habitId, onBack }) {
  const { theme } = useAppTheme();
  const { getHabit } = useHabits();
  const habit = getHabit(habitId);
  const [tab, setTab] = useState("Monthly");

  const points = useMemo(() => {
    if (!habit) return [];
    if (tab === "Weekly") return weeklyTrend(habit);
    if (tab === "Yearly") return yearlyTrend(habit, 6);
    return monthlyTrend(habit, 4);
  }, [habit, tab]);

  if (!habit) {
    return (
      <ScreenEnter style={{ flex: 1 }}>
        <SubHeader title="Habit history" onBack={onBack} />
        <Text style={{ paddingHorizontal: space.xl, color: theme.muted }}>This habit couldn't be found.</Text>
      </ScreenEnter>
    );
  }

  const n = points.length;
  const stepX = n > 1 ? (CHART_W - PAD * 2) / (n - 1) : 0;
  const coords = points.map((p, i) => {
    const x = PAD + i * stepX;
    const y = PAD + (1 - p.pct / 100) * (CHART_H - PAD * 2);
    return { x, y, ...p };
  });
  const lineStr = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaStr = `${PAD},${CHART_H - PAD} ${lineStr} ${CHART_W - PAD},${CHART_H - PAD}`;

  const completion = completionRate(habit, 30);
  const streak = longestStreak(habit);

  return (
    <ScreenEnter style={{ flex: 1 }}>
      <SubHeader title="Habit history" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <View style={{ flexDirection: "row", backgroundColor: theme.card, borderWidth: 0.5, borderColor: theme.border, borderRadius: radius.xl, padding: 4, marginBottom: space.xl }}>
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={{
                flex: 1,
                paddingVertical: space.sm + 2,
                borderRadius: radius.lg,
                alignItems: "center",
                backgroundColor: tab === t ? theme.text : "transparent",
              }}
            >
              <Text style={{ fontSize: type.label, fontWeight: "600", color: tab === t ? theme.bg : theme.muted }}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Card style={{ marginBottom: space.xl }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.lg }}>
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.title - 1, color: theme.text }}>Trends</Text>
            <Text style={{ fontSize: type.caption + 1, color: theme.muted }}>{habit.name}</Text>
          </View>
          <Svg width="100%" height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
            <Polygon points={areaStr} fill={theme.blush} opacity={0.7} />
            <Polyline points={lineStr} fill="none" stroke={theme.text} strokeWidth={2} />
            {coords.map((c, i) => (
              <Circle key={i} cx={c.x} cy={c.y} r={3.5} fill={theme.card} stroke={theme.text} strokeWidth={2} />
            ))}
          </Svg>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
            {points.map((p, i) => (
              <Text key={i} style={{ fontSize: type.caption, color: theme.muted, flex: 1, textAlign: "center" }}>{p.label}</Text>
            ))}
          </View>
        </Card>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.md }}>
          Your progress
        </Text>
        <View style={{ flexDirection: "row", gap: space.md }}>
          <Card style={{ flex: 1, backgroundColor: theme.blush, borderColor: theme.blush }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: theme.card, alignItems: "center", justifyContent: "center", marginBottom: space.md }}>
              <PieChart size={16} color={theme.blushText} />
            </View>
            <Text style={{ fontSize: type.caption + 1, color: theme.blushText, marginBottom: 2 }}>Completion</Text>
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.displayLg - 4, color: theme.text }}>{completion}%</Text>
          </Card>
          <Card style={{ flex: 1 }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: theme.blush, alignItems: "center", justifyContent: "center", marginBottom: space.md }}>
              <Flame size={16} color={theme.blushText} />
            </View>
            <Text style={{ fontSize: type.caption + 1, color: theme.muted, marginBottom: 2 }}>Longest Streak</Text>
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.displayLg - 4, color: theme.text }}>{streak} Days</Text>
          </Card>
        </View>
      </ScrollView>
    </ScreenEnter>
  );
}
