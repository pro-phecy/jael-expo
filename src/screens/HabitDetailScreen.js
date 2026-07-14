import React, { useState, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ChevronLeft, ChevronRight, BarChart3, Heart } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import { useHabits } from "../context/HabitsContext";
import { dateKey, HABIT_ICONS } from "../utils/habits";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";

export default function HabitDetailScreen({ habitId, onBack, onHistory }) {
  const { theme } = useAppTheme();
  const { getHabit, toggleCompletion } = useHabits();
  const habit = getHabit(habitId);
  const [cursor, setCursor] = useState(new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells = useMemo(
    () => Array.from({ length: firstWeekday }).map(() => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1)),
    [firstWeekday, daysInMonth]
  );

  const weeklyTotals = useMemo(() => {
    if (!habit) return [];
    const weeks = [0, 0, 0, 0, 0];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (habit.completions?.[dateKey(date)]) {
        const weekIdx = Math.floor((d + firstWeekday - 1) / 7);
        weeks[weekIdx] += 1;
      }
    }
    return weeks.slice(0, Math.ceil((daysInMonth + firstWeekday) / 7));
  }, [habit, year, month, daysInMonth, firstWeekday]);
  const maxWeekly = Math.max(1, ...weeklyTotals);

  if (!habit) {
    return (
      <ScreenEnter style={{ flex: 1 }}>
        <SubHeader title="Habit" onBack={onBack} />
        <Text style={{ paddingHorizontal: space.xl, color: theme.muted }}>This habit couldn't be found.</Text>
      </ScreenEnter>
    );
  }

  const Icon = HABIT_ICONS[habit.icon] || Heart;

  return (
    <ScreenEnter style={{ flex: 1 }}>
      <SubHeader title={habit.name} onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: space.md,
            backgroundColor: theme.blush,
            borderRadius: radius.xxl,
            padding: space.lg,
            marginBottom: space.xl,
          }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.card, alignItems: "center", justifyContent: "center" }}>
            <Icon size={20} color={theme.blushText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: type.body, fontWeight: "600", color: theme.text }}>{habit.name}</Text>
            {!!habit.description && (
              <Text style={{ fontSize: type.caption + 1, color: theme.blushText, marginTop: 2 }}>{habit.description}</Text>
            )}
          </View>
        </View>

        <Card style={{ marginBottom: space.xl }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.md }}>
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.title - 1, color: theme.text }}>{monthLabel} {year}</Text>
            <View style={{ flexDirection: "row", gap: space.xs }}>
              <Button variant="plain" iconOnly size="sm" icon={ChevronLeft} onPress={() => setCursor(new Date(year, month - 1, 1))} accessibilityLabel="Previous month" />
              <Button variant="plain" iconOnly size="sm" icon={ChevronRight} onPress={() => setCursor(new Date(year, month + 1, 1))} accessibilityLabel="Next month" />
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
              <Text key={i} style={{ flex: 1, textAlign: "center", fontSize: type.caption, color: theme.muted, paddingVertical: 4 }}>{d}</Text>
            ))}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {cells.map((day, idx) => {
              if (!day) return <View key={idx} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
              const date = new Date(year, month, day);
              const isFuture = date > today;
              const done = !!habit.completions?.[dateKey(date)];
              const isToday = dateKey(date) === dateKey(today);
              return (
                <Pressable
                  key={idx}
                  disabled={isFuture}
                  onPress={() => toggleCompletion(habit.id, date)}
                  style={{
                    width: `${100 / 7}%`,
                    aspectRatio: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: done ? theme.accent : isToday ? theme.card : "transparent",
                      borderWidth: isToday && !done ? 1 : 0,
                      borderColor: theme.accent,
                      opacity: isFuture ? 0.35 : 1,
                    }}
                  >
                    <Text style={{ fontSize: type.caption + 1.5, color: done ? theme.onAccent : theme.text }}>{day}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.md }}>
          Statistics
        </Text>
        <Card style={{ marginBottom: space.xl }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 90 }}>
            {weeklyTotals.map((total, i) => (
              <View key={i} style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 14,
                    height: Math.max(4, (total / maxWeekly) * 70),
                    borderRadius: radius.sm,
                    backgroundColor: theme.accent,
                    marginBottom: space.sm,
                  }}
                />
                <Text style={{ fontSize: type.caption, color: theme.muted }}>W{i + 1}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Button variant="outline" icon={BarChart3} onPress={onHistory}>View full history</Button>
      </ScrollView>
    </ScreenEnter>
  );
}
