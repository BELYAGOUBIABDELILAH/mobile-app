import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Code2, BookOpen, Droplets, Gift, FileText, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';

const PLATFORM_URL = 'https://preview--cityhealth-dz.lovable.app/';

const servicesInfo: Record<string, { title: string; description: string; icon: any; color: string }> = {
  'api-developer': {
    title: 'API Developer',
    description: 'Accédez à notre API REST pour intégrer les données de santé dans vos applications. Documentation complète, clés API et exemples de code disponibles.',
    icon: Code2,
    color: 'text-primary',
  },
  'articles-recherche': {
    title: 'Articles & Recherche',
    description: 'Publiez et consultez des articles de recherche médicale. Partagez vos travaux avec la communauté scientifique locale.',
    icon: BookOpen,
    color: 'text-violet-500',
  },
  'don-de-sang': {
    title: 'Don de Sang',
    description: 'Répondez aux urgences de don de sang en temps réel. Trouvez les centres de collecte et sauvez des vies.',
    icon: Droplets,
    color: 'text-red-500',
  },
  'don-gratuit': {
    title: 'Don Gratuit',
    description: 'Offrez ou trouvez de l\'aide communautaire : médicaments, équipements médicaux, transport et accompagnement.',
    icon: Gift,
    color: 'text-emerald-500',
  },
  'documents': {
    title: 'Documents',
    description: 'Accédez à la documentation complète : guides d\'utilisation, protocoles médicaux et ressources éducatives.',
    icon: FileText,
    color: 'text-sky-500',
  },
  'tarifs-providers': {
    title: 'Tarifs Providers',
    description: 'Consultez les plans et tarifs pour les professionnels de santé souhaitant rejoindre notre plateforme.',
    icon: CreditCard,
    color: 'text-amber-500',
  },
};

export default function ServiceLandingPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = servicesInfo[serviceId || ''];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">Service introuvable.</p>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground truncate">{service.title}</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Icon + Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Icon className={`h-10 w-10 ${service.color}`} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{service.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{service.description}</p>
          </div>
        </div>

        {/* Availability badge */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Service disponible
            </div>
            <p className="text-sm text-foreground font-medium">
              Ce service est disponible sur notre plateforme CityHealth
            </p>
            <p className="text-xs text-muted-foreground">
              Rendez-vous sur notre plateforme pour utiliser ce service ou collaborer avec nous.
            </p>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <p className="text-sm font-medium text-foreground">Scannez pour accéder à la plateforme</p>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <QRCodeSVG
                value={PLATFORM_URL}
                size={180}
                level="H"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-center break-all">{PLATFORM_URL}</p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-3">
          <Button className="w-full" size="lg" asChild>
            <a href={PLATFORM_URL} target="_blank" rel="noopener noreferrer">
              Accéder à la plateforme <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
