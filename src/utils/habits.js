import AsyncStorage from "@react-native-async-storage/async-storage";
import { Heart, Droplet, BookOpen, Dumbbell, Moon, NotebookPen } from "lucide-react-native";

const STORAGE_KEY = "jael:habits-data-v1";

export const ICONS = ["heart", "water", "book", "workout", "moon", "note"];
export const HABIT_ICONS = { heart: Heart, water: Droplet, book: BookOpen, workout: Dumbbell, moon: Moon, note: NotebookPen };

export const FREQUENCIES = ["Daily", "Weekly", "3x / week"];
export const REPEATS = ["Everyday", "Weekdays", "Weekends"];

export function dateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function formatTime12(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

// Monday-first week containing `date`.
export function weekDates(date = new Date()) {
  const d = new Date(date);
  const dow = d.getDay(); // 0 = Sun
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

// Whether `habit` is scheduled to happen on `date`, based on its repeat rule.
export function isScheduledOn(habit, date) {
  const dow = date.getDay(); // 0 Sun ... 6 Sat
  if (habit.repeat === "Weekdays") return dow >= 1 && dow <= 5;
  if (habit.repeat === "Weekends") return dow === 0 || dow === 6;
  return true; // Everyday
}

export function isCompletedOn(habit, date) {
  return !!habit.completions?.[dateKey(date)];
}

// Completion % over the last `days` scheduled occurrences.
export function completionRate(habit, days = 30) {
  const today = new Date();
  let scheduled = 0;
  let done = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (!isScheduledOn(habit, d)) continue;
    scheduled++;
    if (isCompletedOn(habit, d)) done++;
  }
  if (!scheduled) return 0;
  return Math.round((done / scheduled) * 100);
}

export function overallCompletionRate(habits, days = 30) {
  if (!habits.length) return 0;
  const rates = habits.map((h) => completionRate(h, days));
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
}

// [{ label: 'Mon', pct }] across all habits, for the current (or given) week.
export function weeklyProgress(habits, refDate = new Date()) {
  const days = weekDates(refDate);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d, i) => {
    const scheduled = habits.filter((h) => isScheduledOn(h, d));
    const done = scheduled.filter((h) => isCompletedOn(h, d));
    const pct = scheduled.length ? Math.round((done.length / scheduled.length) * 100) : 0;
    const isFuture = d > new Date();
    return { label: labels[i], pct: isFuture ? 0 : pct, date: d, disabled: isFuture };
  });
}

export function longestStreak(habit) {
  const dates = Object.keys(habit.completions || {})
    .filter((k) => habit.completions[k])
    .map((k) => {
      const [y, m, day] = k.split("-").map(Number);
      return new Date(y, m - 1, day).getTime();
    })
    .sort((a, b) => a - b);
  if (!dates.length) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const diffDays = Math.round((dates[i] - dates[i - 1]) / 86400000);
    if (diffDays === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }
  return longest;
}

// Weekly buckets (last N weeks) of completion % for a single habit - used by history "Monthly" view.
export function monthlyTrend(habit, weeks = 4) {
  const today = new Date();
  const buckets = [];
  for (let w = weeks - 1; w >= 0; w--) {
    let scheduled = 0;
    let done = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - w * 7 - i);
      if (!isScheduledOn(habit, d)) continue;
      scheduled++;
      if (isCompletedOn(habit, d)) done++;
    }
    buckets.push({ label: `Week ${weeks - w}`, pct: scheduled ? Math.round((done / scheduled) * 100) : 0 });
  }
  return buckets;
}

export function weeklyTrend(habit) {
  return weeklyProgress([habit]).map((d) => ({ label: d.label, pct: isCompletedOn(habit, d.date) ? 100 : 0 }));
}

export function yearlyTrend(habit, months = 6) {
  const today = new Date();
  const buckets = [];
  for (let m = months - 1; m >= 0; m--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    let scheduled = 0;
    let done = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      if (d > today) continue;
      if (!isScheduledOn(habit, d)) continue;
      scheduled++;
      if (isCompletedOn(habit, d)) done++;
    }
    buckets.push({ label: monthDate.toLocaleDateString("en-US", { month: "short" }), pct: scheduled ? Math.round((done / scheduled) * 100) : 0 });
  }
  return buckets;
}

const DEFAULT_HABITS = () => {
  const today = new Date();
  const mkCompletions = (offsets) => {
    const map = {};
    offsets.forEach((o) => {
      const d = new Date(today);
      d.setDate(today.getDate() - o);
      map[dateKey(d)] = true;
    });
    return map;
  };
  return [
    {
      id: "seed-water",
      name: "Drink Water",
      icon: "water",
      description: "Rehydrate your body right after you get up.",
      time: "06:30",
      frequency: "Daily",
      repeat: "Everyday",
      completions: mkCompletions([0, 1, 3, 4, 6, 7, 9]),
    },
    {
      id: "seed-text",
      name: "Send a good morning text",
      icon: "heart",
      description: "A small hello that starts their day warm.",
      time: "07:30",
      frequency: "Daily",
      repeat: "Everyday",
      completions: mkCompletions([0, 1, 3]),
    },
    {
      id: "seed-journal",
      name: "Journal a thought about them",
      icon: "note",
      description: "Keep the little moments from slipping away.",
      time: "21:00",
      frequency: "Weekly",
      repeat: "Everyday",
      completions: mkCompletions([0]),
    },
  ];
};

export async function loadHabits() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fall through to defaults
  }
  const seeded = DEFAULT_HABITS();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch (e) {}
  return seeded;
}

export async function persistHabits(habits) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    // best-effort persistence
  }
}
