import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, Calendar, MessageSquare, UserCheck, Droplets, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { GuestBlockMessage } from '@/components/guest/GuestBlockMessage';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Notification } from '@/types/notifications';

const typeConfig: Record<Notification['type'], { icon: typeof Bell; color: string; bg: string }> = {
  appointment: { icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
  message: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-600/10' },
  profile_update: { icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
  verification_status: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-600/10' },
  blood_emergency: { icon: Droplets, color: 'text-destructive', bg: 'bg-destructive/10' },
};

const NotificationsPage = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <GuestBlockMessage title="Notifications" description="Connectez-vous pour voir vos notifications." />;
  }
  return <NotificationsContent userId={user?.uid} />;
};

function NotificationsContent({ userId }: { userId?: string }) {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications(userId);

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est à jour'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={markAllAsRead}>
            <CheckCheck className="h-3.5 w-3.5" /> Tout lire
          </Button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 flex flex-col items-center text-center gap-3">
            <Bell className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground font-medium">Aucune notification</p>
            <p className="text-xs text-muted-foreground">Vos alertes de rendez-vous, messages et urgences apparaîtront ici.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const cfg = typeConfig[n.type] || typeConfig.message;
            const Icon = cfg.icon;
            return (
              <button
                key={n.id}
                onClick={() => {
                  if (!n.read) markAsRead(n.id);
                  if (n.link) navigate(n.link);
                }}
                className={`w-full rounded-xl border shadow-sm p-3.5 flex items-start gap-3 text-left transition-colors active:scale-[0.98] ${
                  n.read ? 'bg-card border-border' : 'bg-primary/[0.03] border-primary/20'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm leading-snug line-clamp-1 ${n.read ? 'font-medium text-foreground' : 'font-semibold text-foreground'}`}>
                      {n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
