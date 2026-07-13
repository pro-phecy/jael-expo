import { useEffect, useState } from "react";
import { recordVisitAndGetStreak } from "../utils/streak";

/**
 * Records this app open once and returns the persisted streak count.
 * Returns null until the async storage read/write resolves.
 */
export function useStreak() {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    let cancelled = false;
    recordVisitAndGetStreak().then((data) => {
      if (!cancelled) setStreak(data.streak);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return streak;
}
