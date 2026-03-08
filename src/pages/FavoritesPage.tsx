import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Phone, Star, Calendar, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SkeletonCard from '@/components/SkeletonCard';
import { useFavorites, useRemoveFavorite } from '@/hooks/useFavorites';
import { useVerifiedProviders } from '@/hooks/useProviders';
import { useAuth } from '@/contexts/AuthContext';
import { GuestBlockMessage } from '@/components/guest/GuestBlockMessage';
import { toast } from 'sonner';

const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <GuestBlockMessage title="Mes Favoris" description="Connectez-vous pour sauvegarder vos médecins favoris et y accéder rapidement." />;
  }

  return <FavoritesPageContent />;
};

const FavoritesPageContent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: favoriteIds = [], isLoading: loadingFavorites } = useFavorites();
  const { data: allProviders = [], isLoading: loadingProviders } = useVerifiedProviders();
  const removeFavorite = useRemoveFavorite();

  const isLoading = loadingFavorites || loadingProviders;

  const favoriteProviders = useMemo(() => {
    return allProviders.filter(provider => favoriteIds.includes(provider.id));
  }, [allProviders, favoriteIds]);

  const filteredFavorites = useMemo(() => {
    if (!searchQuery) return favoriteProviders;
    return favoriteProviders.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.specialty || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [favoriteProviders, searchQuery]);

  const handleRemoveFavorite = (id: string) => {
    removeFavorite.mutate(id);
    toast.success('Favori supprimé');
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Mes Favoris</h1>
          <p className="text-xs text-muted-foreground">{filteredFavorites.length} prestataire(s)</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-xl bg-card border-border"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredFavorites.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 flex flex-col items-center text-center gap-3">
            <Heart className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground font-medium">
              {searchQuery ? 'Aucun résultat' : 'Aucun favori'}
            </p>
            {!searchQuery && (
              <Button asChild variant="outline" size="sm">
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Découvrir
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFavorites.map((fav) => (
            <Card key={fav.id} className="bg-card border border-border rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/provider/${fav.id}`} className="font-semibold text-sm truncate hover:text-primary">
                        {fav.name}
                      </Link>
                      {fav.verified && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">✓</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{fav.specialty || fav.type}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {fav.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {fav.rating}
                      </span>
                      <Badge variant={fav.isOpen ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                        {fav.isOpen ? 'Ouvert' : 'Fermé'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => handleRemoveFavorite(fav.id)}
                    disabled={removeFavorite.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1 h-8 text-xs rounded-lg" onClick={() => navigate(`/provider/${fav.id}`)}>
                    <Calendar className="mr-1 h-3 w-3" /> RDV
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg" onClick={() => window.open(`tel:${fav.phone}`, '_self')}>
                    <Phone className="mr-1 h-3 w-3" /> Appeler
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
