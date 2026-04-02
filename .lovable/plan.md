

# Plan: Système Badge Premium et Section "Meilleurs Praticiens"

## Constat actuel

- La table `providers_public` dans la base de données existe mais est **vide** (0 lignes)
- Aucun champ `is_premium` n'existe nulle part
- `FeaturedProviders` lit depuis **Firestore** via `useVerifiedProviders()`, pas depuis la base de données Lovable Cloud
- Les données affichées viennent de Firestore (Firebase) avec fallback sur des données de référence locales

## Changements

### 1. Ajouter la colonne `is_premium` a la table `providers_public`

Migration SQL :
```sql
ALTER TABLE providers_public ADD COLUMN is_premium boolean NOT NULL DEFAULT false;
```

### 2. Insérer 3 praticiens Premium de test

Insérer 3 providers réalistes dans `providers_public` avec `is_premium = true`, `is_verified = true`, et des données complètes (nom, type, spécialité, ville, rating, coordonnées).

### 3. Créer un hook `usePremiumProviders`

Nouveau hook dans `src/hooks/useHomepageData.ts` qui requête uniquement les providers premium :

```typescript
export function usePremiumProviders() {
  return useQuery({
    queryKey: ['premium-providers'],
    queryFn: async () => {
      const { data } = await supabase
        .from('providers_public')
        .select('*')
        .eq('is_premium', true)
        .eq('is_verified', true)
        .order('rating', { ascending: false });
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

### 4. Modifier `FeaturedProviders.tsx`

- Remplacer `useVerifiedProviders()` (Firestore) par `usePremiumProviders()` (base de données)
- Mapper les colonnes de `providers_public` vers le format `DisplayProvider`
- Ajouter un badge "Premium" doré visible sur chaque carte
- Supprimer les filtres par type (puisque seuls les premium s'affichent)
- Garder le carousel auto-scroll existant

## Fichiers modifies

| Fichier | Action |
|---------|--------|
| `providers_public` (migration) | Ajouter colonne `is_premium` |
| `providers_public` (insert) | Ajouter 3 praticiens premium |
| `src/hooks/useHomepageData.ts` | Ajouter `usePremiumProviders()` |
| `src/components/homepage/FeaturedProviders.tsx` | Connecter a la BDD, afficher badge Premium |

