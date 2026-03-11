import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MobileStatusBar } from './MobileStatusBar';
import { BottomNavBar } from './BottomNavBar';
import { FloatingNotifications, FloatingNotif } from './FloatingNotification';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useUserLocation } from '@/hooks/useUserLocation';
import { Loader2 } from 'lucide-react';

export const MobileAppShell = () => {
  const location = useLocation();
  const isMapRoute = location.pathname.startsWith('/map');
  const isFullScreenRoute = isMapRoute || location.pathname === '/medical-assistant';

  // GPS permission on launch
  const { requestLocation } = useUserLocation();
  useEffect(() => {
    requestLocation();
  }, []);

  // Pull-to-refresh
  const { pullDistance, isRefreshing } = usePullToRefresh();

  // Floating notifications
  const [floatingNotifs, setFloatingNotifs] = useState<FloatingNotif[]>([]);
  const dismissNotif = useCallback((id: string) => {
    setFloatingNotifs(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-background mx-auto max-w-[430px] relative overflow-x-hidden">
      {!isFullScreenRoute && <MobileStatusBar />}

      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div
          className="flex justify-center items-center transition-all"
          style={{ height: pullDistance }}
        >
          <Loader2
            className="w-6 h-6 text-primary animate-spin"
            style={{ opacity: Math.min(pullDistance / 80, 1) }}
          />
        </div>
      )}

      <FloatingNotifications notifications={floatingNotifs} onDismiss={dismissNotif} />

      <main className={isFullScreenRoute ? '' : 'pb-24 min-h-[calc(100vh-3rem)]'}>
        <Outlet />
      </main>

      <BottomNavBar />
    </div>
  );
};
