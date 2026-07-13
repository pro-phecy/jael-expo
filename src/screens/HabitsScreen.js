import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Plus } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, type } from "../theme/tokens";
import ToolScreen from "../components/ToolScreen";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import PopOnChange from "../components/PopOnChange";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitsScreen({ onBack }) {
  const { theme } = useAppTheme();
  const [habits, setHabits] = useState([
    { id: 1, name: "Send a good morning text", done: [true, true, false, true, false, false, false] },
    { id: 2, name: "Journal a thought about them", done: [true, false, false, false, false, false, false] },
  ]);
  const [draft, setDraft] = useState("");

  const toggleDay = (hid, di) =>
    setHabits(habits.map((h) => (h.id === hid ? { ...h, done: h.done.map((d, i) => (i === di ? !d : d)) } : h)));
  const addHabit = () => {
    if (!draft.trim()) return;
    setHabits([...habits, { id: Date.now(), name: draft, done: Array(7).fill(false) }]);
    setDraft("");
  };

  return (
    <ToolScreen>
      <SubHeader title="Habit tracker" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.xl }}>
          <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={addHabit} placeholder="Add a habit..." style={{ flexGrow: 1, flexBasis: 0 }} />
          <Button variant="primary" iconOnly icon={Plus} onPress={addHabit} accessibilityLabel="Add habit" />
        </View>
        <View style={{ gap: space.lg }}>
          {habits.map((h, hIdx) => (
            <Card key={h.id} delay={hIdx * 60}>
              <Text style={{ fontSize: type.body, color: theme.text, marginBottom: space.md, fontWeight: "500" }}>{h.name}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {DAYS.map((d, i) => {
                  const done = h.done[i];
                  return (
                    <Pressable
                      key={i}
                      onPress={() => toggleDay(h.id, i)}
                      accessibilityLabel={`${d}, day ${i + 1}`}
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
                      <PopOnChange changeKey={done}>
                        <Text style={{ fontSize: type.caption, color: done ? theme.onAccent : theme.muted }}>{d}</Text>
                      </PopOnChange>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ToolScreen>
  );
}
