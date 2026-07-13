import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Droplet } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import PopOnChange from "../components/PopOnChange";
import { usePersistedState } from "../hooks/usePersistedState";
import { dateKey } from "../utils/streak";

export default function WaterScreen({ onBack }) {
  const { theme } = useAppTheme();
  const goal = 8;
  const today = dateKey(new Date());
  // Stored as { date, count } so a new calendar day starts back at 0
  // instead of carrying yesterday's glasses forward.
  const [waterData, setWaterData] = usePersistedState("jael:water", { date: today, count: 0 });
  const count = waterData.date === today ? waterData.count : 0;
  const setCount = (updater) => {
    setWaterData((prev) => {
      const current = prev.date === today ? prev.count : 0;
      const nextCount = typeof updater === "function" ? updater(current) : updater;
      return { date: today, count: nextCount };
    });
  };
  const pct = Math.round((Math.min(count, goal) / goal) * 100);

  return (
    <ScreenEnter style={{ flex: 1 }}>
      <SubHeader title="Water tracker" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
        <Card style={{ alignItems: "center", paddingVertical: 26 }}>
          <PopOnChange changeKey={count}>
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: 34, color: theme.blushText }}>
              {count}
              <Text style={{ fontSize: 16, color: theme.muted }}>/{goal}</Text>
            </Text>
          </PopOnChange>
          <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, marginVertical: space.sm, textTransform: "uppercase" }}>
            Glasses today
          </Text>
          <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: theme.blush, overflow: "hidden", width: "100%" }}>
            <View style={{ height: "100%", width: `${pct}%`, backgroundColor: theme.accent, borderRadius: radius.pill }} />
          </View>
        </Card>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginVertical: space.xl }}>
          {Array.from({ length: goal }).map((_, idx) => {
            const filled = idx < count;
            return (
              <Pressable
                key={idx}
                onPress={() => setCount(idx + 1 === count ? idx : idx + 1)}
                accessibilityLabel={`Glass ${idx + 1}`}
                style={{
                  width: "22%",
                  aspectRatio: 1,
                  borderRadius: radius.md,
                  borderWidth: 0.5,
                  borderColor: filled ? theme.accent : theme.border,
                  backgroundColor: filled ? theme.blush : theme.card,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PopOnChange changeKey={filled ? "filled" : "empty"}>
                  <Droplet size={16} color={filled ? theme.blushText : theme.muted} fill={filled ? theme.blushText : "none"} />
                </PopOnChange>
              </Pressable>
            );
          })}
        </View>

        <View style={{ flexDirection: "row", gap: space.md }}>
          <Button variant="outline" onPress={() => setCount(Math.max(0, count - 1))} style={{ flex: 1 }}>- One less</Button>
          <Button variant="primary" onPress={() => setCount(count + 1)} style={{ flex: 1 }}>+ Add glass</Button>
        </View>
      </ScrollView>
    </ScreenEnter>
  );
}
