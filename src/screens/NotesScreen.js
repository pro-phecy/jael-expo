import React, { useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, Animated } from "react-native";
import { Plus, Trash2, ArrowLeft, Undo2, Redo2, Check, Image as ImageIcon, Type as TypeIcon, Camera, Mic, Sparkles, ListChecks } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { useNotes } from "../context/NotesContext";
import { space, radius, type } from "../theme/tokens";
import ToolScreen from "../components/ToolScreen";
import Card from "../components/Card";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

export default function NotesScreen({ onBack }) {
  const { theme } = useAppTheme();
  const { notes, addNote, updateNote, removeNote } = useNotes();
  const [editing, setEditing] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [largeText, setLargeText] = useState(false);
  const [toast, setToast] = useState(null);

  const bodyHistory = useRef([]).current;
  const bodyFuture = useRef([]).current;
  const [historyTick, setHistoryTick] = useState(0);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const openNew = () => {
    setDraftTitle(""); setDraftBody(""); setLargeText(false);
    bodyHistory.length = 0; bodyFuture.length = 0; setHistoryTick(0);
    setEditing("new");
  };
  const openExisting = (n) => {
    setDraftTitle(n.title); setDraftBody(n.body); setLargeText(false);
    bodyHistory.length = 0; bodyFuture.length = 0; setHistoryTick(0);
    setEditing(n);
  };
  const save = () => {
    if (!draftTitle.trim() && !draftBody.trim()) { setEditing(null); return; }
    if (editing === "new") addNote({ title: draftTitle || "untitled", body: draftBody });
    else updateNote(editing.id, { title: draftTitle || "untitled", body: draftBody });
    setEditing(null);
  };
  const remove = (id) => removeNote(id);

  const updateBody = (text) => {
    bodyHistory.push(draftBody);
    if (bodyHistory.length > 50) bodyHistory.shift();
    bodyFuture.length = 0;
    setHistoryTick((t) => t + 1);
    setDraftBody(text);
  };
  const undo = () => {
    if (bodyHistory.length === 0) return;
    bodyFuture.push(draftBody);
    setDraftBody(bodyHistory.pop());
    setHistoryTick((t) => t + 1);
  };
  const redo = () => {
    if (bodyFuture.length === 0) return;
    bodyHistory.push(draftBody);
    setDraftBody(bodyFuture.pop());
    setHistoryTick((t) => t + 1);
  };
  const insertChecklistLine = () => {
    updateBody(draftBody ? draftBody.replace(/\n?$/, "") + "\n☐ " : "☐ ");
  };
  const showToast = (msg) => {
    setToast(msg);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setToast(null));
  };

  if (editing) {
    const editorHeader = (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: space.lg }}>
        <Button variant="outline" size="md" iconOnly round icon={ArrowLeft} iconSize={19} onPress={() => setEditing(null)} accessibilityLabel="Cancel" />
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
          <Button
            variant="outline"
            size="md"
            iconOnly
            round
            icon={Undo2}
            iconSize={19}
            disabled={bodyHistory.length === 0}
            onPress={undo}
            accessibilityLabel="Undo"
          />
          <Button
            variant="outline"
            size="md"
            iconOnly
            round
            icon={Redo2}
            iconSize={19}
            disabled={bodyFuture.length === 0}
            onPress={redo}
            accessibilityLabel="Redo"
          />
        </View>
        <Button variant="primary" size="md" iconOnly round icon={Check} iconSize={19} onPress={save} accessibilityLabel="Save note" />
      </View>
    );

    return (
      <ToolScreen header={editorHeader} avoidKeyboard>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }} keyboardShouldPersistTaps="handled">
          <TextInput
            value={draftTitle}
            onChangeText={setDraftTitle}
            placeholder="Title"
            style={{ borderWidth: 0, paddingHorizontal: 0, fontFamily: "Fraunces_400Regular", fontSize: type.display, marginBottom: space.md, backgroundColor: "transparent" }}
          />
          <TextInput
            value={draftBody}
            onChangeText={updateBody}
            placeholder="Write something..."
            multiline
            numberOfLines={10}
            style={{
              borderWidth: 0,
              paddingHorizontal: 0,
              fontSize: largeText ? type.bodyLg : type.body,
              lineHeight: largeText ? 24 : 22,
              minHeight: 220,
              textAlignVertical: "top",
              backgroundColor: "transparent",
            }}
          />
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingVertical: space.md,
            paddingHorizontal: space.lg,
            borderTopWidth: 0.5,
            borderTopColor: theme.border,
            backgroundColor: theme.bg,
          }}
        >
          <Button variant="plain" size="sm" iconOnly icon={ImageIcon} iconSize={18} onPress={() => showToast("Photos coming soon")} accessibilityLabel="Add image" />
          <Button
            variant={largeText ? "subtle" : "plain"}
            size="sm"
            iconOnly
            icon={TypeIcon}
            iconSize={18}
            onPress={() => setLargeText((v) => !v)}
            accessibilityLabel="Toggle large text"
          />
          <Button variant="plain" size="sm" iconOnly icon={Camera} iconSize={18} onPress={() => showToast("Camera coming soon")} accessibilityLabel="Add photo from camera" />
          <Button variant="plain" size="sm" iconOnly icon={Mic} iconSize={18} onPress={() => showToast("Dictation coming soon")} accessibilityLabel="Dictate note" />
          <Button variant="plain" size="sm" iconOnly icon={Sparkles} iconSize={18} onPress={() => showToast("Assist coming soon")} accessibilityLabel="AI assist" />
          <Button variant="plain" size="sm" iconOnly icon={ListChecks} iconSize={18} onPress={insertChecklistLine} accessibilityLabel="Add checklist item" />
        </View>

        {toast && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              alignSelf: "center",
              bottom: 64,
              opacity: toastOpacity,
              backgroundColor: theme.card,
              borderWidth: 0.5,
              borderColor: theme.border,
              borderRadius: radius.pill,
              paddingVertical: space.sm,
              paddingHorizontal: space.lg,
            }}
          >
            <Text style={{ fontSize: type.caption + 1, color: theme.muted }}>{toast}</Text>
          </Animated.View>
        )}
      </ToolScreen>
    );
  }

  return (
    <ToolScreen title="Notes" onBack={onBack}>
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