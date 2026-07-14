import AsyncStorage from "@react-native-async-storage/async-storage";

const EVENTS_KEY = "jael:calendar-events";

/**
 * Loads the stored events map ({ "year-month-day": Event[] }). Returns null
 * (rather than {}) when nothing has been saved yet, so callers can tell
 * "never saved" apart from "saved as empty" and seed sample data only once.
 * Never throws — falls back to null if storage is unavailable.
 */
export async function loadEvents() {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : null;
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