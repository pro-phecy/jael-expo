import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { loadHabits, persistHabits, dateKey } from "../utils/habits";

const HabitsContext = createContext(null);

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadHabits().then((data) => {
      if (!cancelled) {
        setHabits(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((next) => {
    setHabits(next);
    persistHabits(next);
  }, []);

  const addHabit = useCallback(
    (data) => {
      const habit = {
        id: `h-${Date.now()}`,
        name: data.name,
        icon: data.icon || "heart",
        description: data.description || "",
        time: data.time || null,
        frequency: data.frequency || "Daily",
        repeat: data.repeat || "Everyday",
        completions: {},
      };
      update([...habits, habit]);
      return habit.id;
    },
    [habits, update]
  );

  const toggleCompletion = useCallback(
    (habitId, date = new Date()) => {
      const key = dateKey(date);
      update(
        habits.map((h) => {
          if (h.id !== habitId) return h;
          const completions = { ...(h.completions || {}) };
          if (completions[key]) delete completions[key];
          else completions[key] = true;
          return { ...h, completions };
        })
      );
    },
    [habits, update]
  );

  const getHabit = useCallback((id) => habits.find((h) => h.id === id), [habits]);

  const value = useMemo(
    () => ({ habits, loading, addHabit, toggleCompletion, getHabit }),
    [habits, loading, addHabit, toggleCompletion, getHabit]
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within a HabitsProvider");
  return ctx;
}
