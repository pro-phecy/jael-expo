import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ToolScreen from "../components/ToolScreen";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import EventEditor from "../components/EventEditor";
import { loadEvents, saveEvents } from "../utils/calendarStorage";
import { DEFAULT_EVENT_COLOR } from "../utils/eventColors";
import {
  WEEKDAYS,
  monthCells,
  dateKey,
  keyToDate,
  isSameDay,
  addMonths,
  startOfDay,
  formatTime,
  timeToMinutes,
  formatMonthYear,
  formatDayHeader,
  formatAgendaHeader,
} from "../utils/calendarDate";

function seedEvents(today) {
  const in3 = new Date(today);
  in3.setDate(in3.getDate() + 3);
  const in7 = new Date(today);
  in7.setDate(in7.getDate() + 7);
  return {
    [dateKey(today)]: [
      { id: "seed-1", title: "Coffee", allDay: false, start: "16:00", end: "17:00", color: DEFAULT_EVENT_COLOR, notes: "" },
    ],
    [dateKey(in3)]: [
      { id: "seed-2", title: "Their birthday", allDay: true, start: "", end: "", color: "#8A5FBF", notes: "Don't forget a card" },
    ],
    [dateKey(in7)]: [
      { id: "seed-3", title: "Dinner reservation", allDay: false, start: "19:30", end: "21:00", color: "#4C7EA8", notes: "" },
    ],
  };
}

function sortDayEvents(list) {
  return list.slice().sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    return timeToMinutes(a.start) - timeToMinutes(b.start);
  });
}

function EventCard({ event, delay, onPress }) {
  const { theme } = useAppTheme();
  const range = [formatTime(event.start), formatTime(event.end)].filter(Boolean).join(" \u2013 ");
  const timeLabel = event.allDay ? "All day" : range || null;

  return (
    <Pressable onPress={onPress}>
      <Card delay={delay} style={{ flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: space.md, paddingHorizontal: space.lg }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: event.color || DEFAULT_EVENT_COLOR }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: type.body - 1, color: theme.text, fontWeight: "500" }}>{event.title}</Text>
          {!!event.notes && (
            <Text style={{ fontSize: type.caption, color: theme.muted, marginTop: 2 }} numberOfLines={1}>
              {event.notes}
            </Text>
          )}
        </View>
        {timeLabel && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {!event.allDay && <Clock size={12} color={theme.muted} />}
            <Text style={{ fontSize: type.caption, color: theme.muted }}>{timeLabel}</Text>
          </View>
        )}
      </Card>
    </Pressable>
  );
}

export default function CalendarScreen({ onBack }) {
  const { theme } = useAppTheme();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);
  const [events, setEvents] = useState({});
  const [view, setView] = useState("month");
  const [editor, setEditor] = useState({ visible: false, initial: null, forDate: today });
  const loadedRef = useRef(false);

  useEffect(() => {
    (async () => {
      const stored = await loadEvents();
      if (stored) {
        setEvents(stored);
      } else {
        const seed = seedEvents(today);
        setEvents(seed);
        saveEvents(seed);
      }
      loadedRef.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    saveEvents(events);
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthCells(year, month), [year, month]);
  const selectedKey = dateKey(selected);
  const selectedEvents = useMemo(() => sortDayEvents(events[selectedKey] || []), [events, selectedKey]);

  const agendaGroups = useMemo(() => {
    const keys = Object.keys(events).filter((k) => (events[k] || []).length > 0);
    keys.sort((a, b) => keyToDate(a) - keyToDate(b));
    return keys.map((k) => ({ key: k, date: keyToDate(k), events: sortDayEvents(events[k] || []) }));
  }, [events]);

  const changeMonth = (delta) => setCursor((c) => addMonths(c, delta));
  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  };

  const openNew = () => setEditor({ visible: true, initial: null, forDate: selected });
  const openEdit = (forDate, event) => setEditor({ visible: true, initial: event, forDate });
  const closeEditor = () => setEditor((e) => ({ ...e, visible: false }));

  const saveEvent = (draft) => {
    const key = dateKey(editor.forDate);
    setEvents((prev) => {
      const list = prev[key] || [];
      const exists = editor.initial && list.some((e) => e.id === editor.initial.id);
      const next = exists
        ? list.map((e) => (e.id === editor.initial.id ? { ...e, ...draft } : e))
        : [...list, { ...draft, id: `${Date.now()}` }];
      return { ...prev, [key]: next };
    });
    closeEditor();
  };

  const deleteEvent = () => {
    if (!editor.initial) return;
    const key = dateKey(editor.forDate);
    setEvents((prev) => ({ ...prev, [key]: (prev[key] || []).filter((e) => e.id !== editor.initial.id) }));
    closeEditor();
  };

  return (
    <ToolScreen>
      <SubHeader title="Calendar planner" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.lg }}>
          <View style={{ flexDirection: "row", backgroundColor: theme.blush, borderRadius: radius.pill, padding: 3 }}>
            {["month", "agenda"].map((v) => (
              <Pressable
                key={v}
                onPress={() => setView(v)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: space.lg,
                  borderRadius: radius.pill,
                  backgroundColor: view === v ? theme.card : "transparent",
                }}
              >
                <Text style={{ fontSize: type.label, fontWeight: "600", color: view === v ? theme.blushText : theme.muted }}>
                  {v === "month" ? "Month" : "Agenda"}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Button variant="outline" size="sm" onPress={goToday}>Today</Button>
            <Button variant="primary" iconOnly size="sm" icon={Plus} onPress={openNew} accessibilityLabel="Add event" />
          </View>
        </View>

        {view === "month" && (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.md }}>
              <Button variant="plain" iconOnly size="sm" icon={ChevronLeft} onPress={() => changeMonth(-1)} accessibilityLabel="Previous month" />
              <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.title - 1, color: theme.text }}>{formatMonthYear(cursor)}</Text>
              <Button variant="plain" iconOnly size="sm" icon={ChevronRight} onPress={() => changeMonth(1)} accessibilityLabel="Next month" />
            </View>

            <View style={{ flexDirection: "row" }}>
              {WEEKDAYS.map((d, i) => (
                <Text key={i} style={{ flex: 1, textAlign: "center", fontSize: type.caption, color: theme.muted, paddingVertical: 4 }}>{d}</Text>
              ))}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: space.xl }}>
              {cells.map((day, idx) => {
                if (!day) return <View key={idx} style={{ width: `${100 / 7}%`, aspectRatio: 0.85 }} />;

                const cellDate = new Date(year, month, day);
                const dayEvents = events[dateKey(cellDate)] || [];
                const isSelected = isSameDay(cellDate, selected);
                const isToday = isSameDay(cellDate, today);

                return (
                  <Pressable
                    key={idx}
                    onPress={() => setSelected(cellDate)}
                    style={{ width: `${100 / 7}%`, aspectRatio: 0.85, alignItems: "center", justifyContent: "center", paddingVertical: 4 }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: radius.pill,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isSelected ? theme.accent : "transparent",
                        borderWidth: isToday && !isSelected ? 1.5 : 0,
                        borderColor: theme.accent,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: type.caption + 1.5,
                          fontWeight: isToday || isSelected ? "600" : "400",
                          color: isSelected ? theme.onAccent : isToday ? theme.accent : theme.text,
                        }}
                      >
                        {day}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 3, marginTop: 4, height: 5 }}>
                      {dayEvents.slice(0, 3).map((e, i) => (
                        <View key={e.id ?? i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: e.color || DEFAULT_EVENT_COLOR }} />
                      ))}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.md }}>
              {formatDayHeader(selected, today)}
            </Text>
            <View style={{ gap: space.sm }}>
              {selectedEvents.map((e, i) => (
                <EventCard key={e.id ?? `${selectedKey}-${i}`} event={e} delay={i * 50} onPress={() => openEdit(selected, e)} />
              ))}
              {!selectedEvents.length && <Text style={{ fontSize: type.body - 1, color: theme.muted }}>Nothing planned yet</Text>}
            </View>
          </>
        )}

        {view === "agenda" && (
          <View style={{ gap: space.lg }}>
            {!agendaGroups.length && (
              <Text style={{ fontSize: type.body - 1, color: theme.muted, textAlign: "center", marginTop: space.xxl }}>
                No events yet. Tap + to add one.
              </Text>
            )}
            {agendaGroups.map((group) => (
              <View key={group.key}>
                <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.sm }}>
                  {formatAgendaHeader(group.date, today)}
                </Text>
                <View style={{ gap: space.sm }}>
                  {group.events.map((e, i) => (
                    <EventCard key={e.id ?? `${group.key}-${i}`} event={e} delay={i * 40} onPress={() => openEdit(group.date, e)} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <EventEditor
        visible={editor.visible}
        dayLabel={formatDayHeader(editor.forDate, today)}
        initial={editor.initial}
        onClose={closeEditor}
        onSave={saveEvent}
        onDelete={editor.initial ? deleteEvent : null}
      />
    </ToolScreen>
  );
}