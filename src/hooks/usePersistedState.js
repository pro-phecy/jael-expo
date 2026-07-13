import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Drop-in replacement for useState that mirrors its value to AsyncStorage,
 * so data survives an app restart instead of resetting to mock defaults.
 *
 * - Reads the stored value once on mount (async — `hydrated` flips to
 *   true once that read finishes, whether or not anything was found).
 * - Writes the value back to storage whenever it changes, debounced so
 *   fast updates (e.g. typing in a note) don't hit AsyncStorage on every
 *   keystroke.
 * - Never throws: a missing key, corrupted JSON, or a storage error all
 *   just fall back to `initialValue` instead of crashing the screen.
 *
 * @param {string} key            Namespaced AsyncStorage key, e.g. "jael:notes"
 * @param {*} initialValue        Used until the stored value loads, and if nothing is stored yet
 * @param {object} [options]
 * @param {number} [options.debounceMs=300]   delay before persisting a change
 * @param {(v:any)=>string} [options.serialize]     defaults to JSON.stringify
 * @param {(raw:string)=>any} [options.deserialize] defaults to JSON.parse
 * @returns {[value, setValue, { hydrated: boolean }]}
 */
export function usePersistedState(key, initialValue, options = {}) {
  const {
    debounceMs = 300,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const writeTimer = useRef(null);

  // Load once on mount.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (cancelled || raw == null) return;
        try {
          setValue(deserialize(raw));
        } catch (e) {
          // Corrupted or unexpected data — keep initialValue rather than crash.
        }
      })
      .catch(() => {
        // Storage unavailable — keep initialValue for this session.
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist on every change, but only after the initial read has happened
  // (otherwise we'd briefly overwrite stored data with initialValue).
  useEffect(() => {
    if (!hydrated) return;
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      AsyncStorage.setItem(key, serialize(value)).catch(() => {
        // If a write fails, the in-memory value is still correct for this session.
      });
    }, debounceMs);
    return () => clearTimeout(writeTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, hydrated]);

  return [value, setValue, { hydrated }];
}
