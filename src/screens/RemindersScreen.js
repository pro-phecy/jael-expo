import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Moon } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import { loadReminders, persistReminders } from "../utils/reminders";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import Toggle from "../components/Toggle";
import { formatTime12 } from "../utils/habits";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const TIME_OPTIONS_BED = ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];
const TIME_OPTIONS_WAKE = ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00"];

export default function RemindersScreen({ onBack }) {
  const { theme } = useAppTheme();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadReminders().then(setData);
  }, []);

  if (!data) {
    return (
      <ScreenEnter style={{ flex: 1 }}>
        <SubHeader title="Reminders" onBack={onBack} />
      </ScreenEnter>
    );
  }

  const update = (patch) => setData({ ...data, ...patch });
  const toggleDay = (i) => {
    const next = data.repeatDays.slice();
    next[i] = !next[i];
    update({ repeatDays: next });
  };
  const cycleTime = (options, current, key) => {
    const idx = options.indexOf(current);
    update({ [key]: options[(idx + 1) % options.length] });
  };
  const save = async () => {
    await persistReminders(data);
    onBack();
  };

  return (
    <ScreenEnter style={{ flex: 1 }}>
      <SubHeader title="Reminders" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl, alignItems: "center" }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.blush, alignItems: "center", justifyContent: "center", marginBottom: space.lg }}>
          <Moon size={28} color={theme.blushText} />
        </View>
        <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.displayLg - 4, color: theme.text, marginBottom: 4 }}>Bedtime & Wakeup</Text>
        <Text style={{ fontSize: type.body - 1, color: theme.muted, marginBottom: space.xl, textAlign: "center" }}>
          Set your sleep and wake-up schedule
        </Text>

        <Card style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.md }}>
          <Pressable onPress={() => cycleTime(TIME_OPTIONS_BED, data.bedtime, "bedtime")} style={{ flex: 1 }}>
            <Text style={{ fontSize: type.body - 1, fontWeight: "600", color: theme.text, marginBottom: 2 }}>Bedtime Reminder</Text>
            <Text style={{ fontSize: type.caption + 1, color: theme.muted }}>{formatTime12(data.bedtime)}</Text>
          </Pressable>
          <Toggle checked={data.bedtimeEnabled} onChange={() => update({ bedtimeEnabled: !data.bedtimeEnabled })} label="Bedtime reminder" />
        </Card>

        <Card style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.xl }}>
          <Pressable onPress={() => cycleTime(TIME_OPTIONS_WAKE, data.wakeup, "wakeup")} style={{ flex: 1 }}>
            <Text style={{ fontSize: type.body - 1, fontWeight: "600", color: theme.text, marginBottom: 2 }}>Wake-up Reminder</Text>
            <Text style={{ fontSize: type.caption + 1, color: theme.muted }}>{formatTime12(data.wakeup)}</Text>
          </Pressable>
          <Toggle checked={data.wakeupEnabled} onChange={() => update({ wakeupEnabled: !data.wakeupEnabled })} label="Wake-up reminder" />
        </Card>

        <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-start", marginBottom: space.md }}>
          Repeat on
        </Text>
        <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.xxl, alignSelf: "flex-start" }}>
          {DAY_LETTERS.map((d, i) => {
            const on = data.repeatDays[i];
            return (
              <Pressable
                key={i}
                onPress={() => toggleDay(i)}
                accessibilityLabel={`Repeat on day ${i + 1}`}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: on ? theme.text : "transparent",
                  borderWidth: on ? 0 : 0.5,
                  borderColor: theme.border,
                }}
              >
                <Text style={{ fontSize: type.label, fontWeight: "600", color: on ? theme.bg : theme.muted }}>{d}</Text>
              </Pressable>
            );
          })}
        </View>

        <Button variant="primary" onPress={save} style={{ width: "100%" }}>Save Changes</Button>
      </ScrollView>
    </ScreenEnter>
  );
}
