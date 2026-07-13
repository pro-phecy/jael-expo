export const NOTIFICATION_ICON_KEYS = {
  compliment: "Heart",
  streak: "Flame",
  reminder: "CalendarHeart",
  water: "Droplet",
  note: "NotebookPen",
  todo: "ListChecks",
};

export function buildInitialNotifications() {
  const now = Date.now();
  const hr = 3600000;
  const day = 86400000;
  return [
    { id: 1, type: "compliment", title: "New compliment ready", message: "Today's compliment about noticing small things is ready to read.", time: new Date(now - 6 * 60000), read: false },
    { id: 2, type: "streak", title: "6 day streak", message: "You've kept the streak going for six days in a row. Keep it up.", time: new Date(now - 3 * hr), read: false },
    { id: 3, type: "reminder", title: "Plan coming up", message: "Coffee with them is coming up Thursday at 4:00pm.", time: new Date(now - 9 * hr), read: false },
    { id: 4, type: "water", title: "Halfway to your goal", message: "You've logged 4 of 8 glasses today.", time: new Date(now - 1 * day - 2 * hr), read: true },
    { id: 5, type: "note", title: "Note saved", message: "\u201cThat thing they said\u201d was added to your notes.", time: new Date(now - 3 * day), read: true },
    { id: 6, type: "todo", title: "Task completed", message: "\u201cSave that playlist idea\u201d was marked as done.", time: new Date(now - 9 * day), read: true },
  ];
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Section header a notification belongs under: Today / Yesterday / a weekday / a date.
export function dayLabel(date, now) {
  const diff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff > 1 && diff < 7) return date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// Right-aligned per-row timestamp: relative for today, short label otherwise.
export function timeLabel(date, now) {
  const diffMs = now - date;
  const diffMin = Math.round(diffMs / 60000);
  const sameDay = startOfDay(date).getTime() === startOfDay(now).getTime();
  if (sameDay) {
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    return `${Math.round(diffMin / 60)}h ago`;
  }
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
