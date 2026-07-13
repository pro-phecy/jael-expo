# Jael (Expo Router)

A native rebuild of the Jael app - a relationship-companion app with daily
compliments/poems, a streak-tracked home screen, five small tools (Notes,
To-do, Water tracker, Habit tracker, Calendar planner), a Profile screen with
dark mode, and a notifications panel.

Routing is file-based via **Expo Router** (the current standard for new Expo
apps), rather than manually wired React Navigation navigators.

## Setup

```bash
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR
code with Expo Go on a physical device.

## Route structure

```
app/
  _layout.js                  - root layout: fonts, providers, notifications overlay
  (tabs)/
    _layout.js                 - bottom tab bar (custom sliding-pill TabBar)
    index.js                   - Home tab
    profile.js                 - Profile tab
    tools/
      _layout.js                - nested stack for the Tools tab
      index.js                  - Tools hub (routes to the 5 tools below)
      notes.js
      todo.js
      water.js
      habits.js
      calendar.js
```

Each route file is a thin wrapper: it imports the real screen component from
`src/screens/`, and passes Expo Router's `useRouter()` down as plain
`onBack` / `onNavigate` callback props. The screen components themselves
don't know or care which router is driving them.

```
src/
  theme/tokens.js               - spacing, radius, type scale, light/dark colors
  context/ThemeContext.js       - dark mode state
  context/NotificationsContext.js - notification list + unread state
  components/                   - Card, Button, Toggle, TextInput, SubHeader,
                                   AppHeader, TopLevelScreen, NotificationsPanel,
                                   animation helpers (ScreenEnter, PopOnChange,
                                   HeartbeatHeart)
  screens/                      - Home, ToolsHome, Notes, Todo, Water, Habits,
                                   Calendar, Profile (routing-agnostic - take
                                   onBack/onNavigate props)
  navigation/TabBar.js          - custom animated tab bar used by (tabs)/_layout.js
  hooks/useStreak.js            - reads/writes the persisted streak
  utils/streak.js               - AsyncStorage streak logic
  utils/notifications.js        - notification seed data + date formatting
```

## What changed in this restructure

- Replaced the hand-wired `RootNavigator` / `ToolsStack` (React Navigation
  `createBottomTabNavigator` / `createNativeStackNavigator` called directly)
  with file-based routes under `app/`. Expo Router still uses React
  Navigation under the hood, so the custom `TabBar` component carries over
  unchanged - only the route-name keys changed to match file names
  (`index`, `tools`, `profile`).
  screen also matches its file name (`notes`, `todo`, `water`, `habits`,
  `calendar`).
- Screens no longer receive a `navigation` prop; they take `onBack` and
  `onNavigate` callbacks instead, so the screen code has zero router
  dependency and would work the same under any navigation library.
- `App.js` is gone - `app/_layout.js` is now the entry point (wired via
  `"main": "expo-router/entry"` in `package.json`).
- Deep linking comes for free with this structure: e.g. a link to
  `jael:///tools/water` opens the Water tracker directly.

## Notes on scope

Like the original, only the streak counter persists across app restarts -
notes, to-dos, habits, water count, and calendar events live in memory for
the session.

The Calendar screen's event-time field is a plain `HH:MM` text input, since
React Native has no built-in equivalent to the web's
`<input type="time">`. Swap in `@react-native-community/datetimepicker` for
a native picker if you want one.
