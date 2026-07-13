import React, { createContext, useContext, useMemo } from "react";
import { lightTheme, darkTheme } from "../theme/tokens";
import { usePersistedState } from "../hooks/usePersistedState";

const ThemeContext = createContext({ theme: lightTheme, darkMode: false, toggleDarkMode: () => {} });

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = usePersistedState("jael:dark-mode", false);
  const theme = darkMode ? darkTheme : lightTheme;
  const value = useMemo(
    () => ({ theme, darkMode, toggleDarkMode: () => setDarkMode((d) => !d) }),
    [theme, darkMode]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
