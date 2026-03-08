

## Refactor Settings Page

**Goal**: Reorganize `src/pages/SettingsPage.tsx` into 7 clean sections, removing duplicated items (Mes favoris, Mes rendez-vous) that exist in the Profile page, and adding new Resources/Legal sections with external link icons.

### Changes to `src/pages/SettingsPage.tsx`

**Structure** — Replace the current `groups` array with these 7 sections:

1. **COMPTE** — Mon Profil (navigate `/profile`), Changer le mot de passe, Se déconnecter (destructive, red)
2. **NOTIFICATIONS** — 3 toggles: Rendez-vous, Urgences sang, Messages
3. **SERVICES DE SANTÉ** — Carte d'urgence (`/profile`), Don de sang (`/blood-donation`) — removes Mes favoris & Mes rendez-vous
4. **PRÉFÉRENCES** — Langue (cycle FR/AR/EN, show current), Mode sombre (toggle)
5. **RESSOURCES** — Comment ça marche (`/how`), Pourquoi CityHealth (`/why`), FAQ (`/faq`), Documentation (`/docs`), Espace développeurs (`/developers`) — all with `ExternalLink` icon instead of chevron
6. **LÉGAL** — Conditions d'utilisation (`/terms`), Politique de confidentialité (`/privacy`) — with `ExternalLink` icon
7. **À PROPOS** — Version v2.4.0 (non-clickable), Centre d'aide (`/faq`), Contacter le support (`/contact`), Signaler un bug (toast)

**Styling changes**:
- Add `ExternalLink` from lucide-react to imports
- Add an `external?: boolean` flag to `SettingsItem` interface
- In the render, show `ExternalLink` icon (instead of `ChevronRight`) when `item.external` is true
- Keep the profile card at top, existing card/animation styles, and the sticky header
- Each section icon gets a unique color tint via a new `iconColor` field (optional, e.g. teal for health, amber for preferences)

**No other files changed** — single file edit only.

