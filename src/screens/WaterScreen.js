import React, { useState, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { Droplet, Settings2, Trash2, Plus, X } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { space, radius, type } from "../theme/tokens";
import ScreenEnter from "../components/ScreenEnter";
import SubHeader from "../components/SubHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Toggle from "../components/Toggle";
import PopOnChange from "../components/PopOnChange";

const DANGER = "#C24E4E";
const DANGER_TINT = "rgba(194,78,78,0.12)";

const DEFAULT_QUICK_ADDS = [
  { id: "small", label: "Small", ml: 150, custom: false },
  { id: "glass", label: "Glass", ml: 250, custom: false },
  { id: "bottle", label: "Bottle", ml: 500, custom: false },
];

function formatVolume(ml, unit) {
  if (unit === "l") {
    const l = ml / 1000;
    return `${l % 1 === 0 ? l.toFixed(0) : l.toFixed(2)} L`;
  }
  return `${Math.round(ml)} mL`;
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function PillToggle({ options, value, onChange, theme }) {
  return (
    <View style={{ flexDirection: "row", backgroundColor: theme.blush, borderRadius: radius.pill, padding: 3 }}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={{
            paddingVertical: 6,
            paddingHorizontal: space.lg,
            borderRadius: radius.pill,
            backgroundColor: value === opt.value ? theme.card : "transparent",
          }}
        >
          <Text style={{ fontSize: type.label, fontWeight: "600", color: value === opt.value ? theme.blushText : theme.muted }}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ProgressRing({ pct, size = 148, strokeWidth = 13, color, trackColor, children }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(pct, 100) / 100);
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>{children}</View>
    </View>
  );
}

// A visibly-tappable delete control: tinted circular background + red icon,
// rather than a bare icon, so it reads unmistakably as a destructive button
// instead of decoration.
function DeleteDot({ onPress, label, size = 26, iconSize = 13 }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityLabel={label}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: DANGER_TINT,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Trash2 size={iconSize} color={DANGER} />
    </Pressable>
  );
}

function PresetChip({ label, ml, onPress, onDelete, theme }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: theme.border,
        backgroundColor: theme.card,
        borderRadius: radius.pill,
        paddingLeft: space.md,
        paddingRight: onDelete ? 4 : space.md,
        paddingVertical: 8,
      }}
    >
      <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Droplet size={13} color={theme.accent} />
        <Text style={{ fontSize: type.label, color: theme.text }} numberOfLines={1}>
          {label}
        </Text>
        <Text style={{ fontSize: type.caption, color: theme.muted }}>{ml}mL</Text>
      </Pressable>
      {onDelete && (
        <Pressable
          onPress={onDelete}
          hitSlop={8}
          accessibilityLabel={`Remove ${label} preset`}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            marginLeft: 6,
            backgroundColor: DANGER_TINT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={11} color={DANGER} />
        </Pressable>
      )}
    </View>
  );
}

export default function WaterScreen({ onBack }) {
  const { theme } = useAppTheme();

  const [entries, setEntries] = useState([
    { id: "seed-1", ml: 250, time: Date.now() - 1000 * 60 * 60 * 3 },
    { id: "seed-2", ml: 500, time: Date.now() - 1000 * 60 * 60 },
  ]);
  const [presets, setPresets] = useState([]);
  const [goalMl, setGoalMl] = useState(2000);

  const [displayUnit, setDisplayUnit] = useState("l");
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("2");

  const [customOpen, setCustomOpen] = useState(false);
  const [customDraft, setCustomDraft] = useState("");
  const [customUnit, setCustomUnit] = useState("ml");
  const [saveAsPreset, setSaveAsPreset] = useState(false);
  const [presetName, setPresetName] = useState("");

  const consumedMl = useMemo(() => entries.reduce((sum, e) => sum + e.ml, 0), [entries]);
  const pct = Math.round((Math.min(consumedMl, goalMl) / goalMl) * 100);
  const sortedEntries = useMemo(() => entries.slice().sort((a, b) => b.time - a.time), [entries]);
  const chips = useMemo(() => [...DEFAULT_QUICK_ADDS, ...presets], [presets]);

  const statusText =
    consumedMl >= goalMl ? "Goal reached \u2014 nicely hydrated" : pct >= 50 ? "Halfway there, keep going" : "Keep it going";

  const addEntry = (ml) => {
    if (!ml || ml <= 0) return;
    setEntries((prev) => [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ml, time: Date.now() }, ...prev]);
  };

  const removeEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const removePreset = (id) => setPresets((prev) => prev.filter((p) => p.id !== id));

  const openGoalEditor = () => {
    setGoalDraft(displayUnit === "l" ? String(goalMl / 1000) : String(goalMl));
    setEditingGoal(true);
    setCustomOpen(false);
  };

  const cancelGoalEdit = () => setEditingGoal(false);

  const saveGoal = () => {
    const parsed = parseFloat(goalDraft.replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      setGoalMl(displayUnit === "l" ? Math.round(parsed * 1000) : Math.round(parsed));
    }
    setEditingGoal(false);
  };

  const changeDisplayUnit = (nextUnit) => {
    if (editingGoal) {
      const parsed = parseFloat(goalDraft.replace(",", "."));
      if (Number.isFinite(parsed)) {
        const ml = displayUnit === "l" ? parsed * 1000 : parsed;
        setGoalDraft(nextUnit === "l" ? String(ml / 1000) : String(Math.round(ml)));
      }
    }
    setDisplayUnit(nextUnit);
  };

  const openCustom = () => {
    setCustomOpen(true);
    setEditingGoal(false);
  };

  const cancelCustom = () => {
    setCustomDraft("");
    setPresetName("");
    setSaveAsPreset(false);
    setCustomOpen(false);
  };

  const submitCustom = () => {
    const parsed = parseFloat(customDraft.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      cancelCustom();
      return;
    }
    const ml = customUnit === "l" ? Math.round(parsed * 1000) : Math.round(parsed);
    addEntry(ml);
    if (saveAsPreset) {
      const label = presetName.trim() || formatVolume(ml, "ml");
      setPresets((prev) => [...prev, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label, ml, custom: true }]);
    }
    cancelCustom();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top", "left", "right"]}>
      <ScreenEnter style={{ flex: 1 }}>
        <SubHeader title="Water tracker" onBack={onBack} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xxl }}>
          <Card style={{ alignItems: "center", paddingVertical: space.xl }}>
            <ProgressRing pct={pct} color={theme.accent} trackColor={theme.blush}>
              <PopOnChange changeKey={consumedMl}>
                <Droplet size={26} color={theme.accent} fill={theme.accent} />
              </PopOnChange>
              <Text style={{ fontFamily: "Fraunces_400Regular", fontSize: 26, color: theme.text, marginTop: 4 }}>{pct}%</Text>
            </ProgressRing>

            <Text style={{ fontSize: type.body, color: theme.text, marginTop: space.md, fontWeight: "500" }}>{statusText}</Text>
            <Text style={{ fontSize: type.caption, color: theme.muted, marginTop: 2 }}>
              {formatVolume(consumedMl, displayUnit)} of {formatVolume(goalMl, displayUnit)}
            </Text>

            {!editingGoal && (
              <Button
                variant="outline"
                size="sm"
                icon={Settings2}
                onPress={openGoalEditor}
                style={{ marginTop: space.md }}
              >
                Edit goal
              </Button>
            )}
          </Card>

          {editingGoal && (
            <Card style={{ marginTop: space.md, borderColor: theme.accent, borderWidth: 1 }}>
              <Text style={{ fontSize: type.label, color: theme.muted, marginBottom: space.sm, textTransform: "uppercase", letterSpacing: 1 }}>
                Daily goal
              </Text>
              <View style={{ flexDirection: "row", gap: space.sm, alignItems: "center" }}>
                <TextInput
                  value={goalDraft}
                  onChangeText={setGoalDraft}
                  keyboardType="decimal-pad"
                  placeholder={displayUnit === "l" ? "2" : "2000"}
                  autoFocus
                  style={{ flex: 1 }}
                />
                <PillToggle
                  theme={theme}
                  value={displayUnit}
                  onChange={changeDisplayUnit}
                  options={[
                    { value: "l", label: "L" },
                    { value: "ml", label: "mL" },
                  ]}
                />
              </View>
              <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
                <Button variant="plain" onPress={cancelGoalEdit} style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button variant="primary" onPress={saveGoal} style={{ flex: 1 }}>
                  Save goal
                </Button>
              </View>
            </Card>
          )}

          <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: space.xl, marginBottom: space.sm }}>
            Log a drink
          </Text>
          <View style={{ flexDirection: "row", gap: space.sm, flexWrap: "wrap" }}>
            {chips.map((c) => (
              <PresetChip
                key={c.id}
                label={c.label}
                ml={c.ml}
                theme={theme}
                onPress={() => addEntry(c.ml)}
                onDelete={c.custom ? () => removePreset(c.id) : null}
              />
            ))}
            {!customOpen && (
              <Pressable
                onPress={openCustom}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: theme.accent,
                  backgroundColor: "transparent",
                  borderRadius: radius.pill,
                  paddingVertical: 8,
                  paddingHorizontal: space.md,
                }}
              >
                <Plus size={13} color={theme.accent} />
                <Text style={{ fontSize: type.label, color: theme.accent, fontWeight: "600" }}>Custom</Text>
              </Pressable>
            )}
          </View>
          {presets.length === 0 && (
            <Text style={{ fontSize: type.caption, color: theme.muted, marginTop: space.sm }}>
              Tip: tap "Custom" to log any amount \u2014 and save it as a preset for one-tap logging next time.
            </Text>
          )}

          {customOpen && (
            <Card style={{ marginTop: space.md, borderColor: theme.accent, borderWidth: 1 }}>
              <Text style={{ fontSize: type.label, color: theme.muted, marginBottom: space.sm, textTransform: "uppercase", letterSpacing: 1 }}>
                Custom amount
              </Text>
              <View style={{ flexDirection: "row", gap: space.sm, alignItems: "center" }}>
                <TextInput
                  value={customDraft}
                  onChangeText={setCustomDraft}
                  keyboardType="decimal-pad"
                  placeholder={customUnit === "l" ? "0.3" : "300"}
                  autoFocus
                  style={{ flex: 1 }}
                />
                <PillToggle
                  theme={theme}
                  value={customUnit}
                  onChange={setCustomUnit}
                  options={[
                    { value: "ml", label: "mL" },
                    { value: "l", label: "L" },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: space.lg,
                  backgroundColor: theme.blush,
                  borderRadius: radius.md,
                  paddingVertical: space.sm,
                  paddingHorizontal: space.md,
                }}
              >
                <View style={{ flex: 1, marginRight: space.sm }}>
                  <Text style={{ fontSize: type.body, color: theme.text, fontWeight: "500" }}>Save as a preset</Text>
                  <Text style={{ fontSize: type.caption, color: theme.muted, marginTop: 2 }}>
                    Adds a reusable chip above for next time
                  </Text>
                </View>
                <Toggle checked={saveAsPreset} onChange={() => setSaveAsPreset((v) => !v)} label="Save as a preset" />
              </View>

              {saveAsPreset && (
                <TextInput
                  value={presetName}
                  onChangeText={setPresetName}
                  placeholder="Name it, e.g. Coffee mug"
                  autoFocus
                  style={{ marginTop: space.sm }}
                />
              )}

              <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
                <Button variant="plain" onPress={cancelCustom} style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button variant="primary" onPress={submitCustom} style={{ flex: 1 }}>
                  {saveAsPreset ? "Save & add" : "Add"}
                </Button>
              </View>
            </Card>
          )}

          <Text style={{ fontSize: type.label, color: theme.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: space.xl, marginBottom: space.sm }}>
            Today's log
          </Text>
          {sortedEntries.length > 0 && (
            <Text style={{ fontSize: type.caption, color: theme.muted, marginBottom: space.sm }}>
              Tap the trash icon to remove an entry.
            </Text>
          )}
          <View style={{ gap: space.sm }}>
            {sortedEntries.map((e) => (
              <Card key={e.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: space.md, paddingHorizontal: space.lg }}>
                <Droplet size={14} color={theme.accent} fill={theme.accent} />
                <Text style={{ flex: 1, fontSize: type.body - 1, color: theme.text, marginLeft: space.sm }}>{formatVolume(e.ml, "ml")}</Text>
                <Text style={{ fontSize: type.caption, color: theme.muted, marginRight: space.sm }}>{formatTime(e.time)}</Text>
                <DeleteDot onPress={() => removeEntry(e.id)} label="Remove entry" />
              </Card>
            ))}
            {!sortedEntries.length && (
              <Text style={{ fontSize: type.body - 1, color: theme.muted, textAlign: "center", marginTop: space.md }}>
                Nothing logged yet today
              </Text>
            )}
          </View>
        </ScrollView>
      </ScreenEnter>
    </SafeAreaView>
  );
}