import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingNotif {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  body?: string;
  duration?: number;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
};

const styles = {
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
};

interface FloatingNotificationProps {
  notifications: FloatingNotif[];
  onDismiss: (id: string) => void;
}

const NotificationItem = ({ notif, onDismiss }: { notif: FloatingNotif; onDismiss: (id: string) => void }) => {
  const Icon = icons[notif.type];
  const startY = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notif.id), notif.duration || 5000);
    return () => clearTimeout(timer);
  }, [notif.id, notif.duration, onDismiss]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: -100, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -30) onDismiss(notif.id);
      }}
      className={cn(
        'mx-4 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm flex items-start gap-3 cursor-grab active:cursor-grabbing',
        styles[notif.type]
      )}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-90" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{notif.title}</p>
        {notif.body && <p className="text-xs opacity-90 mt-0.5">{notif.body}</p>}
      </div>
      <button onClick={() => onDismiss(notif.id)} className="p-1 rounded-full hover:bg-white/20">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const FloatingNotifications = ({ notifications, onDismiss }: FloatingNotificationProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[200] pointer-events-none max-w-[430px] mx-auto">
      <div className="pt-[env(safe-area-inset-top,8px)] mt-1 flex flex-col gap-2 pointer-events-auto">
        <AnimatePresence>
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notif={notif} onDismiss={onDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
