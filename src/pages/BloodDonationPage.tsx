import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplet, 
  Hospital, 
  Clock, 
  MapPin, 
  Phone, 
  AlertTriangle,
  Heart,
  Calendar,
  Bell,
  BellOff,
  CheckCircle2,
  XCircle,
  Info,
  Shield,
  Users,
  Map,
  ArrowRight,
  Activity,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { EmergencyAlertBanner } from '@/components/blood-emergency/EmergencyAlertBanner';
import { DonationConfirmationView } from '@/components/blood-emergency/DonationConfirmationView';
import { getDonationHistory, subscribeToEmergencies } from '@/services/bloodEmergencyService';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { motion, AnimatePresence } from 'framer-motion';
import type { BloodEmergency } from '@/services/bloodEmergencyService';

const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'] as const;
type BloodType = typeof BLOOD_TYPES[number];

interface BloodProfile {
  bloodType?: BloodType;
  lastDonationDate?: string;
  reminderEnabled: boolean;
}

export default function BloodDonationPage() {
  const { isRTL, language } = useLanguage();
  const { isAuthenticated, profile } = useAuth();
  const { requireAuth, AuthRequiredModal: AuthModal } = useAuthRequired();

  const [respondingEmergency, setRespondingEmergency] = useState<BloodEmergency | null>(null);
  const [activeEmergencies, setActiveEmergencies] = useState<BloodEmergency[]>([]);
  const [eligibilityAge, setEligibilityAge] = useState('');
  const [eligibilityWeight, setEligibilityWeight] = useState('');
  const [eligibilityHeight, setEligibilityHeight] = useState('');
  const [lastDonation, setLastDonation] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState<'eligible' | 'not_yet' | null>(null);
  const [nextEligibleDate, setNextEligibleDate] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [profileAutoFilledAge, setProfileAutoFilledAge] = useState(false);
  const [profileAutoFilledWeight, setProfileAutoFilledWeight] = useState(false);
  const [profileAutoFilledHeight, setProfileAutoFilledHeight] = useState(false);
  const [bmiValue, setBmiValue] = useState<number | null>(null);
  const [bloodProfile, setBloodProfile] = useState<BloodProfile>({ reminderEnabled: false });
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    const unsub = subscribeToEmergencies(setActiveEmergencies);
    return unsub;
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !profile || profileLoaded) return;
    const profileAny = profile as any;
    if (profileAny.blood_group) setBloodProfile(prev => ({ ...prev, bloodType: profileAny.blood_group }));
    if (profileAny.date_of_birth) {
      const dob = new Date(profileAny.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const md = today.getMonth() - dob.getMonth();
      if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
      if (age > 0 && age < 150) { setEligibilityAge(String(age)); setProfileAutoFilledAge(true); }
    }
    if (profileAny.weight && profileAny.weight > 0) { setEligibilityWeight(String(profileAny.weight)); setProfileAutoFilledWeight(true); }
    if (profileAny.height && profileAny.height > 0) { setEligibilityHeight(String(profileAny.height)); setProfileAutoFilledHeight(true); }
    if (profileAny.id || profileAny.uid) {
      const citizenId = profileAny.id || profileAny.uid;
      getDonationHistory(citizenId).then(history => {
        if (history.length > 0) { const d = history[0].donated_at.split('T')[0]; setLastDonation(d); setBloodProfile(prev => ({ ...prev, lastDonationDate: d })); }
        else if (profileAny.last_donation_date) { setLastDonation(profileAny.last_donation_date); setBloodProfile(prev => ({ ...prev, lastDonationDate: profileAny.last_donation_date })); }
      }).catch(() => { if (profileAny.last_donation_date) { setLastDonation(profileAny.last_donation_date); setBloodProfile(prev => ({ ...prev, lastDonationDate: profileAny.last_donation_date })); } });
    } else if (profileAny.last_donation_date) { setLastDonation(profileAny.last_donation_date); setBloodProfile(prev => ({ ...prev, lastDonationDate: profileAny.last_donation_date })); }
    setProfileLoaded(true);
  }, [isAuthenticated, profile, profileLoaded]);

  const texts = useMemo(() => ({
    fr: {
      heroTitle: 'Sauvez des vies',
      heroSubtitle: 'Donnez votre sang',
      heroDesc: 'Trouvez les centres de don et répondez aux urgences à Sidi Bel Abbès',
      emergencyFinder: 'Urgences',
      donateBlood: 'Don',
      reminders: 'Rappels',
      info: 'Infos',
      selectBloodType: 'Sélectionnez votre groupe sanguin',
      disclaimer: 'Pour les urgences vitales, contactez immédiatement le SAMU.',
      eligibilityChecker: 'Suis-je éligible ?',
      age: 'Âge',
      weight: 'Poids (kg)',
      height: 'Taille (cm)',
      lastDonationDate: 'Dernier don',
      checkEligibility: 'Vérifier',
      eligible: 'Vous êtes éligible au don !',
      notYetEligible: 'Pas encore éligible',
      nextEligible: 'Prochaine date',
      eligibilityNote: 'Estimation — approbation finale par le personnel médical.',
      findCenter: 'Trouver un centre',
      viewMap: 'Carte interactive',
      bloodType: 'Groupe sanguin',
      saveProfile: 'Sauvegarder',
      enableReminders: 'Rappels de don',
      reminderInfo: 'Notification tous les 3 mois',
      whyDonate: 'Pourquoi donner ?',
      fact1: 'Sauvez jusqu\'à 3 vies',
      fact2: '10-15 minutes seulement',
      fact3: 'Possible tous les 56 jours',
      fact4: 'Sécurisé et supervisé',
      noEmergency: 'Aucune urgence en cours',
      currentEmergencies: 'Appels urgents',
      bmiLabel: 'IMC',
    },
    ar: {
      heroTitle: 'أنقذ حياة',
      heroSubtitle: 'تبرع بدمك',
      heroDesc: 'اعثر على مراكز التبرع واستجب للحالات الطارئة في سيدي بلعباس',
      emergencyFinder: 'طوارئ',
      donateBlood: 'تبرع',
      reminders: 'تذكيرات',
      info: 'معلومات',
      selectBloodType: 'اختر فصيلة دمك',
      disclaimer: 'للحالات الطارئة، اتصل فوراً بخدمات الطوارئ.',
      eligibilityChecker: 'هل أنا مؤهل؟',
      age: 'العمر',
      weight: 'الوزن (كجم)',
      height: 'الطول (سم)',
      lastDonationDate: 'آخر تبرع',
      checkEligibility: 'تحقق',
      eligible: 'أنت مؤهل للتبرع!',
      notYetEligible: 'لا يمكنك التبرع بعد',
      nextEligible: 'التاريخ التالي',
      eligibilityNote: 'تقدير — الموافقة النهائية من الطاقم الطبي.',
      findCenter: 'ابحث عن مركز',
      viewMap: 'الخريطة التفاعلية',
      bloodType: 'فصيلة الدم',
      saveProfile: 'حفظ',
      enableReminders: 'تذكيرات التبرع',
      reminderInfo: 'إشعار كل 3 أشهر',
      whyDonate: 'لماذا التبرع؟',
      fact1: 'أنقذ حتى 3 أرواح',
      fact2: '10-15 دقيقة فقط',
      fact3: 'ممكن كل 56 يومًا',
      fact4: 'آمن ومراقب طبيًا',
      noEmergency: 'لا توجد حالات طوارئ',
      currentEmergencies: 'نداءات عاجلة',
      bmiLabel: 'مؤشر كتلة الجسم',
    },
    en: {
      heroTitle: 'Save lives',
      heroSubtitle: 'Donate blood',
      heroDesc: 'Find donation centers and respond to emergencies in Sidi Bel Abbès',
      emergencyFinder: 'Emergency',
      donateBlood: 'Donate',
      reminders: 'Reminders',
      info: 'Info',
      selectBloodType: 'Select blood type',
      disclaimer: 'For life-threatening emergencies, contact emergency services immediately.',
      eligibilityChecker: 'Am I eligible?',
      age: 'Age',
      weight: 'Weight (kg)',
      height: 'Height (cm)',
      lastDonationDate: 'Last donation',
      checkEligibility: 'Check',
      eligible: 'You are eligible to donate!',
      notYetEligible: 'Not yet eligible',
      nextEligible: 'Next date',
      eligibilityNote: 'Guidance only — final approval by medical staff.',
      findCenter: 'Find a center',
      viewMap: 'Interactive map',
      bloodType: 'Blood type',
      saveProfile: 'Save',
      enableReminders: 'Donation reminders',
      reminderInfo: 'Notification every 3 months',
      whyDonate: 'Why donate?',
      fact1: 'Save up to 3 lives',
      fact2: 'Only 10-15 minutes',
      fact3: 'Every 56 days',
      fact4: 'Safe and supervised',
      noEmergency: 'No active emergencies',
      currentEmergencies: 'Urgent calls',
      bmiLabel: 'BMI',
    }
  }), []);

  const tx = texts[language as keyof typeof texts] || texts.fr;

  const checkEligibility = () => {
    const age = parseInt(eligibilityAge);
    const weight = parseInt(eligibilityWeight);
    const height = parseInt(eligibilityHeight);
    setDaysRemaining(null);
    if (weight > 0 && height > 0) {
      const hm = height / 100;
      setBmiValue(Math.round((weight / (hm * hm)) * 10) / 10);
    } else setBmiValue(null);
    if (age < 18 || weight < 50) { setEligibilityResult('not_yet'); setNextEligibleDate(null); return; }
    if (lastDonation) {
      const ld = new Date(lastDonation);
      const nd = new Date(ld); nd.setDate(nd.getDate() + 56);
      if (nd > new Date()) {
        setDaysRemaining(Math.ceil((nd.getTime() - Date.now()) / 86400000));
        setEligibilityResult('not_yet');
        setNextEligibleDate(nd.toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR'));
        return;
      }
    }
    setEligibilityResult('eligible'); setNextEligibleDate(null);
  };

  const saveBloodProfile = () => localStorage.setItem('blood_profile', JSON.stringify(bloodProfile));
  const profileBloodGroup = (profile as any)?.blood_group;
  const hasAutoFilledDonationDate = profileLoaded && !!bloodProfile.lastDonationDate;

  return (
    <div className={cn("min-h-screen bg-background pb-24", isRTL && "rtl")}>

      {/* ══════════ HERO ══════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-destructive/90 via-destructive/80 to-rose-600/90 dark:from-destructive/70 dark:via-rose-900/60 dark:to-destructive/50">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-40 h-40 rounded-full bg-white/5 blur-2xl" />

        <div className="relative px-5 pt-8 pb-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Droplet className="h-5 w-5" />
              </div>
              <div className="h-2 w-2 rounded-full bg-white/60 animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
              {tx.heroTitle}<br />
              <span className="text-white/80 text-2xl font-bold">{tx.heroSubtitle}</span>
            </h1>
            <p className="text-sm text-white/70 max-w-xs leading-relaxed mt-2">
              {tx.heroDesc}
            </p>
          </motion.div>

          {/* Quick action pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex gap-2.5 mt-6"
          >
            <Button
              asChild
              size="sm"
              className="rounded-full bg-white text-destructive font-semibold hover:bg-white/90 shadow-lg shadow-black/10 gap-1.5 h-10 px-5"
            >
              <Link to="/map?mode=blood">
                <Map className="h-4 w-4" />
                {tx.viewMap}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-full border-white/30 text-white hover:bg-white/10 gap-1.5 h-10 px-5"
            >
              <Link to="/map?mode=emergency">
                <AlertTriangle className="h-4 w-4" />
                {tx.emergencyFinder}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,40 L0,40 Z" className="fill-background" />
        </svg>
      </div>

      <main className="px-4 pt-2 space-y-6">

        {/* ══════════ EMERGENCY BANNER ══════════ */}
        {!respondingEmergency && <EmergencyAlertBanner onRespond={setRespondingEmergency} />}
        {respondingEmergency && (
          <DonationConfirmationView emergency={respondingEmergency} onClose={() => setRespondingEmergency(null)} />
        )}

        {/* ══════════ EMERGENCY DISCLAIMER (compact) ══════════ */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/8 border border-destructive/15">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-xs text-muted-foreground flex-1">{tx.disclaimer}</p>
          <a href="tel:15" className="shrink-0 flex items-center gap-1 text-xs font-bold text-destructive">
            <Phone className="h-3.5 w-3.5" /> 15
          </a>
        </div>

        {/* ══════════ LIVE EMERGENCIES ══════════ */}
        <section>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-destructive" />
            {tx.currentEmergencies}
            {activeEmergencies.length > 0 && (
              <span className="ml-auto flex items-center gap-1 text-xs font-normal text-destructive">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                {activeEmergencies.length} {language === 'fr' ? 'actif' : 'active'}
              </span>
            )}
          </h2>
          {activeEmergencies.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border/50">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <p className="text-sm text-muted-foreground">{tx.noEmergency}</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-1 px-1 snap-x snap-mandatory">
              {activeEmergencies.map((emergency) => (
                <motion.div
                  key={emergency.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "flex-shrink-0 w-[280px] snap-center rounded-2xl border-2 p-4 space-y-3",
                    emergency.urgency_level === 'critical'
                      ? "border-destructive/60 bg-destructive/5"
                      : "border-orange-400/50 bg-orange-50/50 dark:bg-orange-950/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center font-bold text-lg",
                      emergency.urgency_level === 'critical'
                        ? "bg-destructive/15 text-destructive"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900/30"
                    )}>
                      {emergency.blood_type_needed}
                    </div>
                    <div className="flex-1 min-w-0">
                      {emergency.provider_name && (
                        <p className="text-sm font-medium truncate">{emergency.provider_name}</p>
                      )}
                      <Badge
                        variant={emergency.urgency_level === 'critical' ? 'destructive' : 'secondary'}
                        className="text-[10px] mt-0.5"
                      >
                        {emergency.urgency_level === 'critical' ? 'Critique' : 'Urgent'}
                      </Badge>
                    </div>
                  </div>
                  {emergency.message && (
                    <p className="text-xs text-muted-foreground italic line-clamp-2">"{emergency.message}"</p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full rounded-xl h-9 text-xs font-semibold gap-1.5"
                    onClick={() => requireAuth(() => setRespondingEmergency(emergency))}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    {language === 'ar' ? 'يمكنني التبرع' : 'Je peux donner'}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════ STATS STRIP ══════════ */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Users, value: '3', label: language === 'ar' ? 'أرواح/تبرع' : 'vies/don' },
            { icon: Clock, value: '15', label: language === 'ar' ? 'دقيقة' : 'min' },
            { icon: Calendar, value: '56', label: language === 'ar' ? 'يوم انتظار' : 'jours' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-muted/40 border border-border/50">
              <s.icon className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-foreground">{s.value}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ══════════ MAIN TABS ══════════ */}
        <Tabs defaultValue="donate" className="space-y-4">
          <TabsList className={cn(
            "grid w-full h-auto p-1 bg-muted/40 rounded-2xl border border-border/50",
            isAuthenticated ? "grid-cols-3" : "grid-cols-2"
          )}>
            <TabsTrigger value="donate" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5 gap-1.5 text-xs font-semibold">
              <Heart className="h-3.5 w-3.5" />
              {tx.donateBlood}
            </TabsTrigger>
            {isAuthenticated && (
              <TabsTrigger value="reminders" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5 gap-1.5 text-xs font-semibold">
                <Bell className="h-3.5 w-3.5" />
                {tx.reminders}
              </TabsTrigger>
            )}
            <TabsTrigger value="info" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5 gap-1.5 text-xs font-semibold">
              <Info className="h-3.5 w-3.5" />
              {tx.info}
            </TabsTrigger>
          </TabsList>

          {/* ─── Tab: Donate ─── */}
          <TabsContent value="donate" className="space-y-5 mt-0">
            {/* Eligibility Checker */}
            <Card className="border border-border/50 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{tx.eligibilityChecker}</h3>
                  <p className="text-[10px] text-muted-foreground">{tx.eligibilityNote}</p>
                </div>
              </div>
              <CardContent className="space-y-3 pt-2 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">{tx.age}</Label>
                    <Input
                      type="number" min="1" max="100"
                      value={eligibilityAge}
                      onChange={(e) => setEligibilityAge(e.target.value)}
                      placeholder="≥ 18"
                      readOnly={profileAutoFilledAge}
                      className={cn("h-9 rounded-xl text-sm", profileAutoFilledAge && "opacity-60")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{tx.weight}</Label>
                    <Input
                      type="number" min="1" max="300"
                      value={eligibilityWeight}
                      onChange={(e) => setEligibilityWeight(e.target.value)}
                      placeholder="≥ 50"
                      readOnly={profileAutoFilledWeight}
                      className={cn("h-9 rounded-xl text-sm", profileAutoFilledWeight && "opacity-60")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">{tx.height}</Label>
                    <Input
                      type="number" min="50" max="250"
                      value={eligibilityHeight}
                      onChange={(e) => setEligibilityHeight(e.target.value)}
                      placeholder="≥ 100"
                      readOnly={profileAutoFilledHeight}
                      className={cn("h-9 rounded-xl text-sm", profileAutoFilledHeight && "opacity-60")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{tx.bmiLabel}</Label>
                    {bmiValue !== null ? (
                      <div className={cn(
                        "flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold",
                        bmiValue < 18.5 ? "border-amber-300/60 bg-amber-50/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300" :
                        bmiValue <= 25 ? "border-emerald-300/60 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" :
                        bmiValue <= 30 ? "border-amber-300/60 bg-amber-50/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300" :
                        "border-destructive/30 bg-destructive/5 text-destructive"
                      )}>
                        {bmiValue.toFixed(1)}
                        <span className="font-normal opacity-70">
                          {bmiValue < 18.5 ? '↓' : bmiValue <= 25 ? '✓' : bmiValue <= 30 ? '↑' : '⚠'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center h-9 px-3 rounded-xl border text-xs text-muted-foreground">—</div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">{tx.lastDonationDate}</Label>
                  <Input
                    type="date"
                    value={lastDonation}
                    onChange={(e) => setLastDonation(e.target.value)}
                    readOnly={hasAutoFilledDonationDate}
                    className={cn("h-9 rounded-xl text-sm", hasAutoFilledDonationDate && "opacity-60")}
                  />
                </div>

                <Button onClick={checkEligibility} className="w-full h-10 rounded-xl font-semibold gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {tx.checkEligibility}
                </Button>

                <AnimatePresence>
                  {eligibilityResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        "p-3.5 rounded-xl border space-y-2",
                        eligibilityResult === 'eligible'
                          ? "bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-900/15"
                          : "bg-amber-50/50 border-amber-200/60 dark:bg-amber-900/15"
                      )}>
                        <div className="flex items-center gap-2">
                          {eligibilityResult === 'eligible' ? (
                            <><CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" /><span className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">{tx.eligible}</span></>
                          ) : (
                            <><XCircle className="h-4.5 w-4.5 text-amber-600" /><span className="font-semibold text-sm text-amber-700 dark:text-amber-300">{tx.notYetEligible}</span></>
                          )}
                        </div>
                        {daysRemaining !== null && (
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                            {language === 'ar' ? `انتظر ${daysRemaining} يومًا` : `Encore ${daysRemaining} jours d'attente`}
                          </p>
                        )}
                        {nextEligibleDate && (
                          <p className="text-xs text-muted-foreground">{tx.nextEligible}: <strong>{nextEligibleDate}</strong></p>
                        )}
                        {bmiValue !== null && (bmiValue < 18.5 || bmiValue > 30) && (
                          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/15 mt-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                            <p className="text-xs text-destructive/80">
                              {language === 'ar'
                                ? `IMC ${bmiValue.toFixed(1)} — استشر طبيبك`
                                : `IMC ${bmiValue.toFixed(1)} — consultez votre médecin`}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Why donate */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                {tx.whyDonate}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Users, text: tx.fact1, color: 'text-destructive bg-destructive/8' },
                  { icon: Clock, text: tx.fact2, color: 'text-primary bg-primary/8' },
                  { icon: Calendar, text: tx.fact3, color: 'text-emerald-600 bg-emerald-500/8' },
                  { icon: Shield, text: tx.fact4, color: 'text-amber-600 bg-amber-500/8' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40">
                    <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", item.color)}>
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-foreground/80 leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <Link
              to="/map?mode=blood"
              className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-destructive/8 to-rose-500/5 border border-destructive/15 group"
            >
              <div className="h-10 w-10 rounded-xl bg-destructive/15 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <MapPin className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{tx.findCenter}</p>
                <p className="text-xs text-muted-foreground">{tx.viewMap}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </TabsContent>

          {/* ─── Tab: Reminders ─── */}
          {isAuthenticated && (
            <TabsContent value="reminders" className="space-y-5 mt-0">
              <Card className="border border-border/50 rounded-2xl shadow-sm">
                <CardContent className="space-y-4 pt-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{tx.bloodType}</Label>
                    {profileBloodGroup ? (
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center font-bold text-destructive">
                          {profileBloodGroup}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'من ملفك' : 'Depuis votre profil'}
                        </span>
                      </div>
                    ) : (
                      <Select
                        value={bloodProfile.bloodType || ''}
                        onValueChange={(v) => setBloodProfile({ ...bloodProfile, bloodType: v as BloodType })}
                      >
                        <SelectTrigger className="rounded-xl h-10"><SelectValue placeholder={tx.selectBloodType} /></SelectTrigger>
                        <SelectContent>
                          {BLOOD_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{tx.lastDonationDate}</Label>
                    <Input
                      type="date"
                      value={bloodProfile.lastDonationDate || ''}
                      onChange={(e) => setBloodProfile({ ...bloodProfile, lastDonationDate: e.target.value })}
                      readOnly={hasAutoFilledDonationDate}
                      className={cn("h-10 rounded-xl", hasAutoFilledDonationDate && "opacity-60")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                    <div className="flex items-center gap-2.5">
                      {bloodProfile.reminderEnabled
                        ? <Bell className="h-4.5 w-4.5 text-primary" />
                        : <BellOff className="h-4.5 w-4.5 text-muted-foreground" />}
                      <div>
                        <p className="text-sm font-medium">{tx.enableReminders}</p>
                        <p className="text-xs text-muted-foreground">{tx.reminderInfo}</p>
                      </div>
                    </div>
                    <Switch
                      checked={bloodProfile.reminderEnabled}
                      onCheckedChange={(c) => setBloodProfile({ ...bloodProfile, reminderEnabled: c })}
                    />
                  </div>

                  <Button onClick={saveBloodProfile} className="w-full rounded-xl h-10 font-semibold">
                    {tx.saveProfile}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ─── Tab: Info ─── */}
          <TabsContent value="info" className="space-y-4 mt-0">
            {/* Blood types visual */}
            <Card className="border border-border/50 rounded-2xl shadow-sm">
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Droplet className="h-4 w-4 text-destructive" />
                  <h3 className="font-bold text-sm">{language === 'ar' ? 'فصائل الدم' : 'Groupes Sanguins'}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_TYPES.map((type) => (
                    <div
                      key={type}
                      className="h-10 w-10 rounded-xl bg-destructive/8 border border-destructive/15 flex items-center justify-center text-sm font-bold text-destructive"
                    >
                      {type}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar'
                    ? 'O- متبرع عام • AB+ متلقي عام'
                    : 'O- donneur universel • AB+ receveur universel'}
                </p>
              </CardContent>
            </Card>

            {/* Where to donate */}
            <Card className="border border-border/50 rounded-2xl shadow-sm">
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Hospital className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm">{language === 'ar' ? 'أين تتبرع؟' : 'Où donner ?'}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar'
                    ? 'المستشفيات ومراكز التبرع المعتمدة في سيدي بلعباس.'
                    : 'Hôpitaux et centres agréés à Sidi Bel Abbès.'}
                </p>
                <Button className="w-full rounded-xl h-9 text-xs" variant="outline" asChild>
                  <Link to="/map?mode=blood">
                    <Map className="h-3.5 w-3.5 mr-1.5" />
                    {tx.viewMap}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency numbers */}
            <Card className="border border-border/50 rounded-2xl shadow-sm">
              <CardContent className="pt-4 pb-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-destructive" />
                  <h3 className="font-bold text-sm">{language === 'ar' ? 'أرقام الطوارئ' : 'Numéros d\'urgence'}</h3>
                </div>
                <a
                  href="tel:15"
                  className="flex items-center justify-between p-3 rounded-xl bg-destructive/8 border border-destructive/15 active:scale-[0.98] transition-transform"
                >
                  <span className="text-sm font-medium">SAMU</span>
                  <span className="text-lg font-bold text-destructive">15</span>
                </a>
                <a
                  href="tel:14"
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50 active:scale-[0.98] transition-transform"
                >
                  <span className="text-sm font-medium">{language === 'ar' ? 'الحماية المدنية' : 'Protection Civile'}</span>
                  <span className="text-lg font-bold">14</span>
                </a>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AuthModal />
    </div>
  );
}
