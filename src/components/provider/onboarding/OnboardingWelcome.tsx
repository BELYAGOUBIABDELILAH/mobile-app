import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  FileText, 
  Camera, 
  BadgeCheck,
  ArrowRight,
  User,
  Award,
  Upload,
  Send,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OnboardingWelcomeProps {
  providerName?: string;
  onGetStarted: () => void;
}

export function OnboardingWelcome({ providerName, onGetStarted }: OnboardingWelcomeProps) {
  const phases = [
    {
      label: 'Votre identité',
      color: 'primary' as const,
      steps: [
        { icon: User, title: 'Informations de base', description: 'Nom, email et téléphone' },
        { icon: MapPin, title: 'Localisation', description: 'Adresse et coordonnées GPS' },
        { icon: FileText, title: 'Description & Horaires', description: 'Présentez votre pratique' },
      ],
    },
    {
      label: 'Vos preuves',
      color: 'amber' as const,
      steps: [
        { icon: Award, title: 'Licence professionnelle', description: 'Numéro d\'agrément' },
        { icon: Camera, title: 'Photos du cabinet', description: 'Montrez votre établissement' },
        { icon: Upload, title: 'Documents officiels', description: 'Licence + pièce d\'identité' },
      ],
    },
    {
      label: 'Validation',
      color: 'emerald' as const,
      steps: [
        { icon: Send, title: 'Soumettre pour vérification', description: 'Envoi pour validation' },
        { icon: BadgeCheck, title: 'Obtenir le badge vérifié', description: 'Visible publiquement' },
      ],
    },
  ];

  const colorMap = {
    primary: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
      dot: 'bg-primary',
      line: 'from-primary/30',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/20',
      dot: 'bg-amber-500',
      line: 'from-amber-500/30',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-500',
      line: 'from-emerald-500/30',
    },
  };

  let globalIndex = 0;

  return (
    <div className="p-6 space-y-7">
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center"
        >
          <Sparkles className="h-7 w-7 text-primary" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Bienvenue{providerName ? `, ${providerName}` : ''} !
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Complétez ces étapes pour activer votre profil et commencer à recevoir des patients.
          </p>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-5">
        {phases.map((phase, phaseIdx) => {
          const colors = colorMap[phase.color];
          return (
            <motion.div
              key={phase.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIdx * 0.15, duration: 0.4 }}
            >
              {/* Phase label */}
              <div className="flex items-center gap-2 mb-2.5">
                <div className={cn('w-2 h-2 rounded-full', colors.dot)} />
                <span className={cn('text-xs font-semibold uppercase tracking-wider', colors.text)}>
                  {phase.label}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Steps */}
              <div className="space-y-1.5">
                {phase.steps.map((step, stepIdx) => {
                  const currentGlobal = globalIndex++;
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: currentGlobal * 0.06 + 0.2 }}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors',
                        'bg-card hover:bg-muted/40',
                        colors.border
                      )}
                    >
                      {/* Step number + icon */}
                      <div className="relative">
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                          colors.bg
                        )}>
                          <Icon className={cn('h-4 w-4', colors.text)} />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                          <span className="text-[9px] font-bold text-muted-foreground">{currentGlobal + 1}</span>
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-foreground leading-tight">{step.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="pt-1 space-y-3">
        <Button onClick={onGetStarted} className="w-full gap-2 h-12 text-sm font-semibold rounded-xl shadow-md shadow-primary/20" size="lg">
          Commencer l'inscription
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="text-[11px] text-center text-muted-foreground">
          ⏱️ Environ 10-15 minutes • Vous pouvez sauvegarder et reprendre à tout moment
        </p>
      </div>
    </div>
  );
}
