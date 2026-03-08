

# Suggested Improvements for CityHealth

Based on my analysis of your codebase, here are key areas for improvement:

---

## 1. Internationalization Completeness
The homepage (`MobileHomeScreen.tsx`) has all labels hardcoded in French (e.g., "Carte", "Urgences", "RDV"). The app supports French, Arabic, and English via `LanguageContext`, but the homepage doesn't use translations. This should be fixed so Arabic and English users see localized content.

## 2. Replace Hardcoded Mock Data with Real Data
The homepage displays static arrays for ads, articles, community posts, and health services (e.g., "12 spécialistes", "Consultation gratuite Dr. Benali"). These should be fetched from the database to show real, dynamic content.

## 3. Offline / PWA Support
The app has `vite-plugin-pwa` and `workbox-build` installed but it's unclear if offline support is fully configured. For a health app in Algeria where connectivity can be unreliable, proper offline caching of critical pages (emergency info, health card) would be very valuable.

## 4. Performance: Reduce Bundle Size
The app imports many heavy libraries (Leaflet, Mapbox, TipTap, Tesseract.js, pdfjs-dist, Firebase + Firebase Admin). Firebase Admin should never be in a frontend bundle. Consider auditing imports and lazy-loading more aggressively.

## 5. Accessibility (a11y)
Add proper ARIA labels to interactive elements, especially the symptom chips, quick action buttons, and navigation items. Ensure proper color contrast ratios in both light and dark modes.

## 6. Search & Filtering UX
The health services cards all link to `/search` without pre-filtering. They should pass query parameters (e.g., `/search?specialty=cardiologie`) to immediately show relevant results.

## 7. Push Notification Opt-in UX
Add a clear onboarding step or settings toggle for push notification preferences, rather than requesting permission abruptly.

## 8. Error States & Empty States
Add proper empty state illustrations and retry buttons throughout the app (favorites, appointments, community) instead of blank screens.

---

## Recommended Priority Order
1. Replace hardcoded French labels with i18n translations (quick win, big impact)
2. Remove `firebase-admin` from frontend bundle (security + performance)
3. Connect homepage sections to real database data
4. Add empty/error states across the app
5. Improve search pre-filtering from homepage cards

