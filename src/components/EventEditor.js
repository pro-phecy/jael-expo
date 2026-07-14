import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Modal, Animated, KeyboardAvoidingView, Platform } from "react-native";
import { X, Trash2 } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import { EVENT_COLORS, DEFAULT_EVENT_COLOR } from "../utils/eventColors";
import Button from "./Button";
import TextInput from "./TextInput";
import Toggle from "./Toggle";

const emptyDraft = { title: "", allDay: false, start: "", end: "", color: DEFAULT_EVENT_COLOR, notes: "" };

export default function EventEditor({ visible, dayLabel, initial, onClose, onSave, onDelete }) {
  const { theme } = useAppTheme();
  const [draft, setDraft] = useState(emptyDraft);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      setDraft(initial ? { ...emptyDraft, ...initial } : emptyDraft);
      opacity.setValue(0);
      translateY.setValue(20);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, initial]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    if (!draft.title.trim()) return;
    onSave({ ...draft, title: draft.title.trim(), start: draft.allDay ? "" : draft.start, end: draft.allDay ? "" : draft.end });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(20,14,13,0.4)", justifyContent: "flex-end" }} onPress={onClose}>
          <Animated.View
            onStartShouldSetResponder={() => true}
            style={{
              opacity,
              transform: [{ translateY }],
              backgroundColor: theme.bg,
              borderTopLeftRadius: radius.xxl + 6,
              borderTopRightRadius: radius.xxl + 6,
              borderWidth: 0.5,
              borderColor: theme.border,
              borderBottomWidth: 0,
              maxHeight: "88%",
              paddingTop: space.lg,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.xl, paddingBottom: space.md }}>
              <View>
                <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.title, color: theme.text }}>
                  {initial ? "Edit event" : "New event"}
                </Text>
                {!!dayLabel && <Text style={{ fontSize: type.label, color: theme.muted, marginTop: 2 }}>{dayLabel}</Text>}
              </View>
              <Button variant="outline" iconOnly round size="sm" icon={X} onPress={onClose} accessibilityLabel="Close" />
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xl, gap: space.lg }} keyboardShouldPersistTaps="handled">
              <TextInput
                value={draft.title}
                onChangeText={(v) => set({ title: v })}
                placeholder="Event title"
                autoFocus
                style={{ fontSize: type.bodyLg }}
              />

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: type.body, color: theme.text }}>All day</Text>
                <Toggle checked={draft.allDay} onChange={() => set({ allDay: !draft.allDay })} label="All day event" />
              </View>

              {!draft.allDay && (
                <View style={{ flexDirection: "row", gap: space.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: type.label, color: theme.muted, marginBottom: space.xs }}>Starts</Text>
                    <TextInput value={draft.start} onChangeText={(v) => set({ start: v })} placeholder="9:00" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: type.label, color: theme.muted, marginBottom: space.xs }}>Ends</Text>
                    <TextInput value={draft.end} onChangeText={(v) => set({ end: v })} placeholder="10:00" />
                  </View>
                </View>
              )}

              <View>
                <Text style={{ fontSize: type.label, color: theme.muted, marginBottom: space.sm }}>Color</Text>
                <View style={{ flexDirection: "row", gap: space.md }}>
                  {EVENT_COLORS.map((c) => (
                    <Pressable
                      key={c.key}
                      onPress={() => set({ color: c.value })}
                      accessibilityLabel={`${c.key} color`}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: radius.pill,
                        backgroundColor: c.value,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: draft.color === c.value ? 2.5 : 0,
                        borderColor: theme.text,
                      }}
                    />
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: type.label, color: theme.muted, marginBottom: space.xs }}>Notes</Text>
                <TextInput
                  value={draft.notes}
                  onChangeText={(v) => set({ notes: v })}
                  placeholder="Add notes (optional)"
                  multiline
                  numberOfLines={3}
                  style={{ minHeight: 72, textAlignVertical: "top" }}
                />
              </View>

              <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.sm }}>
                {onDelete && (
                  <Button
                    variant="plain"
                    icon={Trash2}
                    iconSize={14}
                    onPress={onDelete}
                    textStyle={{ color: "#C24E4E" }}
                    style={{ backgroundColor: "transparent" }}
                  >
                    Delete
                  </Button>
                )}
                <View style={{ flex: 1 }} />
                <Button variant="primary" onPress={save} disabled={!draft.title.trim()}>Save</Button>
              </View>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}