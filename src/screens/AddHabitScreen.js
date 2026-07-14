import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Target, Repeat as RepeatIcon, Clock, ChevronRight } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import { useHabits } from "../context/HabitsContext";
import { FREQUENCIES, REPEATS, formatTime12 } from "../utils/habits";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

const SUGGESTIONS = [
  { name: "Drink Water", icon: "water", description: "Rehydrate your body right after you get up." },
  { name: "Read a Book", icon: "book", description: "A few pages, just for you." },
  { name: "Workout", icon: "workout", description: "Move your body, even a little." },
];

const TIME_OPTIONS = ["06:00", "06:30", "07:00", "07:30", "08:00", "09:00", "12:00", "18:00", "20:00", "21:00", "22:00"];

function Row({ icon: Icon, label, value, onPress }) {
  const { theme } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: space.md,
        paddingVertical: space.sm,
      }}
    >
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: theme.blush, alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} color={theme.blushText} />
      </View>
      <Text style={{ fontSize: type.body - 1, fontWeight: "500", color: theme.text, flex: 1 }}>{label}</Text>
      <Text style={{ fontSize: type.body - 1, color: theme.muted }}>{value}</Text>
      <ChevronRight size={15} color={theme.muted} />
    </Pressable>
  );
}

export default function AddHabitScreen({ onDone }) {
  const { theme } = useAppTheme();
  const { addHabit } = useHabits();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("heart");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [repeat, setRepeat] = useState("Everyday");
  const [time, setTime] = useState("08:00");

  const applySuggestion = (s) => {
    setName(s.name);
    setIcon(s.icon);
    setDescription(s.description);
  };

  const cycle = (list, current, setter) => {
    const idx = list.indexOf(current);
    setter(list[(idx + 1) % list.length]);
  };

  const create = () => {
    if (!name.trim()) return;
    addHabit({ name: name.trim(), icon, description, frequency, repeat, time });
    onDone();
  };

  return (
    <ScreenEnter style={{ flex: 1 }}>
      <SubHeader title="Add new habit" onBack={onDone} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.sm }}>
          Habit name
        </Text>
        <TextInput value={name} onChangeText={setName} placeholder="e.g. Morning Meditation" style={{ marginBottom: space.md }} />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginBottom: space.xl }}>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s.name}
              onPress={() => applySuggestion(s)}
              style={{
                borderWidth: 0.5,
                borderColor: name === s.name ? theme.accent : theme.border,
                backgroundColor: name === s.name ? theme.blush : theme.card,
                borderRadius: radius.pill,
                paddingVertical: space.sm,
                paddingHorizontal: space.lg,
              }}
            >
              <Text style={{ fontSize: type.label, fontWeight: "500", color: name === s.name ? theme.blushText : theme.text }}>{s.name}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.sm }}>
          Goal
        </Text>
        <Card style={{ marginBottom: space.xl }}>
          <Row icon={Target} label="Frequency" value={frequency} onPress={() => cycle(FREQUENCIES, frequency, setFrequency)} />
          <View style={{ height: 0.5, backgroundColor: theme.border, marginVertical: space.xs }} />
          <Row icon={RepeatIcon} label="Repeat" value={repeat} onPress={() => cycle(REPEATS, repeat, setRepeat)} />
        </Card>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.sm }}>
          Reminder
        </Text>
        <Card style={{ marginBottom: space.xxl }}>
          <Row icon={Clock} label="Time" value={formatTime12(time)} onPress={() => cycle(TIME_OPTIONS, time, setTime)} />
        </Card>

        <Button variant="primary" onPress={create} disabled={!name.trim()}>Create My Habit</Button>
      </ScrollView>
    </ScreenEnter>
  );
}
