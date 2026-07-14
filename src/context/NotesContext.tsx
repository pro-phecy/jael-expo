import React, { createContext, useContext, useState } from "react";

const DEFAULT_NOTES = [
  { id: 1, title: "That thing they said", body: "About the trip to the coast. Keep bringing it up casually." },
];

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(DEFAULT_NOTES);

  const addNote = (note) => setNotes((ns) => [{ id: Date.now(), ...note }, ...ns]);
  const updateNote = (id, patch) => setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  const removeNote = (id) => setNotes((ns) => ns.filter((n) => n.id !== id));

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, removeNote }}>
      {children}
    </NotesContext.Provider>
  );
}

// Falls back to inert no-op state if a screen renders before/without the provider,
// so nothing crashes — but screens should sit under <NotesProvider> to actually share data.
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (ctx) return ctx;
  return { notes: DEFAULT_NOTES, addNote: () => {}, updateNote: () => {}, removeNote: () => {} };
}