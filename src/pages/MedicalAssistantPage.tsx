import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Bot, AlertTriangle, Phone, Sparkles, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { SymptomTriageBot } from "@/components/medical-assistant/SymptomTriageBot";

export default function MedicalAssistantPage() {
  const { language } = useLanguage();
  const [resetKey, setResetKey] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleConfirmReset = useCallback(() => {
    setResetKey((k) => k + 1);
    setShowResetDialog(false);
  }, []);

  const t = useMemo(() => {
    const translations = {
      fr: {
        title: "Assistant Médical IA",
        online: "En ligne",
        disclaimer: "Ne remplace pas un avis médical. Urgence → appelez le",
        newConversation: "Nouvelle conversation",
        resetTitle: "Nouvelle conversation ?",
        resetDescription: "L'historique de cette session sera effacé.",
        cancel: "Annuler",
        confirm: "Confirmer",
      },
      ar: {
        title: "المساعد الطبي الذكي",
        online: "متصل",
        disclaimer: "لا يحل محل الاستشارة الطبية. طوارئ → اتصل بـ",
        newConversation: "محادثة جديدة",
        resetTitle: "محادثة جديدة؟",
        resetDescription: "سيتم مسح سجل هذه الجلسة.",
        cancel: "إلغاء",
        confirm: "تأكيد",
      },
      en: {
        title: "AI Medical Assistant",
        online: "Online",
        disclaimer: "Does not replace medical advice. Emergency → call",
        newConversation: "New conversation",
        resetTitle: "New conversation?",
        resetDescription: "This session's history will be cleared.",
        cancel: "Cancel",
        confirm: "Confirm",
      },
    };
    return translations[language as keyof typeof translations] || translations.fr;
  }, [language]);

  return (
    <div className={cn(
      "flex flex-col bg-background",
      "h-[calc(100vh-4rem-env(safe-area-inset-bottom,8px))]",
      language === "ar" && "rtl"
    )}>
      {/* Compact Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="shrink-0 border-b border-border/40 bg-background/90 backdrop-blur-xl"
      >
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
              </div>
              <div>
                <h1 className="font-semibold text-sm flex items-center gap-1">
                  {t.title}
                  <Sparkles className="w-3 h-3 text-teal-500" />
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{t.online}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                      onClick={() => setShowResetDialog(true)}
                    >
                      <PenSquare className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{t.newConversation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="destructive"
                size="sm"
                className="gap-1 rounded-lg shadow-md shadow-destructive/20 h-8 text-xs px-3"
                onClick={() => window.location.href = "tel:15"}
              >
                <Phone className="w-3 h-3" />
                <span className="font-bold">15</span>
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1.5 bg-amber-500/8 rounded-lg px-2 py-1 border border-amber-500/10">
            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{t.disclaimer} <strong>15</strong></span>
          </div>
        </div>
      </motion.header>

      {/* Chat */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <SymptomTriageBot resetKey={resetKey} />
      </main>

      {/* Reset confirmation dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.resetTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.resetDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset} className="bg-primary hover:bg-primary/90">
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
