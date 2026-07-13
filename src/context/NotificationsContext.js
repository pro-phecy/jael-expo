import React, { createContext, useContext, useState } from "react";
import { buildInitialNotifications } from "../utils/notifications";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(buildInitialNotifications);
  const [visible, setVisible] = useState(false);

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
