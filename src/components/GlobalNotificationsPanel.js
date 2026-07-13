import React from "react";
import { useNotifications } from "../context/NotificationsContext";
import NotificationsPanel from "./NotificationsPanel";

/**
 * Mounted once at the app root (see app/_layout.js). NotificationsPanel
 * itself is presentational — this component is the only place that reads
 * from NotificationsContext and hands it props, so the bell in AppHeader
 * (which calls notifications.open()) actually has something to open.
 */
export default function GlobalNotificationsPanel() {
  const notifications = useNotifications();
  if (!notifications) return null; // defensive: renders nothing if used outside the provider

  const { notifications: list, visible, close, markRead, markAllRead } = notifications;

  return (
    <NotificationsPanel
      visible={visible}
      notifications={list}
      onClose={close}
      onMarkRead={markRead}
      onMarkAllRead={markAllRead}
    />
  );
}
