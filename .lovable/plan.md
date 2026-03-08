

## Redesign des cartes prestataires — Style "Appointments Card"

### Analyse de l'image de référence

L'image montre des cartes d'appointments avec :
- Carte blanche arrondie avec ombre légère, fond propre
- Photo du médecin à droite (grande, arrondie)
- Badge de statut coloré en haut à gauche (vert "Approved", orange "Pending")
- Nom en gras, spécialité en gris dessous
- Date/heure avec icône calendrier
- Type de visite (Video visit / In-person) avec icône
- Deux boutons en bas : "Message" et "Call doctor" (outline, coins arrondis, icônes)

### Plan d'implémentation

**3 fichiers à modifier** (design des cartes uniquement, pas de filtrage) :

#### 1. `src/components/search/SearchResults.tsx` — ProviderCard (lignes 69-196)
Refonte complète du layout de la carte :
- Layout horizontal : infos à gauche, avatar/photo arrondi à droite (64x64)
- Badge de statut en haut : vert "Vérifié" ou badge type (Médecin, Pharmacie...)
- Nom en `font-semibold`, spécialité en `text-muted-foreground`
- Ligne avec icône MapPin + adresse, icône Clock + statut ouvert/fermé
- Rating avec étoile jaune
- Deux boutons en bas : "Message/Appeler" (outline) et "Voir profil" (outline) — style pill avec icônes
- Suppression du layout grid (ou adaptation similaire)

#### 2. `src/pages/SearchPage.tsx` — ProviderCard (lignes 307-374)
Même refonte que ci-dessus, adaptée aux props `CityHealthProvider` :
- Photo/avatar arrondi à droite
- Badge type coloré en haut
- Infos (nom, spécialité, adresse, rating) à gauche
- Boutons "Appeler" et "Voir profil" en bas

#### 3. `src/components/search/ProviderListItem.tsx`
Adaptation du style compact pour la sidebar carte :
- Garder la densité compacte mais ajouter les coins arrondis et l'espacement
- Avatar arrondi à droite au lieu de gauche
- Badge vérifié vert style pill
- Séparateur plus subtil entre les items

### Palette de couleurs (thème existant)
- Fond carte : `bg-white dark:bg-card` avec `shadow-sm` et `rounded-2xl`
- Badge vérifié : `bg-emerald-50 text-emerald-600 border-emerald-200`
- Badge type : `bg-primary/10 text-primary`
- Boutons : `variant="outline"` avec `rounded-full` et icônes
- Accent bleu profond `#1D4ED8` (primary existant)

### Ce qui ne change pas
- Props et interfaces des composants
- Système de filtrage et tri
- Logique de favoris, navigation, virtualisation
- ProviderInfoCard et ProviderCard du map (pas dans la recherche)

