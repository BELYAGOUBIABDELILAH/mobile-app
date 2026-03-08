import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog = ({ open, onOpenChange }: ChangePasswordDialogProps) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error('Vous devez être connecté pour changer votre mot de passe');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast.success('Mot de passe modifié avec succès');
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      if (error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        toast.error('Mot de passe actuel incorrect');
      } else if (error?.code === 'auth/weak-password') {
        toast.error('Le mot de passe est trop faible. Utilisez au moins 6 caractères.');
      } else if (error?.code === 'auth/too-many-requests') {
        toast.error('Trop de tentatives. Veuillez réessayer plus tard.');
      } else {
        toast.error('Erreur lors du changement de mot de passe');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = currentPassword.length > 0 && newPassword.length >= 6 && confirmPassword === newPassword;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-[380px] rounded-2xl">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg">Changer le mot de passe</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Saisissez votre mot de passe actuel puis choisissez un nouveau mot de passe sécurisé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Current password */}
          <div className="space-y-1.5">
            <Label htmlFor="current-password" className="text-xs font-medium">Mot de passe actuel</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-9 pr-9 h-11 rounded-xl"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-xs font-medium">Nouveau mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-9 pr-9 h-11 rounded-xl"
                placeholder="Min. 6 caractères"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className="text-[10px] text-destructive">Minimum 6 caractères requis</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password" className="text-xs font-medium">Confirmer le mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9 pr-9 h-11 rounded-xl"
                placeholder="Répéter le mot de passe"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
              <p className="text-[10px] text-destructive">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full h-11 rounded-xl font-semibold"
          >
            {isLoading ? 'Modification…' : 'Modifier le mot de passe'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
