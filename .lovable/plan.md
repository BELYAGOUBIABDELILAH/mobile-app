

## Plan: French as default + Translate all pages + Language shortcut in Settings

### Scope Assessment

The translation infrastructure (`src/i18n/translations.ts`) already has **fr**, **ar**, and **en** translations for ~25 sections covering most of the app. French is already the default language. The main gaps are:

1. **Hardcoded French strings** in several pages/components that bypass the `t()` translation system
2. **Missing `settings` translation section** for the Settings page labels
3. **Language shortcut** improvement in Settings (currently cycles — needs a proper selector)

### Changes

#### 1. Add `settingsPage` section to translation types and all 3 languages (~80 keys)

In `src/i18n/translations.ts`, add a new `settingsPage` section covering:
- Page title ("Paramètres" / "الإعدادات" / "Settings")
- Account group: "Compte", "Mon Profil", "Changer le mot de passe", "Se déconnecter"
- Notifications group: "Notifications", "Rendez-vous", "Urgences sang", "Messages" + descriptions
- Health services group: "Services de santé", "Carte d'urgence", "Don de sang"
- Preferences group: "Préférences", "Langue", "Mode sombre"
- Resources group: all labels
- Legal group: all labels
- About group: all labels
- Guest state: "Visiteur", "Non connecté", "Se connecter", "Vérifié"
- Toast messages: "Déconnexion réussie", "Signaler un bug" message

#### 2. Update `src/pages/SettingsPage.tsx`
- Import `useLanguage` and use `t('settingsPage', ...)` for all hardcoded strings
- Replace the `cycleLanguage` click with a **language picker dropdown** showing all 3 options (Français, العربية, English) with flag indicators, so users can directly select their language

#### 3. Translate hardcoded strings in key components
- `src/components/guest/GuestBlockMessage.tsx`: "Se connecter", "Créer un compte" → use `t('auth', ...)`
- `src/components/guest/GuestProfilePage.tsx`: hardcoded French labels
- `src/components/settings/ChangePasswordDialog.tsx`: "Changer le mot de passe" title
- `src/pages/AuthGatewayPage.tsx`: "Se connecter", "Créer un compte"
- `src/pages/CitizenRegisterPage.tsx`: hardcoded form labels

#### 4. Translate `src/pages/FAQPage.tsx`
- Add `faqPage` section to translations with all category labels and FAQ Q&A content in fr/ar/en
- Replace hardcoded `faqCategories` and `faqData` arrays with translated versions

#### 5. Translate remaining pages with hardcoded French
- `src/pages/TermsPage.tsx`, `src/pages/PrivacyPage.tsx`, `src/pages/DocsPage.tsx` — these are content-heavy legal pages. Add translation sections or use the `t()` system for their content.

### Technical Details

- **Translation file**: Will grow by ~300-400 lines to add `settingsPage` and `faqPage` sections across 3 languages
- **Language picker**: Replace `cycleLanguage` with a `DropdownMenu` from Radix (already installed) showing 3 language options with labels
- **Default language**: Already `'fr'` in `LanguageContext.tsx` — no change needed
- **Pattern**: Follow existing pattern of `t('section', 'key')` used throughout the app

### Files to modify
1. `src/i18n/translations.ts` — Add `settingsPage` and `faqPage` sections (fr/ar/en)
2. `src/pages/SettingsPage.tsx` — Replace all hardcoded French with `t()` calls + add language dropdown
3. `src/components/guest/GuestBlockMessage.tsx` — Translate button labels
4. `src/components/guest/GuestProfilePage.tsx` — Translate labels
5. `src/components/settings/ChangePasswordDialog.tsx` — Translate title/labels
6. `src/pages/AuthGatewayPage.tsx` — Translate buttons
7. `src/pages/CitizenRegisterPage.tsx` — Translate form labels
8. `src/pages/FAQPage.tsx` — Full translation of categories and Q&A content

