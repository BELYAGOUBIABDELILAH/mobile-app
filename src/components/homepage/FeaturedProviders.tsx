import { Link } from 'react-router-dom';
import { Star, ArrowRight, ChevronLeft, ChevronRight, MapPin, Shield, Crown, Stethoscope, Building2, Pill, FlaskConical, Hospital, Baby, Droplets, RadioTower, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { usePremiumProviders } from '@/hooks/useHomepageData';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface DisplayProvider {
  id: string;
  name: string;
  type: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  image: string;
  city?: string;
}

const typeIcons: Record<string, typeof Stethoscope> = {
  doctor: Stethoscope,
  clinic: Building2,
  pharmacy: Pill,
  lab: FlaskConical,
  hospital: Hospital,
  birth_hospital: Baby,
  blood_cabin: Droplets,
  radiology_center: RadioTower,
  medical_equipment: Wrench,
};

const SkeletonCard = () => (
  <div className="min-w-[260px] max-w-[260px] p-4 bg-card border border-border rounded-2xl space-y-3 flex-shrink-0">
    <Skeleton className="w-full h-24 rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-full rounded-lg" />
  </div>
);

const DEFAULT_IMAGES: Record<string, string> = {
  doctor: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
  clinic: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
  pharmacy: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop',
  hospital: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
  lab: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=300&fit=crop',
};

export const FeaturedProviders = () => {
  const { data: premiumProviders = [], isLoading } = usePremiumProviders();
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const providers: DisplayProvider[] = useMemo(() => {
    return premiumProviders.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      specialty: p.specialty || p.type,
      rating: p.rating || 0,
      reviewCount: p.reviews_count || 0,
      isVerified: p.is_verified,
      image: p.image_url || DEFAULT_IMAGES[p.type] || '',
      city: p.city || '',
    }));
  }, [premiumProviders]);

  const TypeIcon = (type: string) => typeIcons[type] || Stethoscope;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [providers, updateScrollState]);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  }, []);

  // Auto-scroll
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  isPausedRef.current = isPaused;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let rafId: number;
    let lastTime = 0;
    const speed = 0.5;
    const step = (timestamp: number) => {
      if (!isPausedRef.current && el) {
        const delta = lastTime ? (timestamp - lastTime) / 16.67 : 1;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += speed * delta;
        }
      }
      lastTime = timestamp;
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [providers]);

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full mb-3">
              <Crown className="h-3.5 w-3.5" />
              Premium
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('featuredProviders', 'healthProfessionals')}
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground">
            <Link to="/search">
              {t('featuredProviders', 'viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Cards */}
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : providers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center bg-muted/30 border border-border rounded-2xl"
          >
            <p className="text-muted-foreground text-sm mb-4">
              {t('featuredProviders', 'noPractitioners')}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/provider/register">
                {t('featuredProviders', 'becomePractitioner')}
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="relative group/carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {canScrollLeft && (
              <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-background border border-border shadow-md hover:shadow-lg hover:scale-105 transition-all" aria-label="Scroll left">
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
            )}
            {canScrollRight && (
              <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-background border border-border shadow-md hover:shadow-lg hover:scale-105 transition-all" aria-label="Scroll right">
                <ChevronRight className="h-4 w-4 text-foreground" />
              </button>
            )}
            {canScrollLeft && <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none hidden md:block" />}
            {canScrollRight && <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none hidden md:block" />}

            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <AnimatePresence mode="popLayout">
                {providers.map((provider, index) => {
                  const Icon = TypeIcon(provider.type);
                  return (
                    <motion.div key={provider.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35, delay: index * 0.04 }} className="snap-start flex-shrink-0">
                      <Link to={`/provider/${provider.id}`} className="group relative block w-[260px] bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-foreground/10 transition-all duration-300">
                        {/* Top visual */}
                        <div className="relative h-28 bg-muted/50 flex items-center justify-center overflow-hidden">
                          {provider.image && provider.image !== '/placeholder.svg' ? (
                            <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <Icon className="h-10 w-10 text-muted-foreground/40" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                          {/* Premium badge */}
                          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] font-bold rounded-full shadow-sm">
                            <Crown className="h-3 w-3" />
                            Premium
                          </div>

                          {provider.isVerified && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                              <Shield className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors duration-200">
                            {provider.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Icon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate">{provider.specialty}</span>
                          </div>
                          {provider.city && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-muted-foreground/60" />
                              <span className="text-[11px] text-muted-foreground/60 truncate">{provider.city}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-semibold text-foreground">{provider.rating.toFixed(1)}</span>
                              <span className="text-[11px] text-muted-foreground">({provider.reviewCount})</span>
                            </div>
                            <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Voir →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Mobile CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="sm:hidden mt-6 text-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/search" className="flex items-center gap-2">
              {t('featuredProviders', 'viewAllPractitioners')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
