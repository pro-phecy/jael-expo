import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Plus, Trash2 } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ToolScreen from "../components/ToolScreen";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

export default function NotesScreen({ onBack }) {
  const { theme } = useAppTheme();
  const [notes, setNotes] = useState([
    { id: 1, title: "That thing they said", body: "About the trip to the coast. Keep bringing it up casually." },
  ]);
  const [editing, setEditing] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const openNew = () => { setDraftTitle(""); setDraftBody(""); setEditing("new"); };
  const openExisting = (n) => { setDraftTitle(n.title); setDraftBody(n.body); setEditing(n); };
  const save = () => {
    if (!draftTitle.trim() && !draftBody.trim()) { setEditing(null); return; }
    if (editing === "new") setNotes([{ id: Date.now(), title: draftTitle || "untitled", body: draftBody }, ...notes]);
    else setNotes(notes.map((n) => (n.id === editing.id ? { ...n, title: draftTitle || "untitled", body: draftBody } : n)));
    setEditing(null);
  };
  const remove = (id) => setNotes(notes.filter((n) => n.id !== id));

  if (editing) {
    return (
      <ToolScreen>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.xl, paddingBottom: space.lg }}>
          <Button variant="plain" size="sm" onPress={() => setEditing(null)}>Cancel</Button>
          <Button variant="ghost" size="sm" onPress={save}>Save</Button>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
          <TextInput
            value={draftTitle}
            onChangeText={setDraftTitle}
            placeholder="Title"
            style={{ borderWidth: 0, paddingHorizontal: 0, fontFamily: "Fraunces_400Regular", fontSize: type.display, marginBottom: space.md, backgroundColor: "transparent" }}
          />
          <TextInput
            value={draftBody}
            onChangeText={setDraftBody}
            placeholder="Write something..."
            multiline
            numberOfLines={10}
            style={{ borderWidth: 0, paddingHorizontal: 0, fontSize: type.body, lineHeight: 22, minHeight: 220, textAlignVertical: "top", backgroundColor: "transparent" }}
          />
        </ScrollView>
      </ToolScreen>
    );
  }

  return (
    <ToolScreen>
      <SubHeader title="Notes" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl, gap: space.md }}>
        <Button variant="dashed" icon={Plus} onPress={openNew}>New note</Button>
        {notes.map((n, idx) => (
          <Card key={n.id} delay={idx * 45}>
            <Pressable onPress={() => openExisting(n)}>
              <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.bodyLg, color: theme.text, marginBottom: 4 }}>{n.title}</Text>
              <Text numberOfLines={1} style={{ fontSize: type.body - 1, color: theme.muted }}>{n.body || "Empty note"}</Text>
            </Pressable>
            <View style={{ alignItems: "flex-end", marginTop: space.sm }}>
              <Button variant="plain" size="sm" iconOnly icon={Trash2} iconSize={13} onPress={() => remove(n.id)} accessibilityLabel="Delete note" />
            </View>
          </Card>
        ))}
        {notes.length === 0 && (
          <Text style={{ fontSize: type.body, color: theme.muted, textAlign: "center", marginTop: 20 }}>Nothing written yet</Text>
        )}
      </ScrollView>
    </ToolScreen>
  );
}
