import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Plus, BarChart3, Moon, Heart, Check, ChevronRight } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import { useHabits } from "../context/HabitsContext";
import { weekDates, isScheduledOn, isCompletedOn, formatTime12, HABIT_ICONS } from "../utils/habits";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import PopOnChange from "../components/PopOnChange";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitsScreen({ onBack, onAdd, onStatistics, onReminders, onOpenHabit }) {
  const { theme } = useAppTheme();
  const { habits, loading, toggleCompletion } = useHabits();
  const today = new Date();
  const days = weekDates(today);

  const todaysHabits = habits
    .filter((h) => isScheduledOn(h, today))
    .slice()
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));

  return (
    <ScreenEnter style={{ flex: 1 }}>
      <SubHeader title="Habit tracker" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.xl }}>
          <Button variant="primary" icon={Plus} onPress={onAdd} style={{ flex: 1 }}>Add habit</Button>
          <Button variant="outline" iconOnly icon={BarChart3} onPress={onStatistics} accessibilityLabel="Statistics" />
          <Button variant="outline" iconOnly icon={Moon} onPress={onReminders} accessibilityLabel="Sleep reminders" />
        </View>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.md }}>
          Today's schedule
        </Text>

        {!loading && !todaysHabits.length && (
          <Text style={{ fontSize: type.body - 1, color: theme.muted, marginBottom: space.xl }}>Nothing scheduled for today yet.</Text>
        )}

        <View style={{ gap: space.md, marginBottom: space.xl }}>
          {todaysHabits.map((h, idx) => {
            const Icon = HABIT_ICONS[h.icon] || Heart;
            const done = isCompletedOn(h, today);
            return (
              <Card key={h.id} delay={idx * 60} animateIn={idx < 6} style={done ? { backgroundColor: theme.blush, borderColor: theme.blush } : undefined}>
                <Pressable onPress={() => onOpenHabit(h.id)} style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                  <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: done ? theme.card : theme.blush, alignItems: "center", justifyContent: "center" }}>
                    <Icon size={17} color={theme.blushText} />
                  </View>
                  <View style={{ flex: 1 }}>
                    {h.time && (
                      <Text style={{ fontSize: type.caption, color: done ? theme.blushText : theme.muted, marginBottom: 2 }}>
                        {formatTime12(h.time)}
                      </Text>
                    )}
                    <Text style={{ fontSize: type.body - 1, fontWeight: "500", color: theme.text }}>{h.name}</Text>
                    {!!h.description && (
                      <Text style={{ fontSize: type.caption, color: theme.muted, marginTop: 1 }} numberOfLines={1}>
                        {h.description}
                      </Text>
                    )}
                  </View>
                  <Pressable
                    onPress={() => toggleCompletion(h.id, today)}
                    accessibilityLabel={done ? `Mark ${h.name} as not done` : `Mark ${h.name} as done`}
                    hitSlop={8}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: done ? theme.accent : theme.border,
                      backgroundColor: done ? theme.accent : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PopOnChange changeKey={done}>{done ? <Check size={14} color={theme.onAccent} /> : null}</PopOnChange>
                  </Pressable>
                </Pressable>
              </Card>
            );
          })}
        </View>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.md }}>
          This week
        </Text>
        <View style={{ gap: space.lg }}>
          {habits.map((h, hIdx) => (
            <Card key={h.id} delay={hIdx * 60}>
              <Pressable onPress={() => onOpenHabit(h.id)} style={{ flexDirection: "row", alignItems: "center", marginBottom: space.md }}>
                <Text style={{ fontSize: type.body, color: theme.text, fontWeight: "500", flex: 1 }}>{h.name}</Text>
                <ChevronRight size={15} color={theme.muted} />
              </Pressable>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {days.map((d, i) => {
                  const scheduled = isScheduledOn(h, d);
                  const done = isCompletedOn(h, d);
                  return (
                    <Pressable
                      key={i}
                      disabled={!scheduled}
                      onPress={() => toggleCompletion(h.id, d)}
                      accessibilityLabel={`${DAY_LETTERS[i]}, ${h.name}`}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: done ? theme.accent : theme.border,
                        backgroundColor: done ? theme.accent : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: scheduled ? 1 : 0.35,
                      }}
                    >
                      <PopOnChange changeKey={done}>
                        <Text style={{ fontSize: type.caption, color: done ? theme.onAccent : theme.muted }}>{DAY_LETTERS[i]}</Text>
                      </PopOnChange>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ScreenEnter>
  );
}
