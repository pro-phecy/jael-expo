import React, { createContext, useContext, useState } from "react";
import { buildInitialNotifications } from "../utils/notifications";
import { usePersistedState } from "../hooks/usePersistedState";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  // `time` is a Date, which JSON.stringify turns into an ISO string —
  // the custom deserialize below turns it back into a real Date on load.
  const [notifications, setNotifications] = usePersistedState(
    "jael:notifications",
    buildInitialNotifications(),
    {
      deserialize: (raw) => JSON.parse(raw).map((n) => ({ ...n, time: new Date(n.time) })),
    }
  );
  const [visible, setVisible] = useState(false); // panel open/closed is UI-only, not persisted

  const markRead = (id) => setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, visible, open: () => setVisible(true), close: () => setVisible(false), markRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
