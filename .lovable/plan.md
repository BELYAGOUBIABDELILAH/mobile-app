

## Bottom Nav Bar + App Header Upgrade

Two files to edit: `BottomNavBar.tsx` and `MobileHomeScreen.tsx` (the header is inside the home screen greeting section, not in `MobileStatusBar.tsx`).

---

### 1. Bottom Navigation Bar (`src/components/layout/BottomNavBar.tsx`)

**Visual redesign:**
- Frosted glass: `bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl` with a soft `shadow-[0_-2px_20px_rgba(0,0,0,0.06)]` top shadow (no border)
- Active tab: pill background (`bg-primary/10 rounded-2xl px-3 py-1.5`), filled icon via `strokeWidth={2.5}`, bold label in `text-primary` (#3B82F6), icon size 24px (`h-6 w-6`)
- Inactive tab: outline icon `strokeWidth={1.5}`, `text-gray-400`, smaller label `text-[10px]`
- Gap between icon and label: `gap-1` (4px)
- Tap target: min `min-w-[48px] min-h-[48px]`
- Tap feedback: `active:scale-90 transition-transform duration-150`

**Badges:**
- "IA Chat" tab: red notification dot (`w-2 h-2 bg-red-500 rounded-full absolute -top-0.5 -right-0.5`)
- "Carte" tab: pulsing green dot when location is active (use `useUserLocation` hook to check `location !== null`), with `animate-pulse`

**Imports to add:** `useUserLocation` from hooks

---

### 2. App Header in Home Screen (`src/components/homepage/MobileHomeScreen.tsx`)

**Greeting section redesign (section 1):**
- Dynamic greeting: compute based on current hour — "Bonjour" (6-12), "Bon après-midi" (12-18), "Bonsoir" (18+)
- Subtitle: "Bienvenue sur CityHealth" → smaller `text-[11px] text-gray-500 italic`
- Name: larger `text-2xl font-extrabold`, user name wrapped in gradient text `bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent`
- Add fade-in animation on greeting via existing `fadeUp` variant

**Avatar:**
- Size increased to `h-11 w-11` (44px)
- Colored ring: `ring-2 ring-emerald-400` for online status, add `shadow-lg`
- Click navigates to `/profile` (not `/settings`)
- If user is "Visiteur" (no auth): show a "Se connecter" pill button (`bg-primary text-white rounded-full px-4 py-2 text-xs font-semibold`) instead of the avatar

**Notification bell:**
- Add a `Bell` icon between greeting and avatar
- Positioned with a badge count circle
- Click navigates to notifications panel (or `/settings` as fallback)
- Use `useNotifications` hook for `unreadCount`

**Background strip:** Add a subtle gradient `bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20` behind the entire header section via a wrapper div with `-mx-4 px-4 py-3 rounded-b-3xl`

---

### Files Changed
- `src/components/layout/BottomNavBar.tsx` — full redesign
- `src/components/homepage/MobileHomeScreen.tsx` — header/greeting section only

