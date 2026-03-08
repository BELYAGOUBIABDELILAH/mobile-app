

## Plan: Update Ressources, Légal & À propos sections in Settings

Redirect all links in these three sections to the external website (`cityhealth-dz.lovable.app`) using `window.open(..., '_blank')` instead of `navigate(...)`. All items already use Lucide icons (no emojis present).

### Changes in `src/pages/SettingsPage.tsx` (lines 104-130):

**Ressources** — update `onClick` handlers:
- "Comment ça marche" → `window.open('https://cityhealth-dz.lovable.app/docs', '_blank')`
- "Pourquoi CityHealth" → `window.open('https://cityhealth-dz.lovable.app/research', '_blank')`
- "FAQ" → `window.open('https://cityhealth-dz.lovable.app/faq', '_blank')`
- "Documentation" → `window.open('https://cityhealth-dz.lovable.app/docs', '_blank')`
- "Espace développeurs" — already external, keep as-is

**Légal** — update `onClick` handlers:
- "Conditions d'utilisation" → `window.open('https://cityhealth-dz.lovable.app/terms', '_blank')`
- "Politique de confidentialité" → `window.open('https://cityhealth-dz.lovable.app/privacy', '_blank')`

**À propos** — update relevant items:
- "Centre d'aide" → `window.open('https://cityhealth-dz.lovable.app/faq', '_blank')`, add `external: true`
- "Visiter notre site web" — already external, keep as-is
- Others (version, contact, bug) — keep as-is

