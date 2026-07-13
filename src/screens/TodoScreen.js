import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Plus, Check, X } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import PopOnChange from "../components/PopOnChange";
import { usePersistedState } from "../hooks/usePersistedState";

export default function TodoScreen({ onBack }) {
  const { theme } = useAppTheme();
  const [items, setItems] = usePersistedState("jael:todos", [
    { id: 1, text: "Reply to their message", done: false },
    { id: 2, text: "Pick a coffee spot for Thursday", done: false },
    { id: 3, text: "Save that playlist idea", done: true },
  ]);
  const [draft, setDraft] = useState("");

  const add = () => {
    if (!draft.trim()) return;
    setItems([{ id: Date.now(), text: draft, done: false }, ...items]);
    setDraft("");
  };
  const toggle = (id) => setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id) => setItems(items.filter((i) => i.id !== id));
  const remaining = items.filter((i) => !i.done).length;

  return (
    <ScreenEnter style={{ flex: 1, width: "100%" }}>
      <SubHeader title="To-do" onBack={onBack} />
      <ScrollView style={{ flex: 1, width: "100%" }} contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl, width: "100%" }}>
        <Text style={{ fontSize: type.label, color: theme.muted, marginBottom: space.lg }}>{remaining} left to do</Text>
        <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.xl }}>
          <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={add} placeholder="Add a small thing..." style={{ flex: 1 }} />
          <Button variant="primary" iconOnly icon={Plus} onPress={add} accessibilityLabel="Add task" />
        </View>
        <View style={{ gap: space.sm }}>
          {items.map((i) => (
            <View
              key={i.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: space.md,
                backgroundColor: theme.card,
                borderWidth: 0.5,
                borderColor: theme.border,
                borderRadius: radius.lg,
                paddingVertical: 11,
                paddingHorizontal: space.lg,
              }}
            >
              <Pressable
                onPress={() => toggle(i.id)}
                accessibilityLabel={i.done ? "Mark incomplete" : "Mark complete"}
                style={{
                  width: 19,
                  height: 19,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: i.done ? theme.accent : theme.border,
                  backgroundColor: i.done ? theme.accent : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i.done && (
                  <PopOnChange changeKey={i.id + "-done"}>
                    <Check size={11} color="#fff" />
                  </PopOnChange>
                )}
              </Pressable>
              <Text style={{ flex: 1, fontSize: type.body, color: i.done ? theme.muted : theme.text, textDecorationLine: i.done ? "line-through" : "none" }}>
                {i.text}
              </Text>
              <Button variant="plain" size="sm" iconOnly icon={X} iconSize={14} onPress={() => remove(i.id)} accessibilityLabel="Delete task" />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenEnter>
  );
}
