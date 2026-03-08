import { Outlet, useLocation } from 'react-router-dom';
import { MobileStatusBar } from './MobileStatusBar';
import { BottomNavBar } from './BottomNavBar';

export const MobileAppShell = () => {
  const location = useLocation();
  const isMapRoute = location.pathname.startsWith('/map');
  const isFullScreenRoute = isMapRoute || location.pathname === '/medical-assistant';

  return (
    <div className="min-h-screen bg-background mx-auto max-w-[430px] relative">
      {!isFullScreenRoute && <MobileStatusBar />}
      
      <main className={isFullScreenRoute ? '' : 'pb-24 min-h-[calc(100vh-3rem)]'}>
        <Outlet />
      </main>
      
      <BottomNavBar />
    </div>
  );
};
