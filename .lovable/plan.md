

## Plan: Deep Pricing Integration for CityHealth

### 1. Database: Add `plan_type` column to providers (Firestore-based)

The project uses Firebase/Firestore for providers (not a Supabase `providers` table). The `CityHealthProvider` interface in `src/data/providers.ts` is the canonical type. No Supabase migration needed -- we add `planType` as a field on the Firestore document and to the TypeScript interface.

**Edit `src/data/providers.ts`**: Add `planType?: 'basic' | 'standard' | 'premium'` to `CityHealthProvider` interface.

**Edit `src/types/provider.ts`**: Add same field if the type is duplicated there.

### 2. Redesign PricingSection (Landing Page)

**Rewrite `src/components/homepage/PricingSection.tsx`**:
- 3 cards: Basic, Standard (highlighted), Premium
- All features in French, CityHealth-specific:
  - **Basic**: Profil public standard, Localisation sur la carte, Accès réseau "Urgence Sang", Badge "Vérifié" standard
  - **Standard** (Most Popular): All Basic + Prise de RDV en ligne, Mode "Pharmacie de Garde", Affichage avis patients, Galerie photos
  - **Premium**: All Standard + Badge "Premium Vérifié", Tête des résultats de recherche, Recommandation IA Triage, Statistiques avancées
- Green "Gratuit la 1ère année" badge on all cards
- CTA buttons with `useNavigate` to `/inscription-professionnel`:
  - Basic: "Commencer gratuitement"
  - Standard: "Choisir le Standard"
  - Premium: "Devenir Premium"

### 3. Provider Dashboard: Subscription Card

**Create `src/components/provider/SubscriptionCard.tsx`**:
- Displays current plan name from provider's `planType` (default 'basic')
- Shows "Forfait Actuel : Basic/Standard/Premium" badge
- If not premium, shows a "✨ Passer au Premium" button
- Button opens a Dialog/modal listing Premium benefits
- Modal has a confirm CTA (placeholder for future payment flow)

**Edit `src/pages/ProviderDashboard.tsx`**:
- Import and render `SubscriptionCard` in the Overview tab area

### 4. Premium Verified Badge Logic

**Edit `src/components/trust/VerifiedBadge.tsx`**: Already supports `type="premium"` with gold/amber styling. No changes needed.

**Edit badge rendering in key locations** to check `planType`:
- `src/pages/ProviderProfilePage.tsx`: Change `<VerifiedBadge type="verified" />` to `<VerifiedBadge type={provider.planType === 'premium' ? 'premium' : 'verified'} />`
- `src/components/search/SearchResults.tsx`: Same logic in `ProviderCard`
- `src/components/search/ProviderInfoCard.tsx`: Same logic
- `src/components/map/ProviderList.tsx`: Same logic
- `src/components/map/MapSidebar.tsx`: Same logic

### Files to create:
- `src/components/provider/SubscriptionCard.tsx`

### Files to edit:
- `src/data/providers.ts` (add `planType` field)
- `src/components/homepage/PricingSection.tsx` (full redesign)
- `src/pages/ProviderDashboard.tsx` (add SubscriptionCard)
- `src/pages/ProviderProfilePage.tsx` (premium badge logic)
- `src/components/search/SearchResults.tsx` (premium badge logic)
- `src/components/search/ProviderInfoCard.tsx` (premium badge logic)
- `src/components/map/ProviderList.tsx` (premium badge logic)
- `src/components/map/MapSidebar.tsx` (premium badge logic)

