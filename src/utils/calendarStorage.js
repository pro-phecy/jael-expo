import AsyncStorage from "@react-native-async-storage/async-storage";

const EVENTS_KEY = "jael:calendar-events";

/**
 * Guarantees every event has a unique id. Backfills ids for any events
 * saved before this field existed (or that lost one due to an earlier
 * bug), so stale AsyncStorage data can never cause React key collisions
 * on render. Runs once per load; since CalendarScreen re-saves on every
 * events change, the corrected data is written back automatically.
 */
function sanitizeEvents(events) {
  const seen = new Set();
  const next = {};
  for (const [day, list] of Object.entries(events)) {
    next[day] = (list || []).map((e, i) => {
      let id = e.id;
      if (!id || seen.has(id)) {
        id = `${day}-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      }
      seen.add(id);
      return { ...e, id };
    });
  }
  return next;
}

/**
 * Loads the stored events map ({ "year-month-day": Event[] }). Returns null
 * (rather than {}) when nothing has been saved yet, so callers can tell
 * "never saved" apart from "saved as empty" and seed sample data only once.
 * Never throws — falls back to null if storage is unavailable.
 */
export async function loadEvents() {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return sanitizeEvents(parsed);
  } catch (e) {
    return null;
  }
}

/** Persists the events map. Silently no-ops if storage is unavailable. */
export async function saveEvents(events) {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    // Keep working in-memory for this session even if persistence fails.
  }
}