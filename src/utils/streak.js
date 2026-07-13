import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "jael:streak-data";

export function dateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Reads the stored streak record, updates it against "today," persists
 * the result, and returns { streak, totalVisits }. A "day" is the
 * device's local calendar day. Opening the app again on the same day
 * doesn't change the streak; opening it the day right after extends it;
 * skipping a day resets it to 1. Falls back to a fresh in-memory streak
 * (without crashing) if storage is unavailable.
 */
export async function recordVisitAndGetStreak() {
  const today = dateKey(new Date());
  const yesterday = dateKey(new Date(Date.now() - 86400000));

  let existing = null;
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    if (raw) existing = JSON.parse(raw);
  } catch (e) {
    existing = null;
  }

  let next;
  if (!existing) {
    next = { streak: 1, totalVisits: 1, lastVisit: today };
  } else if (existing.lastVisit === today) {
    next = { ...existing, totalVisits: (existing.totalVisits || 0) + 1 };
  } else if (existing.lastVisit === yesterday) {
    next = { streak: (existing.streak || 0) + 1, totalVisits: (existing.totalVisits || 0) + 1, lastVisit: today };
  } else {
    next = { streak: 1, totalVisits: (existing.totalVisits || 0) + 1, lastVisit: today };
  }

  try {
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(next));
  } catch (e) {
    // If persistence fails, still return the computed value for this session.
  }

  return next;
}
