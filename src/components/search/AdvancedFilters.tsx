import React from 'react';
import { Stethoscope, Pill, Building, FlaskConical, Star, Accessibility, Globe, MapPin, Baby, Droplets, ScanLine, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { FilterState } from '@/pages/SearchPage';

interface AdvancedFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  showFilters: boolean;
}

export const AdvancedFilters = ({ filters, setFilters, showFilters }: AdvancedFiltersProps) => {
  const categories = [
    { id: 'doctor', label: 'Médecins', icon: Stethoscope },
    { id: 'clinic', label: 'Cliniques', icon: Building },
    { id: 'pharmacy', label: 'Pharmacies', icon: Pill },
    { id: 'lab', label: 'Laboratoires', icon: FlaskConical },
    { id: 'hospital', label: 'Hôpitaux', icon: Building },
    { id: 'birth_hospital', label: 'Maternité', icon: Baby },
    { id: 'blood_cabin', label: 'Don de sang', icon: Droplets },
    { id: 'radiology_center', label: 'Radiologie', icon: ScanLine },
    { id: 'medical_equipment', label: 'Équipement', icon: Wrench },
  ];

  const availabilityOptions = [
    { value: 'any', label: 'Tous' },
    { value: 'now', label: 'Ouvert maintenant' },
  ];

  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'English' },
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    updateFilter('categories', newCategories);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      availability: 'any',
      minRating: 0,
      verifiedOnly: false,
      emergencyServices: false,
      wheelchairAccessible: false,
      languages: [],
      area: '',
      maxDistance: 50,
    });
  };

  const activeFiltersCount =
    filters.categories.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.emergencyServices ? 1 : 0) +
    (filters.wheelchairAccessible ? 1 : 0) +
    (filters.availability !== 'any' ? 1 : 0) +
    (filters.languages.length > 0 ? 1 : 0) +
    (filters.area ? 1 : 0) +
    (filters.maxDistance < 50 ? 1 : 0);

  if (!showFilters) return null;

  return (
    <div className="w-80 border-r bg-muted/20 h-screen overflow-y-auto">
      <Card className="m-4 shadow-none border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filtres avancés</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="justify-start p-0 h-auto">
              Tout effacer
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Catégories */}
          <div>
            <Label className="text-sm font-medium">Catégories</Label>
            <div className="mt-2 space-y-2">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label htmlFor={category.id} className="flex items-center gap-2 cursor-pointer font-normal">
                      <IconComponent size={16} className="text-primary" />
                      {category.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disponibilité */}
          <div>
            <Label className="text-sm font-medium">Disponibilité</Label>
            <RadioGroup
              value={filters.availability}
              onValueChange={(value) => updateFilter('availability', value)}
              className="mt-2"
            >
              {availabilityOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="font-normal">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Note minimum */}
          <div>
            <Label className="text-sm font-medium">Note minimum</Label>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updateFilter('minRating', rating === filters.minRating ? 0 : rating)}
                  className="p-1"
                >
                  <Star
                    size={20}
                    className={rating <= filters.minRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {filters.minRating > 0 ? `${filters.minRating}+ étoiles` : 'Toutes les notes'}
              </span>
            </div>
          </div>

          {/* Options */}
          <div>
            <Label className="text-sm font-medium">Options</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" checked={filters.verifiedOnly} onCheckedChange={(checked) => updateFilter('verifiedOnly', checked)} />
                <Label htmlFor="verified" className="cursor-pointer font-normal">Vérifiés uniquement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="emergency" checked={filters.emergencyServices} onCheckedChange={(checked) => updateFilter('emergencyServices', checked)} />
                <Label htmlFor="emergency" className="cursor-pointer font-normal">Services d'urgence</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="wheelchair" checked={filters.wheelchairAccessible} onCheckedChange={(checked) => updateFilter('wheelchairAccessible', checked)} />
                <Label htmlFor="wheelchair" className="flex items-center gap-2 cursor-pointer font-normal">
                  <Accessibility size={16} className="text-primary" />
                  Accessibilité fauteuil roulant
                </Label>
              </div>
            </div>
          </div>

          {/* Langues */}
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              Langues parlées
            </Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {languageOptions.map(lang => (
                <Badge
                  key={lang.value}
                  variant={filters.languages.includes(lang.value) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => {
                    const newLangs = filters.languages.includes(lang.value)
                      ? filters.languages.filter(l => l !== lang.value)
                      : [...filters.languages, lang.value];
                    updateFilter('languages', newLangs);
                  }}
                >
                  {lang.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Distance max</span>
              <span>{filters.maxDistance} km</span>
            </div>
            <Slider
              value={[filters.maxDistance]}
              onValueChange={(value) => updateFilter('maxDistance', value[0])}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
