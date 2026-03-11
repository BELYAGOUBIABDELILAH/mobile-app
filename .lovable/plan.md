

# Plan: Native Android Experience — Status Bar, Pull-to-Refresh, GPS Permission, Floating Notifications

## Overview
Four enhancements to make the app feel like a native Android app: integrated status bar, pull-to-refresh, GPS permission on launch, and floating push notifications.

---

## 1. Android Status Bar Integration

**File: `src/components/layout/MobileStatusBar.tsx`**
- Add a faux Android status bar with time, signal, wifi, battery icons
- Use `bg-primary` (blue) background to blend with app header
- Show current time (updating every minute)

**File: `index.html`**
- Change `theme-color` meta tag to match the primary color so Android Chrome blends the status bar

---

## 2. Pull-to-Refresh

**File: `src/hooks/usePullToRefresh.ts`** (new)
- Custom hook using touch events (`touchstart`, `touchmove`, `touchend`)
- Tracks vertical swipe distance when `scrollY === 0`
- Shows a spinner indicator, triggers `window.location.reload()` on threshold (80px)

**File: `src/components/layout/MobileAppShell.tsx`**
- Integrate `usePullToRefresh` hook
- Render pull indicator (spinning loader) above `<Outlet />`

---

## 3. GPS Permission on App Launch

**File: `src/components/layout/MobileAppShell.tsx`**
- On mount, call `useUserLocation().requestLocation()` to trigger the browser's geolocation permission prompt
- Silent — no UI unless error occurs

---

## 4. Floating Push Notifications

**File: `src/components/layout/FloatingNotification.tsx`** (new)
- Slide-down animated toast at top of screen (above status bar, `z-[200]`)
- Shows icon, title, body with auto-dismiss (5s)
- Swipe-up to dismiss gesture

**File: `src/components/layout/MobileAppShell.tsx`**
- Add `FloatingNotification` component
- Connect to existing `useNotifications` hook to display new notifications

---

## Files Changed

| File | Action |
|------|--------|
| `src/components/layout/MobileStatusBar.tsx` | Rewrite — faux Android status bar with time/icons |
| `src/hooks/usePullToRefresh.ts` | Create — touch-based pull-to-refresh hook |
| `src/components/layout/FloatingNotification.tsx` | Create — floating notification component |
| `src/components/layout/MobileAppShell.tsx` | Update — integrate all 3 features |
| `index.html` | Update `theme-color` meta |

