

## Bottom Nav Bar — Floating Design + Avatar Tab

Rewrite `src/components/layout/BottomNavBar.tsx` with two changes:

### 1. Floating Style
- Add `mx-4 mb-2` margin to the inner container so the bar floats above the screen edge
- Apply `rounded-2xl` to the bar itself
- Keep backdrop-blur and shadow, enhance shadow slightly

### 2. Replace Settings Tab with Profile Avatar
- Import `useAuth` from `@/contexts/AuthContext`
- Replace the last tab (Settings/gear) with a profile tab: `key: 'profile'`, `label: 'Profil'`, `path: '/citizen/profile'`
- For this tab, instead of rendering an `Icon`, render:
  - If `profile?.avatar_url` exists: `<img>` (32px circle, `object-cover`)
  - Else: initials circle (gray bg, white text, first letter of `profile?.full_name` or `user?.email`)
- Active state: add `ring-2 ring-[#1D4ED8] ring-offset-1` around the avatar
- Keep all other tabs rendering their icons normally

### File Changed
- `src/components/layout/BottomNavBar.tsx`

