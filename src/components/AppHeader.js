import React from "react";
import { View, Text } from "react-native";
import { Bell } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationsContext";
import { space, radius, type } from "../theme/tokens";
import Button from "./Button";
import PopOnChange from "./PopOnChange";

export default function AppHeader() {
   const { theme } = useAppTheme();
  const notifications = useNotifications();
  const unreadCount = notifications?.unreadCount ?? 0;
  const open = notifications?.open ?? (() => {});

  return (
    <View style={{ paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: type.display, color: theme.text }}>Jael</Text>
      <View>
        <Button
          variant="outline"
          iconOnly
          round
          icon={Bell}
          iconSize={15}
          onPress={open}
          accessibilityLabel={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        />
        {unreadCount > 0 && (
          <PopOnChange changeKey={unreadCount} style={{ position: "absolute", top: -3, right: -3 }}>
            <View
              style={{
                minWidth: 16,
                height: 16,
                paddingHorizontal: 4,
                borderRadius: radius.pill,
                backgroundColor: theme.accent,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: theme.bg,
              }}
            >
              <Text style={{ fontSize: 9.5, fontWeight: "600", color: theme.onAccent }}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
            </View>
          </PopOnChange>
        )}
      </View>
    </View>
  );
}
