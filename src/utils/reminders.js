import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "jael:sleep-reminders-v1";

export const DEFAULT_REMINDERS = {
  bedtimeEnabled: true,
  bedtime: "22:00",
  wakeupEnabled: true,
  wakeup: "06:30",
  repeatDays: [true, true, true, true, true, false, false], // S M T W T F S (starts Sunday)
};

export async function loadReminders() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_REMINDERS, ...JSON.parse(raw) };
  } catch (e) {}
  return DEFAULT_REMINDERS;
}

export async function persistReminders(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}
