import React, { useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Modal, Animated, Dimensions } from "react-native";
import { X, Bell, Heart, Flame, CalendarHeart, Droplet, NotebookPen, ListChecks } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import Button from "./Button";
import { dayLabel, timeLabel } from "../utils/notifications";

const ICONS = { compliment: Heart, streak: Flame, reminder: CalendarHeart, water: Droplet, note: NotebookPen, todo: ListChecks };

export default function NotificationsPanel({ visible, notifications, onClose, onMarkRead, onMarkAllRead }) {
  const { theme } = useAppTheme();
  const now = new Date();
  const translateY = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(-30);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const sections = [];
  const sorted = [...notifications].sort((a, b) => b.time - a.time);
  for (const n of sorted) {
    const label = dayLabel(n.time, now);
    let section = sections.find((s) => s.label === label);
    if (!section) { section = { label, items: [] }; sections.push(section); }
    section.items.push(n);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(20,14,13,0.35)" }} onPress={onClose}>
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
            backgroundColor: theme.bg,
            borderBottomLeftRadius: radius.xxl + 6,
            borderBottomRightRadius: radius.xxl + 6,
            borderWidth: 0.5,
            borderColor: theme.border,
            borderTopWidth: 0,
            maxHeight: "78%",
            paddingTop: 44,
          }}
          onStartShouldSetResponder={() => true}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.xl, paddingBottom: space.md }}>
            <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.title, color: theme.text }}>Notifications</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              {notifications.some((n) => !n.read) && (
                <Button variant="plain" size="sm" onPress={onMarkAllRead}>Mark all read</Button>
              )}
              <Button variant="outline" iconOnly round size="sm" icon={X} onPress={onClose} accessibilityLabel="Close notifications" />
            </View>
          </View>

          <ScrollView style={{ paddingHorizontal: space.xl }}>
            {sections.length === 0 && (
              <View style={{ alignItems: "center", paddingVertical: space.xxl * 2 }}>
                <Heart size={22} color={theme.accent} fill={theme.accent} style={{ marginBottom: space.md }} />
                <Text style={{ fontSize: type.body, color: theme.muted }}>You're all caught up</Text>
              </View>
            )}
            {sections.map((section) => (
              <View key={section.label} style={{ marginBottom: space.lg }}>
                <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: space.sm }}>
                  {section.label}
                </Text>
                <View style={{ gap: space.sm }}>
                  {section.items.map((n) => {
                    const Icon = ICONS[n.type] || Bell;
                    return (
                      <Pressable
                        key={n.id}
                        onPress={() => onMarkRead(n.id)}
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          gap: space.md,
                          backgroundColor: n.read ? theme.card : theme.blush,
                          borderWidth: 0.5,
                          borderColor: theme.border,
                          borderRadius: radius.lg,
                          padding: space.md,
                          paddingHorizontal: space.lg,
                        }}
                      >
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.card, alignItems: "center", justifyContent: "center" }}>
                          <Icon size={14} color={theme.blushText} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space.sm }}>
                            <Text style={{ fontSize: type.body, fontWeight: n.read ? "500" : "600", color: theme.text, flex: 1 }}>{n.title}</Text>
                            <Text style={{ fontSize: type.caption, color: theme.muted }}>{timeLabel(n.time, now)}</Text>
                          </View>
                          <Text style={{ fontSize: type.label, color: theme.muted, marginTop: 3, lineHeight: 16 }}>{n.message}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
