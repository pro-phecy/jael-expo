import React, { useState, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ChevronLeft, ChevronRight, CalendarHeart, Clock, Plus } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function formatTime(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")}${period}`;
}

export default function CalendarScreen({ onBack }) {
  const { theme } = useAppTheme();
  const [cursor, setCursor] = useState(new Date(2026, 2, 1)); // March 2026
  const [selected, setSelected] = useState(13);
  const [events, setEvents] = useState({
    "2026-2-13": [{ text: "Coffee", time: "16:00" }],
    "2026-2-21": [{ text: "Their birthday", time: "" }],
  });
  const [draft, setDraft] = useState("");
  const [draftTime, setDraftTime] = useState("");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const selectedKey = `${year}-${month}-${selected}`;

  const cells = useMemo(
    () => Array.from({ length: firstWeekday }).map(() => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1)),
    [firstWeekday, daysInMonth]
  );

  const changeMonth = (delta) => {
    setCursor(new Date(year, month + delta, 1));
    setSelected(1);
  };

  const addEvent = () => {
    if (!draft.trim()) return;
    const next = [...(events[selectedKey] || []), { text: draft, time: draftTime }].sort((a, b) =>
      (a.time || "99:99").localeCompare(b.time || "99:99")
    );
    setEvents({ ...events, [selectedKey]: next });
    setDraft("");
    setDraftTime("");
  };

  return (
    <ScreenEnter style={{ flex: 1 }}>
      <SubHeader title="Calendar planner" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.md }}>
          <Button variant="plain" iconOnly size="sm" icon={ChevronLeft} onPress={() => changeMonth(-1)} accessibilityLabel="Previous month" />
          <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.title - 1, color: theme.text }}>{monthLabel} {year}</Text>
          <Button variant="plain" iconOnly size="sm" icon={ChevronRight} onPress={() => changeMonth(1)} accessibilityLabel="Next month" />
        </View>

        <View style={{ flexDirection: "row" }}>
          {WEEKDAYS.map((d, i) => (
            <Text key={i} style={{ flex: 1, textAlign: "center", fontSize: type.caption, color: theme.muted, paddingVertical: 4 }}>{d}</Text>
          ))}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: space.xl }}>
          {cells.map((day, idx) => {
            const hasEvents = day && events[`${year}-${month}-${day}`];
            const isSelected = day === selected;
            return (
              <Pressable
                key={idx}
                disabled={!day}
                onPress={() => day && setSelected(day)}
                style={{
                  width: `${100 / 7}%`,
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: radius.md,
                  backgroundColor: isSelected ? theme.accent : hasEvents ? theme.blush : "transparent",
                  opacity: day ? 1 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: type.caption + 1.5,
                    color: isSelected ? theme.onAccent : hasEvents ? theme.blushText : theme.text,
                    fontWeight: hasEvents ? "500" : "400",
                  }}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.md }}>
          {monthLabel} {selected}
        </Text>
        <View style={{ gap: space.sm, marginBottom: space.lg }}>
          {(events[selectedKey] || []).map((e, i) => (
            <Card key={i} delay={i * 50} style={{ flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: space.md, paddingHorizontal: space.lg }}>
              <CalendarHeart size={14} color={theme.blushText} />
              <Text style={{ fontSize: type.body - 1, color: theme.text, flex: 1 }}>{e.text}</Text>
              {formatTime(e.time) && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Clock size={12} color={theme.muted} />
                  <Text style={{ fontSize: type.caption, color: theme.muted }}>{formatTime(e.time)}</Text>
                </View>
              )}
            </Card>
          ))}
          {!(events[selectedKey] || []).length && (
            <Text style={{ fontSize: type.body - 1, color: theme.muted }}>Nothing planned yet</Text>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: space.sm }}>
          <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={addEvent} placeholder="Add a plan for this day..." style={{ flex: 1 }} />
          <TextInput value={draftTime} onChangeText={setDraftTime} placeholder="16:00" style={{ width: 76 }} />
          <Button variant="primary" iconOnly icon={Plus} onPress={addEvent} accessibilityLabel="Add event" />
        </View>
      </ScrollView>
    </ScreenEnter>
  );
}
