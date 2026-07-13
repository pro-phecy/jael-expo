import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Flame, Smile, CalendarHeart, Moon } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ScreenEnter from "../components/ScreenEnter";
import HeartbeatHeart from "../components/HeartbeatHeart";
import PopOnChange from "../components/PopOnChange";

const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

export default function HomeScreen({ streak }) {
  const { theme } = useAppTheme();
  const streakLabel = streak == null ? "…" : `${streak} day streak`;

  return (
    <ScrollView style={{ flex: 1, width: "100%" }} contentContainerStyle={{ padding: space.xl, paddingTop: space.md, width: "100%" }}>
      <ScreenEnter style={{ width: "100%" }}>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: theme.border,
            borderRadius: radius.xxl + 4,
            padding: space.xl,
            paddingBottom: space.lg,
            marginBottom: space.xl,
            backgroundColor: theme.blush,
            overflow: "hidden",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.xl }}>
            <Text style={{ fontSize: type.label - 0.5, fontWeight: "500", color: theme.accent, letterSpacing: 1, textTransform: "uppercase" }}>
              {today}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: theme.card,
                borderRadius: radius.pill,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <HeartbeatHeart size={12} color={theme.accent} />
              <Text style={{ fontSize: type.caption + 1, fontWeight: "500", color: theme.blushText }}>Forever yours</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.displayLg, color: theme.text }}>Good evening, Jordan</Text>
            <Moon size={20} color={theme.accent} fill={theme.accent} />
          </View>
          <Text style={{ fontSize: type.body, color: theme.muted, marginBottom: space.xl }}>Thinking of them, quietly, today.</Text>

          <View style={{ borderTopWidth: 0.5, borderTopColor: theme.border, paddingTop: space.lg, flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Flame size={14} color={theme.accent} />
              <PopOnChange changeKey={streakLabel}>
                <Text style={{ fontSize: type.caption + 1.5, color: theme.text }}>{streakLabel}</Text>
              </PopOnChange>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Smile size={14} color={theme.accent} />
              <Text style={{ fontSize: type.caption + 1.5, color: theme.text }}>Upbeat</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <CalendarHeart size={14} color={theme.accent} />
              <Text style={{ fontSize: type.caption + 1.5, color: theme.text }}>Thu, 4pm</Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: type.label, color: theme.muted, marginBottom: space.md, letterSpacing: 1, textTransform: "uppercase" }}>
          Daily compliment
        </Text>
        <View style={{ backgroundColor: theme.blush, borderWidth: 0.5, borderColor: theme.border, borderRadius: radius.xxl, padding: space.xxl }}>
          <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.displayXl, color: theme.accent, marginBottom: -6 }}>“</Text>
          <Text style={{ fontFamily: "Fraunces_400Regular_Italic", fontStyle: "italic", fontSize: type.title, lineHeight: 25, color: theme.blushText, marginBottom: space.lg }}>
            The way you notice small things about people is rare, and it's exactly why they feel so at ease around you.
          </Text>
          <Text style={{ fontSize: type.caption, color: theme.blushText, letterSpacing: 1, textTransform: "uppercase" }}>For you, today</Text>
        </View>

        <Text style={{ fontSize: type.label, color: theme.muted, marginTop: space.xl, marginBottom: space.md, letterSpacing: 1, textTransform: "uppercase" }}>
          Daily poem
        </Text>
        <View style={{ backgroundColor: theme.blush, borderWidth: 0.5, borderColor: theme.border, borderRadius: radius.xxl, padding: space.xxl }}>
          <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.displayXl, color: theme.accent, marginBottom: -6 }}>“</Text>
          <Text style={{ fontFamily: "Fraunces_400Regular_Italic", fontStyle: "italic", fontSize: type.title - 1, lineHeight: 26, color: theme.blushText, marginBottom: space.lg }}>
            {"You cross a room like weather changing,\nsoft and sure, and I forget\nwhat I was saying.\nSome days I love you\nlike a secret I keep\njust to have something\nonly mine."}
          </Text>
          <Text style={{ fontSize: type.caption, color: theme.blushText, letterSpacing: 1, textTransform: "uppercase" }}>An original verse, just for you</Text>
        </View>
      </ScreenEnter>
    </ScrollView>
  );
}
