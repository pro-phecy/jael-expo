// A small fixed palette so event colors look consistent in both light and
// dark mode (unlike theme.accent, these don't flip with the theme).
export const EVENT_COLORS = [
  { key: "pink", value: "#C8577A" },
  { key: "blue", value: "#4C7EA8" },
  { key: "green", value: "#5B8A72" },
  { key: "amber", value: "#B98A3D" },
  { key: "purple", value: "#8A5FBF" },
];

export const DEFAULT_EVENT_COLOR = EVENT_COLORS[0].value;