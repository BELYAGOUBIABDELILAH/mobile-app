

## Plan: CityHealth Companion Chrome Extension

### Overview
Create an isolated `cityhealth-extension/` directory at the project root containing a Manifest V3 Chrome extension with two features: a popup UI for quick triage/search, and a background service worker for blood emergency notifications.

### File Structure
```text
cityhealth-extension/
├── manifest.json
├── index.html
├── vite.config.ts
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── Popup.tsx
│   ├── background.ts
│   ├── supabaseClient.ts
│   └── index.css
```

### Implementation Steps

#### 1. `manifest.json` — Manifest V3 Configuration
- Permissions: `storage`, `notifications`
- Service worker: `background.js` (built output)
- Popup: `index.html`
- Connect to Supabase URL in `host_permissions`

#### 2. `vite.config.ts` — Dual Build Configuration
- Build popup as standard React app (`index.html` entry)
- Build `background.ts` separately as an IIFE bundle (service worker can't use ES modules)
- Output to `cityhealth-extension/dist/`

#### 3. `supabaseClient.ts` — Supabase Connection
- Import `@supabase/supabase-js`
- Use the project's existing Lovable Cloud Supabase URL and anon key (hardcoded, these are public/publishable)

#### 4. `Popup.tsx` — Popup UI (350×500px)
- **Auth screen**: Email/password login via `supabase.auth.signInWithPassword`
- **Main screen** (post-login):
  - Header with CityHealth branding
  - Read-only badge showing synced blood group from `emergency_health_cards` table (fetched on login, saved to `chrome.storage.local`)
  - Search bar "Trouver un professionnel" — opens main app search page in new tab
  - "Assistant Triage IA" button — opens main app `/assistant-medical` in new tab
  - Logout button
- Styled with Tailwind CSS, healthcare color theme

#### 5. `background.ts` — Service Worker
- On install/startup: read blood type from `chrome.storage.local`
- Listen to `chrome.storage.onChanged` to update blood type if popup refreshes it
- Subscribe to Supabase realtime channel on `blood_emergencies` table (INSERT events, status='active')
- When a new emergency matches the user's blood group → `chrome.notifications.create` with French message
- On notification click → open the blood donation page on the main app

#### 6. `index.css` — Tailwind Setup
- Standard Tailwind directives (`@tailwind base/components/utilities`)
- Minimal custom styles for popup dimensions

#### 7. Supporting Config Files
- `package.json` with dependencies: `@supabase/supabase-js`, `react`, `react-dom`, `vite`, `tailwindcss`, `postcss`, `autoprefixer`, `@vitejs/plugin-react`
- `tsconfig.json` for TypeScript
- `tailwind.config.ts` and `postcss.config.js`

### Technical Notes

- **Blood group source**: Uses existing `emergency_health_cards` table (column `blood_group`, keyed by `user_id`). No new tables needed.
- **Auth**: Uses Supabase Auth (email/password). Session token stored in `chrome.storage.local` for the service worker to reuse.
- **Realtime in service worker**: The background script creates a Supabase client and subscribes to postgres_changes on `blood_emergencies`. Service workers can maintain WebSocket connections while active; Chrome will wake the worker on incoming messages.
- **No changes to main app**: Everything is self-contained in `cityhealth-extension/`. The main app codebase is untouched.
- **Build process**: Run `cd cityhealth-extension && npm install && npm run build` to produce `dist/` folder ready to load as unpacked extension in Chrome.

